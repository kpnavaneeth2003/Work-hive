import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { formatPrice } from "../../utils/formatPrice";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        {/* ✅ Option B: render image ONLY if cover exists */}
        {item.cover?.trim() ? (
          <img className="coverImg" src={item.cover} alt={item.title || ""} />
        ) : (
          <div className="noCover">No Image</div>
        )}

        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt="" />
              <span>{data.username}</span>
            </div>
          )}

          <p>{item.desc}</p>

          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>
              {item.starNumber > 0
                ? Math.round(item.totalStars / item.starNumber)
                : 0}
            </span>
          </div>
        </div>

        <hr />

        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>{formatPrice(item.price)}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;