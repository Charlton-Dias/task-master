import { useState } from 'react'
import { Box, TextField, Typography, Stack, IconButton, Checkbox, FormControlLabel } from '@mui/material'
import { api } from '~/utils/api'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  cardId: string
}

export default function Checklist({ cardId }: Props) {
  const [item, setItem] = useState('')
  const utils = api.useContext()

  const checklist = api.checklist.getAll.useQuery({ cardId })
  const createMutation = api.checklist.create.useMutation({
    onMutate: (variables) => {
      utils.checklist.getAll.setData({ cardId }, prev => {
        prev?.push({
          id: 'temp',
          title: variables.title,
          isDone: false,
          cardId: variables.cardId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return prev
      })
    },
    onSuccess: () => {
      void checklist.refetch()
    }
  })

  const deleteMutation = api.checklist.delete.useMutation({
    onMutate: (variables) => {
      utils.checklist.getAll.setData({ cardId }, prev => {
        return prev?.filter(item => item.id !== variables.id)
      })
    },
  })

  const updateMutation = api.checklist.update.useMutation({
    onMutate: (variables) => {
      utils.checklist.getAll.setData({ cardId }, prev => {
        return prev?.map(item => {
          if (item.id === variables.id) {
            return { ...item, isDone: variables.isDone || false }
          }
          return item
        })
      })
    },
  })

  return (
    <Box my={2}>
      <Typography variant='h6'>Checklist</Typography>
      <Box>
        {checklist.data?.map((item) => (
          <Stack
            key={item.id}
            direction='row'
            alignItems='center'
            spacing={1}
            justifyContent='space-between'
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.isDone}
                  onChange={(e) => {
                    updateMutation.mutate({ id: item.id, isDone: e.target.checked })
                  }}  
                />
              }
              label={item.title}
              sx={{
                textDecoration: item.isDone ? 'line-through' : 'none'
              }}
            />

            <IconButton onClick={() => deleteMutation.mutate({ id: item.id })} size='small'>
              <CloseIcon />
            </IconButton>
          </Stack>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate({ cardId, title: item })
            setItem('')
          }}
          style={{ width: '100%' }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Add a checklist item...'
            value={item}
            onChange={(e) => setItem(e.target.value)}
            size='small'
          />
        </form>
      </Box>
    </Box>
  )
}
