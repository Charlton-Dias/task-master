import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    (session.status === 'loading') ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex'
      }}>
        <Sidebar />
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
