import React, { useState } from "react";
import "./Pay.scss";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ simulate payment
  const handlePayment = async () => {
    try {
      setLoading(true);

      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // OPTIONAL: create order in DB
      await newRequest.post("/orders", {
        gigId: id,
        payment_intent: "dummy_payment_" + Date.now(),
      });

      setSuccess(true);

      // redirect after success
      setTimeout(() => {
        navigate("/orders");
      }, 2500);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay">
      {success ? (
        <div className="successBox">
          <h3>✅ Payment Successful</h3>
          <p>Transaction ID: TXN{Date.now()}</p>
        </div>
      ) : (
        <div className="payBox">
          <h2>Complete Payment</h2>
          <p>Click below to simulate payment.</p>

          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Pay;
