const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const loginRouter = require('./routes/auth/login');
const registerRouter = require('./routes/auth/register');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

//  Security & Logging
app.use(express.json());
app.use(morgan('dev'));

// Serve static images (AFTER CORS)
app.use('/upload', express.static(path.join(__dirname, 'upload')));

//  Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);


// Global error handler (should be last)
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Something went wrong' });
});


//AuthRoutes
app.use(loginRouter);
app.use(registerRouter);



module.exports = app;