import { BrowserProvider, JsonRpcSigner } from 'ethers';

class Web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
  }

  async connect() {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        this.provider = new BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();

        return {
          address: await this.signer.getAddress(),
          provider: this.provider
        };
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      }
    } else {
      throw new Error("No Ethereum wallet detected");
    }
  }

  async getAddress() {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    return await this.signer.getAddress();
  }

  getSigner() {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    return this.signer;
  }
}

export default new Web3Provider();