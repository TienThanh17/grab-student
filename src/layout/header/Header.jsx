"use client";

import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import Drawer from "@mui/material/Drawer";
import { InputBase } from "@mui/material";
import Modal from "@mui/material/Modal";

import userIcon from "@/public/images/User.png";
import Inquiry from "@/public/images/Inquiry.png";
import Motorcycle from "@/public/images/Motorcycle.png";
import Logout from "@/public/images/Logout.png";
import Image from "next/image";
import messageIcon from "@/public/images/Chat Message.png";
import logo from "@/public/images/logo.png";
import userHeader from "@/public/images/userHeader.png";
import messHeader from "@/public/images/messHeader.png";
import notifHeader from "@/public/images/notifHeader.png";
import add from "@/public/images/Add.png";
import Sidebar from "../sidebar/Sidebar";
import PostCreation from "@/components/post/PostCreation";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { logout } from '@/redux-toolkit/userSlice';
import Cookies from "js-cookie";


export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openPostCreation, setOpenPostCreation] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleClosePostCreation = () => {
    setOpenPostCreation(false);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenPostCreation = () => {
    handleMenuClose();
    setOpenPostCreation(true);
  };

  const handleClickMyPost = () => {
    handleMenuClose();
    router.push(`my-post`);
  }

  const handleClickProfile = () => {
    handleMenuClose();
    router.push(`profile`);
  }

  const handleClickRequest = () => {
    handleMenuClose();
    router.push(`request`);
  }

  const handleClickLogout = () => {
    handleMenuClose();
    dispatch(logout());

    router.push(`/`);
  }

  const userMenu = [
    { icon: add, label: "Tạo bài đăng", handle: handleOpenPostCreation },
    { icon: userIcon, label: "Thông tin cá nhân", handle: handleClickProfile },
    { icon: Motorcycle, label: "Bài đăng của tôi", handle: handleClickMyPost },
    { icon: Inquiry, label: "Yêu cầu chở", handle: handleClickRequest },
    { icon: Logout, label: "Đăng xuất", handle: handleClickLogout },
  ];

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      disableScrollLock={true}
    >
      {userMenu.map((value, index) => (
        <MenuItem
          key={index}
          onClick={value.handle}
          sx={{ display: "flex", gap: 2 }}
        >
          <Image src={value.icon} alt="icon" width={30} height={30} />
          {value.label}
        </MenuItem>
      ))}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      disableScrollLock={true}
    >
      {userMenu.map((value, index) => (
        <MenuItem
          key={index}
          onClick={value.handle}
          sx={{ display: "flex", gap: 2 }}
        >
          <Image src={value.icon} alt="icon" width={30} height={30} />
          {value.label}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, position: 'fixed', width: 1, zIndex: 999 }}>
      <AppBar
        position="static"
        sx={{
          paddingInline: { xs: 0, sm: "2rem", md: "10rem" },
          backgroundColor: "white",
        }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", alignContent: "center" }}
        >
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{
              color: "var(--main-color)",
              display: { sm: "block", md: "none" },
            }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ width: { xs: 50, md: 100 }, height: { xs: 25, md: 50 } }}>
            <Image
              src={logo}
              alt="logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Search
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "none", md: "flex" },
            }}
          >
            <SearchIconWrapper onClick={() => console.log("search click")}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm đường..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={4} color="error">
                <Image src={messHeader} alt="icon" width={30} height={30} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={17} color="error">
                <Image src={notifHeader} alt="icon" width={30} height={30} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Image src={userHeader} alt="icon" width={30} height={30} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              sx={{ color: "var(--main-color)" }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <Image src={messHeader} alt="icon" width={20} height={20} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <Image src={notifHeader} alt="icon" width={20} height={20} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              sx={{ color: "var(--main-color)" }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        sx={{ display: { sm: "block", md: "none" } }}
        open={openDrawer}
        onClose={toggleDrawer(false)}
      >
        <Sidebar toggleDrawer={toggleDrawer} />
      </Drawer>
      <Modal open={openPostCreation} onClose={handleClosePostCreation}>
        <PostCreation handleClosePostCreation={handleClosePostCreation} />
      </Modal>
    </Box>
  );
}

const Search = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: "solid 1px black",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  color: "black",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));
