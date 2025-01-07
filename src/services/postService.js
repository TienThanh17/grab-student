import axios from '@/configs/axios';

export const getPostByIdService = (id) => {
    return axios.get(`posts/${id}`);
}

export const getPostService = (userId, postType, status) => {
    const params = {
        userId,
        status
    }
    return axios.get(`posts/${postType}`, { params });
}

export const getMyPostService = (postType, status, startDateFrom, startDateTo) => {
    const params = {
        postType, status, startDateFrom, startDateTo
    }
    return axios.get(`posts/getByCurrentUser`, { params });
}

export const createPostService = (data) => {
    return axios.post('/posts/create', data);
}

export const updatePostService = (id, data) => {
    return axios.put(`/posts/update/${id}`, data);
}

