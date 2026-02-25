import React, { useEffect, useRef, useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Featured() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openSug, setOpenSug] = useState(false);

  const navigate = useNavigate();
  const boxRef = useRef(null);

  const handleSubmit = () => {
    const q = input.trim();
    if (!q) return;
    setOpenSug(false);
    navigate(`/gigs?search=${encodeURIComponent(q)}`);
  };

  const goToCategory = (cat) => {
    setOpenSug(false);
    navigate(`/gigs?cat=${encodeURIComponent(cat)}`);
  };

  const pickSuggestion = (item) => {
    setOpenSug(false);

    if (item.type === "cat") {
      navigate(`/gigs?cat=${encodeURIComponent(item.value)}`);
      return;
    }

    
    navigate(`/gigs?search=${encodeURIComponent(item.value)}`);
    
  };

  
  useEffect(() => {
    const q = input.trim();
    if (!q) {
      setSuggestions([]);
      setOpenSug(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await newRequest.get(
          `/search/suggestions?q=${encodeURIComponent(q)}`
        );
        setSuggestions(res.data || []);
        setOpenSug(true);
      } catch (err) {
        setSuggestions([]);
        setOpenSug(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [input]);

  
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpenSug(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Get <span>it</span> done
          </h1>

          
          <div className="searchWrap" ref={boxRef}>
            <div className="search">
              <div className="searchInput">
                <img src="/img/search.png" alt="" />
                <input
                  type="text"
                  placeholder="Find your service"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => suggestions.length && setOpenSug(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <button onClick={handleSubmit}>Search</button>
            </div>

            {openSug && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="suggestionItem"
                    onClick={() => pickSuggestion(s)}
                  >
                    <span className="suggestionText">{s.value}</span>
                    <span className="suggestionType">
                      {s.type === "cat" ? "Category" : "Service"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="popular">
            <span>Popular:</span>

            <button onClick={() => goToCategory("AC Repair")}>AC Repair</button>
            <button onClick={() => goToCategory("Plumbing")}>Plumbing</button>
            <button onClick={() => goToCategory("Electrician")}>Electrician</button>
            <button onClick={() => goToCategory("Carpentry")}>Carpentry</button>
          </div>
        </div>

        <div className="right"></div>
      </div>
    </div>
  );
}

export default Featured;