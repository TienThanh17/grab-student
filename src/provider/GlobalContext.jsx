'use client'

import { getConversationsService, getCountUnreadService } from "@/services/messageService";
import { countUnReadService, getNotiByRecipientService } from "@/services/notiService";
import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [unreadMessCount, setUnreadMessCount] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [unreadCount, setUnreadCount] = useState(null);
    const [conversations, setConversations] = useState(null);

    const fetchCountUnreadMess = async (userId) => {
        try {
            const res = await getCountUnreadService(userId);
            if (res.data.code === 0) {
                setUnreadMessCount(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNotification = async (userId) => {
        try {
            const res = await getNotiByRecipientService(userId);
            if (res.data.code === 0) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const countUnreadNoti = async (userId) => {
        try {
            const res = await countUnReadService(userId);
            setUnreadCount(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchConversation = async (userId) => {
        try {
            const res = await getConversationsService(userId);
            if (res.data.code === 0) {
                setConversations(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                fetchCountUnreadMess,
                unreadMessCount,
                fetchNotification,
                notifications,
                countUnreadNoti,
                unreadCount,
                fetchConversation,
                conversations
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
