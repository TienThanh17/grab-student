"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/navigation";
import userHeader from '@/public/images/userHeader.png';

const users = [
  { avatar: userHeader, name: "Huỳnh Thanh Tiến" },
  { avatar: userHeader, name: "Tiến Huỳnh Thanh" },
  { avatar: userHeader, name: "Nguyen Thị Huyền Trân" },
  { avatar: userHeader, name: "Huyền Trân" }
];

function MessageSideBar({ toggleDrawer }) {
  const router = useRouter();

  return (
    <Box
      sx={{ width: 300, mt: 2 }}
      role="presentation"
      onClick={toggleDrawer && toggleDrawer(false)}
    >
      <Typography variant="h6">
        Liên hệ gần đây
      </Typography>
      <List>
        {users.map((value, index) => (
          <div key={index}>
            <ListItem
              key={index}
              disablePadding
            >
              <ListItemButton sx={{ mt: 2 }} onClick={() => { }}>
                <ListItemIcon>
                  <Image src={value.avatar} alt="avt" width={40} height={40} />
                </ListItemIcon>
                <ListItemText
                  primary={value.name}
                  sx={{
                    "& .MuiTypography-root": { fontWeight: "bold" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </div>
        ))}
      </List>
    </Box>
  );
}

export default MessageSideBar;
