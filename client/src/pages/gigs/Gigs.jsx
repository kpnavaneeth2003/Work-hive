import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

// Debounce hook (auto filtering while typing, but not spamming API)
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

  // Budget inputs as state
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const { search } = useLocation(); // e.g. "?cat=Plumbing"

  // Debounced values (refetch only after user pauses typing)
  const debouncedMin = useDebounce(min, 400);
  const debouncedMax = useDebounce(max, 400);

  // Convert to numbers for validation + queryKey stability
  const minValue = debouncedMin === "" ? 0 : Number(debouncedMin);
  const maxValue = debouncedMax === "" ? Infinity : Number(debouncedMax);

  const isInvalidRange =
    debouncedMax !== "" && !Number.isNaN(minValue) && !Number.isNaN(maxValue) && minValue > maxValue;

  const { isLoading, error, data } = useQuery({
    queryKey: ["gigs", search, sort, debouncedMin, debouncedMax],
    enabled: !isInvalidRange, // ✅ don't refetch if min > max
    keepPreviousData: true,   // ✅ avoid flicker on refetch
    queryFn: async () => {
      // Build query params safely (keeps existing ?cat=... etc.)
      const params = new URLSearchParams(search ? search.slice(1) : "");

      // Only send min/max if user actually typed them
      if (debouncedMin !== "") params.set("min", debouncedMin);
      if (debouncedMax !== "") params.set("max", debouncedMax);

      params.set("sort", sort);

      const res = await newRequest.get(`/gigs?${params.toString()}`);
      return res.data;
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Workhive &gt; Services &gt;</span>

        <h1>Available Services</h1>
        <p>Browse trusted professionals near you</p>

        {/* FILTER & SORT */}
        <div className="menu">
          <div className="left">
            <span>Budget (₹)</span>

            <input
              type="number"
              placeholder="Min ₹"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              min={0}
            />

            <input
              type="number"
              placeholder="Max ₹"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              min={0}
            />

            {isInvalidRange && (
              <small style={{ color: "red" }}>Min should be ≤ Max</small>
            )}
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>

            <img
              src="/img/down.png"
              alt=""
              onClick={() => setOpen(!open)}
              style={{ cursor: "pointer" }}
            />

            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* GIG LIST */}
        <div className="cards">
          {isLoading && <p>Loading services...</p>}
          {error && <p>Something went wrong!</p>}
          {!isLoading && !error && data?.length === 0 && <p>No services found</p>}

          {!isLoading &&
            !error &&
            data?.length > 0 &&
            data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;