"use client"; // Mark this as a client component

// error page

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";
import { Suspense } from "react";

function ErrorPageContent() {
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

export default function ErrorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  );
}
