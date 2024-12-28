import axios from '@/configs/axios';

export const getUserManagerService = () => {
    return axios.get(`student/manager`);
}


