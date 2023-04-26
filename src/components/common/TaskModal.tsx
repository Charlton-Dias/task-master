import { Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import React, { useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// import '../../css/custom-editor.css'
import { type RouterOutputs, api } from '~/utils/api'

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
  height: '80%'
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

  const updateEditorHeight = () => {
    //   setTimeout(() => {
    //     if (editorWrapperRef.current) {
    //       const box = editorWrapperRef.current
    //       box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
    //     }
    //   }, timeout)
  }

  // const onClose = () => {
  // isModalClosed = true
  // props.onUpdate(task)
  // props.onClose()
  // }

  const updateTitle = async (e) => {
    //   clearTimeout(timer)
    //   const newTitle = e.target.value
    //   timer = setTimeout(async () => {
    //     try {
    //       await taskApi.update(boardId, task.id, { title: newTitle })
    //     } catch (err) {
    //       alert(err)
    //     }
    //   }, timeout)

    //   task.title = newTitle
    //   setTitle(newTitle)
    //   props.onUpdate(task)
  }

  const updateContent = async (event, editor) => {
    //   clearTimeout(timer)
    //   const data = editor.getData()

    //   console.log({ isModalClosed })

    //   if (!isModalClosed) {
    //     timer = setTimeout(async () => {
    //       try {
    //         await taskApi.update(boardId, task.id, { content: data })
    //       } catch (err) {
    //         alert(err)
    //       }
    //     }, timeout);

    //     task.content = data
    //     setContent(data)
    //     props.onUpdate(task)
    //   }
  }

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
            padding: '2rem 5rem 5rem'
          }}>
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
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
                // onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal