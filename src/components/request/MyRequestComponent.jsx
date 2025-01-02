import { Card, CardContent, Avatar, Typography, Box, Divider, Chip, Button } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { updateRideRequestService } from "@/services/rideService";
import socket from "@/configs/socket";
import { createNotiService } from "@/services/notiService";
import { setPostData } from "@/redux-toolkit/postSlice";

const MyRequestComponent = ({ data, fetchRideRequest, handleOpenPostRequest }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickRequest = () => {
    console.log('data', data);
    dispatch(setPostData(data))
    handleOpenPostRequest();
  };

  const handleCancel = async (event) => {
    event.stopPropagation();
    dispatch(setIsLoading(true));
    try {
      const res = await updateRideRequestService(data.id, { status: 'rejected' });
      if (res.data.code === 0) {
        const resNoti = await createNotiService({
          senderId: data.passenger.id,
          recipientId: data.post.student.id,
          type: 'cancel_request',
          postId: data.post.id
        });
        if (resNoti.data.code === 0) {
          socket.emit("sendNotification", {
            senderId: data.passenger.id,
            receiverId: data.post.student.id,
            type: 'cancel_request',
          });
          fetchRideRequest();
          enqueueSnackbar(
            "Hủy yêu cầu thành công",
            { variant: "success" }
          );
          // handleClose();
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        "Lỗi",
        { variant: "error" }
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Card
      sx={{
        width: 1,
        margin: "0 auto",
        borderRadius: 7,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: 2,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)", // Phóng to nhẹ khi hover
          boxShadow: (theme) => theme.shadows[6], // Tăng độ đổ bóng khi hover
        },
      }}
      onClick={handleClickRequest}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {/* Section Left */}
          <Box flex={1} mr={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={data.passenger.avatarUrl}
                  alt="passenger"
                  sx={{ width: 45, height: 45, marginRight: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Hành khách
                  </Typography>
                  <Typography variant="h6">{data.passenger.name}</Typography>
                </Box>
              </Box>
              <Chip
                icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
                label={data.passenger.rating}
                sx={{ fontWeight: "bold", bgcolor: "white" }}
                variant="outlined"
              />
            </Box>
            <Typography variant="body1" color="textSecondary" fontWeight="bold">
              Điểm đón
            </Typography>
            <Typography variant="body1" mt={0.5}>
              {data.pickUpLocation}
            </Typography>

            <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
              Điểm trả
            </Typography>
            <Typography variant="body1" mt={0.5}>
              {data.dropOffLocation}
            </Typography>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem />

          {/* Section Right */}
          <Box flex={1} ml={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={data.post.student.avatarUrl}
                  alt="rider"
                  sx={{ width: 45, height: 45, marginRight: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tài xế
                  </Typography>
                  <Typography variant="h6">{data.post.student.name}</Typography>
                </Box>
              </Box>
              <Chip
                icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
                label={data.post.student.rating}
                sx={{ fontWeight: "bold", bgcolor: "white" }}
                variant="outlined"
              />
            </Box>
            <Typography variant="body1" color="textSecondary" fontWeight="bold">
              Điểm xuất phát
            </Typography>
            <Typography variant="body1" mt={0.5}>
              {data.post.pickUpLocation}
            </Typography>

            <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
              Điểm đến
            </Typography>
            <Typography variant="body1" mt={0.5}>
              {data.post.dropOffLocation}
            </Typography>
          </Box>
        </Box>
        {data.status === 'pending' && <Button color="error" onClick={handleCancel} variant="contained" sx={{ mt: 3 }}>
          Hủy bỏ
        </Button>}
      </CardContent>
    </Card>
  );
};

export default MyRequestComponent;
