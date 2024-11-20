"use client";

import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Popper from "@mui/material/Popper";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import Chip from "@mui/material/Chip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";

import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import line from "@/public/images/line.png";
import { useDebouncedState } from "@/utils/customHook";
import SearchPlace from "./SearchPlace";
import SearchPopper from "./SearchPopper";
import Mapbox from "@/components/mapbox/Mapbox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 1, sm: 1, md: "60%", lg: "50%", xl: "40%" },
  height: { xs: 1, sm: 1, md: "auto" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { sm: 0, md: 4 },
  borderRadius: { sm: 0, md: 9 },
};

function PostDetail({ handleClose }) {
  const postData = useSelector((state) => state.post.postData);
  const [starting, setStarting, debouncedStarting] = useDebouncedState(
    "",
    1000
  );
  const [destination, setDestination, debouncedDestination] = useDebouncedState(
    "",
    1000
  );
  const [openStartingPopper, setOpenStartingPopper] = useState(false);
  const [openDestinationPopper, setOpenDestinationPopper] = useState(false);
  const [anchorStarting, setAnchorStarting] = useState(null);
  const [anchorDestination, setAnchorDestination] = useState(null);
  const [message, setMessage] = useState("");

  const handleChangeStarting = (e) => {
    setStarting(e.target.value);
    setAnchorStarting(e.currentTarget);
  };

  const handleChangeDestination = (e) => {
    setDestination(e.target.value);
    setAnchorDestination(e.currentTarget);
  };

  const sendRequest = () => {
    //call api
    console.log("send request");
  };

  const handleChangeMessage = (e) => {
    //call api
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    //call api
    console.log(message);
  };

  useEffect(() => {
    if (starting.trim().length > 0) {
      setOpenStartingPopper(true);
    } else {
      setOpenStartingPopper(false);
    }
    if (destination.trim().length > 0) {
      setOpenDestinationPopper(true);
    } else {
      setOpenDestinationPopper(false);
    }
  }, [starting, destination]);

  return (
    <Box sx={style}>
      <Grid
        container
        columnSpacing={{ xs: 0, sm: 2 }}
        sx={{
          border: `1px solid ${alpha("#000", 0.3)}`,
          p: { xs: 2, md: 2 },
          borderRadius: { sm: 0, md: 5 },
          display: { xs: "none", md: "flex" },
          bgcolor: "white",
        }}
      >
        <Grid size={8}>
          <Typography variant="subtitle1" sx={{ color: alpha("#000", 0.6) }}>
            Điểm xuất phát
          </Typography>
        </Grid>
        <Grid size={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid size={3}></Grid>

        <Grid size={8}>
          <Typography variant="subtitle1">{postData.from}</Typography>
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
            <WatchLaterIcon color="primary" />
            <Typography variant="subtitle1">{postData.time}</Typography>
          </Stack>
        </Grid>

        <Grid size={8} sx={{ display: "flex", alignItems: "center" }}>
          <Divider orientation="horizontal" sx={{ width: 1 }} />
        </Grid>
        <Grid size={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid size={3}>
          <Image src={line} alt="line" style={{ marginLeft: "10px" }} />
        </Grid>

        <Grid size={8}>
          <Typography variant="subtitle1" sx={{ color: alpha("#000", 0.6) }}>
            Điểm đến
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
            <CalendarMonthIcon color="primary" />
            <Typography variant="subtitle1">{postData.date}</Typography>
          </Stack>
        </Grid>

        <Grid size={8}>
          <Typography variant="subtitle1">{postData.to}</Typography>
        </Grid>
        <Grid size={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid size={3}></Grid>
      </Grid>
      <Box
        sx={{
          position: "relative", // Thiết lập ngữ cảnh cho SearchPlace
          width: 1,
          height: { xs: "100vh", md: "auto" },
        }}
      >
        <Stack
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10, // Giữ SearchPlace trên mapContainerRef
            width: { xs: 1, sm: 1, md: "70%" },
            gap: 1,
            mt: { xs: 5, md: 1 },
            paddingInline: 1,
          }}
        >
          <SearchPlace
            handleChangeStarting={handleChangeStarting}
            starting={starting}
            setStarting={setStarting}
            handleChangeDestination={handleChangeDestination}
            destination={destination}
            setDestination={setDestination}
            postData={postData}
            sendRequest={sendRequest}
          />
        </Stack>
        <Mapbox />
        {/* <Box
          sx={{
            bgcolor: "white",
            width: 1,
            height: { xs: 1, sm: 1, md: "25rem" },
            border: "1px solid red",
            mt: { xs: 0, md: 2 },
          }}
          ref={mapContainerRef}
        ></Box> */}
      </Box>
      <Box
        sx={{
          position: { xs: "absolute", md: "static" },
          bottom: 10,
          left: 0,
          width: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 5 },
            mt: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}
          >
            <Image src={postData.avatarURL} alt="avt" />
            <Typography
              variant="subtitle1"
              sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: "bold" }}
            >
              {postData.name}
            </Typography>
          </Stack>
          <Chip
            avatar={<Avatar alt="Natacha" src={postData.avatarURL} />}
            label={postData.name}
            variant="outlined"
            sx={{
              fontWeight: "bold",
              bgcolor: "white",
              display: { xs: "flex", md: "none" },
            }}
          />
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={postData.rating}
            sx={{ fontWeight: "bold", bgcolor: "white" }}
            variant="outlined"
          />
        </Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 5 },
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              display: { xs: "none", md: "block" },
            }}
            onClick={sendRequest}
          >
            Gửi yêu cầu
          </Button>
          <TextField
            label="Gửi tin nhắn"
            value={message}
            onChange={handleChangeMessage}
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
      </Box>
      <HighlightOffTwoToneIcon
        sx={{
          position: "absolute",
          top: 5,
          right: 10,
          display: { xs: "block", md: "none" },
          fontSize: "2rem",
        }}
        onClick={handleClose}
        color="error"
      />
      <Popper
        open={openStartingPopper}
        anchorEl={anchorStarting}
        disablePortal
        placement="bottom"
        sx={{
          zIndex: 999,
          // width: anchorStarting ? `${anchorStarting.clientWidth}px` : 'auto'
        }}
        modifiers={[
          {
            name: "setPopperWidth",
            enabled: true,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: ({ state }) => {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
          },
        ]}
      >
        <SearchPopper />
      </Popper>
      <Popper
        open={openDestinationPopper}
        anchorEl={anchorDestination}
        disablePortal
        placement="bottom"
        sx={{ zIndex: 999 }}
        modifiers={[
          {
            name: "setPopperWidth",
            enabled: true,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: ({ state }) => {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
          },
        ]}
      >
        <SearchPopper />
      </Popper>
    </Box>
  );
}
export default PostDetail;
