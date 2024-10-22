"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import driverIcon from "@/public/images/driver.png";
import clientIcon from "@/public/images/client.png";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

const navBar = [
  { icon: driverIcon, label: "Kênh Tài Xế", path: "rider" },
  { icon: clientIcon, label: "Kênh Khách Hàng", path: "passenger" },
];

function Sidebar({ toggleDrawer }) {
  const router = useRouter();
  const params = useParams();

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer && toggleDrawer(false)}
    >
      <List>
        {navBar.map((value, index) => (
          <div key={index}>
            <ListItem
              sx={{
                backgroundColor:
                  value.path === params.postType ? "silver" : null,
              }}
              key={index}
              disablePadding
            >
              <ListItemButton onClick={() => router.push(value.path)}>
                <ListItemIcon>
                  <Image src={value.icon} alt="icon" width={40} height={40} />
                </ListItemIcon>
                <ListItemText
                  primary={value.label}
                  sx={{
                    "& .MuiTypography-root": { fontWeight: "bold" },
                  }}
                />
              </ListItemButton>
            </ListItem>
            {index !== navBar.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
