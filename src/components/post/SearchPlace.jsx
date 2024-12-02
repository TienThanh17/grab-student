import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { useRef, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

function SearchPlace({
  handleChangeStarting,
  starting,
  setStarting,
  setOpenStartingPopper,
  loadingStartingSearch,
  handleChangeDestination,
  destination,
  setDestination,
  setOpenDestinationPopper,
  loadingDestinationSearch,
  postData,
  sendRequest,
  type,
  setAnchorStarting,
  setAnchorDestination,
  popperStartingRef,
  popperDestinationRef
}) {
  const startingRef = useRef();
  const destinationRef = useRef();

  const clearStarting = () => {
    setStarting("");
    setOpenStartingPopper(false);
  };

  const clearDestination = () => {
    setDestination("");
    setOpenDestinationPopper(false)
  };

  const handleFocusDestination = (e) => {
    setAnchorDestination(e.currentTarget)
    setOpenDestinationPopper(true)
  }

  const handleFocusStarting = (e) => {
    setAnchorStarting(e.currentTarget)
    setOpenStartingPopper(true)
  }

  const handleBlurStarting = (event) => {
    // Kiểm tra nếu click không nằm trong anchor hoặc popper
    if (
      startingRef.current &&
      !startingRef.current.contains(event.target) &&
      popperStartingRef.current &&
      !popperStartingRef.current.contains(event.target)
    ) {
      setOpenStartingPopper(false);
    }
  };

  const handleBlurDestination = (event) => {
    // Kiểm tra nếu click không nằm trong anchor hoặc popper
    if (
      destinationRef.current &&
      !destinationRef.current.contains(event.target) &&
      popperDestinationRef.current &&
      !popperDestinationRef.current.contains(event.target)
    ) {
      setOpenDestinationPopper(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleBlurStarting);
    document.addEventListener("mousedown", handleBlurDestination);

    return () => {
      document.removeEventListener("mousedown", handleBlurStarting);
      document.removeEventListener("mousedown", handleBlurDestination);
    };
  }, []);

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
        onFocus={handleFocusStarting}
        autoComplete='off'
        slotProps={{
          input: {
            endAdornment: (
              // eslint-disable-next-line react/jsx-no-duplicate-props
              <InputAdornment
                position="end"
                sx={{ cursor: "pointer" }}
                onClick={clearStarting}
              >
                {loadingStartingSearch ? <CircularProgress size="20px" /> : starting.trim().length > 0 ? <ClearIcon /> : <SearchIcon />}
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
        onFocus={handleFocusDestination}
        autoComplete='off'
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
                {loadingDestinationSearch ? <CircularProgress size="20px" /> : destination.trim().length > 0 ? <ClearIcon /> : <SearchIcon />}
              </InputAdornment>
            ),
          },
        }}
      />
      {type !== "postCreation" && (
        <Stack
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
        </Stack>
      )}
      {/* <MobileDatePicker
        value={date}
        onChange={(newValue) => onChangeDate(newValue)}
        sx={{ width: 1 }}
      /> */}
    </>
  );
}

export default SearchPlace;
