import React, { useState } from 'react'
import { Box, Typography, Divider, TextField, IconButton, Card, CircularProgress, AvatarGroup, Avatar, Stack } from '@mui/material'
import { DragDropContext, Draggable, type DropResult, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { type RouterOutputs, api } from '~/utils/api'
import Loading from './Loading'
import dynamic from 'next/dynamic'
const TaskModal = dynamic(() => import('./TaskModal'), { ssr: false })
import AddIcon from '@mui/icons-material/Add'
import LoadingButton from '@mui/lab/LoadingButton'
import type { User } from '@prisma/client'

type CardType = RouterOutputs['card']['create']

interface Props {
  boardId: string,
  members: User[]
}

const Kanban: React.FC<Props> = ({ boardId, members }) => {
  const [selectedTask, setSelectedTask] = useState<CardType>()
  const utils = api.useContext()
  const lists = api.list.getAll.useQuery({ boardId })

  const createListMuration = api.list.create.useMutation({
    onSuccess: () => {
      void lists.refetch()
    }
  })

  const updateCardMutation = api.card.update.useMutation()

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return

    console.log(destination.droppableId, draggableId)
    if (source.droppableId !== destination.droppableId) {
      updateCardMutation.mutate({
        id: draggableId,
        listId: destination.droppableId
      })

      utils.list.getAll.setData({ boardId }, prev => {
        if (!!prev) {
          const sourceList = prev.find(list => list.id === source.droppableId)
          const destinationList = prev.find(list => list.id === destination.droppableId)
          if (sourceList && destinationList) {
            const card = sourceList.cards?.find(card => card.id === draggableId)
            if (card) {
              sourceList.cards = sourceList.cards?.filter(card => card.id !== draggableId)
              destinationList.cards?.push(card)
            }
          }
        }
        return prev
      })
    }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <LoadingButton
          loading={createListMuration.isLoading}
          loadingPosition="start"
          startIcon={<AddIcon />}
          color='primary'
          onClick={() => {
            if (!!lists.data) {
              createListMuration.mutate({ boardId, title: 'Untitled', order: lists.data.length })
            }
          }}
        >
          Add section
        </LoadingButton>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='body2' fontWeight='700'>
            {lists?.data?.length ?? 0} Sections
          </Typography>
          <AvatarGroup max={4}>
            {members.map((member, idx) => (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <Avatar key={idx} alt={member.name!} src={member.image!} sx={{ width: 30, height: 30 }} />
            ))}
          </AvatarGroup>
        </Stack>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />

      {lists.isLoading && <Loading />}

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100vw - 400px)',
          overflowX: 'auto'
        }}>
          {lists.data?.map(list => (
            <div key={list.id} style={{ width: '300px' }}>
              <Droppable key={list.id} droppableId={list.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
                  >

                    <SectionHeader list={list} />

                    {list.cards?.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: '10px',
                              marginBottom: '10px',
                              cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                            }}
                            onClick={() => setSelectedTask(card)}
                          >
                            <Typography>
                              {card.title === '' ? 'Untitled' : card.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))
                    }
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))
          }
        </Box>
      </DragDropContext>
      {(selectedTask !== undefined) &&
        <TaskModal
          task={selectedTask}
          boardId={boardId}
          onClose={() => setSelectedTask(undefined)}
        />
      }
    </>
  )
}

export default Kanban

interface ListHeaderProps {
  list: RouterOutputs['list']['getAll'][0]
}

const SectionHeader = ({ list }: ListHeaderProps) => {
  const [title, setTitle] = useState(list.title);
  const utils = api.useContext()
  const updateListMutation = api.list.update.useMutation({
    onSuccess: () => {
      void utils.list.getAll.refetch({ boardId: list.boardId })
    }
  })

  const deleteListMutation = api.list.delete.useMutation({
    onSuccess: () => {
      void utils.list.getAll.refetch({ boardId: list.boardId })
    }
  })

  const createTaskCardMutation = api.card.create.useMutation({
    onSuccess: () => {
      void utils.list.getAll.refetch({ boardId: list.boardId })
    }
  })

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }}>
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={(e) => {
          if (title !== list.title) {
            updateListMutation.mutate({ id: list.id, title: e.target.value })
          }
        }}
        placeholder='Untitled'
        variant='outlined'
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-input': { padding: 0 },
          '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
          '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
        }}
      />
      <IconButton
        size='small'
        sx={{
          color: 'gray',
          '&:hover': { color: 'green' }
        }}
        onClick={() => {
          createTaskCardMutation.mutate({
            title: 'Untitled',
            listId: list.id,
          })
        }}
      >
        {createTaskCardMutation.isLoading
          ? <CircularProgress size={18} color='success' />
          : <AddOutlinedIcon />
        }
      </IconButton>
      <IconButton
        size='small'
        sx={{
          color: 'gray',
          '&:hover': { color: 'red' }
        }}
        onClick={() => deleteListMutation.mutate({ id: list.id })}
      >
        {deleteListMutation.isLoading
          ? <CircularProgress size={18} color='error' />
          : <DeleteOutlinedIcon />
        }
      </IconButton>
    </Box>
  )
}
