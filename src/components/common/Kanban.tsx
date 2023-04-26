import React, { useState } from 'react'
import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { DragDropContext, Draggable, type DropResult, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import TaskModal from './TaskModal'
import { type RouterOutputs, api } from '~/utils/api'

type CardType = RouterOutputs['card']['create']

interface Props {
  boardId: string
}

const Kanban: React.FC<Props> = ({ boardId }) => {
  const [selectedTask, setSelectedTask] = useState<CardType>()

  const lists = api.list.getAll.useQuery({ boardId })

  const createListMuration = api.list.create.useMutation({
    onSuccess: () => {
      void lists.refetch()
    }
  })

  const onDragEnd = ({ source, destination }: DropResult) => {
    // if (!destination) return
    // const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
    // const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)
    // const sourceCol = data[sourceColIndex]
    // const destinationCol = data[destinationColIndex]

    // const sourceSectionId = sourceCol.id
    // const destinationSectionId = destinationCol.id

    // const sourceTasks = [...sourceCol.tasks]
    // const destinationTasks = [...destinationCol.tasks]

    // if (source.droppableId !== destination.droppableId) {
    //   const [removed] = sourceTasks.splice(source.index, 1)
    //   destinationTasks.splice(destination.index, 0, removed)
    //   data[sourceColIndex].tasks = sourceTasks
    //   data[destinationColIndex].tasks = destinationTasks
    // } else {
    //   const [removed] = destinationTasks.splice(source.index, 1)
    //   destinationTasks.splice(destination.index, 0, removed)
    //   data[destinationColIndex].tasks = destinationTasks
    // }

    // try {
    //   await taskApi.updatePosition(boardId, {
    //     resourceList: sourceTasks,
    //     destinationList: destinationTasks,
    //     resourceSectionId: sourceSectionId,
    //     destinationSectionId: destinationSectionId
    //   })
    //   setData(data)
    // } catch (err) {
    //   alert(err)
    // }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Button onClick={() => {
          if (!!lists.data) {
            createListMuration.mutate({ boardId, title: 'Untitled', order: lists.data.length })
          }
        }}>
          Add section
        </Button>
        <Typography variant='body2' fontWeight='700'>
          {lists?.data?.length ?? 0} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100vw - 400px)',
          overflowX: 'auto'
        }}>
          {
            lists.data?.map(list => (
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
        // onUpdate={onUpdateTask}
        // onDelete={onDeleteTask}
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
        <AddOutlinedIcon />
      </IconButton>
      <IconButton
        size='small'
        sx={{
          color: 'gray',
          '&:hover': { color: 'red' }
        }}
        onClick={() => deleteListMutation.mutate({ id: list.id })}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Box>
  )
}
