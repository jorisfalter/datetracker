"use client";

import React, { useState } from "react";
import EmailModal from "./emailModal"; // Import the modal component

export default function signInBox() {
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  const handleLoginClick = () => {
    setModalOpen(true); // Open the modal when the button is clicked
  };

  return (
    <div>
      <button onClick={handleLoginClick}>Log In</button>{" "}
      {/* Updated button to open modal */}
      {isModalOpen && <EmailModal onClose={() => setModalOpen(false)} />}{" "}
      {/* Render modal if open */}
    </div>
  );
}
