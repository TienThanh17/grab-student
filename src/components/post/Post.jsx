import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import { setPostData } from "@/redux-toolkit/postSlice";
import dayjs from 'dayjs'
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, SpeedDial, SpeedDialAction } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PostSelf from '@/components/post/PostSelf'
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { updatePostService } from "@/services/postService";
import { useSnackbar } from "notistack";

export default function Post({ data, handleOpen, isMyPostPage, handleOpenPostUpdate, fetchPosts }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const handleClickPost = () => {
    console.log('post data', data);
    if (handleOpen) {
      dispatch(setPostData(data));
      handleOpen();
    } 
    // else if (isMyPostPage && data.type === 'rider') {
    //   router.push(`/request/${data.id}`)
    // }
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      dispatch(setIsLoading(true));
      const res = await updatePostService(data.id, { status: false })
      if (res.data.code === 0) {
        enqueueSnackbar("Xóa thành công", { variant: "success" });
      }
      fetchPosts();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Lỗi", { variant: "error" });
    } finally {
      dispatch(setIsLoading(false));
      setOpenDialog(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setOpenDialog(false); // Đóng dialog nếu hủy
  };

  const handleSpeedDialAction = (event, action) => {
    event.stopPropagation();
    if (action === 'delete') {
      setOpenDialog(true);
    } else if (action === 'view') {
      dispatch(setPostData(data));
      handleOpen();
    } else if (action === 'edit') {
      dispatch(setPostData(data));
      handleOpenPostUpdate();
    } else if (action === 'request') {
      router.push(`/request/${data.id}`)
    }
    console.log('action', action)
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: '90%',
        px: { xs: 1, sm: 5, md: 10 },
        py: { xs: 1, sm: 4, md: 5 },
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)", // Phóng to nhẹ khi hover
          boxShadow: (theme) => theme.shadows[6], // Tăng độ đổ bóng khi hover
        },
        borderRadius: 5,
        position: 'relative'
      }}
      onClick={handleClickPost}
    >
      {isMyPostPage && <SpeedDial
        ariaLabel="More actions"
        sx={{
          position: 'absolute',
          top: 15,
          right: 25,
          zIndex: 800,
          '.MuiSpeedDial-fab': {
            backgroundColor: 'transparent', // Loại bỏ background
            boxShadow: 'none', // Loại bỏ shadow
            '&:hover': {
              backgroundColor: 'transparent', // Vẫn giữ không nền khi hover
            },
          },
          '.MuiSpeedDial-actions': {
            pt: 2.5
          }
        }}
        icon={<MoreHorizIcon sx={{ color: 'black' }} />}
        direction="down" // Hướng mở xuống dưới
        onClick={(e) => e.stopPropagation()} // Ngăn click lan ra ngoài
      >
        <SpeedDialAction
          icon={<VisibilityIcon />}
          tooltipTitle="View"
          onClick={(event) => handleSpeedDialAction(event, 'view')}
          sx={{
            color: 'white',
            bgcolor: (theme) => theme.palette.primary.main,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
          }}
        />
        {data.status && <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle="Edit"
          onClick={(event) => handleSpeedDialAction(event, 'edit')}
          sx={{
            color: 'white',
            bgcolor: (theme) => theme.palette.primary.main,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
          }}
        />}
        {data.status && <SpeedDialAction
          icon={<DeleteIcon />}
          tooltipTitle="Delete"
          onClick={(event) => handleSpeedDialAction(event, 'delete')}
          sx={{
            color: 'white',
            bgcolor: 'red',
            '&:hover': {
              bgcolor: 'darkred', // Màu hover khi rê chuột
            },
          }}
        />}
        {data.type === 'rider' && data.status && <SpeedDialAction
          icon={<TwoWheelerIcon />}
          tooltipTitle="request"
          onClick={(event) => handleSpeedDialAction(event, 'request')}
          sx={{
            color: 'white',
            bgcolor: 'green',
            '&:hover': {
              bgcolor: 'darkgreen',
            },
          }}
        />}
      </SpeedDial>}

      <Stack spacing={3}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "flex-start", gap: 52 }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              src={data.student.avatarUrl}
              alt="avt"
              sx={{ width: '3.5rem', height: '3.5rem', borderRadius: '5rem' }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {data.student.name}
            </Typography>
          </Stack>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={data.rating ?? null}
          />
        </Stack>
        <Typography variant="subtitle1" >
          {data.content}
        </Typography>

        <Grid container columnSpacing={{ xs: 0, sm: 2 }}>
          <Grid size={8}>
            <Typography
              variant="subtitle1"
              fontSize={{ xs: 14, md: 16 }}
              sx={{ color: alpha("#000", 0.6) }}
            >
              Điểm đón
            </Typography>
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid size={3}></Grid>

          <Grid size={8}>
            <Typography variant="subtitle1" fontSize={{ xs: 14, md: 16 }}>
              {data.pickUpLocation}
            </Typography>
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid size={3}>
            <Stack
              direction="row"
              spacing={{ xs: 0, md: 2 }}
              sx={{ alignItems: "center" }}
            >
              <WatchLaterIcon
                // sx={{ color: "#FE7171" }} 
                color='primary'
              />
              <Typography variant="subtitle1" fontSize={{ xs: 14, md: 16 }}>
                {data.startTimeString}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={9}>
            <Divider />
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid size={2}></Grid>

          <Grid size={8}>
            <Typography
              variant="subtitle1"
              fontSize={{ xs: 14, md: 16 }}
              sx={{ color: alpha("#000", 0.6) }}
            >
              Điểm đến
            </Typography>
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid size={3}></Grid>

          <Grid size={8}>
            <Typography variant="subtitle1" fontSize={{ xs: 14, md: 16 }}>
              {data.dropOffLocation}
            </Typography>
          </Grid>
          <Grid size={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid size={3}>
            <Stack
              direction="row"
              spacing={{ xs: 0, md: 2 }}
              sx={{ alignItems: "center" }}
            >
              <CalendarMonthIcon color='primary' />
              <Typography variant="subtitle1" fontSize={{ xs: 13, md: 16 }}>
                {dayjs(data.startDate).format('DD-MM-YYYY')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      {/* Dialog xác nhận xóa */}
      {isMyPostPage && <Dialog
        open={openDialog}
        onClose={handleCancel}
        disableScrollLock={true}
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => handleCancel(e)} color="primary">
            Hủy
          </Button>
          <Button onClick={(e) => handleDelete(e)} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>}

    </Paper>
  );
}
