import React, { useState } from "react";
import { Card, CardContent, Avatar, Typography, Box, Button, IconButton, Divider, TextField, InputAdornment, Stack, Chip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const RideRequest = ({ data }) => {
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e) => {
    //call api
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    //call api
    console.log(message);
  };

  const handleAccept = (event) => {
    event.stopPropagation(); // Ngăn sự kiện lan lên cha
    console.log('data', data);
  };

  return (
    <Card
      sx={{
        width: '90%',
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
    >
      <CardContent>
        {/* Header: Avatar, Name, and Rating */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 48, height: 48 }}>HT</Avatar>
            <Box ml={2}>
              <Typography fontWeight="bold">{data.passenger.name}</Typography>
            </Box>
          </Box>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={data.passenger?.rating ?? 0}

            sx={{ fontWeight: "bold", bgcolor: "white" }}
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Pick-up Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold">
          Điểm đón
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.pickUpLocation}
        </Typography>

        {/* drop-off Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
          Điểm đến
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.dropOffLocation}
        </Typography>

        {/* Message */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
          Lời nhắn
        </Typography>
        <Typography variant="body1" mt={0.5}>
          Mình đợi ở cổng A
        </Typography>

        {/* Buttons */}
        <Stack direction='row' justifyContent="space-between" alignItems="center" mt={3}>
          <Button
            variant="contained"
            color='primary'
            onClick={handleAccept}
          >
            Chấp nhận
          </Button>
          <TextField
            label="Gửi tin nhắn"
            value={message}
            onChange={handleChangeMessage}
            autoComplete="off"
            variant="outlined"
            size="medium"
            sx={{
              width: { xs: 1, md: "60%" },
              borderRadius: "2rem",
              "& .MuiInputBase-root": {
                borderRadius: "2rem",
              },
              bgcolor: "white",
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ cursor: "pointer" }}
                    onClick={sendMessage}
                  >
                    <SendIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RideRequest;
