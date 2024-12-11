import axios from '@/configs/axios';

export const loginService = (data) => {
    return axios.post('auth/login', data);
}

export const sendOtpService = (email) => {
    const params = {
        toEmail: email
    }
    return axios.post('/email/sendOtp', null, { params });
}

export const verifyOtpService = ({ email, otp }) => {
    const params = {
        email: email,
        otp
    }
    return axios.post('/student/verifyOtp', null, { params });
}

