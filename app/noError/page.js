"use client";

// debugging page to check if it redirects properly

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";
import { Suspense } from "react";

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "Default Message when no data";

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Yes! This went right!</h1>
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
