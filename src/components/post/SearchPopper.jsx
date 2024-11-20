import { Button, Stack, Typography } from "@mui/material";
import { searchData } from "@/utils/fakeData";
import PlaceIcon from "@mui/icons-material/Place";

function SearchPopper() {
  return (
    <Stack
      sx={{
        border: "1px solid silver",
        p: 1,
        bgcolor: "background.paper",
        borderRadius: "0.5rem",
      }}
    >
      {searchData.map((value, index) => (
        <Button
          key={index}
          variant="text"
          startIcon={<PlaceIcon />}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: 1, // Đặt chiều rộng tối đa để giới hạn
            justifyContent: "flex-start", // Đảm bảo text canh trái
          }}
        >
          <Stack direction="column" sx={{ alignItems: "flex-start" }}>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {value.name}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              {value.address}
            </Typography>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}

export default SearchPopper;
