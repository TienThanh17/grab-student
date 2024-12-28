import axios from '@/configs/axios';

export const createReview = ({ rating, comment, rideId, reviewerId, reviewedId }) => {

    return axios.post(`/`, { rating, comment, rideId, reviewerId, reviewedId });
}

export const getPostService = (userId, postType, status) => {
    const params = {
        userId,
        status
    }
    return axios.get(`posts/${postType}`, { params });
}
