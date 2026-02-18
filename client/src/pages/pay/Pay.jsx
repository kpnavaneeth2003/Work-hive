import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./Pay.scss";

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");

  const validateUPI = (upi) => /^[\w.-]+@[\w.-]+$/.test(upi);

  const handlePayment = async () => {
    if (!validateUPI(upiId)) {
      setError("Enter a valid UPI ID (example@upi)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // generate fake transaction ID
      const transaction = "TXN" + Date.now();
      setTxnId(transaction);

      setSuccess(true);

      // redirect to orders after 2.5s
      setTimeout(() => navigate("/orders"), 2500);
    } catch {
      setError("Unexpected error occurred");
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
          <div className="upiHeader">
           
            <h2>UPI Payment</h2>
          </div>

          <p>Enter your UPI ID or scan the QR to pay</p>

          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            disabled={loading}
          />

          {error && <span className="error">{error}</span>}

          <button onClick={handlePayment} disabled={loading}>
            {loading ? (
              <>
                <span className="loadingDots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>{" "}
                Processing...
              </>
            ) : (
              "Pay via UPI"
            )}
          </button>

          <div className="qrBox">
            {upiId ? (
              <QRCodeCanvas
                value={`upi://pay?pa=${upiId}&pn=Workhive&am=100&cu=INR`}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="qrPlaceholder">Enter UPI ID to generate QR</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pay;
