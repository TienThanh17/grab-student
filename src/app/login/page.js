'use client'

import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    CircularProgress,
    styled,
    Autocomplete,
    Fade,
    InputAdornment, IconButton
} from "@mui/material";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useRouter } from 'next/navigation';
import { verifyOtpService, sendOtpService, loginService } from '@/services/userService'
import Cookies from 'js-cookie';
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux-toolkit/userSlice';


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
        zIndex: 0
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    borderRadius: 30,
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    "&:hover": {
        background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
        transform: "translateY(-1px)",
        boxShadow: "0 6px 10px 2px rgba(33, 203, 243, .3)"
    }
}));

const OTPInput = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "center",
    marginTop: theme.spacing(2)
}));

const OTPDigit = styled(TextField)(({ theme }) => ({
    width: "48px",
    "& input": {
        textAlign: "center",
        fontSize: "1.5rem",
        padding: theme.spacing(1)
    }
}));

const Login = () => {
    const [email, setEmail] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const commonDomains = ["@student.edu.vn", "@outlook.com", '@gmail.com'];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!validateEmail(email)) {
                setEmailError("Vui lòng nhập email hợp lệ");
                return;
            }
            setEmailError("");
            setLoading(true);

            const res = await loginService({
                email,
                password
            });
            if (res.status === 200) {
                Cookies.set('accessToken', res.data.accessToken, { expires: 7 });
                Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 });
                if (!res.data.studentInfo.is2faEnabled) {
                    dispatch(login(res.data.studentInfo));
                    router.push('/rider');
                } else {
                    const otpRes = await sendOtpService(email);
                    // console.log(otpRes.data)
                    setShowOTP(true);
                }
            }
        } catch (err) {
            console.log(err)
            enqueueSnackbar(
                "Lỗi đăng nhập",
                { variant: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOtp(newOTP);

            // Auto-focus next input
            if (value && index < otp.length - 1) {
                const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index]) {
            if (index > 0) {
                const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
                if (prevInput) {
                    prevInput.focus();
                    const newOTP = [...otp];
                    newOTP[index - 1] = ""; // Xóa ký tự ở ô trước
                    setOtp(newOTP);
                }
            }
        }
    };

    const handleOTPSubmit = async (e) => {
        try {
            e.preventDefault();
            const otpValue = otp.join("");
            if (otpValue.length !== 6) {
                setOtpError("Vui lòng nhập đủ 6 chữ số");
                return;
            }
            setOtpError("");
            setLoading(true);

            const res = await verifyOtpService({
                email,
                otp: otpValue
            });
            // console.log('verify otp', res);
            if (res.data.data.isVerified) {
                router.push('rider')
            } else {
                enqueueSnackbar(
                    "OTP không chính xác",
                    { variant: "error" }
                );
            }
        } catch (err) {
            console.log(err)
            enqueueSnackbar(
                "Lỗi xác thực OTP",
                { variant: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setShowOTP(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(https://online.hcmue.edu.vn/static/media/banner-1668412987.c5ee3f2a.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền trong suốt
                        backdropFilter: "blur(4px)", // Hiệu ứng mờ kính
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)", // Đổ bóng nhẹ
                        border: "1px solid rgba(255, 255, 255, 0.18)", // Viền mờ
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ mb: 4, fontWeight: "bold", color: "#1976D2", textAlign: "center" }}
                    >
                        GRAB STUDENT
                    </Typography>

                    {!showOTP ? (
                        <Box
                            component="form"
                            autoComplete="off"
                            onSubmit={handleEmailSubmit}
                            sx={{ width: "100%" }}
                        >
                            <Autocomplete
                                autoComplete="off"
                                freeSolo
                                options={commonDomains.map(
                                    (domain) => email.split("@")[0] + domain
                                )}
                                inputValue={email}
                                onInputChange={(_, newValue) => setEmail(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        name="email"
                                        label="Email Sinh Viên"
                                        variant="outlined"
                                        fullWidth
                                        error={!!emailError}
                                        helperText={emailError}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <FaEnvelope
                                                    style={{ marginRight: 8, color: "#757575" }}
                                                />
                                            ),
                                        }}
                                        aria-label="Email input"
                                    />
                                )}
                            />
                            <TextField
                                autoComplete="off"
                                type={showPassword ? "text" : "password"}
                                label="Mật khẩu"
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 5 }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <FaLock style={{ marginRight: 8, color: "#757575" }} />
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                aria-label="Password input"
                            />
                            <StyledButton
                                type="submit"
                                fullWidth
                                disabled={loading}
                                startIcon={
                                    loading && <CircularProgress size={20} color="inherit" />
                                }
                                sx={{
                                    mt: 5,
                                    backgroundColor: "rgba(25, 118, 210, 0.8)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgba(25, 118, 210, 1)",
                                    },
                                }}
                            >
                                {loading ? "Đang gửi OTP..." : "Tiếp tục"}
                            </StyledButton>
                        </Box>
                    ) : (
                        <Fade in={showOTP}>
                            <Box component="form" onSubmit={handleOTPSubmit} sx={{ width: "100%", position: "relative" }}>
                                {/* Icon Button để quay về */}
                                <IconButton
                                    onClick={handleGoBack} // Hàm xử lý khi nhấn nút quay về
                                    sx={{
                                        position: "absolute",
                                        top: -75,
                                        left: 0,
                                        color: "rgba(0, 0, 0, 0.7)", // Màu sắc
                                        backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền mờ nhẹ
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 1)", // Nền khi hover
                                        },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>

                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2, textAlign: "center", color: "black" }}
                                >
                                    Nhập mã OTP được gửi đến {email}
                                </Typography>
                                <OTPInput>
                                    {otp.map((digit, index) => (
                                        <OTPDigit
                                            key={index}
                                            name={`otp-${index}`}
                                            value={digit}
                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            error={!!otpError}
                                            inputProps={{
                                                maxLength: 1,
                                                "aria-label": `OTP digit ${index + 1}`,
                                            }}
                                        />
                                    ))}
                                </OTPInput>
                                {otpError && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{
                                            mt: 1,
                                            display: "block",
                                            textAlign: "center",
                                        }}
                                    >
                                        {otpError}
                                    </Typography>
                                )}
                                <StyledButton
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    startIcon={
                                        loading && <CircularProgress size={20} color="inherit" />
                                    }
                                    sx={{
                                        mt: 3,
                                        backgroundColor: "rgba(25, 118, 210, 0.8)",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "rgba(25, 118, 210, 1)",
                                        },
                                    }}
                                >
                                    {loading ? "Đang xác thực..." : "Xác thực"}
                                </StyledButton>
                            </Box>

                        </Fade>
                    )}
                </Paper>
            </Container>
        </Box>

    );
};

export default Login;