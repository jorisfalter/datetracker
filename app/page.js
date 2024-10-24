"use client"; // Mark this as a client component

import styles from "./page.module.css";
import ReactTable from "../components/reactTable";
import SignIn from "../components/signIn";
import AirtableAlternative from "../components/airtableAlternative";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HomeContent() {
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

  // Rotate dynamic parts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex(
        (prevIndex) => (prevIndex + 1) % dynamicParts.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [dynamicParts.length]);

  // Handle verification data from URL
  useEffect(() => {
    const encodedData = searchParams.get("verificationData");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setVerificationData(decodedData);
        // console.log("Decoded verification data:", decodedData);
      } catch (error) {
        // console.error("Error decoding verification data:", error);
        setVerificationData(null);
      }
    } else {
      setVerificationData(null);
    }
  }, [searchParams]);

  const isLoggedIn = verificationData !== null; // Check if user is logged in

  return (
    <main className={styles.main}>
      <div>
        {/* Your existing code goes here */}
        {/* {verificationData && verificationData.data ? (
          <div>
            <p>Verification successful for:</p>
            <ul>
              {verificationData.data.map((entry, index) => (
                <li key={index}>
                  {entry.email} (ID: {entry.id})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No verification data available</p>
        )} */}
        <div className={styles.rotatingH1}>
          <h1 className={styles.wordRotateSentence}>
            {staticText}
            <span className={styles.wordRotateWrapper}>
              {dynamicParts.map((part, index) => (
                <span
                  key={index}
                  className={`${styles.wordRotateItem} ${
                    index === currentSentenceIndex ? styles.active : ""
                  }`}
                >
                  {part}
                </span>
              ))}
            </span>
          </h1>
        </div>
        <br />
        <h2>Go ahead, enter your important dates:</h2>
        <br />
        {!isLoggedIn && <SignIn />}{" "}
        <ReactTable verificationData={verificationData} />
      </div>
      <div>
        <AirtableAlternative />
      </div>
    </main>
  );
}

// Wrapper for Suspense
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
