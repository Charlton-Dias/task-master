import { useState } from 'react'
import { Box, TextField, Typography, Stack } from '@mui/material'
import { api } from '~/utils/api'
import moment from 'moment'

interface Props {
  cardId: string
}

export default function Comments({ cardId }: Props) {
  const [commentText, setCommentText] = useState('')
  const comments = api.comment.getAll.useQuery({ cardId })

  const createCommentMutation = api.comment.create.useMutation({
    onSuccess: () => {
      void comments.refetch()
    }
  })

  return (
    <Box>
      <Typography variant='h6'>Comments</Typography>
      <Box>
        {comments.data?.map(comment => (
          <Box key={comment.id} sx={{ display: 'flex', flexDirection: 'column', my: 1 }}>
            <Typography variant='body1'>{comment.text}</Typography>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='caption'>{comment.user.name}</Typography>
              <Typography variant='caption'>{moment(comment.createdAt).format('YYYY-MM-DD hh:mm')}</Typography>
            </Stack>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createCommentMutation.mutate({ cardId, text: commentText })
            setCommentText('')
          }}
          style={{ width: '100%' }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Add a comment...'
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            size='small'
          />
        </form>
      </Box>
    </Box>
  )
}
