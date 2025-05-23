const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let VotingSystem;
  let votingSystem;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    VotingSystem = await ethers.getContractFactory("VotingSystem");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    votingSystem = await VotingSystem.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingSystem.owner()).to.equal(owner.address);
    });

    it("Should start with voting closed", async function () {
      expect(await votingSystem.votingOpen()).to.equal(false);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow owner to add candidates", async function () {
      await votingSystem.addCandidate("Candidate 1");
      const [id, name, votes] = await votingSystem.getCandidate(1);
      
      expect(id).to.equal(1);
      expect(name).to.equal("Candidate 1");
      expect(votes).to.equal(0);
    });

    it("Should not allow non-owners to add candidates", async function () {
      await expect(
        votingSystem.connect(addr1).addCandidate("Candidate 1")
      ).to.be.revertedWith("Only the owner can call this function");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await votingSystem.addCandidate("Candidate 1");
      await votingSystem.addCandidate("Candidate 2");
      await votingSystem.startVoting();
    });

    it("Should allow voters to vote once", async function () {
      await votingSystem.connect(addr1).vote(1);
      expect(await votingSystem.hasVoted(addr1.address)).to.equal(true);
      
      const [id, name, votes] = await votingSystem.getCandidate(1);
      expect(votes).to.equal(1);
    });

    it("Should not allow voting twice", async function () {
      await votingSystem.connect(addr1).vote(1);
      await expect(
        votingSystem.connect(addr1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting for invalid candidates", async function () {
      await expect(
        votingSystem.connect(addr1).vote(3)
      ).to.be.revertedWith("Invalid candidate ID");
    });
  });

  describe("Voting Control", function () {
    beforeEach(async function () {
      await votingSystem.addCandidate("Candidate 1");
    });

    it("Should not allow voting when voting is closed", async function () {
      await expect(
        votingSystem.connect(addr1).vote(1)
      ).to.be.revertedWith("Voting is not open");
    });

    it("Should allow owner to start and end voting", async function () {
      await votingSystem.startVoting();
      expect(await votingSystem.votingOpen()).to.equal(true);
      
      await votingSystem.endVoting();
      expect(await votingSystem.votingOpen()).to.equal(false);
    });
  });

  describe("Getting Winner", function () {
    beforeEach(async function () {
      await votingSystem.addCandidate("Candidate 1");
      await votingSystem.addCandidate("Candidate 2");
      await votingSystem.startVoting();
    });

    it("Should correctly determine the winner", async function () {
      await votingSystem.connect(addr1).vote(1);
      await votingSystem.connect(addr2).vote(1);
      await votingSystem.connect(addrs[0]).vote(2);
      
      await votingSystem.endVoting();
      
      const [id, name, votes] = await votingSystem.getWinner();
      expect(id).to.equal(1);
      expect(name).to.equal("Candidate 1");
      expect(votes).to.equal(2);
    });

    it("Should not allow getting the winner while voting is open", async function () {
      await expect(
        votingSystem.getWinner()
      ).to.be.revertedWith("Voting is still open");
    });
  });
});
