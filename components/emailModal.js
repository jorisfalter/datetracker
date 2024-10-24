import React, { useState } from "react";
import "../emailModal.css"; // Import the CSS file for styling

const EmailModal = ({ onClose }) => {
  const [email, setEmail] = useState(""); // State to manage email input

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log("Email submitted:", email);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-overlay">
      {" "}
      {/* Overlay for the modal */}
      <div className="modal-content">
        {" "}
        {/* Centered modal content */}
        <span className="close" onClick={onClose}>
          &times;
        </span>{" "}
        {/* Close button */}
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            placeholder="Your email address"
            required
          />
          <button type="submit">Submit</button> {/* Submit button */}
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
