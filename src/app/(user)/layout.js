'use client'

import Header from "@/layout/header/Header";
import Sidebar from "@/layout/sidebar/Sidebar";
import Footer from "@/layout/footer/Footer";
import { Box, Container, Stack } from "@mui/material";
import MessageSideBar from "@/layout/sidebar/MessageSideBar";
import ProtectRoute from "@/components/protect/ProtectRoute";
import { usePathname } from "next/navigation";

export default function UserLayout({ children }) {
  const pathname = usePathname();

  // Kiểm tra nếu route là "/mess" thì ẩn Sidebar và MessageSideBar
  const isMessPage = pathname === "/mess";


  return (
    <>
      <Header />
      <Stack direction="row" sx={{ mt: '70px' }}>
        {!isMessPage && (
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
        )}
        <Container maxWidth={isMessPage ? null : 'content'} sx={{ px: { xs: 0, sm: 10 } }}>
          <ProtectRoute>
            {children}
          </ProtectRoute>
        </Container>
        {!isMessPage && <MessageSideBar />}
      </Stack>
      {!isMessPage && <Footer />}
    </>
  );
}
