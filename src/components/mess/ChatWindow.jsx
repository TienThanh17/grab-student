import React, { useEffect, useRef, useState } from 'react';
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
import { sendMessageService } from '@/services/messageService';
import { setIsLoading } from '@/redux-toolkit/loadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import socket from '@/configs/socket';
import { useGlobalContext } from '@/provider/GlobalContext';

export default function ChatWindow({ user, messages, onOpenSidebar, sidebarOpen, senderId, setMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { fetchConversation } = useGlobalContext();
  const userInfo = useSelector((state) => state.user.userInfo);

  // Tạo ref để tham chiếu tới container tin nhắn
  const messagesEndRef = useRef(null);

  // Hiệu ứng scroll xuống khi tin nhắn mới được thêm
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (!user) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography>
      </Box>
    );
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await sendMessageService({
        senderId,
        recipientId: user.id,
        content: newMessage
      })
      if (res.data.code === 0) {
        socket.emit("sendMessage", res.data.data);
        setMessage((prev) => [...prev, res.data.data])
        fetchConversation(userInfo.id)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setNewMessage('');
    }
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
          <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 40, height: 40, mr: 2 }} />
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
          {messages?.map((message) => (
            <ListItem key={message.id} sx={{ justifyContent: message.senderId === user.id ? 'flex-start' : 'flex-end' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.senderId === user.id ? '#F0F0F0' : 'primary.light',
                  borderRadius: '18px',
                }}
              >
                <ListItemText
                  primary={message.content}
                  primaryTypographyProps={{
                    color: message.senderId === user.id ? 'text.primary' : 'primary.contrastText'
                  }}
                />
              </Paper>
              {/* Phần tử cuối cùng để scroll đến */}
              <div ref={messagesEndRef} />
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
            autoComplete='off'
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

