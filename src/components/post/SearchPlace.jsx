import TextField from "@mui/material/TextField";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { useRef } from "react";

function SearchPlace({
  handleChangeStarting,
  setStarting,
  starting,
  destination,
  setDestination,
  handleChangeDestination,
  postData,
  sendRequest,
  type
}) {
  const startingRef = useRef();
  const destinationRef = useRef();
  
  const clearStarting = () => {
    setStarting("");
  };

  const clearDestination = () => {
    setDestination("");
  };

  return (
    <>
      <TextField
        label="Điểm xuất phát của bạn"
        variant="outlined"
        sx={{
          bgcolor: "white",
          borderRadius: "2rem",
          "& .MuiInputBase-root": {
            borderRadius: "2rem",
          },
        }}
        size="small"
        ref={startingRef}
        onChange={handleChangeStarting}
        value={starting}
        slotProps={{
          input: {
            endAdornment: (
              // eslint-disable-next-line react/jsx-no-duplicate-props
              <InputAdornment
                position="end"
                sx={{ cursor: "pointer" }}
                onClick={clearStarting}
              >
                {starting.trim().length > 0 ? <ClearIcon /> : <SearchIcon />}
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label="Điểm đến của bạn"
        variant="outlined"
        size="small"
        ref={destinationRef}
        onChange={handleChangeDestination}
        value={destination}
        sx={{
          bgcolor: "white",
          borderRadius: "2rem",
          "& .MuiInputBase-root": {
            borderRadius: "2rem",
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              // eslint-disable-next-line react/jsx-no-duplicate-props
              <InputAdornment
                position="end"
                sx={{ cursor: "pointer" }}
                onClick={clearDestination}
              >
                {destination.trim().length > 0 ? <ClearIcon /> : <SearchIcon />}
              </InputAdornment>
            ),
          },
        }}
      />
      {type !== 'postCreation' &&<Stack
        direction="row"
        sx={{
          display: { xs: "flex", sm: "flex", md: "none" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" gap={1}>
          <Chip
            sx={{ bgcolor: "white" }}
            icon={<CalendarMonthIcon color="primary" />}
            label={postData.date}
            variant="outlined"
          />
          <Chip
            sx={{ bgcolor: "white" }}
            icon={<WatchLaterIcon color="primary" />}
            label={postData.time}
            variant="outlined"
          />
        </Stack>
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 3,
            display: { xs: "block", md: "none" },
          }}
          onClick={sendRequest}
        >
          Gửi yêu cầu
        </Button>
      </Stack>}
      {/* <MobileDatePicker
        value={date}
        onChange={(newValue) => onChangeDate(newValue)}
        sx={{ width: 1 }}
      /> */}
    </>
  );
}

export default SearchPlace;
