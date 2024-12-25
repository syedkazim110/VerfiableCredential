require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
// require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 200000, // Optional: Increase timeout duration
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // Use the first account (index 0) as the deployer
    },
  },
};
