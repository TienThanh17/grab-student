'use client'

import ChatWindow from '@/components/mess/ChatWindow'
import MessSidebar from '@/components/mess/MessSidebar'
import { Box, createTheme, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

const theme = createTheme({
    palette: {
        primary: {
            main: '#0084ff',
        },
        background: {
            default: '#ffffff',
            paper: '#f0f2f5',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

const mockUsers = [
    { id: 1, name: 'Alice Johnson', avatar: 'https://mui.com/static/images/avatar/1.jpg', lastMessage: 'Hey, how are you?', lastMessageTime: '2:30 PM' },
    { id: 2, name: 'Bob Smith', avatar: 'https://mui.com/static/images/avatar/2.jpg', lastMessage: 'Can we meet tomorrow?', lastMessageTime: 'Yesterday' },
    { id: 3, name: 'Charlie Brown', avatar: 'https://mui.com/static/images/avatar/3.jpg', lastMessage: 'I sent you the file.', lastMessageTime: 'Tue' },
    { id: 4, name: 'David Wilson', avatar: 'https://mui.com/static/images/avatar/4.jpg', lastMessage: 'Thanks for your help!', lastMessageTime: 'Mon' },
];

const mockMessages = [
    { id: 1, senderId: 1, text: 'Hey, how are you?', timestamp: '2023-05-10T14:30:00Z' },
    { id: 2, senderId: 2, text: "I'm good, thanks! How about you?", timestamp: '2023-05-10T14:35:00Z' },
    { id: 3, senderId: 1, text: 'Doing well, thanks for asking!', timestamp: '2023-05-10T14:40:00Z' },
    { id: 4, senderId: 2, text: 'Great! Do you want to grab coffee sometime this week?', timestamp: '2023-05-10T14:45:00Z' },
    { id: 5, senderId: 1, text: 'Sure, that sounds good. How about Wednesday afternoon?', timestamp: '2023-05-10T14:50:00Z' },
];

function Mess() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    return (
        <Box sx={{ display: 'flex', height: '90vh', bgcolor: 'background.default' }}>
            <MessSidebar
                users={mockUsers}
                onSelectUser={(user) => {
                    setSelectedUser(user);
                    if (!isDesktop) setSidebarOpen(false);
                }}
                selectedUser={selectedUser}
                open={isDesktop || sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <ChatWindow
                user={selectedUser}
                messages={mockMessages}
                onOpenSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
            />
        </Box>
    )
}

export default Mess