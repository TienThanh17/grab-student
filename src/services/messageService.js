import axios from '@/configs/axios';

export const getConversationsService = (id) => {

    return axios.get(`conversation/student?studentId=${id}`);
}

export const getOneConversationService = (id, studentId) => {

    return axios.get(`conversation/${id}?studentId=${studentId}`);
}

export const getMessageService = (id) => {

    return axios.get(`message/${id}`);
}

export const getCountUnreadService = (id) => {

    return axios.get(`message/count-un-read?recipientId=${id}`);
}

export const sendMessageService = ({ senderId, recipientId, content }) => {

    return axios.post(`message/send`, { senderId, recipientId, content });
}

export const seenMessageService = ({ messageIds }) => {

    return axios.put(`message/seen`, { messageIds});
}