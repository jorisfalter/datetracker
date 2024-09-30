"use client"; // Add this line to specify that this is a Client Component

import styles from "./page.module.css";
import ReactTable from "../components/reactTable";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [verificationData, setVerificationData] = useState(null);

  const searchParams = useSearchParams();

  // Static part of the sentence
  const staticText = "Never Forget ";

  // Dynamic parts that change
  const dynamicParts = [
    "Your Wedding Anniversary",
    "Your Best Friend's Birthday",
    "Any Emotional Important Date",
  ];

  const fetchEntries = async () => {
    const res = await fetch("/api/entries");
    const data = await res.json();
    setEntries(data);
  };

  const addEntry = async () => {
    await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    fetchEntries();
    setContent("");
  };

  // Rotate dynamic parts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex(
        (prevIndex) => (prevIndex + 1) % dynamicParts.length
      );
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dynamicParts.length]);

  useEffect(() => {
    const encodedData = searchParams.get("verificationData");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        setVerificationData(decodedData);
        console.log("Decoded verification data:", decodedData);
      } catch (error) {
        console.error("Error decoding verification data:", error);
        setVerificationData(null);
      }
    }
  }, [searchParams]);

  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.slidingSentence}>
          {staticText}
          <span className={styles.dynamicText}>
            {dynamicParts[currentSentenceIndex]}
          </span>
        </h1>
        <br />
        <h2>Go ahead, add your important dates:</h2>
        <br />
        {verificationData ? (
          <p>Verification successful for: {verificationData.email}</p>
        ) : (
          <p>No verification data available</p>
        )}
        <ReactTable />
      </div>
    </main>
  );
}
