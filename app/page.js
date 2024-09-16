"use client"; // Add this line to specify that this is a Client Component

import styles from "./page.module.css";
import ReactTable from "../components/reactTable";
import { useState, useEffect } from "react";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedDynamicText, setDisplayedDynamicText] = useState("");

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

  // Typing effect for dynamic part of the sentence
  useEffect(() => {
    let charIndex = 0;
    const currentDynamicPart = dynamicParts[currentSentenceIndex];

    // Reset the displayed dynamic text
    setDisplayedDynamicText("");

    const typeInterval = setInterval(() => {
      if (charIndex < currentDynamicPart.length) {
        setDisplayedDynamicText((prev) => prev + currentDynamicPart[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval); // Stop typing when the sentence is fully typed out
      }
    }, 100); // Typing speed (100ms per character)

    return () => clearInterval(typeInterval); // Cleanup on sentence change or unmount
  }, [currentSentenceIndex]);

  // Rotate dynamic parts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex(
        (prevIndex) => (prevIndex + 1) % dynamicParts.length
      );
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [dynamicParts.length]);

  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.typingSentence}>
          {staticText}
          <span className={styles.dynamicText}>{displayedDynamicText}</span>
          <span className={styles.cursor}>|</span>
        </h1>
        <br />
        <h2>Go ahead, enter your important dates in the table:</h2>
        <br />
        <ReactTable />
      </div>
    </main>
  );
}
