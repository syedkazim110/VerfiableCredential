module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();  // Fetch the deployer's address
    const { deploy } = deployments;
  
    console.log("Deploying VerifiableCredentials contract...");
  
    // Deploy the DigitalIdentity contract (no constructor args)
    await deploy("VerifiableCredentials", {
      from: deployer,
      args: [], // No constructor args to pass
      log: true, // Log the deployment process
    });
  };
  
  module.exports.tags = ["VerifiableCredentials"];
  