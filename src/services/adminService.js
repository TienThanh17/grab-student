import axios from '@/configs/axios';

export const getUserManagerService = () => {
    return axios.get(`student/manager`);
}

export const updateUserManagerService = (id, data) => {
    return axios.put(`/student/manager/update/${id}`, data);
}
export const deleteUserManagerService = (id, data) => {
    return axios.put(`/student/manager/delete/${id}`);
}

export const createUserManagerService = (data) => {
    return axios.post(`/student/create`, data);
}
export const getPostManagerService = () => {
    return axios.get(`posts/`);
}

export const getRideRequestManagerService = () => {
    return axios.get(`riderequest/`);
}

export const getRideManagerService = () => {
    return axios.get(`ride/`);
}

export const getRideReviewManagerService = () => {
    return axios.get(`ride-review`);
}

