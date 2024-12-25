// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LockModule", (m) => {
  // Deploying the Lock contract (which is the same as DigitalIdentity contract)
  const lock = m.contract("Lock", [], {
    // You can add constructor parameters here if needed
  });

  return { lock };  // Return the deployed contract instance
});
