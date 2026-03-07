import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { formatPrice } from "../../utils/formatPrice";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig-user", item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  const rating =
    item.starNumber > 0 ? Math.round(item.totalStars / item.starNumber) : 0;

  return (
    <Link to={`/gig/${item._id}`} className="link gigCardLink">
      <div className="gigCard">
        {item.cover?.trim() ? (
          <img className="coverImg" src={item.cover} alt={item.title || ""} />
        ) : (
          <div className="noCover">No Image Available</div>
        )}

        <div className="info">
          {isLoading ? (
            <div className="user userState">Loading seller...</div>
          ) : error ? (
            <div className="user userState">Seller unavailable</div>
          ) : (
            <div className="user">
              <img src={data?.img || "/img/noavatar.jpg"} alt={data?.username || "User"} />
              <span>{data?.username}</span>
            </div>
          )}

          <h3>{item.title}</h3>

          <p>{item.shortDesc || item.desc}</p>

          {(item.city || item.area || item.distanceKm !== undefined) && (
            <div className="meta">
              {item.city && (
                <div className="metaRow">
                  <span className="label">City</span>
                  <span className="value">{item.city}</span>
                </div>
              )}

              {item.area && (
                <div className="metaRow">
                  <span className="label">Area</span>
                  <span className="value">{item.area}</span>
                </div>
              )}

              {item.distanceKm !== undefined && item.distanceKm !== null && (
                <div className="metaRow">
                  <span className="label">Distance</span>
                  <span className="value">{item.distanceKm} km</span>
                </div>
              )}
            </div>
          )}

          <div className="star">
            <img src="/img/star.png" alt="Rating" />
            <span>{rating}</span>
          </div>
        </div>

        <hr />

        <div className="detail">
          <img src="/img/heart.png" alt="Save" />
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