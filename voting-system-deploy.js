const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  
  // Deploy the contract
  console.log("Deploying VotingSystem contract...");
  const votingSystem = await VotingSystem.deploy();
  
  // Wait for deployment to finish
  await votingSystem.deployed();
  
  console.log(`VotingSystem deployed to: ${votingSystem.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
