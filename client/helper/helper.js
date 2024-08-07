
import moment from "moment";
import web3 from "web3";
import _ from 'lodash';
import axios from 'axios';

export const weiToEther = (num) =>{
    return web3.utils.fromWei(num, 'ether')
}

export const etherToWei = (num) => {
  const weiBigNumber = web3.utils.toWei(num, 'ether');
  const wei = weiBigNumber.toString();
  return wei
}

const getEthToIdrExchangeRate = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr');
    return response.data.ethereum.idr;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};

// Fungsi untuk mengkonversi nilai ETH ke IDR
export const ethToIdrConverter = async (ethAmount) => {
  try {
    // Mendapatkan kurs tukar ETH ke IDR
    const exchangeRate = await getEthToIdrExchangeRate();

    // Menghitung nilai dalam IDR
    const idrAmount = ethAmount * exchangeRate;

    return idrAmount;
  } catch (error) {
    console.error('Error converting ETH to IDR:', error);
    throw error;
  }
};



export const unixToDate = (unixDate) =>{
  return moment(unixDate).format("DD/MM/YYYY");
}

export const state = ["Fundraising","Expired","Successful"];

export const projectDataFormatter = (data,contractAddress) =>{
  const formattedData = {
    address:contractAddress,
    creator:data?.projectStarter,
    contractBalance: data.balance?weiToEther(data.balance):0,
    title:data.title,
    description:data.desc,
    minContribution:weiToEther(data.minContribution),
    goalAmount:weiToEther(data.goalAmount),
    currentAmount:weiToEther(data.currentAmount),
    state:state[Number(data.currentState)],
    deadline:unixToDate(Number(data.projectDeadline)),
    progress:Math.round((Number(weiToEther(data.currentAmount))/Number(weiToEther(data.goalAmount)))*100)
  }
  return formattedData;
}


const formatProjectContributions = (contributions) =>{
  const formattedData = contributions.map(data=>{
    return {
      projectAddress:data.returnValues.projectAddress,
      contributor:data.returnValues.contributor,
      amount:Number(weiToEther(data.returnValues.contributedAmount))
    }
  })
  return formattedData;
}

export const groupContributionByProject = (contributions) => {
  const contributionList = formatProjectContributions(contributions);
  //const contributionGroupByProject = _.map(_.groupBy(contributionList, 'projectAddress'), (o,projectAddress,address) => { return {projectAddress:projectAddress, contributor: address,amount: _.sumBy(o,'amount') }})
  return contributionList;
}

const formatContribution = (contributions) =>{
  const formattedData = contributions.map(data=>{
    return {
      contributor:data.returnValues.contributor,
      amount:Number(weiToEther(data.returnValues.amount))
    }
  })
  return formattedData;
}

export const groupContributors = (contributions) => {
  const contributorList = formatContribution(contributions);
  const contributorGroup = _.map(_.groupBy(contributorList, 'contributor'), (o,address) => { return { contributor: address,amount: _.sumBy(o,'amount') }})
  return contributorGroup;
}


export const withdrawRequestDataFormatter = (data) =>{
  const { requestId, noOfVotes, amount, isCompleted, description, reciptent } = data;
  const status = isCompleted ? "Completed" : (noOfVotes === 5 && noOfVotes.noVotes > noOfVotes.yesVotes ? "Rejected" : "Pending");
  return{
     requestId:requestId,
     totalVote:noOfVotes,
     amount:weiToEther(amount),
     status:status,
     desc:description,
     reciptant:reciptent
    }
}

export const connectWithWallet = async (onSuccess) => {
  //connect web3 with http provider
  console.log("CONNECT WALLET")
  if (window.ethereum) {
   ethereum.request({method:"eth_requestAccounts"})
   .then(res=>{
    onSuccess()
   }).catch(error=>{
     alert(error.message)
   })
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const chainOrAccountChangedHandler = () => {
  // reload the page to avoid any errors with chain or account change.
  window.location.reload();
}
