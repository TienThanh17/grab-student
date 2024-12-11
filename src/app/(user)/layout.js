'use client'

import Header from "@/layout/header/Header";
import Sidebar from "@/layout/sidebar/Sidebar";
import Footer from "@/layout/footer/Footer";
import { Box, Container, Stack } from "@mui/material";
import MessageSideBar from "@/layout/sidebar/MessageSideBar";
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function UserLayout({ children }) {
  const isLogin = useSelector((state) => state.user.isLogin);
  if(!isLogin) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <Stack direction="row" sx={{mt: '70px'}}>
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <Sidebar />
        </Box>
        <Container maxWidth="content" sx={{ px: { xs: 0, sm: 10 } }}>
          {children}
        </Container>
        <MessageSideBar />
      </Stack>
      <Footer />
    </>
  );
}
