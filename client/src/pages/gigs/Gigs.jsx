import React, { useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);

  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation(); // ?cat=Plumbing

  const { isLoading, error, data } = useQuery({
    queryKey: ["gigs", search, sort],
    queryFn: async () => {
      const min = minRef.current?.value || 0;
      const max = maxRef.current?.value || 1000000;

      const query = search ? `${search}&` : "?";

      const res = await newRequest.get(
        `/gigs${query}min=${min}&max=${max}&sort=${sort}`
      );

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
            <input ref={minRef} type="number" placeholder="Min ₹" />
            <input ref={maxRef} type="number" placeholder="Max ₹" />
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
          {!isLoading && data?.length === 0 && <p>No services found</p>}

          {!isLoading &&
            data?.length > 0 &&
            data.map((gig) => (
              <GigCard key={gig._id} item={gig} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
