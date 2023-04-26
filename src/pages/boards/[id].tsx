import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import Kanban from '../../components/common/Kanban'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { useState } from 'react'


const Board = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const utils = api.useContext()

  const board = api.board.get.useQuery({ id: router.query.id as string }, {
    onSuccess: (data) => {
      if (data?.title && data?.description) {
        setTitle(data.title)
        setDescription(data.description)
      }
    }
  })

  const boardUpdateMutation = api.board.update.useMutation({
    onSuccess: () => {
      void board.refetch()
      void utils.board.invalidate()
    }
  })

  if (board.isLoading || !board.data)
    return <div>Loading...</div>

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <IconButton onClick={() => {}}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <TextField
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={e => {
              if (!!board?.data?.id && e.target.value !== board.data?.title) {
                boardUpdateMutation.mutate({
                  id: board?.data?.id ?? '',
                  title: e.target.value
                })
              }
            }}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={e => {
              if (!!board?.data?.id && e.target.value !== board.data?.description) {
                boardUpdateMutation.mutate({
                  id: board?.data?.id ?? '',
                  description: e.target.value
                })
              }
            }}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
          {/* <Kanban data={sections} boardId={boardId}/>*/}
        </Box>
      </Box>
    </>
  )
}

export default Board