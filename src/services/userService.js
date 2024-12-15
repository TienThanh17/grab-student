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

export const update2fa = (id, isEnabled) => {
    const params = {
        id: id,
        isEnabled: isEnabled
    }
    return axios.put('/student/update2fa', null, { params });
}

export const changePasswordService = ({ id, currentPassword, newPassword }) => {

    return axios.put(`/student/updatePassword/${id}`,
        {
            password: currentPassword,
            newPassword: newPassword
        }
    );
}

