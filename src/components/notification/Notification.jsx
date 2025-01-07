import React from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography
} from '@mui/material';
import { markAsReadService } from '@/services/notiService';
import { useRouter } from 'next/navigation';
import { formatNotificationTime } from '@/utils/functionUtils';
import { useSelector } from 'react-redux';
import { useGlobalContext } from '@/provider/GlobalContext';


const Notification = ({ handleCloseNoti }) => {
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
    const { fetchNotification, notifications, countUnreadNoti } = useGlobalContext();

    const handleNotificationClick = async (notification) => {
        try {
            if (notification.type === 'send_request' || notification.type === 'cancel_request') {
                router.push(`/request/${notification.postId}`)
            } else if (notification.type === 'reject_request') {
                router.push(`/my-request`)
            } else if (notification.type === 'accept_request' || notification.type === 'cancel_ride') {
                router.push(`/ride/${notification.rideId}`)
            } else if (notification.type === 'review') {
                router.push(`/ride/${notification.rideId}`)
            }
            if (!notification.isRead) {
                const res = await markAsReadService(notification.id);
                fetchNotification(userInfo.id)
                countUnreadNoti(userInfo.id)
            }
            handleCloseNoti()
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: '30rem', overflowY: 'scroll' }}>
            {notifications?.map((notification) => (
                <ListItem
                    key={notification.id}
                    alignItems="flex-start"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                        bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                        '&:hover': {
                            bgcolor: 'action.selected',
                        },
                        cursor: 'pointer',
                    }}
                >
                    <ListItemAvatar>
                        <Avatar alt="User Avatar" src={notification.sender.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography
                                component="span"
                                variant="body1"
                                color="text.primary"
                                sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                            >
                                {notification.content}
                            </Typography>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {formatNotificationTime(notification.createAt)}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default Notification;

