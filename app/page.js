"use client"; // Add this line to specify that this is a Client Component

import Image from "next/image";
import styles from "./page.module.css";
import EditableTable from "../components/EditableTable";
import ReactTable from "../components/reactTable";
import { useState, useEffect } from "react";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = [
    "Never forget Your Wedding Anniversary",
    "Never forget Your Best Friend's Birthday",
    "Never forget Any Emotional Important Date",
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

  // Rotate sentences every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentenceIndex(
        (prevIndex) => (prevIndex + 1) % sentences.length
      );
    }, 3000); // Change sentence every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [sentences.length]);

  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.rotatingSentence}>
          {sentences[currentSentenceIndex]}
        </h1>
        <br />
        <h2>Go ahead, enter your important dates in the table:</h2>
        <br />
        <ReactTable />
      </div>
    </main>
  );
}
