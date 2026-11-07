"use client";

import { useEffect } from "react";

/** Records `?ref=KODE` from any landing URL; the server keeps it in a 30-day cookie. */
export default function RefCapture() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (!code) return;
    fetch("/api/referral/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => {});
  }, []);

  return null;
}
