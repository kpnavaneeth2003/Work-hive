import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./Pay.scss";

const Pay = () => {
  const { id } = useParams(); // gigId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  // ✅ Your UPI (replace with your real one)
  const merchantUPI = "yourupi@oksbi";

  // ✅ Example price (later fetch from gig API if needed)
  const amount = 100;

  const upiLink = `upi://pay?pa=${merchantUPI}&pn=Workhive&am=${amount}&cu=INR`;

  const handlePayment = async () => {
    setLoading(true);

    try {
      // simulate delay after scanning
      await new Promise((r) => setTimeout(r, 2500));

      const transaction = "TXN" + Date.now();
      setTxnId(transaction);
      setSuccess(true);

      setTimeout(() => navigate(`/success?gigId=${id}&txnId=${transaction}`), 1500);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="pay">
      {success ? (
        <div className="successBox">
          <h3>✅ Payment Successful</h3>
          <p>Transaction ID: {txnId}</p>
        </div>
      ) : (
        <div className="payBox">
          <h2>Scan & Pay</h2>

          {/* ✅ QR code always visible */}
          <div className="qrBox">
            <QRCodeCanvas
              value={upiLink}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin
            />
          </div>

          <p style={{ marginTop: 10 }}>Scan with any UPI app</p>

          {/* fallback manual button */}
          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Waiting for payment..." : "I have paid"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Pay;