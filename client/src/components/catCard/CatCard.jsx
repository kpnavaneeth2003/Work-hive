import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link
      to={`/gigs?cat=${encodeURIComponent(card.title)}`}
      className="catCardLink"
    >
      <div className="catCard">
        <img src={card.img} alt={card.title} />
        <div className="overlay"></div>

        <div className="content">
          <span className="desc">{card.desc}</span>
          <span className="title">{card.title}</span>
        </div>
      </div>
    </Link>
  );
}

export default CatCard;