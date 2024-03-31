require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");


module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./client/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545",
    },
    sepolia: {
      url: 'https://sepolia.infura.io/v3/9ac6be8f5c9749bda6ac74a57d8e9695',
      accounts: ['09b805feff89faf19450027dd508f143590b5bd2e1075ff68ccbad8a160c8810']
    }
  },
};