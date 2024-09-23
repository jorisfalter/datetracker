// this script is to test the login.js functionality. Call it with node app/api/auth/testLogin.js;

import fetch from "node-fetch";

async function sendTestEmail() {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "jorisf1987@gmail.com" }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error sending test email:", error.message);
  }
}

sendTestEmail();
