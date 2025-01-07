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
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import line from "@/public/images/line.png";
import { useDebouncedState } from "@/utils/customHook";
import SearchPlace from "./SearchPlace";
import SearchPopper from "./SearchPopper";
import Mapbox from "@/components/mapbox/Mapbox";
import mapboxgl from "mapbox-gl";
import { getSuggestPlaceService, getDirectionService, getMultiDirectionService } from "./../../services/mapService";
import { createRideRequestService, acceptRequestService } from './../../services/rideService'
import { useSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";
import socket from "@/configs/socket";
import { createNotiService } from "@/services/notiService";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { sendMessageService } from "@/services/messageService";
import { useGlobalContext } from "@/provider/GlobalContext";

function PostDetail({ handleClose, fetchPosts }) {
  const { fetchConversation } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const postData = useSelector((state) => state.post.postData);
  const userInfo = useSelector((state) => state.user.userInfo);
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
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(null)
  const [distance, setDistance] = useState(null)
  const [riderDuration, setRiderDuration] = useState(null)
  const [riderDistance, setRiderDistance] = useState(null)
  const mapRef = useRef();
  const postStartingMarkerRef = useRef(null);
  const postDestinationMarkerRef = useRef(null);
  const startingMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const startingTextRef = useRef('');
  const destinationTextRef = useRef('');
  const popperDestinationRef = useRef(null);
  const popperStartingRef = useRef(null);
  const dispatch = useDispatch();


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
    dispatch(setIsLoading(true));
    try {
      if (params.postType === 'rider') {
        const data = {
          'passenger_id': userInfo.id,
          'post_id': postData.id,
          'pickUpLocation': startingTextRef.current,
          'dropOffLocation': destinationTextRef.current,
          "pickUpLat": retrieveStarting[1],
          "pickUpLon": retrieveStarting[0],
          "dropOffLat": retrieveDestination[1],
          "dropOffLon": retrieveDestination[0],
          "status": "pending",
          'estimatedTime': duration,
          'distance': distance
        }
        const res = await createRideRequestService(data);
        if (res.data.code === 0) {
          if(message.trim().length > 0) {
            const messRes = await sendMessageService({
              senderId: userInfo.id,
              recipientId: postData.student.id,
              content: message
            })
            if (messRes.data.code === 0) {
              socket.emit("sendMessage", res.data.data);
              fetchConversation(userInfo.id)
            }
          }
          const resNoti = await createNotiService({
            senderId: userInfo.id,
            recipientId: postData.student.id,
            type: 'send_request',
            postId: postData.id
          });
          if (resNoti.data.code === 0) {
            socket.emit("sendNotification", {
              senderId: userInfo.id,
              receiverId: postData.student.id,
              type: 'send_request'
            });

            enqueueSnackbar(
              "Gửi yêu cầu thành công",
              { variant: "success" }
            );
            handleClose();
          }
        }
      } else if (params.postType === 'passenger') {
        const data = {
          'passenger_id': postData.student.id,
          'post_id': postData.id,
          'pickUpLocation': postData.pickUpLocation,
          'dropOffLocation': postData.dropOffLocation,
          "pickUpLat": postData.pickUpLat,
          "pickUpLon": postData.pickUpLon,
          "dropOffLat": postData.dropOffLat,
          "dropOffLon": postData.dropOffLon,
          "status": "accepted",
          'estimatedTime': duration,
          'distance': distance
        }
        const res = await createRideRequestService(data);
        if (res.data.code === 0) {
          const res2 = await acceptRequestService({
            requestId: res.data.data.id,
            riderId: userInfo.id,
            riderStartLocation: startingTextRef.current ?? postData.pickUpLocation,
            riderEndLocation: destinationTextRef.current ?? postData.dropOffLocation,
            startLat: retrieveStarting[1],
            startLon: retrieveStarting[0],
            endLat: retrieveDestination[1],
            endLon: retrieveDestination[0],
            estimatedTime: riderDuration ?? duration,
            distance: riderDistance ?? distance
          })
          if (res2.data.code === 0) {
            if(message.trim().length > 0) {
              const messRes = await sendMessageService({
                senderId: userInfo.id,
                recipientId: postData.student.id,
                content: message
              })
              if (messRes.data.code === 0) {
                socket.emit("sendMessage", res.data.data);
                fetchConversation(userInfo.id)
              }
            }
            const resNoti = await createNotiService({
              senderId: userInfo.id,
              recipientId: postData.student.id,
              type: 'accept_request',
              rideId: res2.data.data.id
            });
            if (resNoti.data.code === 0) {
              socket.emit("sendNotification", {
                senderId: userInfo.id,
                receiverId: postData.student.id,
                type: 'accept_request',
                ride: res2.data.data
              });
              enqueueSnackbar(
                "Chấp nhận yêu cầu thành công",
                { variant: "success" }
              );
              handleClose();
              router.push(`/ride/${res2.data.data.id}`)
            }
          }
        }

      }
    } catch (error) {
      console.log(error)
      if (error.response.data.code === 19) {
        enqueueSnackbar(
          "Yêu cầu đã tồn tại",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar(
          "Gửi yêu cầu không thành công",
          { variant: "error" }
        );
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleChangeMessage = (e) => {
    //call api
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    //call api
    // console.log(message);
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

  const getMultiDirection = async (start1, end1, start2, end2) => {
    try {
      const res = await getMultiDirectionService(start1, end1, start2, end2);
      // console.log(res.data.routes);
      const data = res.data.routes[0];

      const durationInMinutes = data.duration / 60; // Chuyển giây thành phút
      const formattedDuration =
        durationInMinutes > 60
          ? `${Math.floor(durationInMinutes / 60)} giờ ${Math.round(durationInMinutes % 60)} phút`
          : `${Math.round(durationInMinutes)} phút`;
      // Format distance
      const formattedDistance = `${(data.distance / 1000).toFixed(1)} km`;
      setRiderDistance(formattedDistance);
      setRiderDuration(formattedDuration);

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
      if (mapRef.current.getSource('route1')) {
        mapRef.current.getSource('route1').setData(geojson);
      }
      // Nếu không, thêm một lớp mới
      else {
        mapRef.current.addSource(`route1`, {
          type: 'geojson',
          data: geojson
        });

        mapRef.current.addLayer({
          id: 'route1',
          type: 'line',
          source: 'route1',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4285F4',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // Zoom out để xem toàn bộ tuyến đường
      const bounds = new mapboxgl.LngLatBounds();

      res.data.routes.forEach(route => {
        route.geometry.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
      });

      mapRef.current.fitBounds(bounds, {
        padding: 100
      });

    } catch (err) {
      console.log(err);
    }
  };

  const getDirection = async (startingLocation, destinationLocation) => {
    try {
      // Đảm bảo bản đồ đã được tải
      if (!mapRef.current.isStyleLoaded()) {
        await new Promise(resolve => mapRef.current.once('style.load', resolve));
      }
      const res = await getDirectionService(startingLocation, destinationLocation);
      // console.log(res.data.routes[0]);
      const data = res.data.routes[0];
      const durationInMinutes = data.duration / 60; // Chuyển giây thành phút
      const formattedDuration =
        durationInMinutes > 60
          ? `${Math.floor(durationInMinutes / 60)} giờ ${Math.round(durationInMinutes % 60)} phút`
          : `${Math.round(durationInMinutes)} phút`;
      // Format distance
      const formattedDistance = `${(data.distance / 1000).toFixed(1)} km`;

      setDistance(formattedDistance);
      setDuration(formattedDuration);

      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // Đợi cho style được tải xong
      // mapRef.current.on('style.load', () => {
      // Nếu tuyến đường đã tồn tại trên bản đồ, cập nhật nó
      if (mapRef.current.getSource('route1')) {
        mapRef.current.getSource('route1').setData(geojson);
      }
      // Nếu không, thêm một lớp mới
      else {
        mapRef.current.addSource(`route1`, {
          type: 'geojson',
          data: geojson
        });

        mapRef.current.addLayer({
          id: 'route1',
          type: 'line',
          source: 'route1',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4285F4',
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
        padding: 100
      });
      // });

    } catch (err) {
      console.log(err);
    } finally {
      // setLoadingStartingSearch(false);
    }
  };

  useEffect(() => {
    // Xóa marker cũ nếu nó tồn tại
    if (postStartingMarkerRef.current) {
      postStartingMarkerRef.current.remove();
    }
    if (postDestinationMarkerRef.current) {
      postDestinationMarkerRef.current.remove();
    }
    const startingLocation = [postData.pickUpLon, postData.pickUpLat];
    const destinationLocation = [postData.dropOffLon, postData.dropOffLat];

    // Tạo một marker tùy chỉnh
    const el = document.createElement('div');
    el.className = 'postStartingMarker';
    // Tạo popup cho điểm bắt đầu
    const startPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm bắt đầu');
    const destinationPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đến');

    postStartingMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat(startingLocation)
      .setPopup(startPopup)
      .addTo(mapRef.current);

    postDestinationMarkerRef.current = new mapboxgl.Marker({ color: "green", rotation: 0 })
      .setLngLat(destinationLocation)
      .setPopup(destinationPopup)
      .addTo(mapRef.current);

    new Promise((resolve, reject) => {
      try {
        getDirection(startingLocation, destinationLocation);
        resolve('success')
      } catch (error) {
        console.log(error);
        reject('fail');
      }
    }).then((data) => console.log('get direction', data));
  }, [postData]);

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
      const startingLocation = [postData.pickUpLon, postData.pickUpLat];
      const destinationLocation = [postData.dropOffLon, postData.dropOffLat];
      // getDirection(retrieveStarting, retrieveDestination);
      if (params.postType === 'rider') {
        getMultiDirection(startingLocation, destinationLocation, retrieveStarting, retrieveDestination);
      } else if (params.postType === 'passenger') {
        getMultiDirection(retrieveStarting, retrieveDestination, startingLocation, destinationLocation);
      }
    }
  }, [retrieveStarting, retrieveDestination]);

  return (
    <Box sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: 1, sm: 1, md: "60%", lg: "60%", xl: "50%" },
      height: { xs: 1, sm: 1, md: "auto" },
      bgcolor: "background.paper",
      boxShadow: 24,
      p: { sm: 0, md: 4 },
      borderRadius: { sm: 0, md: 9 },
      overflowY: "auto"
    }}
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
            {params.postType === 'rider' ? 'Điểm xuất phát' : 'Điểm đón'}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid size={3}></Grid>

        <Grid size={8}>
          <Typography variant="subtitle1">{postData.pickUpLocation}</Typography>
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
            <Typography variant="subtitle1">{postData.startTimeString}</Typography>
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
            <Typography variant="subtitle1">{postData.startDate}</Typography>
          </Stack>
        </Grid>

        <Grid size={8}>
          <Typography variant="subtitle1">{postData.dropOffLocation}</Typography>
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
            <Avatar
              src={postData.student.avatarUrl}
              alt="avt"
              sx={{ width: '3rem', height: '3rem', borderRadius: '5rem' }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: "bold" }}
            >
              {postData.student.name}
            </Typography>
          </Stack>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={postData.student.rating}

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
            onClick={handleSubmit}
          >
            {postData.type === 'rider' ? 'Gửi yêu cầu' : 'Chấp nhận yêu cầu'}
          </Button>
          <TextField
            label="Tin nhắn"
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
