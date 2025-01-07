'use client'

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    TextField,
    Typography,
    Box,
    Avatar,
    Fade,
    Alert
} from "@mui/material";
import { styled } from "@mui/system";
import { FaCar, FaStar } from "react-icons/fa";
import { createReview } from "@/services/reviewService";
import { useSnackbar } from "notistack";
import { createNotiService } from "@/services/notiService";
import socket from "@/configs/socket";
import { useRouter } from "next/navigation";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        borderRadius: 16,
        padding: theme.spacing(2),
        maxWidth: 500
    }
}));

const DriverInfo = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
}));

const RatingContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3)
}));

const FeedbackDialog = ({ open, handleCloseDialog, userData, isRider, ride, userId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const maxChars = 250;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!rating) {
            setError("Please provide a rating");
            return;
        }
        try {
            const res = await createReview({
                rating,
                comment,
                rideId: ride.id,
                reviewerId: userId,
                reviewedId: userData.id
            })
            if (res.data.code === 0) {
                const resNoti = await createNotiService({
                    senderId: userId,
                    recipientId: userData.id,
                    type: 'review',
                    rideId: ride.id,
                });
                if (resNoti.data.code === 0) {
                    socket.emit("sendNotification", {
                        senderId: userId,
                        receiverId: userData.id,
                        type: isRider ? 'passenger-review' : 'rider-review',
                        ride: ride
                    });
                    enqueueSnackbar(
                        "Đánh giá thành công",
                        { variant: "success" }
                    );
                    setRating(0);
                    setComment("");
                    setError("");
                    if (isRider === false) {
                        router.push(`/ride/${ride.id}`)
                    }
                    handleCloseDialog();
                }
            }
        } catch (error) {
            console.log(error);
            if (error.response.data.code === 25) {
                enqueueSnackbar(
                    "Bạn đã đánh giá rồi",
                    { variant: "error" }
                );
            } else {
                enqueueSnackbar(
                    "Lỗi",
                    { variant: "error" }
                );
            }

        }
    };

    const isSubmitDisabled = !rating;

    return (
        <StyledDialog
            open={open}
            // onClose={handleCloseDialog}
            TransitionComponent={Fade}
            aria-labelledby="feedback-dialog-title"
            fullWidth
            disableScrollLock={true}
            disableEscapeKeyDown={true}
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    return;
                }
                handleCloseDialog();
            }}
        >
            <DialogTitle id="feedback-dialog-title">
                {isRider ? 'Đánh giá hành khách' : 'Đánh giá tài xế'}
            </DialogTitle>

            <DialogContent>
                <DriverInfo>
                    <Avatar
                        alt="username"
                        src={userData.avatarUrl}
                        sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            {isRider ? 'Hành khách' : 'Tài xế'}
                            <Typography variant="h6">{userData.name}</Typography>
                        </Typography>
                    </Box>
                </DriverInfo>

                <RatingContainer>
                    <Typography component="legend" variant="subtitle1">
                        Chuyến đi của bạn thế nào ?
                    </Typography>
                    <Rating
                        value={rating}
                        onChange={(_, newValue) => {
                            setRating(newValue);
                            setError("");
                        }}
                        size="large"
                        icon={<FaStar />}
                        emptyIcon={<FaStar />}
                        aria-label="Trip rating"
                    />
                </RatingContainer>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => {
                        if (e.target.value.length <= maxChars) {
                            setComment(e.target.value);
                            setError("");
                        }
                    }}
                    placeholder="Kể về trải nghiệm của bạn"
                    variant="outlined"
                    aria-label="Feedback comments"
                    helperText={`${comment.length}/${maxChars} ký tự`}
                />

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions>
                {isRider && <Button onClick={handleCloseDialog} color="primary">
                    Hủy
                </Button>}
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitDisabled}
                >
                    Gửi đánh giá
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default FeedbackDialog;