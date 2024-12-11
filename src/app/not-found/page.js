'use client'

import React from "react";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { BiError } from "react-icons/bi";
import { useRouter } from 'next/navigation';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  textAlign: "center",
  gap: theme.spacing(4)
}));

const StyledErrorIcon = styled(BiError)(({ theme }) => ({
  fontSize: "150px",
  color: theme.palette.primary.main,
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0)"
    },
    "50%": {
      transform: "translateY(-20px)"
    }
  }
}));

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(`rider`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledErrorIcon />
        <Typography 
          variant="h1" 
          component="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            fontWeight: "bold",
            color: "primary.main"
          }}
        >
          404
        </Typography>
        <Typography 
          variant="h4" 
          component="h2"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            mb: 2,
            color: "text.secondary"
          }}
        >
          Ồ! Không tìm thấy trang
        </Typography>
        <Typography 
          variant="body1"
          sx={{
            maxWidth: "600px",
            mb: 4,
            color: "text.secondary"
          }}
        >
        Trang bạn đang tìm kiếm có thể đã bị xóa, đã đổi tên hoặc tạm thời không khả dụng.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{
            borderRadius: "28px",
            padding: "12px 32px",
            fontSize: "1.1rem",
            textTransform: "none",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.2s ease-in-out"
            }
          }}
        >
          Về trang chủ
        </Button>
      </StyledContainer>
    </Box>
  );
};

export default NotFoundPage;