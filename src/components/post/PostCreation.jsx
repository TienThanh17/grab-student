import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState, useRef } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Divider from "@mui/material/Divider";
import SearchPlace from "./SearchPlace";
import SearchPopper from "./SearchPopper";
import Popper from "@mui/material/Popper";
import { useDebouncedState } from "@/utils/customHook";
import mapboxgl from "mapbox-gl";
import Mapbox from "@/components/mapbox/Mapbox";
import { getSuggestPlaceService, getDirectionService } from "./../../services/mapService";
import {createPostService} from '@/services/postService'
import { useSelector } from 'react-redux';
import { useSnackbar } from "notistack";



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

const MAX_TEXT_LENGTH = 200;
const MAX_LINES = 3;

function PostCreation({ handleClosePostCreation }) {
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
  const [postType, setPostType] = useState(postTypeSelect[0].value);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [text, setText] = useState("");
  const mapRef = useRef();
  const startingMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const startingTextRef = useRef('');
  const destinationTextRef = useRef('');
  const popperDestinationRef = useRef(null);
  const popperStartingRef = useRef(null);
  const userId = useSelector((state) => state.user.userInfo.id)
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   // console.log(dayjs(date).format("DD-MM-YYYY"));
  //   console.log(dayjs(time).format("hh:mm"));
  // }, [date, time])

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
      setOpenStartingPopper(true);
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
      setOpenDestinationPopper(true);
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
    setLoadingStartingSearch(true);
    setIsAddStartingMarker(false)
  };

  const handleChangeDestination = (e) => {
    setDestination(e.target.value);
    setAnchorDestination(e.currentTarget);
    setLoadingDestinationSearch(true);
    setIsAddDestinationMarker(false)
  };

  const handleSubmit = async () => {
    if (startingTextRef.current.trim() !== '' &&
      destinationTextRef.current.trim() !== '' &&
      retrieveStarting.length !== 0 &&
      retrieveDestination.length !== 0 &&
      postType !== null &&
      date !== null &&
      time !== null
    ) {
      // console.log({
      //   starting: startingTextRef.current,
      //   destination: destinationTextRef.current,
      //   lon: retrieveStarting,
      //   lat: retrieveDestination,
      //   postType: postType,
      //   date: dayjs(date).format("DD-MM-YYYY"),
      //   time: dayjs(time).format("hh:mm"),
      //   content: text
      // })
      try {
        const formData = {
          studentId: userId,
          pickUpLocation: startingTextRef.current,
          dropOffLocation: destinationTextRef.current,
          type: postType,
          pickUpLat: retrieveStarting[1],
          pickUpLon: retrieveStarting[0],
          dropOffLat: retrieveDestination[1],
          dropOffLon: retrieveDestination[0],
          startDate: dayjs(date).format("DD-MM-YYYY"),
          startTimeString: dayjs(time).format("hh:mm"),
          status: true,
          content: text
        };
        const res = await createPostService(formData);
        if(res.data.code === 0) {
          handleClosePostCreation()
        }
      } catch (error) {
        enqueueSnackbar(
          "Tạo không thành công",
          { variant: "error" }
        );
      }
    } else {
      // console.log('missing param')
      enqueueSnackbar(
        "Nhập chưa đủ thông tin",
        { variant: "error" }
      );
    }
    console.log('startingTextRef', startingTextRef.current)
  }

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
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: 1, sm: 1, md: "90%", lg: "70%", xl: "60%" },
        height: { xs: 1, sm: 1, md: "auto" },
        bgcolor: "background.paper",
        boxShadow: 24,
        px: { sm: 0, md: 4 },
        py: { sm: 0, md: 4 },
        borderRadius: { sm: 0, md: 3 },
        overflowY: "auto"
      }}
    >
      <Stack direction="row">
        <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
          Tạo bài đăng
        </Typography>
        <CancelIcon
          sx={{
            color: "silver",
            fontSize: { xs: 30, md: 30 },
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
            flex: 2,
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
            flex: 2,
            width: 1,
            height: { xs: 1, sm: 1, md: "25rem" },
            border: "1px solid red",
          }}
        ></Box> */}
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
              <MenuItem key={item.id} value={item.id}>
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
          <TextField
            placeholder="Thêm nội dung..."
            multiline
            minRows={3}
            value={text}
            onChange={handleChangeText}
          />
          <Button variant="contained" onClick={handleSubmit}>Đăng</Button>
        </Stack>
      </Stack>
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

export default PostCreation;
