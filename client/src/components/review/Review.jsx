import React from "react";
import "./Review.scss";

const Review = ({ review }) => {
  return (
    <div className="review">
      <div className="user">
        <img className="pp" src={review?.img || "/img/noavatar.jpg"} alt="" />
        <div className="info">
          <span>{review?.username || "Unknown"}</span>
          <div className="country">
            <span>{review?.country || ""}</span>
          </div>
        </div>
      </div>

      <div className="stars">
        {Array(Number(review.star))
          .fill(0)
          .map((_, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
      </div>

      <p>{review.desc}</p>

      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;