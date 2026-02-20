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
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <h1>Services</h1>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Contact</th>
              </tr>
            </thead>

            <tbody>
              {data?.length === 0 ? (
                <tr>
                  <td colSpan="4">No orders yet</td>
                </tr>
              ) : (
                data.map((order) => (
                  <tr key={order._id}>
                    <td>{order.title}</td>
                    <td>₹{order.price}</td>
                    <td>{order.isCompleted ? "Completed" : "Pending"}</td>
                    <td>
                      <img
                        className="message"
                        src="./img/message.png"
                        alt=""
                        onClick={() => handleContact(order)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;