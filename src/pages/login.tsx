import { Button } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Login = () => {
  const session = useSession()
  const router = useRouter()

  if (session.status === 'authenticated') {
    return (
      <>
        <Button
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          fullWidth
          onClick={() => {
            signOut()
              .then(() => console.log('success'))
              .catch(err => console.log(err))
          }}
        >
          Logout
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        sx={{ mt: 3, mb: 2 }}
        variant='outlined'
        color='success'
        fullWidth
        onClick={() => {
          signIn()
            .then(() => router.push('/'))
            .catch(err => console.log(err))
        }}
      >
        Login
      </Button>
    </>
  )
}

export default Login
