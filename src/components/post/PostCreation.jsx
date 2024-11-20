import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Divider from "@mui/material/Divider";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchPlace from "./SearchPlace";
import SearchPopper from "./SearchPopper";
import Popper from "@mui/material/Popper";
import { useDebouncedState } from "@/utils/customHook";
import Mapbox from "@/components/mapbox/Mapbox";

const postTypeSelect = [
  {
    id: "passenger",
    value: "Kênh khách hàng",
  },
  {
    id: "rider",
    value: "Kênh tài xế",
  },
];

function PostCreation({ handleClosePostCreation }) {
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
  const [postType, setPostType] = useState(postTypeSelect[0].value);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    // console.log(dayjs(date).format("DD-MM-YYYY"));
    console.log(dayjs(time).format("hh:mm"));
  }, [date, time])

  const MAX_TEXT_LENGTH = 200;
  const MAX_LINES = 3;

  const handleChangeText = (e) => {
    const lines = e.target.value.split("\n");
    if (e.target.value.length <= MAX_TEXT_LENGTH && lines.length <= MAX_LINES) {
      setText(e.target.value);
    }
  };

  const handleDateChange = (newValue) => {
      setDate(newValue);
  };

  const handleChangePostType = (event) => {
    setPostType(event.target.value);
  };

  const handleChangeStarting = (e) => {
    setStarting(e.target.value);
    setAnchorStarting(e.currentTarget);
  };

  const handleChangeDestination = (e) => {
    setDestination(e.target.value);
    setAnchorDestination(e.currentTarget);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: 1, sm: 1, md: "90%", lg: "70%", xl: "55%" },
        height: { xs: 1, sm: 1, md: "auto" },
        bgcolor: "background.paper",
        boxShadow: 24,
        p: { sm: 0, md: 4 },
        borderRadius: { sm: 0, md: 3 },
      }}
    >
      <Stack direction="row">
        <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
          Tạo bài đăng
        </Typography>
        <CancelIcon
          sx={{
            color: "silver",
            fontSize: { xs: 30, md: 40 },
            cursor: "pointer",
          }}
          onClick={handleClosePostCreation}
        />
      </Stack>
      <Divider sx={{ mt: { xs: 0, md: 2 } }} />
      <Stack
        direction="row"
        sx={{ mt: { xs: 0, md: 4 }, gap: 4, height: { xs: 1, md: "auto" } }}
      >
        <Box
          sx={{
            position: "relative", // Thiết lập ngữ cảnh cho SearchPlace
            width: 1,
            height: { xs: "100vh", md: "auto" },
            flex: 2
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
              type="postCreation"
            />
          </Stack>
          {/* <Mapbox /> */}
          <Box
          sx={{
            bgcolor: "white",
            flex: 2,
            width: 1,
            height: { xs: 1, sm: 1, md: "25rem" },
            border: "1px solid red",
          }}
        ></Box>
        </Box>

        <Stack
          direction="column"
          sx={{ gap: 2, flex: 0.7, display: { xs: "none", md: "flex" } }}
        >
          <TextField
            value={postType}
            label="Loại bài đăng"
            select
            onChange={handleChangePostType}
            slotProps={{
              input: {
                startAdornment: (
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  <InputAdornment
                    position="start"
                    sx={{ cursor: "pointer" }}
                    // onClick={clearStarting}
                  >
                    <TwoWheelerIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          >
            {postTypeSelect.map((item) => (
              <MenuItem key={item.id} value={item.value}>
                {item.value}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            label="Ngày"
            value={date}
            format="DD-MM-YYYY"
            onChange={handleDateChange}
            disablePast
            slotProps={{
              // Targets the `IconButton` component.
              openPickerButton: {
                color: "primary",
              },
              // Targets the `InputAdornment` component.
              inputAdornment: {
                position: "start",
              },
            }}
          />
          <TimePicker
            label="Time"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            ampm={false}
            slotProps={{
              openPickerButton: {
                color: "primary",
              },
              inputAdornment: {
                position: "start",
              },
            }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ mt: 2, justifyContent: "center" }}>
        <Stack sx={{ gap: 2, width: "60%" }}>
          <TextField
            placeholder="Thêm nội dung văn bản..."
            multiline
            minRows={3}
            value={text}
            onChange={handleChangeText}
          />
          <Button variant="contained">Đăng</Button>
        </Stack>
      </Stack>
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

export default PostCreation;
