// Modal.js

import React, { useState } from "react";
import "./Modal.css"; // Ensure you have the correct path to your CSS file

const Modal = ({ isOpen, onClose, onEmailSend }) => {
  const [email, setEmail] = useState("");

  const handleEmailSend = () => {
    onEmailSend(email); // Call the function passed from parent with email
    setEmail(""); // Clear email input after sending
    onClose(); // Close the modal after sending
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Enter your email</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailSend}>Send</button>
      </div>
    </div>
  );
};

export default Modal;
