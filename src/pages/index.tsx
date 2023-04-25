import { Box } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { api } from "~/utils/api";

const Home = () => {
  const mutation = api.board.create.useMutation();

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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
    </Box>
  )
}

export default Home