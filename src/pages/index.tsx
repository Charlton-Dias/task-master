import { Box } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { api } from "~/utils/api";
import Loading from "~/components/common/Loading";

const Home = () => {
  const mutation = api.board.create.useMutation();
  const boards = api.board.getAll.useQuery()

  if (boards.isLoading) {
    return <Loading />
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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
