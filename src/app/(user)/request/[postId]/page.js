'use client'

import Mapbox from '@/components/mapbox/Mapbox'
import { alpha, Box, Button, Chip, Divider, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useDispatch, useSelector } from 'react-redux';
import line from "@/public/images/line.png";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Image from "next/image";
import { acceptRequestService, getRideRequestService, updateRideRequestService } from '@/services/rideService';
import { getDirectionService, getMultiDirectionService } from '@/services/mapService';
import mapboxgl from "mapbox-gl";
import { setIsLoading } from '@/redux-toolkit/loadingSlice';
import RideRequest from '@/components/request/RideRequest'
import { useParams, useRouter } from 'next/navigation';
import { getPostByIdService } from '@/services/postService';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import { useSnackbar } from 'notistack';
import socket from '@/configs/socket';
import empty from '@/public/images/empty-folder.png'
import { createNotiService } from '@/services/notiService';


function Request() {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null)
  const [rideRequest, setRideRequest] = useState([])
  const [rideRequestClicked, setRideRequestClicked] = useState(null)
  const [duration, setDuration] = useState(null)
  const [distance, setDistance] = useState(null)
  const mapRef = useRef();
  const postStartingMarkerRef = useRef(null);
  const postDestinationMarkerRef = useRef(null);
  const startingMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const requestId = useRef(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userInfo = useSelector((state) => state.user.userInfo);
  const router = useRouter();

  const handleAccept = async (requestId) => {
    dispatch(setIsLoading(true));
    try {
      const res = await acceptRequestService({
        requestId,
        riderId: userInfo.id,
        riderStartLocation: postData.pickUpLocation,
        riderEndLocation: postData.dropOffLocation,
        startLon: postData.pickUpLon,
        startLat: postData.pickUpLat,
        endLon: postData.dropOffLon,
        endLat: postData.dropOffLat,
        estimatedTime: duration,
        distance: distance
      })
      if (res.data.code === 0) {
        const resNoti = await createNotiService({
          senderId: userInfo.id,
          recipientId: rideRequestClicked.passenger.id,
          type: 'accept_request',
          rideId: res.data.data.id,
        });
        if (resNoti.data.code === 0) {
          socket.emit("sendNotification", {
            senderId: userInfo.id,
            receiverId: rideRequestClicked.passenger.id,
            type: 'accept_request'
          });
          enqueueSnackbar(
            "Chấp nhận thành công",
            { variant: "success" }
          );
          router.push(`/ride/${res.data.data.id}`)
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        "Chấp nhận không thành công",
        { variant: "error" }
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  const handleCancel = async () => {
    dispatch(setIsLoading(true));
    try {
      const res = await updateRideRequestService(requestId.current, { status: 'rejected' });
      if (res.data.code === 0) {
        const resNoti = await createNotiService({
          senderId: userInfo.id,
          recipientId: rideRequestClicked.passenger.id,
          type: 'reject_request',
          postId: postData.id
        });
        if (resNoti.data.code === 0) {
          socket.emit("sendNotification", {
            senderId: userInfo.id,
            receiverId: rideRequestClicked.passenger.id,
            type: 'reject_request'
          });

          enqueueSnackbar(
            "Từ chối yêu cầu thành công",
            { variant: "success" }
          );
          requestId.current = null;
          fetchRideRequest();
          handleMapbox(postData);
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

  const getDirection = async (startingLocation, destinationLocation) => {
    try {
      if (!mapRef.current.isStyleLoaded()) {
        await new Promise(resolve => {
          mapRef.current.once('styledata', resolve);
        });
      }
      const res = await getDirectionService(startingLocation, destinationLocation);
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
    }
  };

  const getMultiDirection = async (start1, end1, start2, end2) => {
    try {
      const res = await getMultiDirectionService(start1, end1, start2, end2);
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

      // Thêm hoặc cập nhật tuyến đường trên bản đồ
      if (mapRef.current.getSource('route1')) {
        mapRef.current.getSource('route1').setData(geojson);
      } else {
        mapRef.current.addSource('route1', {
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

      // Zoom để xem toàn bộ tuyến đường
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach(coord => {
        bounds.extend(coord);
      });

      mapRef.current.fitBounds(bounds, {
        padding: 100
      });

    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRequest = (requestData) => {
    // console.log('postData', postData);
    // console.log('requestData', requestData);
    requestId.current = requestData.id;
    setRideRequestClicked(requestData)
    const startingLocation = [postData.pickUpLon, postData.pickUpLat];
    const destinationLocation = [postData.dropOffLon, postData.dropOffLat];
    const pickUpLocation = [requestData.pickUpLon, requestData.pickUpLat];
    const dropOffLocation = [requestData.dropOffLon, requestData.dropOffLat];
    getMultiDirection(startingLocation, destinationLocation, pickUpLocation, dropOffLocation)
      .then(() => {
        if (startingMarkerRef.current) {
          startingMarkerRef.current.remove();
        }
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
        }
        const pickUpPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đón khách');
        const dropOffPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm trả khách');
        // Tạo một marker tùy chỉnh
        const el = document.createElement('div');
        el.className = 'postStartingMarker';
        startingMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat(pickUpLocation)
          .setPopup(pickUpPopup)
          .addTo(mapRef.current);

        destinationMarkerRef.current = new mapboxgl.Marker({ color: "green", rotation: 0 })
          .setLngLat(dropOffLocation)
          .setPopup(dropOffPopup)
          .addTo(mapRef.current);

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      })
      .catch(error => console.log(error))
  }

  const fetchRideRequest = async () => {
    const res = await getRideRequestService(postId, 'pending');
    setRideRequest(res.data.data);
  }

  const handleMapbox = (post) => {
    // Remove old markers if they exist
    if (postStartingMarkerRef.current) {
      postStartingMarkerRef.current.remove();
    }
    if (postDestinationMarkerRef.current) {
      postDestinationMarkerRef.current.remove();
    }
    if (startingMarkerRef.current) {
      startingMarkerRef.current.remove();
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
    }

    // Extract locations
    const startingLocation = [post.pickUpLon, post.pickUpLat];
    const destinationLocation = [post.dropOffLon, post.dropOffLat];

    // Create custom marker for starting location
    const startMarkerElement = document.createElement('div');
    startMarkerElement.className = 'marker';

    // Create popups
    const startPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm xuất phát');
    const destinationPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đến');

    // Add markers to the map
    postStartingMarkerRef.current = new mapboxgl.Marker(startMarkerElement)
      .setLngLat(startingLocation)
      .setPopup(startPopup)
      .addTo(mapRef.current);

    postDestinationMarkerRef.current = new mapboxgl.Marker({ color: 'red', rotation: 0 })
      .setLngLat(destinationLocation)
      .setPopup(destinationPopup)
      .addTo(mapRef.current);

    // Get directions
    getDirection(startingLocation, destinationLocation)
      .then(() => console.log('Direction fetched successfully'))
      .catch((error) => console.error('Failed to fetch directions', error));
  };

  useEffect(() => {
    socket.on("getNotification", (data) => {
      console.log(data);
      if (data.type === 'cancel_request') {
        fetchRideRequest();
      }
    });
  }, []);

  useEffect(() => {
    const fetchPostAndRideRequest = async () => {
      dispatch(setIsLoading(true));
      try {
        // Fetch post data
        const res = await getPostByIdService(postId);
        const post = res.data.data;
        setPostData(post);

        // Fetch ride request data based on post data
        await fetchRideRequest();

        // Handle Mapbox setup
        handleMapbox(post);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchPostAndRideRequest();
  }, [dispatch, postId]);

  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ borderRadius: 7, overflow: "hidden", mt: 4, width: '90%' }}>
        <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
          <Typography variant="h6">DACH SÁCH YÊU CẦU</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid
            container
            columnSpacing={{ xs: 0, sm: 2 }}
            sx={{
              border: `1px solid ${alpha("#000", 0.3)}`,
              p: { xs: 2, md: 2 },
              borderRadius: { sm: 0, md: 4 },
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
              <Typography variant="subtitle1">{postData?.pickUpLocation}</Typography>
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
                <Typography variant="subtitle1">{postData?.startTimeString}</Typography>
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
                <Typography variant="subtitle1">{postData?.startDate}</Typography>
              </Stack>
            </Grid>

            <Grid size={8}>
              <Typography variant="subtitle1">{postData?.dropOffLocation}</Typography>
            </Grid>
            <Grid size={1}>
              <Divider orientation="vertical" />
            </Grid>
            <Grid size={3}></Grid>
          </Grid>
          <Box
            sx={{
              width: 1,
              height: { xs: "100vh", md: "auto" },
              position: 'relative'
            }}
          >
            <Mapbox mapRef={mapRef} />
            {requestId.current && duration && distance && <Stack
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                gap: 1
              }}
            >
              <Chip icon={<AccessTimeFilledIcon color='primary' />} label={`${duration}`} variant='filled' sx={{ bgcolor: "white" }} />
              <Chip icon={<TwoWheelerIcon color='primary' />} label={`${distance}`} variant='filled' sx={{ bgcolor: "white" }} />
              <Button
                variant="contained"
                color='primary'
                sx={{
                  borderRadius: '100rem'
                }}
                onClick={() => handleAccept(requestId.current)}
              >
                Chấp nhận
              </Button>
              <Button
                variant="contained"
                color='error'
                sx={{
                  borderRadius: '100rem'
                }}
                onClick={() => handleCancel()}
              >
                Từ chối
              </Button>
            </Stack>}
          </Box>
        </Box>
      </Paper>

      {rideRequest.length > 0
        ? rideRequest.map((item, index) => (
          <Box key={index} sx={{ width: 1, mt: 4 }} onClick={() => handleClickRequest(item)}>
            <RideRequest data={item} clickedRequestId={requestId} handleMapbox={handleMapbox} postData={postData} handleAccept={handleAccept} fetchRideRequest={fetchRideRequest} />
          </Box>
        ))
        : <Image style={{marginTop: '2rem'}} src={empty} alt='empty' width={150} height={150}></Image>
      }
    </Stack>
  )
}

export default Request