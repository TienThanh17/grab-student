import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { getPlaceService } from "@/services/mapService";
import PopupContent from './PopupContent';

const INITIAL_CENTER = [106.6445, 10.76994];
const INITIAL_ZOOM = 15;

function Mapbox({ mapRef, setDestination, setStarting, setIsAddStartingMarker, setIsAddDestinationMarker, setRetrieveDestination, setRetrieveStarting, startingTextRef, destinationTextRef }) {
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [popupNode, setPopupNode] = useState(null);
  const [location, setLocation] = useState({});
  const coordinatesRef = useRef();
  const mapContainerRef = useRef();
  const popupRef = useRef();
  const holdTimer = useRef();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: center,
      zoom: zoom,
    });

    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    const HOLD_DURATION = 500;
    let isMouseMoving = false;
    let windowStartPosition = null;

    const getPlace = async (lng, lat) => {
      try {
        const res = await getPlaceService(lng, lat);
        if (Object.keys(location).length === 0) {
          setLocation({
            name: res.data.features[0].properties.name,
            address: res.data.features[0].properties.full_address
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    const makePopup = async (e) => {
      if (!isMouseMoving) {
        holdTimer.current = setTimeout(async () => {
          const { lng, lat } = e.lngLat;
          coordinatesRef.current = [lng, lat];
          // Xóa popup cũ nếu có
          if (popupRef.current) {
            popupRef.current.remove();
          }
          // Tạo location
          await getPlace(lng, lat);
          // Tạo một node mới cho popup
          const popupNode = document.createElement("div");
          setPopupNode(popupNode);
          // Tạo và hiển thị popup
          popupRef.current = new mapboxgl.Popup({ closeOnClick: false })
            .setMaxWidth("700px")
            .setLngLat([lng, lat])
            .setDOMContent(popupNode)
            .addTo(mapRef.current);
        }, HOLD_DURATION);
      }
    }

    mapRef.current.on('mousedown', makePopup);

    const handleMouseMove = (e) => {
      if (Math.abs(e.clientX - windowStartPosition.x) > 1 || Math.abs(e.clientY - windowStartPosition.y) > 1) {
        isMouseMoving = true;
        clearTimeout(holdTimer.current);
      }
    };


    const handleMouseDown = (e) => {
      isMouseMoving = false;
      windowStartPosition = { x: e.clientX, y: e.clientY }
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseUp = () => {
      clearTimeout(holdTimer.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      mapRef.current.remove();
    };
  }, [mapRef, center, zoom]);

  // Render component React vào popup node
  useEffect(() => {
    if (popupNode && location) {
      const root = createRoot(popupNode); // Tạo root instance từ popupNode
      root.render(<PopupContent location={location} coordinatesRef={coordinatesRef} popupRef={popupRef} mapRef={mapRef} setStarting={setStarting} setDestination={setDestination} setIsAddStartingMarker={setIsAddStartingMarker} setIsAddDestinationMarker={setIsAddDestinationMarker} setRetrieveDestination={setRetrieveDestination} setRetrieveStarting={setRetrieveStarting} destinationTextRef={destinationTextRef} startingTextRef={startingTextRef} />);
    }
  }, [popupNode, location]);

  return (
    <Box
      id="map-container"
      sx={{
        width: 1,
        height: { xs: 1, sm: 1, md: "30rem" },
      }}
      ref={mapContainerRef}
    ></Box>
  );
}

export default Mapbox;
