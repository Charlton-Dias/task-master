import { Box, CircularProgress } from '@mui/material'

interface Props {
  fullHeight?: boolean
}

const Loading: React.FC<Props> = props => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: props.fullHeight ? '100vh' : '100%'
    }}>
      <CircularProgress />
    </Box>
  )
}

export default Loading