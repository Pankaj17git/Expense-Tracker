import React, { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Typography, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Helmet } from 'react-helmet';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    // Example: Get user data from localStorage or from an API
    const userData = JSON.parse(localStorage.getItem('user'))

    setUser(userData);
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center" mt={4}>
        <Card sx={{ maxWidth: 400, width: '100%', p: 3, boxShadow: 3 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Box>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {user.name}
            </Typography>
            <Divider />
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default UserProfile
