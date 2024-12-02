"use client";

import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
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
import mapboxgl from "mapbox-gl";
import { getSuggestPlaceService, getDirectionService } from "./../../services/mapService";

function PostDetail({ handleClose }) {
  const postData = useSelector((state) => state.post.postData);
  const [starting, setStarting, debouncedStarting] = useDebouncedState(
    "",
    2000
  );
  const [destination, setDestination, debouncedDestination] = useDebouncedState(
    "",
    1000
  );
  const [loadingStartingSearch, setLoadingStartingSearch] = useState(false);
  const [loadingDestinationSearch, setLoadingDestinationSearch] =
    useState(false);
  const [startingSearchResult, setStartingSearchResult] = useState([]);
  const [destinationSearchResult, setDestinationSearchResult] = useState([]);
  const [openStartingPopper, setOpenStartingPopper] = useState(false);
  const [openDestinationPopper, setOpenDestinationPopper] = useState(false);
  const [anchorStarting, setAnchorStarting] = useState(null);
  const [anchorDestination, setAnchorDestination] = useState(null);
  const [retrieveStarting, setRetrieveStarting] = useState([]);
  const [retrieveDestination, setRetrieveDestination] = useState([]);
  const [isAddStartingMarker, setIsAddStartingMarker] = useState(false);
  const [isAddDestinationMarker, setIsAddDestinationMarker] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [message, setMessage] = useState("");
  const mapRef = useRef();
  const startingMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const startingTextRef = useRef('');
  const destinationTextRef = useRef('');
  const popperDestinationRef = useRef(null);
  const popperStartingRef = useRef(null);

  const handleChangeStarting = (e) => {
    setStarting(e.target.value);
    setAnchorStarting(e.currentTarget);
    setLoadingStartingSearch(true);
    setIsAddStartingMarker(false)
  };

  const handleChangeDestination = (e) => {
    setDestination(e.target.value);
    setAnchorDestination(e.currentTarget);
    setLoadingDestinationSearch(true);
    setIsAddDestinationMarker(false)
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
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

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          console.log(`Vị trí của bạn: ${longitude}, ${latitude}`);
          resolve(`${longitude},${latitude}`); // Trả về giá trị qua resolve
        },
        (error) => {
          console.error('Error fetching location:', error);
          reject(error); // Trả về lỗi qua reject
        },
        {
          enableHighAccuracy: false, // Tắt độ chính xác cao để phản hồi nhanh hơn
          timeout: 5000, // Giảm thời gian chờ xuống 5 giây
          maximumAge: 300000, // Sử dụng vị trí được cache trong vòng 5 phút
        }
      );
    });
  };

  const getSuggestStarting = async () => {
    try {
      const proximity = await getCurrentLocation();
      const res = await getSuggestPlaceService(debouncedStarting.trim(), proximity);
      setStartingSearchResult(res.data.suggestions);
      // setOpenStartingPopper(true);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStartingSearch(false);
    }
  };

  const getSuggestDestination = async () => {
    try {
      const proximity = await getCurrentLocation();
      const res = await getSuggestPlaceService(debouncedDestination.trim(), proximity);
      setDestinationSearchResult(res.data.suggestions);
      // setOpenDestinationPopper(true);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingDestinationSearch(false);
    }
  };

  const getDirection = async () => {
    try {
      const res = await getDirectionService(retrieveStarting, retrieveDestination);
      console.log(res.data.routes[0]);

      const data = res.data.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Nếu tuyến đường đã tồn tại trên bản đồ, cập nhật nó
      if (mapRef.current.getSource('route')) {
        mapRef.current.getSource('route').setData(geojson);
      }
      // Nếu không, thêm một lớp mới
      else {
        mapRef.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      // Zoom out để xem toàn bộ tuyến đường
      const coordinates = geojson.geometry.coordinates;
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

      for (const coord of coordinates) {
        bounds.extend(coord);
      }

      mapRef.current.fitBounds(bounds, {
        padding: 50
      });

    } catch (err) {
      console.log(err);
    } finally {
      // setLoadingStartingSearch(false);
    }
  };

  useEffect(() => {
    if (debouncedStarting.trim().length > 0 && !isAddStartingMarker) {
      getSuggestStarting();
    } else {
      setLoadingStartingSearch(false);
      setOpenStartingPopper(false);
    }
    if (debouncedDestination.trim().length > 0 && !isAddDestinationMarker) {
      getSuggestDestination();
    } else {
      setLoadingDestinationSearch(false);
      setOpenDestinationPopper(false);
    }
  }, [debouncedStarting, debouncedDestination]);

  useEffect(() => {
    //retrieveStarting = [123, 321]
    // console.log(retrieveStarting);
    if (retrieveStarting.length > 0) {
      // Xóa marker cũ nếu nó tồn tại
      if (startingMarkerRef.current) {
        startingMarkerRef.current.remove();
      }
      const el = document.createElement('div');
      el.className = 'marker';
      // Tạo một marker tùy chỉnh
      startingMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat(retrieveStarting)
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: retrieveStarting,
        zoom: 15,
      });
    }
  }, [retrieveStarting]);

  useEffect(() => {
    //retrieveStarting = [123, 321]
    // console.log(retrieveDestination);
    if (retrieveDestination.length > 0) {
      // Xóa marker cũ nếu nó tồn tại
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
      }
      // Tạo một marker tùy chỉnh
      destinationMarkerRef.current = new mapboxgl.Marker({ color: "red", rotation: 0 })
        .setLngLat(retrieveDestination)
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: retrieveDestination,
        zoom: 15,
      });
    }
  }, [retrieveDestination]);

  useEffect(() => {
    //retrieveStarting = [123, 321]
    if (retrieveStarting.length > 0 && retrieveDestination.length > 0) {
      getDirection();
    }
  }, [retrieveStarting, retrieveDestination]);

  return (
    <Box sx={{  position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: 1, sm: 1, md: "60%", lg: "50%", xl: "50%" },
      height: { xs: 1, sm: 1, md: "auto" },
      bgcolor: "background.paper",
      boxShadow: 24,
      p: { sm: 0, md: 4 },
      borderRadius: { sm: 0, md: 9 }}}
    >
      <Grid
        container
        columnSpacing={{ xs: 0, sm: 2 }}
        sx={{
          border: `1px solid ${alpha("#000", 0.3)}`,
          p: { xs: 2, md: 2 },
          borderRadius: { sm: 0, md: 5 },
          display: { xs: "none", md: "flex" },
          bgcolor: "white",
          mb: 2,
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
              type="postCreation"
              loadingStartingSearch={loadingStartingSearch}
              setOpenStartingPopper={setOpenStartingPopper}
              setOpenDestinationPopper={setOpenDestinationPopper}
              openDestinationPopper={openDestinationPopper}
              openStartingPopper={openStartingPopper}
              loadingDestinationSearch={loadingDestinationSearch}
              setAnchorDestination={setAnchorDestination}
              setAnchorStarting={setAnchorStarting}
              popperStartingRef={popperStartingRef}
              popperDestinationRef={popperDestinationRef}
            />
        </Stack>
        <Mapbox mapRef={mapRef} setStarting={setStarting} setDestination={setDestination} setIsAddStartingMarker={setIsAddStartingMarker} setIsAddDestinationMarker={setIsAddDestinationMarker} setRetrieveDestination={setRetrieveDestination} setRetrieveStarting={setRetrieveStarting} destinationTextRef={destinationTextRef} startingTextRef={startingTextRef} />
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
        ref={popperStartingRef}
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
        <SearchPopper
          searchData={startingSearchResult}
          setRetrieve={setRetrieveStarting}
          setPlaceName={setStarting}
          placeRef={startingTextRef}
          setOpenPopper={setOpenStartingPopper}
          setIsAddMarker={setIsAddStartingMarker}
        />
      </Popper>
      <Popper
        open={openDestinationPopper}
        anchorEl={anchorDestination}
        ref={popperDestinationRef}
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
        <SearchPopper
          searchData={destinationSearchResult}
          setRetrieve={setRetrieveDestination}
          setPlaceName={setDestination}
          placeRef={destinationTextRef}
          setOpenPopper={setOpenDestinationPopper}
          setIsAddMarker={setIsAddDestinationMarker}
          popperDestinationRef={popperDestinationRef}
        />
      </Popper>
    </Box>
  );
}
export default PostDetail;
