import axios from "axios";

export const getSuggestPlaceService = (search, proximity) => {
  const params = {
    q: search,
    limit: 5,
    proximity: proximity,
    language: "vi",
    country: "VN",
    session_token: "[GENERATED-UUID]",
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  };
  return axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest`, {
    params: params,
  });
};

export const retrievePlaceService = (mapboxId) => {
  const params = {
    session_token: "[GENERATED-UUID]",
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  };
  return axios.get(`https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}`, {
    params: params,
  });
};

export const getDirectionService = (start, end) => {
  const params = {
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    geometries: 'geojson'
  };
  return axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`, {
    params: params,
  });
};

export const getMultiDirectionService = (start1, end1, start2, end2) => {
  const params = {
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    geometries: 'geojson'
  };
  return axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start1[0]},${start1[1]};${start2[0]},${start2[1]};${end2[0]},${end2[1]};${end1[0]},${end1[1]}`, {
    params: params,
  });
};

export const getPlaceService = (longitude, latitude) => {
  const params = {
    longitude,
    latitude,
    language: "vi",
    country: "VN",
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  };
  return axios.get(`https://api.mapbox.com/search/searchbox/v1/reverse`, {
    params: params,
  });
};