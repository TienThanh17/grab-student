'use client'

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    avatarUrl,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import { FaShare, FaTimes, FaMapMarkerAlt, FaClock, FaUser } from "react-icons/fa";
import Mapbox from "@/components/mapbox/Mapbox";
import { getOneRideService } from "@/services/rideService";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/redux-toolkit/loadingSlice";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 1200,
    margin: "20px auto",
    padding: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
}));

const TripInformation = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [ride, setRide] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const params = useParams();
    const mapRef = useRef();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRide = async () => {
            dispatch(setIsLoading(true));
            try {
                const res = await getOneRideService(
                    params.rideId
                );
                setRide(res.data.data);
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

    if(!ride) return null;

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

            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <avatarUrl
                                src={ride.passenger.avatarUrl}
                                alt="Passenger"
                                sx={{ width: 56, height: 56, marginRight: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Hành khách
                                </Typography>
                                <Typography variant="h6">{ride.passenger.name}</Typography>
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <avatarUrl
                                src={ride.rider.avatarUrl}
                                alt="rider"
                                sx={{ width: 56, height: 56, marginRight: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Tài xế
                                </Typography>
                                <Typography variant="h6">{ride.rider.name}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                <FaMapMarkerAlt /> Điểm đón
                            </Typography>
                            <Typography variant="body1">{ride.rideRequest.pickUpLocation}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                <FaMapMarkerAlt /> Điểm trả
                            </Typography>
                            <Typography variant="body1">{ride.rideRequest.dropOffLocation}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                <FaClock /> Thời gian
                            </Typography>
                            <Typography variant="body1">{ride.estimatedTime}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                                <FaClock /> Khoảng cách
                            </Typography>
                            <Typography variant="body1">{ride.distance}</Typography>
                        </Box>

                        <Box display="flex" gap={2} justifyContent={isMobile ? "center" : "flex-end"}>
                            <Button
                                variant="outlined"
                                startIcon={<FaShare />}
                                onClick={handleShareTrip}
                            >
                                Share Trip
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<FaTimes />}
                                onClick={handleCancelTrip}
                            >
                                Cancel Trip
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to proceed with this action?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledCard>
    );
};

export default TripInformation;