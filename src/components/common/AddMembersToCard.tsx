/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from "react";
import { Autocomplete, TextField, Box, Avatar } from "@mui/material";
import { api } from "~/utils/api";
import type { User } from '@prisma/client'

interface Props {
  boardId: string,
  cardId: string,
  onSuccess: () => void
}

export default function AddMembersToCard({ boardId, cardId, onSuccess }: Props) {
  const utils = api.useContext()
  const [selectedUser, setSelectedUser] = useState<User>()
  const board = api.board.get.useQuery({ id: boardId })

  const addMemberMutation = api.card.addMember.useMutation({
    onMutate: () => {
      void utils.card.get.setData({ id: cardId }, prev => {
        if (prev) {
          if (!!prev.members)
            prev.members.push(selectedUser!)
          else
            prev = { ...prev, members: [selectedUser!] }
        }
        return prev
      })
      onSuccess()
    }
  });

  if (board.isLoading || !board.data) {
    return null
  }

  return (
    <Box mb={2}>
      <Autocomplete
        id="tags-outlined"
        getOptionLabel={(option) => option.name ?? ''}
        options={board.data?.members ?? []}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Member"
            placeholder="Type a name"
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar src={option.image ?? ''} sx={{ width: 24, height: 24, mr: 1 }} />
            {option.name}
          </li>
        )}
        onChange={(e, value) => {
          if (value) {
            setSelectedUser(value)
            addMemberMutation.mutate({ id: cardId, userId: value.id })
          }
        }}
      />
    </Box>
  )
}
