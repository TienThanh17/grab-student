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
import Sidebar from "../sidebar/Sidebar";

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

const userMenu = [
  { icon: userIcon, label: "Thông tin cá nhân" },
  { icon: Motorcycle, label: "Bài đăng của tôi" },
  { icon: Inquiry, label: "Yêu cầu chở" },
  { icon: Logout, label: "Đăng xuất" },
];

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
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
    >
      {userMenu.map((value, index) => (
        <MenuItem
          key={index}
          onClick={handleMenuClose}
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
    >
      <MenuItem onClick={handleMenuClose} sx={{ display: "flex", gap: 2 }}>
        <Badge badgeContent={4} color="error">
          <Image src={messageIcon} alt="icon" width={30} height={30} />
        </Badge>
        <p>Tin nhắn</p>
      </MenuItem>
      {userMenu.map((value, index) => (
        <MenuItem
          key={index}
          onClick={handleMenuClose}
          sx={{ display: "flex", gap: 2 }}
        >
          <Image src={value.icon} alt="icon" width={30} height={30} />
          {value.label}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          paddingInline: { xs: 0, sm: "10rem" },
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
              display: { xs: "block", md: "none" },
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
          <Search sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
            <SearchIconWrapper onClick={() => console.log("search click")}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm đường..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
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
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
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
        sx={{ display: { xs: "block", sm: "none" } }}
        open={openDrawer}
        onClose={toggleDrawer(false)}
      >
        <Sidebar toggleDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
}
