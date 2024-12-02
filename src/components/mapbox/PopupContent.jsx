import { IconButton, Typography, Stack } from "@mui/material";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const PopupContent = ({ location,coordinatesRef,mapRef,popupRef, setDestination, setStarting, setIsAddStartingMarker, setIsAddDestinationMarker, setRetrieveDestination, setRetrieveStarting, startingTextRef, destinationTextRef }) => {
    const handleClickStarting = () => {
      setStarting(location?.address)
      setIsAddStartingMarker(true)
      setRetrieveStarting(coordinatesRef.current)
      popupRef.current.remove()
      startingTextRef.current = location?.address;
    }
    const handleClickDestination = () => {
      setDestination(location?.address)
      setIsAddDestinationMarker(true)
      setRetrieveDestination(coordinatesRef.current)
      popupRef.current.remove();
      destinationTextRef.current = location?.address;
    }
    return (
      <Stack direction="row">
        <Stack direction="column">
          <Typography variant="h6" sx={{ fontSize: 14, fontWeight: "bold" }}>
            {location?.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
            {location?.address}
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconButton color="primary" onClick={handleClickStarting}>
            <AddLocationAltIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleClickDestination}>
            <AssistantDirectionIcon />
          </IconButton>
        </Stack>
      </Stack>
    )
  }

  export default PopupContent;