import axios from '@/configs/axios';

export const createRideRequestService = (data) => {

    return axios.post('riderequest/create', data);
}

export const getRideRequestService = (postId, status) => {

    return axios.get(`riderequest/fineByPost/${postId}?status=${status}`);
}

export const getRideRequestByUserService = (userId, status) => {

    return axios.get(`riderequest?userId=${userId}&status=${status}`);
}

export const updateRideRequestService = (id, data) => {

    return axios.put(`riderequest/${id}`, data);
}


export const acceptRequestService = ({ requestId, riderId, riderStartLocation, riderEndLocation, startLon, startLat, endLon, endLat, estimatedTime, distance }) => {

    return axios.post('ride/accept', { requestId, riderId, riderStartLocation, riderEndLocation, startLon, startLat, endLon, endLat, estimatedTime, distance });
}

export const getRideService = (userId, role, status, from, to) => {
    const params = {
        userId,
        role,
        status,
        from,
        to
    }
    return axios.get(`ride`, { params });
}

export const getOneRideService = (id) => {
    return axios.get(`ride/${id}`);
}

export const doneRideService = (id) => {
    return axios.put(`ride/update/rideDone?rideId=${id}`);
}

export const cancelRideService = (id) => {
    return axios.put(`ride/update/rideCancel?rideId=${id}`);
}



