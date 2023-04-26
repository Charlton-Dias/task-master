import { Box, Button, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import GitHubIcon from '@mui/icons-material/GitHub'

const Login = () => {
  const session = useSession()

  if (session.status === 'authenticated') {
    return (
      <>
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          fullWidth
          onClick={() => {
            void signOut()
          }}
        >
          Logout
        </Button>
      </>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Box
        sx={{
          maxWidth: '650px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          letterSpacing: '0.3rem',
          textTransform: 'uppercase',
          borderRadius: '.5rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            maxWidth: '420px'
          }}
          bgcolor='grey.900'
        >
          <Typography variant='h1' fontWeight='700' fontSize='5rem'
            color='white'
            p={2}
          >
            Task Master
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '68%',
            overflow: 'hidden',
          }}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              void signIn("github", { callbackUrl: '/' })
            }}
          >
            <GitHubIcon sx={{ mr: 1 }} />
            Login with GitHub
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
