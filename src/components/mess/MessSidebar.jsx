import React from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, InputBase, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { formatNotificationTime } from '@/utils/functionUtils';

export default function Sidebar({ conversations, open, onClose, handleSelectUser, selectedUser }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const sidebarContent = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Chats</Typography>
        <IconButton onClick={onClose} sx={{ display: { xs: 'block', md: 'none' } }}>
          <CloseIcon />
        </IconButton>
        <IconButton sx={{ display: { xs: 'none', md: 'block' } }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 20, p: '2px' }}>
          <IconButton sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Messenger"
            inputProps={{ 'aria-label': 'search messenger' }}
          />
        </Box>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        {conversations?.map((conversation) => (
          <ListItem
            key={conversation.id}
            button
            onClick={() => handleSelectUser(conversation.id)}
            sx={{
              bgcolor: selectedUser?.id == conversation.student.id ? 'primary.light' : 'background.paper', // Màu nền khi được chọn
              color: selectedUser?.id == conversation.student.id ? 'primary.contrastText' : 'text.primary', // Màu chữ khi được chọn
              '&:hover': {
                bgcolor: selectedUser?.id == conversation.student.id ? 'primary.main' : 'action.hover', // Màu hover
              },
              cursor: 'pointer'
            }}
          >
            <ListItemAvatar>
              <Avatar alt={conversation.student.name} src={conversation.student.avatarUrl} sx={{ width: 56, height: 56, mr: 1 }} />
            </ListItemAvatar>
            <ListItemText
              primary={conversation.student.name}
              secondary={conversation.lastMessage}
              primaryTypographyProps={{ fontWeight: 'medium' }}
              secondaryTypographyProps={{ noWrap: true }}
            />
            <Typography variant="caption" color="text.secondary">{formatNotificationTime(conversation.lastMessageTime)}</Typography>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isDesktop) {
    return (
      <Box
        sx={{
          width: 350,
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {sidebarContent}
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}

