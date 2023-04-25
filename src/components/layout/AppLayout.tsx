import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { useSession, signIn } from 'next-auth/react'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      signIn()
        .then(() => console.log('signed in'))
        .catch(() => console.log('failed to sign in'))
    }
  }, [session])

  return (
    (session.status === 'loading') ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex'
      }}>
        {/* <Sidebar /> */}
        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          {children}
        </Box>
      </Box>
    )
  )
}

export default AppLayout
