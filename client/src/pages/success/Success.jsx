import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const ran = useRef(false); 

  const params = new URLSearchParams(search);
  const gigId = params.get("gigId");
  const txnId = params.get("txnId");

  useEffect(() => {
    if (!gigId || !txnId) return;

  
    if (ran.current) return;
    ran.current = true;

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

    createOrder();
  }, [gigId, txnId, navigate]);

  return <h2>Creating your order...</h2>;
};

export default Success;