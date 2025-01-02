'use client'

import { useState } from 'react'
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem, Stack, Paper, InputAdornment
} from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import dayjs from 'dayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { getRideService } from '@/services/rideService';
import { useSelector } from 'react-redux';
import RideComponent from '@/components/ride/RideComponent';

const statusSelect = [
    {
        label: "Đang diễn ra",
        value: "going",
    },
    {
        label: "Đã hoàn thành",
        value: "done",
    },
    {
        label: "Đã hủy",
        value: "canceleded",
    }
];

const roleSelect = [
    {
        label: "Tài xế",
        value: true,
    },
    {
        label: "Hành khách",
        value: false,
    },
];

function Ride() {
    const [rides, setRides] = useState([]);
    const [role, setRole] = useState(roleSelect[0].value);
    const [status, setStatus] = useState(statusSelect[0].value);
    const [dateRange, setDateRange] = useState([
        dayjs().startOf("month"), // Ngày đầu tháng
        dayjs().endOf("month"),   // Ngày cuối tháng
    ]);
    const userId = useSelector((state) => state.user.userInfo.id)

    const handleDateChange = (newValue) => {
        setDateRange(newValue); // Cập nhật giá trị
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const handleChangeRole = (event) => {
        setRole(event.target.value);
    };

    const fetchRides = async () => {
        try {
            const res = await getRideService(
                userId,
                role,
                status,
                dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss").replace(' ', 'T'),
                dayjs(dateRange[1]).startOf("day").format("YYYY-MM-DD HH:mm:ss").replace(' ', 'T')
            );
            setRides(res.data.data);
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    const handleConfirm = () => {
        // console.log('Đã xác nhận:', { postType, status, dateRange });
        fetchRides();
    };

    return (
        <Stack sx={{ width: 1, mt: 2, alignItems: 'center' }}>
            <Paper elevation={2} sx={{ width: '90%', borderRadius: 5, overflow: "hidden", pb: 5 }}>
                <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
                    <Typography variant="h6">CHUYẾN XE</Typography>
                </Box>
                <Stack direction='row' sx={{ justifyContent: 'space-evenly', mt: 4 }}>
                    <TextField
                        select
                        label="Vai trò"
                        sx={{ width: '30%' }}
                        value={role}
                        onChange={handleChangeRole}
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
                                        <TwoWheelerIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    >
                        {roleSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        format="DD-MM-YYYY"
                        label="Khoảng ngày"
                        slots={{ field: SingleInputDateRangeField }}
                        name="allowedRange"
                        slotProps={{
                            textField: {
                                InputProps: {
                                    startAdornment: (
                                        <Stack sx={{ pr: 2, justifyContent: 'center' }}>
                                            <CalendarMonth color="primary" />
                                        </Stack>
                                    ),
                                },
                            },
                            popper: {
                                sx: {
                                    zIndex: 900,
                                },
                            },
                        }}
                    />
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
                {rides?.map((value, index) => (
                    <RideComponent key={index} data={value} />
                ))}
            </Stack>
                
        </Stack>
    )
}

export default Ride