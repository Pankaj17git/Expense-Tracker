import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import axios from "axios";
import './styles/login.css'
import { useNavigate } from "react-router";


const AuthForm = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })

  const UserUrl = import.meta.env.VITE_REGISTERED_USER;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.token) {
      navigate("/main");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const res = await axios.get(UserUrl, {
      params: {
        email: user.email,
      }
    });

    if (res.data.length > 0) {
      alert('Please enter different email')
      return;
    }

    try {
      const response = await axios.post(UserUrl, user);
      console.log(response.data);
      alert('user registeration successfull')
      setUser({
        name: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const generateToken = () => {
    return Math.random().toString(36) + Date.now().toString(36);
  };


  const handleSignIn = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.get(UserUrl, {
        params: {
          email: user.email,
          password: user.password
        }
      });

      if (response.data.length > 0) {
        // User found
        const user = response.data[0];
        const token = generateToken();

        const loggedInUser = {
          ...user,
          token
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        console.log(loggedInUser);
        window.location.href = '/main';
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Box
        className="auth-body"
        sx={{
          backgroundImage: "url('/background-budget.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      >
        <Box className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
          {/* Sign Up Form */}
          <Box className="form-container sign-up-container">
            <Box className="auth-form" component='form' onSubmit={handleSignUp}>
              <Typography variant="h4">Create Account</Typography>
              <Box className="social-container">
                <IconButton><FacebookIcon /></IconButton>
                <IconButton><TwitterIcon /></IconButton>
                <IconButton><LinkedInIcon /></IconButton>
              </Box>
              <span>or use your email for registration</span>
              <TextField fullWidth margin="normal" placeholder="Name" name="name" value={user.name} onChange={handleChange} />
              <TextField fullWidth margin="normal" type="email" placeholder="Email" name='email' value={user.email} onChange={handleChange} />
              <TextField fullWidth margin="normal" type="password" placeholder="Password" name='password' value={user.password} onChange={handleChange} />
              <Button variant="contained" type="submit">Sign Up</Button>
            </Box>
          </Box>

          {/* Sign In Form */}
          <Box className="form-container sign-in-container">
            <Box className="auth-form" component='form' onSubmit={handleSignIn}>
              <Typography variant="h4">Sign In</Typography>
              <Box className="social-container">
                <IconButton><FacebookIcon /></IconButton>
                <IconButton><TwitterIcon /></IconButton>
                <IconButton><LinkedInIcon /></IconButton>
              </Box>
              <span>or use your account</span>
              <TextField fullWidth margin="normal" type="email" placeholder="Email" name="email" value={user.email} onChange={handleChange} />
              <TextField fullWidth margin="normal" type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} />
              <Button variant="contained" type="submit">Sign In</Button>
            </Box>
          </Box>

          {/* Overlay Panels */}
          <Box className="overlay-container">
            <Box className="overlay">
              <Box className="overlay-panel overlay-left">
                <Typography variant="h4">Welcome Back!</Typography>
                <Typography>
                  Please login to your <strong>BudgetBuddy!</strong> account with your personal info
                </Typography>
                <Button sx={{ marginTop: 4 }} className="ghost" variant="outlined" onClick={() => setIsSignUpActive(false)}>
                  Sign In
                </Button>
              </Box>
              <Box className="overlay-panel overlay-right">
                <Typography variant="h4">Hello, Friend!</Typography>
                <Typography>
                  Enter your personal details to create a <strong>BudgetBuddy</strong> account
                </Typography>
                <Button sx={{ marginTop: 4 }} className="ghost" variant="outlined" onClick={() => setIsSignUpActive(true)}>
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AuthForm;
