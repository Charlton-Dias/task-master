import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { api } from '~/utils/api';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  boardId: string
}

export default function AddMemberModal({ boardId }: Props) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const addMemberMutation = api.board.addMember.useMutation({
    onSuccess: () => {
      setEmail('')
      setOpen(false)
    }
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton title='Add Member to Board' onClick={handleClickOpen}>
        <PersonAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add member to your board, please enter your email address here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {addMemberMutation.error && (
            <DialogContentText sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1 }} />
              {addMemberMutation.error.message}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton 
            variant='contained'
            onClick={() => {
              void addMemberMutation.mutate({ id: boardId, email })
            }}
            loading={addMemberMutation.isLoading}
          >
            Add Member
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
