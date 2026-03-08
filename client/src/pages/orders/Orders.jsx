import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get("/orders").then((res) => res.data),
  });

  const handleContact = async (order) => {
    const conversationId = `${order.sellerId}_${order.buyerId}`;

    try {
      const res = await newRequest.get(`/conversations/single/${conversationId}`);
      navigate(`/messages/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations`, {
          to: currentUser?.isSeller ? order.buyerId : order.sellerId,
        });
        navigate(`/messages/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
      <div className="container">
        <div className="pageHeader">
          <div>
            <h1>{currentUser?.isSeller ? "Manage Orders" : "My Orders"}</h1>
            <p>
              {currentUser?.isSeller
                ? "Track your buyers, service requests, and communication."
                : "View your booked services and contact your service providers."}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="stateBox">Loading orders...</div>
        ) : error ? (
          <div className="stateBox errorBox">Something went wrong while loading orders.</div>
        ) : data?.length === 0 ? (
          <div className="emptyState">
            <h2>No orders yet</h2>
            <p>
              {currentUser?.isSeller
                ? "You don't have any service orders yet."
                : "You haven't placed any orders yet."}
            </p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>{currentUser?.isSeller ? "Buyer" : "Seller"}</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Contact</th>
                </tr>
              </thead>

              <tbody>
                {data.map((order) => (
                  <tr key={order._id}>
                    <td className="nameCell">
                      {currentUser?.isSeller
                        ? order.buyerName || "Unknown"
                        : order.sellerName || "Unknown"}
                    </td>

                    <td className="titleCell">{order.title}</td>

                    <td className="priceCell">₹{order.price}</td>

                    <td>
                      <span
                        className={`statusBadge ${
                          order.isCompleted ? "completed" : "pending"
                        }`}
                      >
                        {order.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="contactBtn"
                        onClick={() => handleContact(order)}
                        type="button"
                      >
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;