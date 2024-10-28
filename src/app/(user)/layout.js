import Header from "@/layout/header/Header";
import Sidebar from "@/layout/sidebar/Sidebar";
import { Box, Container, Stack } from "@mui/material";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      {/* <Container maxWidth='background'> */}
      <Stack direction="row">
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <Sidebar />
        </Box>
        <Container maxWidth='content'>{children}</Container>
      </Stack>
      {/* </Container> */}
    </>
  );
}
