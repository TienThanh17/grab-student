import { Button, Stack, Typography } from "@mui/material";
// import { searchData } from "@/utils/fakeData";
import PlaceIcon from "@mui/icons-material/Place";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { getPlaceService, retrievePlaceService } from "@/services/mapService";
import { useSnackbar } from "notistack";

function SearchPopper({
  searchData,
  setRetrieve,
  setPlaceName,
  setOpenPopper,
  setIsAddMarker,
  placeRef
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleGetMyLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        console.log(`Vị trí của bạn: ${longitude},${latitude}`);
        setRetrieve([longitude, latitude]);
        const res = await getPlaceService(longitude, latitude);
        placeRef.current = res.data.features[0].properties.full_address;
        setPlaceName("Vị trí của bạn");
        setOpenPopper(false);
        setIsAddMarker(true);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            enqueueSnackbar(
              "Permission denied. Please enable location services.",
              { variant: "error" }
            );
            break;
          case error.POSITION_UNAVAILABLE:
            enqueueSnackbar(
              "Position unavailable. Check your GPS or network.",
              { variant: "error" }
            );
            break;
          case error.TIMEOUT:
            enqueueSnackbar("Request timed out. Try again.", {
              variant: "error",
            });
            break;
          default:
            enqueueSnackbar("An unknown error occurred.", { variant: "error" });
        }
      },
      {
        enableHighAccuracy: false, // Tắt độ chính xác cao để phản hồi nhanh hơn
        timeout: 5000, // Giảm thời gian chờ xuống 5 giây
        maximumAge: 300000, // Sử dụng vị trí được cache trong vòng 5 phút
      }
    );
  };

  const handleGetLocation = async (item) => {
    try {
      const res = await retrievePlaceService(item.mapbox_id);
      // console.log(res.data.features[0].geometry.coordinates)
      placeRef.current=item.name + ', ' + item.full_address;
      setRetrieve(res.data.features[0].geometry.coordinates);
      setPlaceName(item.name);
      setOpenPopper(false);
      setIsAddMarker(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack
      sx={{
        border: "1px solid silver",
        p: 1,
        bgcolor: "background.paper",
        borderRadius: "0.5rem",
      }}
    >
      <Button
        variant="text"
        startIcon={<MyLocationIcon />}
        sx={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: 1, // Đặt chiều rộng tối đa để giới hạn
          justifyContent: "flex-start", // Đảm bảo text canh trái
        }}
        onClick={handleGetMyLocation}
      >
        <Stack direction="column" sx={{ alignItems: "flex-start" }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Vị trí của bạn
          </Typography>
        </Stack>
      </Button>
      {searchData?.map((value, index) => (
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
          onClick={() => handleGetLocation(value)}
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
              {value.full_address}
            </Typography>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}

export default SearchPopper;
