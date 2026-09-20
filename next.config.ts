import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.io"],
  // Transactions and admin now live inside the dashboard; keep old links (bookmarks, emails) working.
  async redirects() {
    return [
      { source: "/transactions", destination: "/dashboard/transactions", permanent: false },
      { source: "/transactions/:orderId", destination: "/dashboard/transactions/:orderId", permanent: false },
      { source: "/admin", destination: "/dashboard/admin", permanent: false },
    ];
  },
};

export default nextConfig;
