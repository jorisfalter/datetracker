"use client";

// error page - doesn't seem to work

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "An unknown error occurred";

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Oops! Something went wrong</h1>
      <p className={styles.errorMessage}>{errorMessage}</p>
      <Link href="/" className={styles.homeLink}>
        Go back to home page
      </Link>
    </div>
  );
}
