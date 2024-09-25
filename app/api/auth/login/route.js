// app/api/auth/login/route.js

import { NextResponse } from "next/server.js";
import jwt from "jsonwebtoken";
import postmark from "postmark";

export async function POST(req) {
  const { email } = await req.json();
  console.log("email");
  console.log(email);

  // Generate a JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10000h",
  });

  // Send the JWT to the user's email using Postmark
  const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

  const mailOptions = {
    From: process.env.FROM_EMAIL_USER,
    To: email,
    Subject: "Your login link",
    // TextBody: `Click the following link to log in: ${process.env.BASE_URL}/api/auth/verify?token=${token}`,
    TextBody: `Click the following link to log in: ${process.env.BASE_URL}/?token=${token}`,
  };

  try {
    await client.sendEmail(mailOptions);
    return NextResponse.json({ message: "Login link sent to your email." });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send login link", error });
  }
}
