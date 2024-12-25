# VerifiableCredential

## Description
VerifiableCredential is a blockchain-based project designed to manage and verify credentials in a decentralized, secure, and tamper-proof manner. This project utilizes Ethereum smart contracts, Hardhat, and a Node.js backend to deploy and interact with the VerifiableCredential system. It includes a front-end application for user interactions and testing scripts for validating functionality.

---

## Features
- **Smart Contracts:** Secure credential issuance and verification.
- **Decentralized:** Built on Ethereum blockchain.
- **Node.js Backend:** Simplifies contract interaction.
- **Front-End Application:** Provides an easy-to-use interface for users.
- **Hardhat Integration:** For development, testing, and deployment of smart contracts.

---

## Project Structure

```plaintext
VerifiableCredential/
├── contracts/          # Solidity smart contracts
├── deploy/             # Deployment scripts
├── deployments/        # Deployment artifacts
├── frontend/           # Frontend application
├── ignition/modules/   # Modules for deployment automation
├── scripts/            # Scripts for interactions and tasks
├── test/               # Test cases for smart contracts
├── hardhat.config.js   # Hardhat configuration file
├── package.json        # Project dependencies
├── README.md           # Project documentation
```

---

## Prerequisites
To run this project, you need:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Hardhat** (installed locally)
- **Ethereum Wallet** (e.g., Metamask)
- **A local Ethereum node** (e.g., Hardhat Network)

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/syedkazim110/VerifiableCredential.git
   ```
2. Navigate to the project directory:
   ```bash
   cd VerifiableCredential
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage
### Start the Local Blockchain Node
Run the following command to start the Hardhat node:
```bash
npx hardhat node
```

### Deploy Contracts
In a new terminal, deploy the contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Run the Frontend
Navigate to the frontend directory and start the application:
```bash
cd frontend
npm start
```

---

## Testing
Run the tests to ensure everything is functioning as expected:
```bash
npx hardhat test
```

---

## Built With
- [Ethereum](https://ethereum.org/) - Blockchain Platform
- [Hardhat](https://hardhat.org/) - Ethereum Development Environment
- [Node.js](https://nodejs.org/) - Backend JavaScript Runtime
- [Solidity](https://soliditylang.org/) - Smart Contract Programming Language

---

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---
