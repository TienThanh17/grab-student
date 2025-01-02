'use client'

import { Box, Button, InputAdornment, MenuItem, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import TimerIcon from '@mui/icons-material/Timer';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { getRideRequestByUserService } from "@/services/rideService";
import MyRequestComponent from "@/components/request/MyRequestComponent";
import PostRequest from "@/components/post/PostRequest";
import Image from "next/image";
import empty from '@/public/images/empty-folder.png'


const statusSelect = [
    {
        label: "Đang chờ",
        value: "pending",
    },
    {
        label: "Đã hủy",
        value: "rejected",
    },
];

const MyRequest = () => {
    const [status, setStatus] = useState(statusSelect[0].value);
    const [rideRequest, setRideRequest] = useState([]);
    const [openPostRequest, setOpenPostRequest] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const fetchRideRequest = async () => {
        dispatch(setIsLoading(true));
        try {
            const res = await getRideRequestByUserService(
                userInfo.id,
                status,
            );
            setRideRequest(res.data.data);
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const handleConfirm = () => {
        fetchRideRequest()
    };

    const handleOpenPostRequest = () => setOpenPostRequest(true);
    const handleClosePostRequest = () => setOpenPostRequest(false);

    return (
        <Stack sx={{ width: 1, mt: 2, alignItems: 'center' }}>
            <Paper elevation={2} sx={{ width: '90%', borderRadius: 5, overflow: "hidden", pb: 5 }}>
                <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
                    <Typography variant="h6">YÊU CẦU CỦA TÔI</Typography>
                </Box>
                <Stack direction='row' sx={{ justifyContent: 'space-evenly', mt: 4 }}>
                    <TextField
                        select
                        label="Trạng thái"
                        sx={{ width: '30%' }}
                        value={status}
                        onChange={handleChangeStatus}
                        slotProps={{
                            select: {
                                MenuProps: {
                                    disableScrollLock: true,
                                    sx: {
                                        zIndex: 900
                                    }
                                }
                            },
                            input: {
                                startAdornment: (
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    <InputAdornment
                                        position="start"
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TimerIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    >
                        {statusSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                </Stack>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        sx={{ width: '30%' }}
                    >
                        Lọc
                    </Button>
                </Box>
            </Paper>
            <Stack spacing={5} sx={{ width: '90%', mt: 5, alignItems: "center" }}>
                {rideRequest.length > 0
                    ? rideRequest.map((value, index) => (
                        <MyRequestComponent key={index} data={value} fetchRideRequest={fetchRideRequest} handleOpenPostRequest={handleOpenPostRequest} />
                    ))
                    : <Image src={empty} alt='empty' width={150} height={150}></Image>
                }
            </Stack>

            <Modal
                open={openPostRequest}
                onClose={handleClosePostRequest}
                disableScrollLock={true}
            >
                <PostRequest handleClose={handleClosePostRequest} fetchRideRequest={fetchRideRequest} />
            </Modal>

        </Stack>
    )
}


export default MyRequest;