import { Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { useSession, signOut } from 'next-auth/react'
import { api } from '~/utils/api'
import Link from 'next/link'
import { useRouter } from 'next/router'

const sidebarWidth = 250

const Sidebar = () => {
  const session = useSession()
  const router = useRouter()
  const boardsQuery = api.board.getAll.useQuery()
  const mutation = api.board.create.useMutation({
    onSuccess: (data) => {
      void boardsQuery.refetch()
      void router.push(`/boards/${data.id}`)
    }
  })

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        '& > div': { borderRight: 'none' }
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: '#f7f7f7'
        }}
      >
        <ListItem>
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Avatar src={session.data?.user.image ?? ''} alt={session.data?.user.name ?? 'profile'} />
            <Typography variant='body2' fontWeight='700'>
              {session.data?.user.name}
            </Typography>
            <IconButton title='Sign Out' onClick={() => {
              signOut()
                .then(() => console.log('signed out'))
                .catch(() => console.log('failed to sign out'))
            }}>
              <LogoutOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='body2' fontWeight='700'>
              Boards
            </Typography>
            <IconButton onClick={() => mutation.mutate({
              title: 'Untitled',
              description: `Add description here
🟢 You can add multiline description
🟢 Let's start...`
            })}>
              <AddBoxOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>

        {boardsQuery.data && boardsQuery.data.map((item) => (
          <ListItemButton
            key={item.id}
            selected={item.id === router.query?.id}
            component={Link}
            href={`/boards/${item.id}`}
            sx={{ pl: '20px' }}
          >
            <Typography
              variant='body2'
              fontWeight='700'
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {item.title}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar
