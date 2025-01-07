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
import { useGlobalContext } from "@/provider/GlobalContext";
import { Avatar } from "@mui/material";


function MessageSideBar({ toggleDrawer }) {
  const router = useRouter();
  const { conversations } = useGlobalContext();

  const handleClickUser = (converId) => {
    router.push(`/mess/${converId}`)
  };

  return (
    <Box
      sx={{ width: 300, mt: 2, height: '50vh', overflowY: 'scroll' }}
      role="presentation"
      onClick={toggleDrawer && toggleDrawer(false)}
    >
      <Typography variant="h6">
        Liên hệ gần đây
      </Typography>
      <List>
        {conversations?.map((value, index) => (
          <div key={index}>
            <ListItem
              key={index}
              disablePadding
            >
              <ListItemButton sx={{ mt: 2 }} onClick={() => handleClickUser(value.id)}>
                <ListItemIcon>
                  <Avatar alt={value.student.name} src={value.student.avatarUrl} sx={{ width: 56, height: 56, mr: 1 }} />
                </ListItemIcon>
                <ListItemText
                  primary={value.student.name}
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
