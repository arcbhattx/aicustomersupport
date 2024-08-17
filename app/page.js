'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path as necessary
import { useAuth } from '../context/AuthContext'; // Import your custom hook

export default function Home() {
  const { user } = useAuth(); // Access the user from context
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Fitness support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      // Check if user state is still undefined (loading)
      return;
    }
    if (user === null) {
      // Redirect if user is not authenticated
      router.push('/home');
    } else {
      setLoading(false); // Set loading to false if user is authenticated
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner or message while determining user state
  }

  const sendMessage = async () => {
    setMessage('');  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ]);

    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();  // Get a reader to read the response body
      const decoder = new TextDecoder();  // Create a decoder to decode the response text

      let result = '';
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1);  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ];
        });
        return reader.read().then(processText);  // Continue reading the next chunk of the response
      });
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/home');  // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoHome = () => {
    router.push('/home');  // Navigate to the home page
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="black"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="black"
      >
        <Stack
          direction={'row'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color= 'white'variant="h6">FitnessAI</Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }} 
              variant="contained" 
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
            <Button 
              sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }} 
              variant="contained" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'red'  // Red color for assistant
                    : 'black'  // Black color for user
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            '& .MuiInputBase-input': {
              color: 'white', // Text color inside the input
            },
            '& .MuiInputLabel-root': {
              color: 'white', // Label color
            },
          }}
        />

          <Button sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }}  variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
