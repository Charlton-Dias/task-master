import { Box, Typography } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { api } from "~/utils/api";
import Loading from "~/components/common/Loading";
import { useSession } from "next-auth/react"

const Home = () => {
  const mutation = api.board.create.useMutation();
  const boards = api.board.getAll.useQuery()
  const session = useSession()

  if (boards.isLoading) {
    return <Loading />
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <Typography variant='h6'>Hi, {session.data?.user?.name?.split(' ')[0]} 👋</Typography>
      <Typography textTransform='uppercase' variant='h5'>Welcome to</Typography>
      <Typography fontWeight='600' textTransform='uppercase' variant='h1'>Task Master</Typography>
      {boards?.data?.length ? (
        <h1>👈 Pick a Board</h1>
      ) : (
        <LoadingButton
          variant='outlined'
          color='success'
          onClick={() => mutation.mutate({
            title: 'Untitled',
            description: `Add description here
🟢 You can add multiline description
🟢 Let's start...`
          })}
          loading={mutation.isLoading}
        >
          Click here to create your first board
        </LoadingButton>
      )}
    </Box>
  )
}

export default Home
