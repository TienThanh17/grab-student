import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, ListItemText, Paper, Avatar, useTheme, useMediaQuery } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import PhotoIcon from '@mui/icons-material/Photo';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

export default function ChatWindow({ user, messages, onOpenSidebar, sidebarOpen }) {
  const [newMessage, setNewMessage] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!user) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography>
      </Box>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isDesktop && !sidebarOpen && (
            <IconButton onClick={onOpenSidebar} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Avatar alt={user.name} src={user.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
          <Typography variant="h6">{user.name}</Typography>
        </Box>
        <Box>
          <IconButton color="primary" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><CallIcon /></IconButton>
          <IconButton color="primary" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><VideocamIcon /></IconButton>
          <IconButton><InfoIcon /></IconButton>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ justifyContent: message.senderId === user.id ? 'flex-start' : 'flex-end' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  maxWidth: '70%',
                  bgcolor: message.senderId === user.id ? 'background.paper' : 'primary.main',
                  borderRadius: '18px',
                }}
              >
                <ListItemText
                  primary={message.text}
                  primaryTypographyProps={{ 
                    color: message.senderId === user.id ? 'text.primary' : 'primary.contrastText'
                  }}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><AttachFileIcon /></IconButton>
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><PhotoIcon /></IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Aa"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
            sx={{ mx: 1, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
          />
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><InsertEmoticonIcon /></IconButton>
          <IconButton size="small" color="primary"><ThumbUpAltIcon /></IconButton>
          <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
            <SendIcon />
          </IconButton>
        </form>
      </Box>
    </Box>
  );
}

