import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";

const INITIAL_CENTER = [106.6445, 10.76994];
const INITIAL_ZOOM = 15;

function Mapbox() {
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: center,
      zoom: zoom,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <Box
      id="map-container"
      sx={{
        width: 1,
        height: { xs: 1, sm: 1, md: "25rem" },
      }}
      ref={mapContainerRef}
    ></Box>
  );
}

export default Mapbox;
