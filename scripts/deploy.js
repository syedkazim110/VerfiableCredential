const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    const Upload = await hre.ethers.getContractFactory("DigitalIdentity");

    // Deploy the contract
    const upload = await Upload.deploy();

    // Wait for the deployment transaction to be mined
    const tx = await upload.deployTransaction.wait();
    
    console.log("DigitalIdentity deployed to:", upload.address);
    console.log("Transaction mined in block:", tx.blockNumber);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();
