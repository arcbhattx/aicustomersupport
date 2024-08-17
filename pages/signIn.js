'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged to listen for auth changes

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/'); // Redirect to home if already authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in:', userCredential.user);
      router.push('/'); // Redirect to home page upon successful sign-in
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert(error.message);
    }
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
        height="300px"
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
        <Button 
          sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }} 
          variant="contained" 
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Stack>
    </Box>
  );
}
