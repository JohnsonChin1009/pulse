"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`/api/get-cookie`);
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else {
        setToken("No token found");
      }
    };
    fetchToken();
  }, []);

  return (
    <div>
      <p>Token: {token}</p>
    </div>
  );
}

