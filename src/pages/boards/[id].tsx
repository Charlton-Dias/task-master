import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Box, CircularProgress, IconButton, TextField } from '@mui/material'
import Kanban from '../../components/common/Kanban'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
import { useState } from 'react'
import Loading from '~/components/common/Loading'
import AddMemberModal from '~/components/common/AddMemberModal'
import { useSession } from 'next-auth/react'

const Board = () => {
  const router = useRouter()
  const session = useSession()
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

  const boardDeleteMutation = api.board.delete.useMutation({
    onSuccess: () => {
      void utils.board.invalidate()
      void router.push('/')
    }
  })

  if (board.isLoading || !board.data) {
    return <Loading />
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        px: '50px'
      }}>
        {session?.data?.user?.id === board?.data?.creator && (
          <>
            <AddMemberModal boardId={board?.data?.id ?? ''} />
            <IconButton title='Delete Board' onClick={() => boardDeleteMutation.mutate({ id: board?.data?.id ?? '' })}>
              {boardDeleteMutation.isLoading
                ? <CircularProgress color='error' size={18} />
                : <DeleteOutlinedIcon />
              }
            </IconButton>
          </>
        )
        }
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
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
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
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem', px: 0 }
            }}
          />
        </Box>
        <Box>
          <Kanban boardId={board?.data?.id ?? ''} members={board?.data?.members ?? []} />
        </Box>
      </Box>
    </>
  )
}

export default Board