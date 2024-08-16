import React, { useState } from "react";
import "./Trackingmanage.css";

export default function Trackingcontent() {
  const [productId, setProductId] = useState("");
  const [qrCode, setQRCodeData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  const generateQRCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/product/${productId}/qrcode`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const qrCodeData = await response.text(); // Assuming the data is returned as plain text
      setQRCodeData(qrCodeData);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const sendEmail = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Email sent successfully!");
      setShowModal(false); // close the modal
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    sendEmail();
  };
  ////////////////////////////////
  return (
    <div>
      <h1 className="text-white" id="head">
        TrackingManage
      </h1>
      <div className="d-flex container blo">
        <div className="w-50">
          <div className="w-75 block1">
            <div className="tracker">
              <label htmlFor="track" id="label">
                Track
              </label>
              <input
                id="track"
                type="text"
                value={productId}
                placeholder="Enter id"
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <div className="container but">
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                Email
              </button>
              <button className="btn btn-success" onClick={generateQRCode}>
                Qrcode
              </button>
            </div>
          </div>
        </div>
        <div className="container w-50" id="seconddiv">
          {qrCode && <img id="imgs" src={qrCode} alt="QR Code" />}
        </div>

        {showModal && (
          <div
            className="modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              padding: 30,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "#fff",
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 10,
                width: 500,
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                Enter your email address
              </h2>
              <form
                onSubmit={handleEmailSubmit}
                className="justify-content-around"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="email"
                  value={email}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-4"
                  style={{
                    width: "80%",
                    height: 40,
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-success center"
                  style={{
                    width: "80%",
                    height: 40,
                    marginTop: 3,
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <button
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                  style={{
                    width: "40%", // reduced width to 40%
                    height: 40,
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    backgroundColor: "dark",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
