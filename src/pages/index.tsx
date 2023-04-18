import { Box } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
// import { setBoards } from "../redux/features/boardSlice"
// import boardApi from "../api/boardApi"
import { useState } from "react"

const Home = () => {
  const [loading, setLoading] = useState(false)

  // const createBoard = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await boardApi.create()
  //   } catch (err) {
  //     alert(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
        // onClick={createBoard}
        loading={loading}
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  )
}

export default Home