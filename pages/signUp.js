'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path as needed
import { useRouter } from 'next/navigation'; // Import useRouter

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      router.push('/'); // Redirect to the home page after sign-up
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert(error.message);
    }
  };

  const handleGoHome = () => {
    router.push('/home'); // Redirect to /home
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="black" // Set background color to black
    >
      <Stack
        direction={'column'}
        width="400px"
        height="350px"
        border="1px solid white" // Adjust border color for visibility
        p={2}
        spacing={3}
      >
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            sx: {
              color: 'red', // Text color inside the input
              borderColor: 'red', // Border color of the input
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'red', // Border color of the outline
              },
            },
          }}
          InputLabelProps={{
            sx: {
              color: 'red', // Label color
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            sx: {
              color: 'red', // Text color inside the input
              borderColor: 'red', // Border color of the input
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'red', // Border color of the outline
              },
            },
          }}
          InputLabelProps={{
            sx: {
              color: 'red', // Label color
            },
          }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            sx: {
              color: 'red', // Text color inside the input
              borderColor: 'red', // Border color of the input
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'red', // Border color of the outline
              },
            },
          }}
          InputLabelProps={{
            sx: {
              color: 'red', // Label color
            },
          }}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button 
            sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }} 
            variant="contained" 
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Button 
            sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }} 
            variant="contained" 
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
