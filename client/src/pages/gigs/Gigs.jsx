import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [userCoords, setUserCoords] = useState(null);

  const { search } = useLocation();

  const debouncedMin = useDebounce(min);
  const debouncedMax = useDebounce(max);

  // -------------------------
  // Load Cities on Mount
  // -------------------------
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await newRequest.get("/location/cities");
        setCities(res.data);
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };

    fetchCities();
  }, []);

  // -------------------------
  // Load Areas when City changes
  // -------------------------
  useEffect(() => {
    if (!city) {
      setAreas([]);
      setArea("");
      return;
    }

    const fetchAreas = async () => {
      try {
        const res = await newRequest.get(
          `/location/areas?city=${encodeURIComponent(city)}`
        );
        setAreas(res.data);
      } catch (err) {
        console.error("Failed to load areas", err);
      }
    };

    fetchAreas();
  }, [city]);

  // -------------------------
  // Fetch Gigs
  // -------------------------
  const { isLoading, error, data } = useQuery({
    queryKey: [
      "gigs",
      search,
      sort,
      debouncedMin,
      debouncedMax,
      city,
      area,
      userCoords?.lat,
      userCoords?.lng,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(search ? search.slice(1) : "");

      if (debouncedMin) params.set("min", debouncedMin);
      if (debouncedMax) params.set("max", debouncedMax);
      if (city) params.set("city", city);
      if (area) params.set("area", area);

      params.set("sort", sort);

      if (sort === "distance" && userCoords) {
        params.set("lat", userCoords.lat);
        params.set("lng", userCoords.lng);
      }

      const res = await newRequest.get(`/gigs?${params.toString()}`);
      return res.data;
    },
  });

  // -------------------------
  // Sorting
  // -------------------------
  const reSort = (type) => {
    if (type === "distance" && !userCoords) {
      alert("Enable current location first.");
      return;
    }

    setSort(type);
    setOpen(false);
  };

  // -------------------------
  // Detect Location
  // -------------------------
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSort("distance");
      },
      () => alert("Location access denied")
    );
  };

  const clearFilters = () => {
    setMin("");
    setMax("");
    setCity("");
    setArea("");
    setUserCoords(null);
    setSort("sales");
  };

  return (
    <div className="gigs">
      <div className="container">
        <h1>Available Services</h1>

        <div className="menu">
          <div className="left" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="number"
              placeholder="Min ₹"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max ₹"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />

            {/* City Dropdown */}
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Area Dropdown */}
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              disabled={!city}
            >
              <option value="">All Areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <button onClick={handleDetectLocation}>
              Use Current Location
            </button>

            <button onClick={clearFilters}>Clear</button>
          </div>

          <div className="right">
            <span>{sort === "distance" ? "Nearest" : sort}</span>
            <img
              src="/img/down.png"
              alt=""
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className="rightMenu">
                <span onClick={() => reSort("sales")}>Best Selling</span>
                <span onClick={() => reSort("createdAt")}>Newest</span>
                <span onClick={() => reSort("price")}>Price</span>
                <span onClick={() => reSort("distance")}>Nearest</span>
              </div>
            )}
          </div>
        </div>

        {userCoords && (
          <p>
            Current Location: {userCoords.lat.toFixed(4)},{" "}
            {userCoords.lng.toFixed(4)}
          </p>
        )}

        <div className="cards">
          {isLoading && <p>Loading...</p>}
          {error && <p>Something went wrong!</p>}
          {!isLoading &&
            data?.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;