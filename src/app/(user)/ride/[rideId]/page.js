'use client'

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery,
    Avatar,
    Stack
} from "@mui/material";
import { styled } from "@mui/system";
import { FaShare, FaTimes, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import Mapbox from "@/components/mapbox/Mapbox";
import mapboxgl from "mapbox-gl";
import { getOneRideService } from "@/services/rideService";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";
import { getMultiDirectionService } from "@/services/mapService";
import Image from "next/image";
import goingGif from '@/public/images/going.gif'
import Feedback from "@/components/feedback/feedback";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 1200,
    margin: "20px auto",
    padding: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center'
}));

const TripInformation = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [ride, setRide] = useState(null);
    const params = useParams();
    const mapRef = useRef();
    const startMarkerRef = useRef(null);
    const endMarkerRef = useRef(null);
    const pickUpMarkerRef = useRef(null);
    const dropOffMarkerRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userInfo.id)


    const getMultiDirection = async (start1, end1, start2, end2) => {
        try {
            const res = await getMultiDirectionService(start1, end1, start2, end2);

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
            mapRef.current.on('style.load', () => {
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
            })
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchRide = async () => {
            dispatch(setIsLoading(true));
            try {
                const res = await getOneRideService(
                    params.rideId
                );
                const ride = res.data.data;
                setRide(ride);

                handleMapbox(ride);
            } catch (error) {
                console.log(error)
                enqueueSnackbar(
                    "Lỗi lấy dữ liệu",
                    { variant: "error" }
                );
            } finally {
                dispatch(setIsLoading(false));
            }
        }

        const handleMapbox = (ride) => {
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
            const startingLocation = [ride.startLon, ride.startLat];
            const startPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm xuất phát');

            const destinationLocation = [ride.endLon, ride.endLat];
            const destinationPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đến');

            const pickUpLocation = [ride.rideRequest.pickUpLon, ride.rideRequest.pickUpLat];
            const pickUpPopup = new mapboxgl.Popup({ offset: 25 }).setText('Điểm đón');

            const dropOffLocation = [ride.rideRequest.dropOffLon, ride.rideRequest.dropOffLat];
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
        fetchRide();
    }, [params])

    const handleShareTrip = () => {
        setOpenDialog(true);
    };

    const handleCancelTrip = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (!ride) return null;

    return (
        <StyledCard>
            <Box
                sx={{
                    width: 1,
                    height: { xs: "100vh", md: "auto" },
                }}
            >
                <Mapbox mapRef={mapRef} />
            </Box>

            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 0, justifyContent: 'center' }}>
                    {/* Rider Section */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Avatar src={ride.rider.avatarUrl} alt="Rider" sx={{ width: 80, height: 80 }} />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Tài xế
                                </Typography>
                                <Typography variant="h6">{ride.rider.name}</Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaMapMarkerAlt /> Điểm xuất phát
                                </Typography>
                                <Typography variant="body1">{ride.riderStartLocation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaMapMarkerAlt /> Điểm đến
                                </Typography>
                                <Typography variant="body1">{ride.riderEndLocation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaClock /> Thời gian
                                </Typography>
                                <Typography variant="body1">{ride.estimatedTime}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <GiPathDistance /> Khoảng cách
                                </Typography>
                                <Typography variant="body1">{ride.distance}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Passenger Section */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={2} mb={4}>
                            <Avatar src={ride.passenger.avatarUrl} alt="Passenger" sx={{ width: 80, height: 80 }} />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Hành khách
                                </Typography>
                                <Typography variant="h6">{ride.passenger.name}</Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaMapMarkerAlt /> Điểm đón
                                </Typography>
                                <Typography variant="body1">{ride.rideRequest.pickUpLocation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaMapMarkerAlt /> Điểm trả
                                </Typography>
                                <Typography variant="body1">{ride.rideRequest.dropOffLocation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <FaClock /> Thời gian
                                </Typography>
                                <Typography variant="body1">{ride.rideRequest.estimatedTime}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                    <GiPathDistance /> Khoảng cách
                                </Typography>
                                <Typography variant="body1">{ride.rideRequest.distance}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack mt={4} direction='row' justifyContent='space-between' width='100%'>
                    <Stack alignItems='center'>
                        <Typography variant="h6">
                            <Box component="span" sx={{ color: "grey" }}>
                                Trạng thái:
                            </Box>{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: ride.status === "GOING" ? (theme) => theme.palette.primary.main : "red",
                                }}
                            >
                                {ride.status === "GOING" ? "Đang diễn ra" : ride.status === "DONE" ? 'Đã hoàn thành chuyến' : 'Đã hủy chuyến'}
                            </Box>
                        </Typography>
                        <Image src={goingGif} alt="going" style={{ width: "10rem", height: "10rem" }} />
                    </Stack>
                    <Stack direction="row" alignItems='flex-end' gap='1rem'>
                        <Button variant="outlined" sx={{ height: '20%' }} startIcon={<FaShare />} onClick={handleShareTrip}>
                            Hoàn thành chuyến đi
                        </Button>
                        <Button variant="contained" sx={{ height: '20%' }} color="error" startIcon={<FaTimes />} onClick={handleCancelTrip}>
                            Hủy chuyến
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
            {
                userId === ride.rider.id 
                ? <Feedback open={openDialog} handleCloseDialog={handleCloseDialog} userData={ride.passenger} isRider={true} /> 
                : <Feedback open={openDialog} handleCloseDialog={handleCloseDialog} userData={ride.rider} isRider={false} />
            }
        </StyledCard>
    );
};

export default TripInformation;