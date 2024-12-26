"use client";
import React, { useState, useEffect } from "react";
import {
  issueCredential, 
  verifyCredential, 
  revokeCredential, 
  getCredentialsForSubject, 
  generateCredentialHash 
} from "../../utils/digitalIdentity";
import { ethers } from 'ethers';
import contractABI from '../../../artifacts/contracts/VerifiableCredentials.sol/VerifiableCredentials.json';


const Page = () => {
  const [subject, setSubject] = useState('');
  const [credentialDetails, setCredentialDetails] = useState('');
  const [expirationPeriod, setExpirationPeriod] = useState('3600');
  const [credentialHash, setCredentialHash] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check wallet connection on page load
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  // Generate the credential hash automatically
  useEffect(() => {
    if (subject && credentialDetails && account) {
      try {
        const generatedHash = generateCredentialHash(account, subject, credentialDetails);
        setCredentialHash(generatedHash);
      } catch (error) {
        console.error('Error generating credential hash:', error);
      }
    }
  }, [subject, credentialDetails, account]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet');
    }
  };
 
  const handleIssueCredential = async () => {
    setIsLoading(true);
    try {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract's address
  
      console.log("Starting credential issuance process...");
  
      // Validate inputs
      if (!subject || !ethers.isAddress(subject)) {
        console.log("Invalid subject address:", subject);
        alert("Invalid subject address");
        return;
      }
  
      if (!credentialDetails) {
        console.log("Credential details are empty");
        alert("Credential details cannot be empty");
        return;
      }
  
      const parsedExpirationPeriod = parseInt(expirationPeriod);
      if (isNaN(parsedExpirationPeriod) || parsedExpirationPeriod <= 0) {
        console.log("Invalid expiration period:", expirationPeriod);
        alert("Invalid expiration period");
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const issuer = await signer.getAddress();
      console.log("Issuer address:", issuer);
  
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
  
      // Send the transaction
      const tx = await contract.issueCredential(subject, credentialHash, parsedExpirationPeriod);
      console.log("Transaction sent, waiting for confirmation...");
  
      // Wait for the transaction to be mined (this is an async operation)
      const receipt = await tx.wait(); // Ensure this is a transaction object that has the wait method
      console.log("Transaction mined, receipt:", receipt);
  
      // Access the event from logs
      const event = receipt.logs.find(log => log.address.toLowerCase() === contractAddress.toLowerCase());
      if (event) {
        // Decode the event log
        const decoded = contract.interface.decodeEventLog('CredentialIssued', event.data, event.topics);
        const credentialId = decoded.credentialId;
        console.log("Credential ID:", credentialId);
  
        alert("Credential issued successfully!");
      } else {
        console.log("Event not found in logs");
        alert("Credential issuance failed, event not found");
      }
    } catch (error) {
      console.error("Error in credential issuance process:", error);
      alert(`Failed to issue credential: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  
  const handleVerifyCredential = async () => {
    try {
      // Ensure wallet is connected
      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet");
        return;
      }
  
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      const isValid = await verifyCredential(credentialId);
      setVerificationResult(isValid ? "Valid" : "Invalid");
    } catch (error) {
      console.error("Error verifying credential:", error);
      setVerificationResult("Verification failed");
    }
  };


    
  const handleRevokeCredential = async () => {
    try {
      // Validate credentialId
      if (!credentialId) {
        alert("Please provide a valid Credential ID.");
        return;
      }
      
      console.log("Initiating Credential Revocation:", credentialId);
  
      // Call the revocation function
      await revokeCredential(credentialId);
  
      // Success feedback
      alert("Credential revoked successfully!");
    } catch (error) {
      // Comprehensive error handling
      console.error("Revocation Handler Error:", {
        message: error.message,
        name: error.name,
        code: error.code
      });
  
      // User-friendly error messages
      if (error.message.includes("Only the issuer can revoke")) {
        alert("You are not authorized to revoke this credential. Only the original issuer can revoke.");
      } else {
        alert(`Failed to revoke credential: ${error.message}`);
      }
    }
  };
  
  
  
  

  const handleGetCredentialsForSubject = async () => {
    try {
      const credentials = await getCredentialsForSubject(subject);
      console.log("Credentials:", credentials);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  return (
    <div>
  <style>
    {`
      div {
        font-family: Arial, sans-serif;
        margin: 0 auto;
        max-width: 600px;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
      }
      input {
        display: block;
        width: calc(100% - 20px);
        margin: 10px auto;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      button {
        display: block;
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        font-size: 1rem;
        color: white;
        background: #4CAF50;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover {
        background: #45a049;
      }
      p {
        margin: 10px 0;
        color: #555;
      }
      .section {
        margin-bottom: 20px;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `}
  </style>
  <h2>Issue, Verify, and Revoke Credentials</h2>
  
  {/* Subject and Credential Details Form */}
  <div className="section">
    <input
      type="text"
      placeholder="Subject Address"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />
    <input
      type="text"
      placeholder="Credential Details"
      value={credentialDetails}
      onChange={(e) => setCredentialDetails(e.target.value)}
    />
    <input
      type="number"
      placeholder="Expiration Period (seconds)"
      value={expirationPeriod}
      onChange={(e) => setExpirationPeriod(e.target.value)}
    />
    <p>Generated Credential Hash: {credentialHash}</p>
    <button onClick={handleIssueCredential}>Issue Credential</button>
    
  </div>
  {/* Verify Credential */}
  <div className="section">
    <input
      type="text"
      placeholder="Credential ID"
      value={credentialId}
      onChange={(e) => setCredentialId(e.target.value)}
    />
    <button onClick={handleVerifyCredential}>Verify Credential</button>
    <p>Verification Result: {verificationResult}</p>
  </div>
   
  {/* Revoke Credential */}
  <div className="section">
    <button onClick={handleRevokeCredential}>Revoke Credential</button>
  </div>

  {/* Get Credentials for Subject */}
  <div className="section">
    <button onClick={handleGetCredentialsForSubject}>
      Get Credentials for Subject
    </button>
  </div>

  {/* Wallet Connection Status */}
  <div className="section">
    {isConnected ? (
      <p>Wallet Connected: {account}</p>
    ) : (
      <p>Please connect your wallet.</p>
    )}
  </div>
</div>

  );
};

export default Page;
