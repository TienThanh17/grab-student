import { Card, CardContent, Avatar, Typography, Box, Divider, Chip } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useRouter } from "next/navigation";

const RideComponent = ({ data }) => {
  const router = useRouter();

  const handleClickRide = (event) => {
    // console.log('data', data);
    router.push(`/ride/${data.id}`)
  };

  return (
    <Card
      sx={{
        width: 1,
        margin: "0 auto",
        borderRadius: 7,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: 2,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)", // Phóng to nhẹ khi hover
          boxShadow: (theme) => theme.shadows[6], // Tăng độ đổ bóng khi hover
        },
      }}
      onClick={handleClickRide}
    >
      <CardContent>
        {/* Header: Avatar, Name, and Rating */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={data.rider.avatar}
              alt="rider"
              sx={{ width: 45, height: 45, marginRight: 2 }}
            />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Tài xế
              </Typography>
              <Typography variant="h6">{data.rider.name}</Typography>
            </Box>
          </Box>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={data.rider?.rating ?? 0}

            sx={{ fontWeight: "bold", bgcolor: "white" }}
            variant="outlined"
          />
        </Box>
        {/* Pick-up Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold">
          Điểm xuất phát
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.riderStartLocation}
        </Typography>

        {/* drop-off Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
          Điểm đến
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.riderEndLocation}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={data.passenger.avatar}
              alt="passenger"
              sx={{ width: 45, height: 45, marginRight: 2 }}
            />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Hành khách
              </Typography>
              <Typography variant="h6">{data.passenger.name}</Typography>
            </Box>
          </Box>
          <Chip
            icon={<StarRoundedIcon sx={{ color: "gold !important" }} />}
            label={data.passenger?.rating ?? 0}

            sx={{ fontWeight: "bold", bgcolor: "white" }}
            variant="outlined"
          />
        </Box>
        {/* Pick-up Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold">
          Điểm đón
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.rideRequest.pickUpLocation}
        </Typography>

        {/* drop-off Location */}
        <Typography variant="body1" color="textSecondary" fontWeight="bold" mt={2}>
          Điểm trả
        </Typography>
        <Typography variant="body1" mt={0.5}>
          {data.rideRequest.dropOffLocation}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RideComponent;
