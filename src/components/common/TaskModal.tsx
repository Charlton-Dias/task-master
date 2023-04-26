import { Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import React, { useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { type RouterOutputs, api } from '~/utils/api'
import Comments from './Comments'

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%',
  overflow: 'auto'
}

type TaskType = RouterOutputs['card']['create']

interface Props {
  task: TaskType,
  boardId: string,
  onClose: () => void
}

const TaskModal: React.FC<Props> = ({ task, boardId, onClose }) => {
  const editorWrapperRef = useRef()
  const utils = api.useContext()
  const [title, setTitle] = useState(task.title)
  const [content, setContent] = useState(task.description)

  const deleteCardMutation = api.card.delete.useMutation({
    onSuccess: () => {
      void utils.list.getAll.refetch({ boardId })
      onClose()
    }
  })

  const updateCardMutation = api.card.update.useMutation({
    onSuccess: () => {
      void utils.list.getAll.refetch({ boardId })
    }
  })

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton color='error' onClick={() => deleteCardMutation.mutate({ id: task.id })}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            padding: '2rem 3rem 5rem'
          }}>
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => updateCardMutation.mutate({ id: task.id, title })}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px'
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(e, editor) => setContent(editor.getData())}
                onBlur={(e, editor) => {
                  updateCardMutation.mutate({ id: task.id, description: editor.getData() })
                }}
              />
            </Box>

            <Comments cardId={task.id} />
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal