'use client'

import { Box, Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSignUpClick = () => {
    router.push('/signUp') // Navigate to the sign-up page
  }

  const handleSignInClick = () => {
    router.push('/signIn') // Navigate to the sign-in page
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ bgcolor: 'black' }}
    >
      <Stack
        direction="column"
        spacing={4}
        alignItems="center"
      >
        <Typography color="red" variant="h2" component="h1">
          Welcome to FitnessAI
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }}
            variant="contained"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
          <Button
            sx={{ bgcolor: 'black', ':hover': { bgcolor: 'red' } }}
            variant="contained"
            onClick={handleSignInClick}
          >
            Sign In
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
