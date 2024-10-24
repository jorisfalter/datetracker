import React, { useState } from "react";
import styles from "../airtableAlternative.css"; // Import the CSS file for styling

const AirtableAlternative = () => {
  return (
    <section className={styles.infoSection}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Additional Information</h2>
        <p className={styles.description}>
          This section contains more details about how the application works, or
          any additional content that is relevant to your users. It could
          include instructions, links to external resources, or anything else
          you'd like to display after the main content.
        </p>

        <p className={styles.description}>
          You can also add images, videos, or other media below the fold to make
          the section more engaging for users who scroll down.
        </p>
      </div>
    </section>
  );
};

export default AirtableAlternative;
