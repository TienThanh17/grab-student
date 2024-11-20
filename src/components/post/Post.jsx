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

import Image from "next/image";
import { useDispatch } from "react-redux";

export default function Post({ data, handleOpen }) {
  const dispatch = useDispatch();
  
  return (
    <Paper
      elevation={2}
      sx={{
        width: 1,
        px: { xs: 1, sm: 5, md: 10 },
        py: { xs: 1, sm: 4, md: 5 },
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)", // Phóng to nhẹ khi hover
          boxShadow: (theme) => theme.shadows[6], // Tăng độ đổ bóng khi hover
        },
      }}
      onClick={() => {
        dispatch(setPostData(data));
        handleOpen();
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Image src={data.avatarURL} alt="avt" />
            <Typography variant="subtitle1" >
              {data.name}
            </Typography>
          </Stack>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={data.rating}
          />
        </Stack>
        <Typography variant="subtitle1" >
          {data.comment}
        </Typography>

        <Grid container columnSpacing={{xs: 0, sm: 2}}>
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
              {data.from}
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
                {data.time}
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
              {data.to}
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
                {data.date}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}
