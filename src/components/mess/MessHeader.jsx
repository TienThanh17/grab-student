import { useGlobalContext } from '@/provider/GlobalContext'
import { formatNotificationTime } from '@/utils/functionUtils'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'


function MessHeader({ handleCloseMess }) {
    const { conversations } = useGlobalContext();
    const router = useRouter();

    const handleClickMessUser = (converId) => {
        handleCloseMess()
        router.push(`/mess/${converId}`)
    }

    return (
        <List
            sx={{
                flex: 1,
                overflowY: 'auto',
                pt: 0,
                maxWidth: 360,
                maxHeight: '30rem',
                width: 360,
            }}
        >
            {conversations?.map((conversation) => (
                <ListItem
                    key={conversation.id}
                    button
                    onClick={() => handleClickMessUser(conversation.id)}
                    sx={{
                        bgcolor: !conversation.isRead ? 'grey.200' : 'transparent', // Đổi màu nền khi chưa đọc
                        '&:hover': {
                            bgcolor: !conversation.isRead ? 'grey.300' : 'action.hover', // Nền hover
                        },
                        cursor: 'pointer',
                    }}
                >
                    <ListItemAvatar>
                        <Avatar
                            alt={conversation.student.name}
                            src={conversation.student.avatarUrl}
                            sx={{ width: 56, height: 56, mr: 1 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={conversation.student.name}
                        secondary={conversation.lastMessage}
                        primaryTypographyProps={{
                            fontWeight: !conversation.isRead ? 'bold' : 'normal',
                        }}
                        secondaryTypographyProps={{
                            noWrap: true,
                            fontWeight: !conversation.isRead ? 'bold' : 'normal', 
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formatNotificationTime(conversation.lastMessageTime)}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
}

export default MessHeader