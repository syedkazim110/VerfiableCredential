import { ethers } from 'ethers';
import contractABI from '../../artifacts/contracts/VerifiableCredentials.sol/VerifiableCredentials.json';

// The contract address deployed on your Hardhat node
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Initialize the contract instance
let contract;
let signer;

// Connect to the smart contract
export const connectContract = async (useSigner = false) => {
  try {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Hardhat node URL
    if (useSigner) {
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
    } else {
      contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
    }
  } catch (error) {
    console.error("Failed to connect to contract", error);
  }
};


// Generate the credential hash using AbiCoder and keccak256
export function generateCredentialHash(issuer, subject, credentialDetails) {
  

  try {
    if (!ethers.isAddress(issuer)) {
      throw new Error("Invalid issuer address");
    }
    if (!ethers.isAddress(subject)) {
      throw new Error("Invalid subject address");
    }
    // Create the AbiCoder instance
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    // Encode the parameters to match the contract structure
    const encodedData = abiCoder.encode(
      ["address", "address", "string"],  // The types of the parameters
      [issuer, subject, credentialDetails] // The values to encode
    );

    // Generate the keccak256 hash of the encoded data
    const hash = ethers.keccak256(encodedData);

    return hash;
  } catch (error) {
    console.error("Error generating credential hash", error);
  }
}

// Issue a new credential
// Issue a new credential

export const issueCredential = async (issuer, subject, credentialDetails, expirationPeriod) => {
  try {
    // Ensure Ethereum provider exists
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    // Convert chainId to number and compare
    const currentChainId = Number(network.chainId);
    const targetChainId = 31337; // Hardhat local network

    console.log(`Current Network ChainId: ${currentChainId}`);
    console.log(`Target Network ChainId: ${targetChainId}`);

    // Explicit network check with more detailed error
    if (currentChainId !== targetChainId) {
      throw new Error(`Incorrect network. Please switch to Hardhat local network (ChainId: ${targetChainId})`);
    }

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    // Verify signer matches issuer
    if (signerAddress.toLowerCase() !== issuer.toLowerCase()) {
      throw new Error(`Signer address (${signerAddress}) does not match issuer (${issuer})`);
    }

    const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

    const credentialHash = generateCredentialHash(issuer, subject, credentialDetails);

    try {
      // Issue the credential by calling the smart contract function
      const tx = await contract.issueCredential(subject, credentialHash, expirationPeriod);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction succeeded", receipt);
      return receipt;
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error.data) {
        console.log("Revert reason:", ethers.toUtf8String(error.data));
      }
      throw error;
    }
  } catch (error) {
    console.error("Error issuing credential:", error.message);
    console.error("Full error details:", error);
    throw error;
  }
};

// Verify a credential
export const verifyCredential = async (credentialId) => {
  try {
    // Trim any leading or trailing whitespace
    credentialId = credentialId.trim();

    // Ensure Ethereum provider exists
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Ensure you're on the correct network
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== 31337) {
      throw new Error(`Incorrect network. Please switch to Hardhat local network (ChainId: 31337)`);
    }

    // Get the signer (optional, but recommended)
    const signer = await provider.getSigner();

    // Create contract instance
    const contract = new ethers.Contract(
      contractAddress,  // Your deployed contract address
      contractABI.abi,  // Your contract ABI
      signer  // Use signer instead of provider
    );

    // Call the verify method on the contract
    const isValid = await contract.verifyCredential(credentialId);

    return isValid;
  } catch (error) {
    console.error("Error verifying credential:", error.message);
    throw error;
  }
};



export async function revokeCredential(credentialId) {
  if (typeof window.ethereum !== "undefined") {
      try {
          // Initialize provider and signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // Define the contract using the ABI and contract address
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Use your contract's address here
          const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

          // Call the revokeCredential function
          const transaction = await contract.revokeCredential(credentialId);

          // Wait for the transaction to be mined
          await transaction.wait();

          console.log(`Credential ${credentialId} successfully revoked!`);
          return true; // Indicate success
      } catch (error) {
          console.error("Error revoking credential:", error);
          return false; // Indicate failure
      }
  } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
      return false;
  }
}










// Get credentials for a subject
export const getCredentialsForSubject = async (subject) => {
  try {
    // Connect with a provider for read-only operations
    await connectContract(false);
    
    if (!ethers.isAddress(subject)) {
      throw new Error("Invalid subject address");
    }

    // Call the contract method
    const credentials = await contract.getCredentialsForSubject(subject);
    return credentials;
  } catch (error) {
    console.error("Error fetching credentials for subject", error);
    throw error;
  }
};



// Get credentials by issuer
export const getCredentialsByIssuer = async (issuer) => {
  try {
    await connectContract();
    const credentials = await contract.getCredentialsByIssuer(issuer);
    return credentials;
  } catch (error) {
    console.error("Error fetching credentials by issuer", error);
  }
};
