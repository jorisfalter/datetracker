"use client"; // Add this line to specify that this is a Client Component

import styles from "./page.module.css";
import ReactTable from "../components/reactTable";
import { useState, useEffect } from "react";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Static part of the sentence
  const staticText = "Never forget ";

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

  // Rotate dynamic parts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex(
        (prevIndex) => (prevIndex + 1) % dynamicParts.length
      );
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dynamicParts.length]);

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
        <h2>Go ahead, enter your important dates in the table:</h2>
        <br />
        <ReactTable />
      </div>
    </main>
  );
}
