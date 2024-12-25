import React, { useState } from "react";

export const ConnectWallet = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        alert("User rejected the connection request or error occurred.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={loading}>
        {loading
          ? "Connecting..."
          : account
          ? `Connected: ${account}`
          : "Connect Wallet"}
      </button>
    </div>
  );
};
