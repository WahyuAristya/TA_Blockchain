// const hre = require("hardhat");

// async function main() {
//   // Deploy Crowdfunding Contract
//   const Project = await hre.ethers.getContractFactory("Project");
//   const project = await Project.deploy();

//   await project.deployed();

//   console.log("Project deployed to:", project.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const hre = require("hardhat");

async function main() {
  // Deploy Project Contract
  const Project = await hre.ethers.getContractFactory("Project");
  const project = await Project.deploy(
    '0x4aeE1d07F794Db63B3De35407365485D4fd79284',
    1,
    1643482800,
    10,
    'Deploy',
    'deploy contract'
  );

  await project.deployed();

  console.log("Project deployed to:", project.address);

  // Deploy Crowdfunding Contract
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy();

  await crowdfunding.deployed();

  console.log("Crowdfunding deployed to:", crowdfunding.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
