"use client";

import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Chip from "@mui/material/Chip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Avatar from "@mui/material/Avatar";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import line from "@/public/images/line.png";
import Mapbox from "@/components/mapbox/Mapbox";
import mapboxgl from "mapbox-gl";
import { getDirectionService } from "./../../services/mapService";
import { useParams } from "next/navigation";

function PostSelf({ handleClose }) {
    const params = useParams();
    const postData = useSelector((state) => state.post.postData);
    const [retrieveStarting, setRetrieveStarting] = useState([]);
    const [retrieveDestination, setRetrieveDestination] = useState([]);
    const mapRef = useRef();
    const postStartingMarkerRef = useRef(null);
    const postDestinationMarkerRef = useRef(null);
    const startingMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const startingTextRef = useRef('');
    const destinationTextRef = useRef('');
    const [duration, setDuration] = useState(null)
    const [distance, setDistance] = useState(null)

    const getDirection = async (startingLocation, destinationLocation) => {
        try {
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
            mapRef.current.on('style.load', () => {
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
            });

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
            overflowY: 'scroll',
            "&::-webkit-scrollbar": {
                display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        }}
        >
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
                        p: { xs: 2, md: 2 }
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
                        label={postData.rating}

                        sx={{ fontWeight: "bold", bgcolor: "white" }}
                        variant="outlined"
                    />
                </Stack>
            </Box>
            <Box sx={{ p: { xs: 2, md: 2 } }}>
                <Typography variant="subtitle1" >
                    {postData.content}
                </Typography>
            </Box>
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
                <Mapbox mapRef={mapRef} setRetrieveDestination={setRetrieveDestination} setRetrieveStarting={setRetrieveStarting} destinationTextRef={destinationTextRef} startingTextRef={startingTextRef} />
            </Box>


        </Box>
    );
}
export default PostSelf;
