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

const FeedbackDialog = ({ open, handleCloseDialog, userData, isRider }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const maxChars = 250;

    console.log('haaaaaaa', userData);

    const handleClose = () => {
        setRating(0);
        setComment("");
        setError("");
    };

    const handleSubmit = () => {
        if (!rating) {
            setError("Please provide a rating");
            return;
        }
        if (!comment.trim()) {
            setError("Please provide feedback comments");
            return;
        }
        // Handle submission logic here
        console.log({ rating, comment });
        handleCloseDialog();
    };

    const isSubmitDisabled = !rating || !comment.trim();

    return (
        <StyledDialog
            open={open}
            onClose={handleCloseDialog}
            TransitionComponent={Fade}
            aria-labelledby="feedback-dialog-title"
            fullWidth
            disableScrollLock={true}
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
                <Button onClick={handleCloseDialog} color="primary">
                    Hủy
                </Button>
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