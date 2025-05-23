# Voting System Smart Contract

This repository contains a Solidity smart contract for a decentralized voting system. The system allows for registration of candidates and enables users to cast votes for their preferred candidate. Each address can vote only once.

## Features

- Add candidates to the voting system (owner only)
- Start and end voting periods (owner only)
- Vote for candidates (each address can vote only once)
- View candidate details and vote counts
- Determine the winner after voting ends

## Contract Details

### VotingSystem.sol

The main contract that manages the voting process. It includes:

- A `Candidate` struct to store candidate information
- Functions to add candidates, start/end voting, and cast votes
- Modifiers to restrict certain functions to the contract owner
- Events to track when candidates are added and votes are cast

## Deployment

The contract was deployed to the Ethereum [NETWORK_NAME] network at address: `[CONTRACT_ADDRESS]`

### Deployment Process

1. Compiled the contract using Hardhat
2. Deployed using the deployment script (`deploy.js`)
3. Verified the contract on Etherscan

### Transaction Hash

Deployment Transaction: `[TRANSACTION_HASH]`

## Usage Instructions

### For Contract Owner

1. After deployment, add candidates using the `addCandidate` function
2. Start the voting period with the `startVoting` function
3. End the voting period with the `endVoting` function
4. Determine the winner with the `getWinner` function

### For Voters

1. Call the `vote` function with your preferred candidate's ID
2. Each address can only vote once

## Testing

The contract was tested using Hardhat's testing framework. Run tests with:

```
npx hardhat test
```

## License

This project is licensed under the MIT License - see the SPDX-License-Identifier in each file for details.
