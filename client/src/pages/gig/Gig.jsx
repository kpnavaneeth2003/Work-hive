import React, { useContext } from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import { AuthContext } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  
  const hasRating = data?.starNumber > 0;
  const avgRating = hasRating
    ? Math.round(data.totalStars / data.starNumber)
    : null;

 
  const memberSince = (() => {
    const raw = dataUser?.createdAt;
    if (!raw) return "—";
    const d = new Date(String(raw).replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  })();

 
  const handleContact = async () => {
    try {
      if (!data?.userId || currentUser?.id === data.userId) return;

      const res = await newRequest.post("/conversations", {
        to: data.userId,
      });

      navigate(`/messages/${res.data.id}`);
    } catch (err) {
      console.log("Contact Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="gig">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          
          <div className="left">
            <span className="breadcrumbs">Workhive &gt; {data.cat} &gt;</span>
            <h1>{data.title}</h1>

            
            {isLoadingUser ? (
              "Loading..."
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>

                {avgRating && (
                  <div className="stars">
                    {Array(avgRating)
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{avgRating}</span>
                  </div>
                )}
              </div>
            )}

            
            {(data.images?.length > 0 || data.cover) && (
              <Slider>
                {data.cover && (
                  <img src={data.cover || "/img/noimage.jpg"} alt="" />
                )}
                {data.images?.map((img) => (
                  <img key={img} src={img} alt="" />
                ))}
              </Slider>
            )}

            <h2>About This Gig</h2>
            <p>{data.desc}</p>

           
            {isLoadingUser || errorUser ? null : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>

                    {avgRating && (
                      <div className="stars">
                        {Array(avgRating)
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>{avgRating}</span>
                      </div>
                    )}

                    {currentUser?.id !== data.userId && (
                      <button onClick={handleContact}>Contact Me</button>
                    )}
                  </div>
                </div>

                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>

                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">{memberSince}</span>
                    </div>

                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>

                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            <Reviews gigId={id} />
          </div>

          
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>{formatPrice(data.price)}</h2>
            </div>

            <p>{data.shortDesc}</p>

            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>Arrive in {data.hours} Hours </span>
              </div>
            </div>

            <div className="features">
              {(data.features || []).map((feature) => (
                <div className="item" key={feature}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link to={`/pay/${id}`}>
              <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;