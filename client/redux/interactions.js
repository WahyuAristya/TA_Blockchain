import Web3 from "web3";
import * as actions from "./actions";
import { useSelector } from 'react-redux';
import CrowdFunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'
import Project from '../artifacts/contracts/Project.sol/Project.json'
import { groupContributionByProject, groupContributors, projectDataFormatter, state, withdrawRequestDataFormatter} from "../helper/helper";
import { useAddress } from '@thirdweb-dev/react';


const crowdFundingContractAddress = "0xd073Ee90134fa49217D8e7113F7F9CDb2635dde4"; //deploy testnet sepolia thirdweb

// const crowdFundingContractAddress = "0xb63923cB06C1320481E5c97550486F8a89660E2b";

//Load web3
export const loadWeb3 = async (dispatch) => {
  const web3 = new Web3(Web3.givenProvider || "https://sepolia.infura.io/v3/8d05e94c5cec4a68a92798ad1852d1fe");
  // const web3 = new Web3(Web3.givenProvider || "https://sepolia.infura.io/");
  // const web3 = new Web3(Web3.givenProvider || "https://localhost:7545");
  dispatch(actions.web3Loaded(web3));
  return web3;
};


// Load connected wallet
export const loadAccount = async (web3, dispatch) => {
  // const account = await web3.eth.getAccounts();
  // console.log(await web3.eth.getAccounts());
  // const network = await web3.eth.net.getId();
  const account = localStorage.getItem("addressBaru")

  dispatch(actions.walletAddressLoaded(account));
  localStorage.setItem("ADDRESS",account)
  // const address = useAddress();
  // console.log(address)
  return account;
  };



//Connect with crowd funding contract
export const loadCrowdFundingContract = async(web3,dispatch) =>{
  const crowdFunding = new web3.eth.Contract(CrowdFunding.abi,crowdFundingContractAddress);
  dispatch(actions.crowdFundingContractLoaded(crowdFunding));
  return crowdFunding;
}


// Start fund raising project
export const startFundRaising = async(web3,CrowdFundingContract,data,onSuccess,onError,dispatch) =>{
  const {minimumContribution,deadline,targetContribution,projectTitle,projectDesc,account} = data;


  await CrowdFundingContract.methods.createProject(minimumContribution,deadline,targetContribution,projectTitle,projectDesc).send({from:account})
  .on('receipt', function(receipt){

    const projectsReceipt = receipt.events.ProjectStarted.returnValues;
    const contractAddress = projectsReceipt.projectContractAddress;

    const formattedProjectData = projectDataFormatter(projectsReceipt,contractAddress)
    var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);

    dispatch(actions.newProjectContractsLoaded(projectConnector));
    dispatch(actions.newProjectsLoaded(formattedProjectData));

    onSuccess()
  })
  .on('error', function(error){
    onError(error.message)
  })
}

export const getAllFunding = async (CrowdFundingContract, web3, dispatch, props) => {
  const fundingProjectList = await CrowdFundingContract.methods.returnAllProjects().call();
  const projectContracts = [];
  const projects = [];

  await Promise.all(
    fundingProjectList.map(async (data) => {
      var projectConnector = new web3.eth.Contract(Project.abi, data);
      const details = await projectConnector.methods.getProjectDetails().call();
      projectContracts.push(projectConnector);
      const formattedProjectData = projectDataFormatter(details, data);
      const splitDeadline = formattedProjectData.deadline.split('/')
      const deadlinePassed = new Date(splitDeadline[2],splitDeadline[1]-1,splitDeadline[0], 23, 59) < new Date();

      if (deadlinePassed && (formattedProjectData.state !== "Successful")) {
        formattedProjectData.state = 'Expired'
      }
      projects.push(formattedProjectData);
    })
  );

  dispatch(actions.projectContractsLoaded(projectContracts));
  dispatch(actions.projectsLoaded(projects));
};



