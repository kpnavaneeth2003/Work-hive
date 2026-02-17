import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!input.trim()) return; // prevent empty search
    navigate(`/gigs?search=${encodeURIComponent(input)}`);
  };

  const goToCategory = (cat) => {
    navigate(`/gigs?cat=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Get <span>it</span> done
          </h1>

          {/* 🔍 SEARCH */}
          <div className="search">
            <div className="searchInput">
              <img src="/img/search.png" alt="" />
              <input
                type="text"
                placeholder="Find your service"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>

          {/* ⭐ POPULAR CATEGORIES */}
          <div className="popular">
            <span>Popular:</span>

            <button onClick={() => goToCategory("AC Repair")}>
              AC Repair
            </button>

            <button onClick={() => goToCategory("Plumbing")}>
              Plumbing
            </button>

            <button onClick={() => goToCategory("Electrician")}>
              Electrician
            </button>

            <button onClick={() => goToCategory("Carpentry")}>
              Carpentry
            </button>
          </div>
        </div>

        <div className="right">
         
        </div>
      </div>
    </div>
  );
}

export default Featured;

