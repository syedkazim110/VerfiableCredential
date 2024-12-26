"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import { ConnectWallet } from "../../components/ConnectWallet";

export default function RootLayout({ children }) {
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet is connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
        }
      }).catch((error) => {
        console.error("Error checking wallet connection:", error);
      });
    }
  }, []);

  return (
    <>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verifiable Credentials</title>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
          }
          header {
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            margin: 0;
            font-size: 2rem;
          }
          main {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .connect-wallet {
            margin-top: 10px;
          }
        `}
      </style>
    </head>
    <body>
      <header>
        <h1>Verifiable Credentials</h1>
        {!isConnected && <div className="connect-wallet"><ConnectWallet /></div>}
      </header>
      <main>{children}</main>
    </body>
  </html>
</>

  );
}
