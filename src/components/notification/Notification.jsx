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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Notification = ({ notifications, fetchNotification, countUnreadNoti, handleCloseNoti }) => {
    const router = useRouter();
    // console.log(notifications);

    function formatNotificationTime(notificationTime) {
        const now = dayjs();
        const time = dayjs(notificationTime);

        // Nếu thời gian nhỏ hơn 1 ngày
        if (now.diff(time, 'day') < 1) {
            return time.fromNow(); // Trả về '1 phút trước', '1 giờ trước', ...
        }

        // Nếu thời gian lâu hơn 1 ngày
        return time.format('DD-MM-YYYY HH:mm');
    }

    const handleNotificationClick = async (notification) => {
        try {
            if (notification.type === 'send_request' || notification.type === 'cancel_request') {
                router.push(`/request/${notification.postId}`)
            } else if (notification.type === 'reject_request') {
                router.push(`/my-request`)
            } else if (notification.type === 'accept_request' || notification.type === 'cancel_ride') {
                router.push(`/ride/${notification.rideId}`)
            } else if (notification.type === 'review' && !notification.isRead) {
                
            }
            if (!notification.isRead) {
                const res = await markAsReadService(notification.id);
                if (res.data.code === 0) {
                    fetchNotification()
                    countUnreadNoti()
                }
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