// Contribute in fund raising project
export const contribute = async(crowdFundingContract,data,dispatch,onSuccess,onError) =>{
  const {contractAddress,amount,account} = data;
  console.log(account)
  await crowdFundingContract.methods.contribute(contractAddress).send({from:account,value:amount})
  .on('receipt', function(receipt){
    dispatch(actions.amountContributor({projectId:contractAddress,amount:amount}))
    onSuccess()
  })
  .on('error', function(error){
    onError(error.message)
  })
}

// Get all contributors by contract address
export const getContributors = async (web3,contractAddress,onSuccess,onError) =>{
  try {
    var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
    const getContributions = await projectConnector.getPastEvents("FundingReceived",{
      fromBlock: 0,
      toBlock: 'latest'
    })
    onSuccess(groupContributors(getContributions))
  } catch (error) {
    onError(error)
  }
}

// Request for withdraw amount
export const withdrawRequest = async (web3,contractAddress,data,onSuccess,onError) =>{
  const {description,amount,recipient,account} = data;
    var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
    await projectConnector.methods.withdrawRequest(description,amount,recipient).send({from:account})
    .on('receipt', function(receipt){
      const withdrawReqReceipt = receipt.events.WithdrawRequestCreated.returnValues;;
      const formattedReqData = withdrawRequestDataFormatter(withdrawReqReceipt,withdrawReqReceipt.requestId)
      onSuccess(formattedReqData)
    })
    .on('error', function(error){
      onError(error.message)
    })
}

// Get all withdraw request
export const getAllWithdrawRequest = async (web3,contractAddress,onLoadRequest) =>{
  var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
  var withdrawRequestCount = await projectConnector.methods.numOfWithdrawRequests().call();
  var withdrawRequests = [];

  if(withdrawRequestCount <= 0){
    onLoadRequest(withdrawRequests)
    return
  }

  for(var i=1;i<=withdrawRequestCount;i++){
    const req = await projectConnector.methods.withdrawRequests(i-1).call();
    withdrawRequests.push(withdrawRequestDataFormatter({...req,requestId:i-1}));
  }
  onLoadRequest(withdrawRequests)
}

// Vote for withdraw request
export const trusteesVoteWithdrawRequest = async (web3, data, onSuccess, onError) => {
  const { contractAddress, reqId, vote, account } = data;
  var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
  
  // Convert vote to integer: 0 for No, 1 for Yes
  const voteValue = vote === "No" ? 0 : 1;

  try {
    await projectConnector.methods.trusteesVoteWithdrawRequest(reqId, voteValue).send({ from: account });
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
};

export const requestRefund = async (web3, data, onSuccess, onError) => {
  const { contractAddress, account } = data;
  var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
  
  try {
    await projectConnector.methods.requestRefund().send({ from: account });
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
};


// Withdraw requested amount
export const withdrawAmount = async (web3,dispatch,data,onSuccess,onError) =>{
  const {contractAddress,reqId,account,amount} = data;
  var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
  await projectConnector.methods.withdrawFunding(reqId).send({from:account})
  .on('receipt', function(receipt){
    console.log(receipt)
    dispatch(actions.withdrawContractBalance({
      contractAddress:contractAddress,
      withdrawAmount:amount
    }))
    onSuccess()
  })
  .on('error', function(error){
    onError(error.message)
  })
}

//Get my contributions
export const getMyContributionList = async(crowdFundingContract,account) =>{
  const getContributions = await crowdFundingContract.getPastEvents("ContributionReceived",{
    filter: { contributor: account },
    fromBlock: 0,
    toBlock: 'latest'
  })
  return groupContributionByProject(getContributions);
}


// Function to retrieve trustee addresses
export const getTrustees = async (web3, contractAddress) => {
  try {
    const projectContract = new web3.eth.Contract(Project.abi, contractAddress);
    const trustees = await projectContract.methods.getTrustees().call();
    return trustees;
  } catch (error) {
    console.error('Error fetching trustees:', error);
    throw error;
  }
};