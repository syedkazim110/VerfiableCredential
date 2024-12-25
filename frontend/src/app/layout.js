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
        </head>
        <body>
          <header>
            <h1>Verifiable Credentials</h1>
            {!isConnected && <ConnectWallet />}
          </header>
          <main>{children}</main>
        </body>
      </html>
    </>
  );
}
