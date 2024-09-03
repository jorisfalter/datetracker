"use client"; // Add this line to specify that this is a Client Component

import Image from "next/image";
import styles from "./page.module.css";
import EditableTable from "../components/EditableTable";
import { useState } from "react";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");

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

  return (
    <main className={styles.main}>
      <div>
        <h1>SQLite with Next.js</h1>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={addEntry}>Add Entry</button>
        <button onClick={fetchEntries}>Load Entries</button>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>{entry.content}</li>
          ))}
        </ul>
      </div>
      <div style={{ padding: "20px" }}>
        <h1>Editable Table</h1>
        <EditableTable />
      </div>
      <div className={styles.description}>
        <p>
          BlaBlaBla! Get started by editing&nbsp;
          <code className={styles.code}>app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
