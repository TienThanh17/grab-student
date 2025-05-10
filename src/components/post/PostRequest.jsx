"use client";

import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import Chip from "@mui/material/Chip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import line from "@/public/images/line.png";
import Mapbox from "@/components/mapbox/Mapbox";
import mapboxgl from "mapbox-gl";
import { getMultiDirectionService } from "./../../services/mapService";
import { useSnackbar } from "notistack";
import { useParams } from "next/navigation";
import socket from "@/configs/socket";
import { createNotiService } from "@/services/notiService";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { updateRideRequestService } from "@/services/rideService";

function PostRequest({ handleClose, fetchRideRequest }) {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const postData = useSelector((state) => state.post.postData);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [message, setMessage] = useState("");
    const mapRef = useRef();
    const startingTextRef = useRef('');
    const destinationTextRef = useRef('');
    const startMarkerRef = useRef(null);
    const endMarkerRef = useRef(null);
    const pickUpMarkerRef = useRef(null);
    const dropOffMarkerRef = useRef(null);
    const dispatch = useDispatch();

    const handleChangeMessage = (e) => {
        //call api
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        //call api
        console.log(message);
    };

    const handleCancel = async () => {
        dispatch(setIsLoading(true));
        try {
            const res = await updateRideRequestService(postData.id, { status: 'rejected' });
            if (res.data.code === 0) {
                const resNoti = await createNotiService({
                    senderId: postData.passenger.id,
                    recipientId: postData.post.student.id,
                    type: 'cancel_request',
                    postId: postData.post.id
                });
                if (resNoti.data.code === 0) {
                    socket.emit("sendNotification", {
                        senderId: postData.passenger.id,
                        receiverId: postData.post.student.id,
                        type: 'cancel_request',
                    });
                    fetchRideRequest();
                    enqueueSnackbar(
                        "Hủy yêu cầu thành công",
                        { variant: "success" }
                    );
                    handleClose();
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

    const getMultiDirection = async (start1, end1, start2, end2) => {
        try {
            if (!mapRef.current.isStyleLoaded()) {
                await new Promise(resolve => {
                    mapRef.current.once('styledata', resolve);
                });
            }
            const res = await getMultiDirectionService(start1, end1, start2, end2);
            // console.log(res.data.routes);
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

    useEffect(() => {
        const handleMapbox = () => {
            // console.log(ride);
            // Remove old markers if they exist
            if (startMarkerRef.current) {
                startMarkerRef.current.remove();
            }
            if (endMarkerRef.current) {
                endMarkerRef.current.remove();
            }
            if (pickUpMarkerRef.current) {
                pickUpMarkerRef.current.remove();
            }
            if (dropOffMarkerRef.current) {
                dropOffMarkerRef.current.remove();
            }

            // Extract locations
            const startingLocation = [postData.post.pickUpLon, postData.post.pickUpLat];
            const startPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm xuất phát');

            const destinationLocation = [postData.post.dropOffLon, postData.post.dropOffLat];
            const destinationPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đến');

            const pickUpLocation = [postData.pickUpLon, postData.pickUpLat];
            const pickUpPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đón');

            const dropOffLocation = [postData.dropOffLon, postData.dropOffLat];
            const dropOffPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm trả');

            // Create custom marker for starting location
            const startMarkerElement = document.createElement('div');
            startMarkerElement.className = 'marker';

            const pickUpMarkerElement = document.createElement('div');
            pickUpMarkerElement.className = 'postStartingMarker';

            // Add markers to the map
            startMarkerRef.current = new mapboxgl.Marker(startMarkerElement)
                .setLngLat(startingLocation)
                .setPopup(startPopup)
                .addTo(mapRef.current);

            endMarkerRef.current = new mapboxgl.Marker({ color: 'red', rotation: 0 })
                .setLngLat(destinationLocation)
                .setPopup(destinationPopup)
                .addTo(mapRef.current);

            pickUpMarkerRef.current = new mapboxgl.Marker(pickUpMarkerElement)
                .setLngLat(pickUpLocation)
                .setPopup(pickUpPopup)
                .addTo(mapRef.current);

            dropOffMarkerRef.current = new mapboxgl.Marker({ color: 'green', rotation: 0 })
                .setLngLat(dropOffLocation)
                .setPopup(dropOffPopup)
                .addTo(mapRef.current);

            // Get directions
            getMultiDirection(startingLocation, destinationLocation, pickUpLocation, dropOffLocation)
                .then(() => console.log('Direction fetched successfully'))
                .catch((error) => console.error('Failed to fetch directions', error));
        };
        handleMapbox();
    }, [postData]);


    return (
        <Box
            sx={{
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
                    <Typography variant="subtitle1">{postData.post.pickUpLocation}</Typography>
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
                        <Typography variant="subtitle1">{postData.post.startTimeString}</Typography>
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
                        <Typography variant="subtitle1">{postData.post.startDate}</Typography>
                    </Stack>
                </Grid>

                <Grid size={8}>
                    <Typography variant="subtitle1">{postData.post.dropOffLocation}</Typography>
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
                </Stack>
                <Mapbox mapRef={mapRef} destinationTextRef={destinationTextRef} startingTextRef={startingTextRef} />
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
                            src={postData.post.student.avatarUrl}
                            alt="avt"
                            sx={{ width: '3rem', height: '3rem', borderRadius: '5rem' }}
                        />
                        <Typography
                            variant="subtitle1"
                            sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: "bold" }}
                        >
                            {postData.post.student.name}
                        </Typography>
                    </Stack>
                    <Chip
                        icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
                        label={postData.post.student.rating}

                        sx={{ fontWeight: "bold", bgcolor: "white" }}
                        variant="outlined"
                    />
                </Stack>

                {postData.status === 'pending' && <Button
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        display: { xs: "none", md: "block" },
                        mt: 2
                    }}
                    onClick={handleCancel}
                    color='error'
                >
                    Hủy yêu cầu
                </Button>}

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
        </Box>
    );
}
export default PostRequest;
