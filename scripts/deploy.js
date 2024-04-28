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
    '0xb0a55654c8Bc42e8b904A0c65c4b0e006c3dD326',
    0,
    1643482800,
    10,
    'DeployBaru',
    'deploy contract baru'
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
