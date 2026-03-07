import React, { useEffect, useRef, useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const POPULAR_CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Cleaning",
  "Carpentry",
];

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

    if (item.type === "city") {
      navigate(`/gigs?city=${encodeURIComponent(item.value)}`);
      return;
    }

    if (item.type === "area") {
      navigate(`/gigs?area=${encodeURIComponent(item.value)}`);
      return;
    }

    navigate(`/gigs?search=${encodeURIComponent(item.value)}`);
  };

  const getSuggestionLabel = (type) => {
    if (type === "cat") return "Category";
    if (type === "gig") return "Service";
    if (type === "city") return "City";
    if (type === "area") return "Area";
    return "Result";
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
        setOpenSug((res.data || []).length > 0);
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
            Find trusted local experts and get <span>it</span> done
          </h1>

          <p>
            Book reliable professionals for plumbing, electrical work, cleaning,
            carpentry, painting, and more — all in one place.
          </p>

          <div className="searchWrap" ref={boxRef}>
            <div className="search">
              <div className="searchInput">
                <img src="/img/search.png" alt="Search" />
                <input
                  type="text"
                  placeholder="Search for a service, category, city, or area"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setOpenSug(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
              </div>

              <button onClick={handleSubmit}>Search</button>
            </div>

            {openSug && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s, idx) => (
                  <div
                    key={`${s.type}-${s.value}-${idx}`}
                    className="suggestionItem"
                    onClick={() => pickSuggestion(s)}
                  >
                    <span className="suggestionText">{s.value}</span>
                    <span className="suggestionType">
                      {getSuggestionLabel(s.type)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="popular">
            <span>Popular services:</span>

            {POPULAR_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => goToCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default Featured;