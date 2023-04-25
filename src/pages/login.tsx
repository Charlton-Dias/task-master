import { Button } from '@mui/material'
import { signIn } from 'next-auth/react'

const Login = () => {
  return (
    <>
      <Button
        sx={{ mt: 3, mb: 2 }}
        variant='outlined'
        color='success'
        fullWidth
        onClick={() => {
          signIn()
            .then(() => {
              console.log('success')
            })
            .catch(err => {
              console.log(err)
            })
        }}
      >
        Login
      </Button>
    </>
  )
}

export default Login
