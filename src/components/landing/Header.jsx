'use client'

import logo from "@/public/images/logo.png";
import Image from 'next/image';
import { Box, Stack, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

function Header() {
    const router = useRouter();

    const navigateToLogin = () => {
        router.push(`login`);
      };

    return (
        <Stack direction='row' sx={{
            position: 'fixed', width: 1, height: '70px', bgcolor: 'white', zIndex: 999,
            justifyContent: 'space-around', alignItems: 'center', bgcolor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)",
            // border: "1px solid rgba(255, 255, 255, 0.2)", 
            // borderRadius: "16px", 
            // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", 
            // padding: "0 16px",
        }}>
            <Box sx={{ width: { xs: 50, md: 100 }, height: { xs: 25, md: 50 } }}>
                <Image
                    src={logo}
                    alt="logo"
                    style={{ width: "100%", height: "100%" }}
                />
            </Box>
            <Typography variant="h6" color='primary' sx={{ fontWeight: "bold" }}>
                GRAB STUDENT
            </Typography>
            <Button
                variant='contained'
                onClick={navigateToLogin}
                sx={{
                    backgroundColor: "#e0e0e0",
                    color: "#333", // Màu chữ
                    fontWeight: "bold",
                    borderRadius: "12px", // Bo góc
                    boxShadow: "8px 8px 15px #bebebe, -8px -8px 15px #ffffff", // Đổ bóng 2 bên
                    transition: "0.3s ease",
                    // "&:hover": {
                    //     backgroundColor: "#d1d1d1",
                    //     boxShadow: "inset 8px 8px 15px #bebebe, inset -8px -8px 15px #ffffff", // Tạo hiệu ứng chìm khi hover
                    // },
                    "&:active": {
                        boxShadow: "inset 4px 4px 10px #bebebe, inset -4px -4px 10px #ffffff", // Hiệu ứng nhấn sâu
                    },
                }}
            >
                Đăng nhập
            </Button>
        </Stack>
    )
}

export default Header