'use client'

import ChatWindow from '@/components/mess/ChatWindow'
import MessSidebar from '@/components/mess/MessSidebar'
import socket from '@/configs/socket'
import { useGlobalContext } from '@/provider/GlobalContext'
import { getMessageService, getOneConversationService, seenMessageService } from '@/services/messageService'
import { Box, createTheme, useMediaQuery } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

function Mess() {
    const [message, setMessage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversation, setConversation] = useState(null);
    const userInfo = useSelector((state) => state.user.userInfo);
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const dispatch = useDispatch();
    const params = useParams();
    const router = useRouter();
    const { fetchCountUnreadMess, conversations, fetchConversation } = useGlobalContext();

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const handleSelectUser = (converId) => {
        router.push(`/mess/${converId}`)
        if (!isDesktop) setSidebarOpen(false);
    };

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const res = await getMessageService(params.converId);
                if (res.data.code === 0) {
                    const messages = res.data.data
                    setMessage(messages);
                    //mark seen mess
                    if (params.converId == messages[0].conversationId) {
                        const unSeenMessages = [];
                        for (let message of messages) {
                            if (message.recipientId == userInfo.id && message.status == 'SENT') {
                                unSeenMessages.push(message.id);
                            }
                        }
                        if (unSeenMessages.length > 0) {
                            await seenMessageService({
                                messageIds: unSeenMessages
                            })
                            fetchCountUnreadMess(userInfo.id)
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchMessage();

        const fetchCurrentConversation = async () => {
            try {
                const res = await getOneConversationService(params.converId, userInfo.id);
                if (res.data.code === 0) {
                    const conversation = res.data.data;
                    setConversation(conversation);
                    setSelectedUser(conversation.student)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCurrentConversation();

    }, [dispatch, params.converId, userInfo.id, fetchCountUnreadMess])

    // Create a memoized version of the handleIncomingMessage function
    const handleIncomingMessage = useCallback(async (data) => {
        if (data.conversationId === +params.converId) {
            setMessage((prev) => {
                // Check if the message already exists in the state
                const messageExists = prev && prev.some(msg => msg.id === data.id);
                if (!messageExists) {
                    return prev ? [...prev, data] : [data];
                }
                return prev;
            });
            const unSeenMessages = [data.id];
            await seenMessageService({
                messageIds: unSeenMessages
            })
        } else {
            console.log("Tin nhắn từ cuộc trò chuyện khác:", data);
        }
        // Always call these functions, regardless of which conversation the message is for
        fetchCountUnreadMess(userInfo.id);
        fetchConversation(userInfo.id);
    }, [params.converId, userInfo.id, fetchCountUnreadMess, fetchConversation]);

    // Set up the socket event listener
    useEffect(() => {
        socket.on("getMessage", handleIncomingMessage);

        return () => {
            socket.off("getMessage", handleIncomingMessage);
        };
    }, [handleIncomingMessage]);

    useEffect(() => {
        // Setup
        fetchCountUnreadMess(userInfo.id);
        fetchConversation(userInfo.id);

        // Cleanup
        return () => {
            socket.off("getMessage", handleIncomingMessage);
            // Optionally, you can call these functions again on cleanup
            // fetchCountUnreadMess(userInfo.id);
            // fetchConversation(userInfo.id);
        };
    }, [userInfo.id]);

    return (
        <Box sx={{ display: "flex", height: "90vh", bgcolor: "background.default" }}>
            {selectedUser && <MessSidebar
                conversations={conversations}
                selectedUser={selectedUser}
                handleSelectUser={handleSelectUser}
                open={isDesktop || sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />}
            {selectedUser && <ChatWindow
                user={selectedUser}
                messages={message}
                setMessage={setMessage}
                onOpenSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                senderId={userInfo.id}
            />}
        </Box>
    );
}

export default Mess;