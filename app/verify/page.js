"use client"; // This ensures the component is treated as a Client Component

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();
      console.log("data");
      console.log(data);

      if (data.error) {
        // Handle error, redirect to error page
        router.push(`/error?message=${data.error}`);
      } else {
        // Handle successful verification, maybe redirect to dashboard
        router.push("/");
        // for debugging:
        // const encodedData = encodeURIComponent(JSON.stringify(data));
        // router.push(`/noError?message=${encodedData}`);
      }
    };

    if (token) {
      verifyToken();
    } else {
      router.push("/error?message=Missing token");
    }
  }, [token, router]);

  return <div>Verifying your token...</div>;
};

export default VerifyPage;
