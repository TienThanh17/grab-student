import React from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, InputBase, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar({ users, onSelectUser, selectedUser, open, onClose }) {
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
        {users.map((user) => (
          <ListItem 
            key={user.id}
            button 
            onClick={() => onSelectUser(user)}
            selected={selectedUser && selectedUser.id === user.id}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              },
            }}
          >
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar} sx={{ width: 56, height: 56 }} />
            </ListItemAvatar>
            <ListItemText 
              primary={user.name} 
              secondary={user.lastMessage}
              primaryTypographyProps={{ fontWeight: 'medium' }}
              secondaryTypographyProps={{ noWrap: true }}
            />
            <Typography variant="caption" color="text.secondary">{user.lastMessageTime}</Typography>
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

