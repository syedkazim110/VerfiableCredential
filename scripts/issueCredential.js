async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const contract = await ethers.getContractAt("VerifiableCredentials", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
    const subject = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Replace with the subject address
    const credentialHash = "0xd2c48081b42dea806e160430417317f36df67859e0c0e1bb4d27a726eae7b0b5"; // Replace with the credential hash
    const expirationPeriod = 3600; // Example expiration period in seconds
  
    const tx = await contract.issueCredential(subject, credentialHash, expirationPeriod);
    const receipt = await tx.wait();
    console.log(receipt);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  