import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import EmojiPicker from '../../components/common/EmojiPicker'
import Kanban from '../../components/common/Kanban'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'

let timer
const timeout = 500

const Board = () => {
  const router = useRouter()
  const board = api.board.get.useQuery({ id: router.query.id as string })

  // useEffect(() => {
  //   const getBoard = async () => {
  //     try {
  //       const res = await boardApi.getOne(boardId)
  //       setTitle(res.title)
  //       setDescription(res.description)
  //       setSections(res.sections)
  //       setIsFavourite(res.favourite)
  //       setIcon(res.icon)
  //     } catch (err) {
  //       alert(err)
  //     }
  //   }
  //   getBoard()
  // }, [boardId])

  const updateTitle = async (e) => {
    // clearTimeout(timer)
    // const newTitle = e.target.value
    // setTitle(newTitle)

    // // let temp = [...boards]
    // const index = temp.findIndex(e => e.id === boardId)
    // temp[index] = { ...temp[index], title: newTitle }

    // if (isFavourite) {
    //   let tempFavourite = [...favouriteList]
    //   const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
    //   tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
    //   // dispatch(setFavouriteList(tempFavourite))
    // }

    // // dispatch(setBoards(temp))

    // timer = setTimeout(async () => {
    //   try {
    //     await boardApi.update(boardId, { title: newTitle })
    //   } catch (err) {
    //     alert(err)
    //   }
    // }, timeout);
  }

  const updateDescription = async (e) => {
    // clearTimeout(timer)
    // const newDescription = e.target.value
    // setDescription(newDescription)
    // timer = setTimeout(async () => {
    //   try {
    //     await boardApi.update(boardId, { description: newDescription })
    //   } catch (err) {
    //     alert(err)
    //   }
    // }, timeout);
  }

  const addFavourite = async () => {
    // try {
    //   const board = await boardApi.update(boardId, { favourite: !isFavourite })
    //   let newFavouriteList = [...favouriteList]
    //   if (isFavourite) {
    //     newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
    //   } else {
    //     newFavouriteList.unshift(board)
    //   }
    //   // dispatch(setFavouriteList(newFavouriteList))
    //   setIsFavourite(!isFavourite)
    // } catch (err) {
    //   alert(err)
    // }
  }

  const deleteBoard = () => {
    // try {
    //   await boardApi.delete(boardId)
    //   if (isFavourite) {
    //     const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
    //     // dispatch(setFavouriteList(newFavouriteList))
    //   }

    //   const newList = boards.filter(e => e.id !== boardId)
    //   if (newList.length === 0) {
    //     navigate('/boards')
    //   } else {
    //     navigate(`/boards/${newList[0].id}`)
    //   }
    //   // dispatch(setBoards(newList))
    // } catch (err) {
    //   alert(err)
    // }
  }

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
        <IconButton onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <TextField
            value={board.data.title}
            // onChange={updateTitle}
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
            value={board.data.description}
            // onChange={updateDescription}
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