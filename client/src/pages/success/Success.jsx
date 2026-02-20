import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const gigId = params.get("gigId");
  const txnId = params.get("txnId");

  useEffect(() => {
    const createOrder = async () => {
      try {
        await newRequest.post("/orders", {
          gigId,
          payment_intent: txnId,
        });

        setTimeout(() => navigate("/orders"), 1500);
      } catch (err) {
        console.log(err);
      }
    };

    if (gigId && txnId) createOrder();
  }, [gigId, txnId, navigate]);

  return <h2>Creating your order...</h2>;
};

export default Success;