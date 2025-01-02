import axios from '@/configs/axios';

export const countUnReadService = (id) => {
    return axios.get(`notification/count-unread?recipientId=${id}`);
}

export const getNotiByRecipientService = (id) => {
    return axios.get(`notification/recipient/${id}`);
}

export const markAsReadService = (id) => {
    return axios.put(`notification/mark-as-read/${id}`);
}

export const createNotiService = ({ type, senderId, recipientId, postId, rideId }) => {
    const data = {
        type,
        senderId,
        recipientId,
        postId: postId ?? null,
        rideId: rideId ?? null
    }
    return axios.post(`notification/create`, data);
}
