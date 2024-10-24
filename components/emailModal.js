import React, { useState } from "react";
import "../emailModal.css"; // Import the CSS file for styling
// import fetch from "node-fetch";

const EmailModal = ({ onClose }) => {
  const [email, setEmail] = useState(""); // State to manage email input
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    async function sendLogInEmail() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setSuccessMessage("An email has been sent. Please check your inbox."); // Set success message
      } catch (error) {
        console.error("Error sending test email:", error.message);
      }
    }
    // Call the sendLogInEmail function
    sendLogInEmail(); // This line was missing
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
        {successMessage && <p>{successMessage}</p>}{" "}
        {/* Display success message */}
      </div>
    </div>
  );
};

export default EmailModal;
