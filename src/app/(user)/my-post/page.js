'use client'

import { useState, useEffect } from 'react'
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
import Post from '@/components/post/Post';
import dayjs from 'dayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { getMyPostService } from '@/services/postService'


const postTypeSelect = [
  {
    label: "Kênh khách hàng",
    value: "passenger",
  },
  {
    label: "Kênh tài xế",
    value: "rider",
  },
];

const ExpirySelect = [
  {
    label: "Còn hạn",
    value: "validity",
  },
  {
    label: "Hết hạn",
    value: "expiry",
  },
];

function MyPost() {
  const [posts, setPosts] = useState([]);
  const [isExpired, setIsExpired] = useState(ExpirySelect[0].value);
  const [postType, setPostType] = useState(postTypeSelect[0].value);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]); // [start, end]

  const handleDateChange = (newValue) => {
    setDateRange(newValue); // Cập nhật giá trị
  };

  const handleChangePostType = (event) => {
    setPostType(event.target.value);
  };

  const handleChangeIsExpired = (event) => {
    setIsExpired(event.target.value);
  };

  const fetchPosts = async () => {
    try {
      const res = await getMyPostService(
        postType, 
        isExpired === 'expiry' ? false : true, 
        dayjs(dateRange[0]).format("YYYY-MM-DD"), 
        dayjs(dateRange[1]).format("YYYY-MM-DD")
      );
      setPosts(res.data.data);
    } catch (error) {
      console.log(error)
    } finally {

    }
  }

  const handleConfirm = () => {
    // Logic xác nhận
    console.log('Đã xác nhận:', { postType, isExpired, dateRange });
    fetchPosts();
  };


  return (
    <Stack sx={{ width: 1, mt: 2, alignItems: 'center' }}>
      <Paper elevation={2} sx={{ width: '90%', borderRadius: 5, overflow: "hidden", pb: 5 }}>
        <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
          <Typography variant="h6">BÀI ĐĂNG CỦA TÔI</Typography>
        </Box>
        <Stack direction='row' sx={{ justifyContent: 'space-evenly', mt: 4 }}>
          <TextField
            select
            label="Loại bài đăng"
            sx={{ width: '30%' }}
            value={postType}
            onChange={handleChangePostType}
            slotProps={{
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
              },
              select: {
                MenuProps: {
                  disableScrollLock: true,
                  sx: {
                    zIndex: 900
                  }
                }
              }
            }}
          >
            {postTypeSelect.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Còn hạn"
            sx={{ width: '30%' }}
            value={isExpired}
            onChange={handleChangeIsExpired}
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
            {ExpirySelect.map((option) => (
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
      <Stack spacing={5} sx={{ mt: 5, alignItems: "center" }}>
        {posts?.map((value, index) => (
          <Post key={index} data={value} />
        ))}
      </Stack>

    </Stack>
  )
}

export default MyPost