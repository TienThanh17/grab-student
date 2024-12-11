import axios from '@/configs/axios';

export const getPostService = (userId, postType) => {
    const params = {
        userId
    }
    return axios.get(`posts/${postType}`, { params });
}

export const createPostService = (data) => {

    return axios.post('/posts/create', data);
}

