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

  const { search } = useLocation();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gigs", sort, search],
    queryFn: async () => {
      const min = minRef.current?.value || 0;
      const max = maxRef.current?.value || 999999;

      const res = await newRequest.get(
        `/gigs${search || "?"}${
          search ? "&" : ""
        }min=${min}&max=${max}&sort=${sort}`
      );

      return res.data;
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    // React Query will refetch automatically because queryKey depends on sort/search
    // To trigger manually, you could use queryClient.invalidateQueries if needed
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Liverr &gt; Services</span>
        <h1>Available Gigs</h1>
        <p>Browse available services from our sellers</p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="./img/down.png"
              alt=""
              onClick={() => setOpen(!open)}
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

        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.map((gig) => (
                <GigCard key={gig._id} item={gig} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
