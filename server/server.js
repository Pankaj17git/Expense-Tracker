// server.js
const dotenv = require("dotenv");
const connectToDb = require('./config/db');
const app = require('./app')
dotenv.config({
    path: process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env"
});

const PORT = process.env.PORT || 5000;

//Db connecton
connectToDb();

app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server running on port', PORT)
    } else {
        console.log("Unable to connect to the server!", error)
    }
});