import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as actions from "../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import { contribute, createWithdrawRequest, UpdateProjectState } from '../redux/interactions';
import { etherToWei, ethToIdrConverter } from '../helper/helper';
import { toastSuccess, toastError } from '../helper/toastMessage';

const colorMaker = (state) => {
  if (state === 'Fundraising') {
    return 'bg-cyan-500';
  } else if (state === 'Expired') {
    return 'bg-red-500';
  } else {
    return 'bg-emerald-500';
  }
};

const FundRiserCard = ({ props, pushWithdrawRequests }) => {
  const [btnLoader, setBtnLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [goalAmountIdrMap, setGoalAmountIdrMap] = useState({});
  const [contractBalanceIdrMap, setContractBalanceIdrMap] = useState({});
  const dispatch = useDispatch();
  const crowdFundingContract = useSelector((state) => state.fundingReducer.contract);
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const [withdrawRequested, setWithdrawRequested] = useState(false);
  const [creationTimeMap, setCreationTimeMap] = useState({});
  const [latestBlockTimestamp, setLatestBlockTimestamp] = useState(null);


  // const contributeAmount = async (projectId, minContribution) => {
  //   if (amount < minContribution) {
  //     toastError(`Minimum contribution amount is ${minContribution}`);
  //     return;
  //   }
  
  //   setBtnLoader(projectId);
  //   const contributionAmount = etherToWei(amount);
  
  //   try {
  //     const block = await web3.eth.getBlock('latest');
  //     const currentTime = block.timestamp;
  
  //     const data = {
  //       contractAddress: projectId,
  //       amount: contributionAmount,
  //       account: account,
  //       timestamp: props.deadline, // Adding block timestamp here
  //     };
  //     // console.log(data)
  
  //     const onSuccess = () => {
  //       setBtnLoader(false);
  //       setAmount(0);
  //       toastSuccess(`Successfully contributed ${amount} ETH`);
  //     };
  
  //     const onError = (message) => {
  //       setBtnLoader(false);
  //       toastError(message);
        
  //     };

  //     // const splittedDate = props.deadline.split("/")
  //     // const deadlinePassed = new Date(splittedDate[2],splittedDate[1]-1,splittedDate[0], 23, 59) < new Date();
      
  //     // if (!deadlinePassed) {
  //     //   dispatch(actions.updateProjectState({ projectId, state: 'Expired' } ));
  //     //   props.state = 'Expired';
  //     //   onError("Deadline has been passed")
  //     // } else {
  //     //   contribute(crowdFundingContract,data,dispatch,() => {
  //     //     onSuccess();
  //     //     const deadlinePassed = new Date(props.deadline * 1000) < new Date();
  //     //     if (deadlinePassed) {
  //     //       dispatch({ UpdateProjectState, payload: { projectId, state: 'Expired' } });
  //     //     }
  //     //   },
  //     //   onError
  //     // );
  //     // }
  //   } catch (error) {
  //     console.error('Error getting block timestamp:', error);
  //     toastError('Error getting block timestamp');
  //     setBtnLoader(false);
  //   }
  // };

  const contributeAmount = (projectId,minContribution) =>{

    if(amount < minContribution){
      toastError(`Minimum contribution amount is ${minContribution}`);
      return;
    }

    setBtnLoader(projectId)
    const contributionAmount = etherToWei(amount);

    const data = {
      contractAddress:projectId,
      amount:contributionAmount,
      account:account
    }
    const onSuccess = () =>{
      setBtnLoader(false)
      setAmount(0)
      toastSuccess(`Successfully contributed ${amount} ETH`)
    }
    const onError = (message) =>{
      setBtnLoader(false)
      toastError(message)
    }
    contribute(crowdFundingContract,data,dispatch,onSuccess,onError)
  }

  // Fungsi untuk mendapatkan waktu block terbaru
const getLatestBlockTimestamp = async () => {
  try {
    // Mendapatkan block terbaru
    const block = await web3.eth.getBlock('latest');
    // Mengembalikan nilai timestamp block terbaru
    return block.timestamp;
  } catch (error) {
    console.error('Error getting latest block timestamp:', error);
    return null;
  }
};
  

useEffect(() => {
  const fetchBlockTimestamp = async () => {
    try {
      const timestamp = await getLatestBlockTimestamp();
      if (timestamp) {
        setLatestBlockTimestamp(timestamp);
      } else {
        console.error('Failed to get block timestamp.');
      }
    } catch (error) {
      console.error('Error fetching block timestamp:', error);
    }
  };

  fetchBlockTimestamp();
}, []);


useEffect(() => {
  const storedCreationTime = localStorage.getItem(`creationTime_${props.address}`);
  if (!storedCreationTime && latestBlockTimestamp && props.address) {
    const currentTime = new Date(latestBlockTimestamp * 1000).toLocaleString();
    setCreationTimeMap((prevMap) => ({
      ...prevMap,
      [props.address]: currentTime,
    }));
    localStorage.setItem(`creationTime_${props.address}`, currentTime);
  } else if (storedCreationTime) {
    setCreationTimeMap((prevMap) => ({
      ...prevMap,
      [props.address]: storedCreationTime,
    }));
  }
}, [latestBlockTimestamp, props.address]);

useEffect(() => {
  const fetchLatestBlockTimestamp = async () => {
    try {
      const timestamp = await getLatestBlockTimestamp();
      if (timestamp) {
        setLatestBlockTimestamp(timestamp);
      } else {
        console.error('Failed to get latest block timestamp.');
      }
    } catch (error) {
      console.error('Error fetching latest block timestamp:', error);
    }
  };

  
  fetchLatestBlockTimestamp(); // Pertama kali, ambil timestamp

  // Set interval untuk memperbarui timestamp setiap 10 detik (misalnya)
  const interval = setInterval(() => {
    fetchLatestBlockTimestamp();
  }, 10000); // 10000 ms = 10 detik

  // Membersihkan interval saat komponen dilepas
  return () => clearInterval(interval);
}, []);




  useEffect(() => {
    const convertGoalAmountToIdr = async () => {
      try {
        const goalAmountEth = parseFloat(props.goalAmount);
        const goalAmountIdr = await ethToIdrConverter(goalAmountEth);
        setGoalAmountIdrMap((prevMap) => ({
          ...prevMap,
          [props.address]: goalAmountIdr,
        }));
      } catch (error) {
        console.error('Error converting goal amount to IDR:', error);
      }
    };
    convertGoalAmountToIdr();
  }, [props.goalAmount, props.address]);


  useEffect(() => {
    const convertContractBalanceToIdr = async () => {
      try {
        const contractBalance = parseFloat(props.contractBalance);
        const contractBalanceIdr = await ethToIdrConverter(contractBalance);
        setContractBalanceIdrMap((prevMap) => ({
          ...prevMap,
          [props.address]: contractBalanceIdr,
        }));
      } catch (error) {
        console.error('Error converting balance to IDR:', error);
      }
    };
    convertContractBalanceToIdr();
  }, [props.contractBalance, props.address]);




  const requestForWithdraw = (projectId) => {
    // if (props.state === 'Expired') {
    //   toastError('Deadline has passed');
    //   return;
    // }
    
    setBtnLoader(projectId);
    const contributionAmount = etherToWei(props.contractBalance);
    

    const data = {
      description: `${props.contractBalance} ETH requested for withdraw`,
      amount: contributionAmount,
      recipient: account,
      account: account
    };

    const onSuccess = (data) => {
      setBtnLoader(false);
      setAmount(0);
      if (pushWithdrawRequests) {
        pushWithdrawRequests(data);
      }
      toastSuccess(`Successfully requested for withdraw ${props.contractBalance} ETH`);
      setWithdrawRequested(true);
      localStorage.setItem(`withdrawn_${projectId}`, 'true');
    };

    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };

    createWithdrawRequest(web3, projectId, data, onSuccess, onError);
  };

  useEffect(() => {
    const hasWithdrawn = localStorage.getItem(`withdrawn_${props.address}`);
    setWithdrawRequested(hasWithdrawn === 'true');
  }, [props.address]);

  return (
    <div className="card relative overflow-hidden my-4">
      <div className={`ribbon ${colorMaker(props.state)}`}>{props.state}</div>
      <Link href={`/project-details/${props.address}`}>
        <h1 className="font-sans text-xl text-gray font-semibold hover:text-sky-500 hover:cursor-pointer">{props.title}</h1>
      </Link>
      <p className="text-md font-bold font-sans text-gray">Creation Time</p>
      <p className="text-sm font-bold font-sans text-gray-600 ">{creationTimeMap[props.address]}</p>
<div className="font-sans text-md font-bold text-gray">Latest Block Timestamp</div>
<div className="font-sans text-sm font-bold text-gray-600">{latestBlockTimestamp ? new Date(latestBlockTimestamp * 1000).toLocaleString() : 'Loading...'}</div>
      <p className="font-sans text-sm text-stone-800 tracking-tight">{props.description}</p>
      <div className="flex flex-col lg:flex-row">
        <div className="inner-card my-6 w-full lg:w-3/6">
          <p className="text-md font-bold font-sans text-gray">Targeted contribution</p>
          <p className="text-sm font-bold font-sans text-gray-600 ">{props.goalAmount} ETH </p>
          <p className="text-md font-bold font-sans text-gray">Targeted contribution in IDR</p>
        {goalAmountIdrMap[props.address] !== undefined && goalAmountIdrMap[props.address] !== null ? (
          <p className="text-sm font-bold font-sans text-gray-600 ">Rp.{goalAmountIdrMap[props.address].toLocaleString()} </p>
        ) : (
          <p className="text-sm font-bold font-sans text-gray-600 ">Loading...</p>
        )}
          <p className="text-md font-bold font-sans text-gray">Deadline</p>
          <p className="text-sm font-bold font-sans text-gray-600 ">{props.deadline}</p>
          <p className="text-md font-bold font-sans text-gray">Creator's Wallet Address</p>
          <p className="text-sm font-bold font-sans text-gray-600">{props.creator}</p>
        </div>
        <div className="inner-card my-6 w-full lg:w-3/5">
          {props.state !== 'Successful' && props.state !== 'Expired' ? (
            <>
              <label className="text-sm text-gray-700 font-semibold">Contribution amount :</label>
              <div className="flex flex-row">
                <input type="number" placeholder="Type here" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={btnLoader === props.address} className="input rounded-l-md" />
                <button className="button" onClick={() => contributeAmount(props.address, props.minContribution)} disabled={btnLoader === props.address}>
                  {btnLoader === props.address ? 'Loading...' : 'Contribute'}
                </button>
              </div>
              <p className="text-sm text-red-600"> <span className="font-bold">NOTE : </span> Minimum contribution is {props.minContribution} ETH </p>
              <p className="text-md font-bold font-sans text-gray">Contract balance</p>
              <p className="text-sm font-bold font-sans text-gray-600 ">{props.contractBalance} ETH </p>
              <p className="text-md font-bold font-sans text-gray">Contract Balance in IDR</p>
        {contractBalanceIdrMap[props.address] !== undefined && contractBalanceIdrMap[props.address] !== null ? (
          <p className="text-sm font-bold font-sans text-gray-600 ">Rp.{contractBalanceIdrMap[props.address].toLocaleString()} </p>
        ) : (
          <p className="text-sm font-bold font-sans text-gray-600 ">Loading...</p>
        )}
            </>
          ) : (
            <>
              <p className="text-md font-bold font-sans text-gray">Contract balance</p>
              <p className="text-sm font-bold font-sans text-gray-600 ">{props.contractBalance} ETH </p>
                            <p className="text-md font-bold font-sans text-gray">Contract Balance in IDR</p>
        {contractBalanceIdrMap[props.address] !== undefined && contractBalanceIdrMap[props.address] !== null ? (
          <p className="text-sm font-bold font-sans text-gray-600 ">Rp.{contractBalanceIdrMap[props.address].toLocaleString()} </p>
        ) : (
          <p className="text-sm font-bold font-sans text-gray-600 ">Loading...</p>
        )}
              {props.creator === account && !withdrawRequested ? (
                <>
                  <label className="text-sm text-gray-700 font-semibold">Withdraw request :</label>
                  <div className="flex flex-row">
                    <button className="withdraw-button" onClick={() => requestForWithdraw(props.address)} disabled={btnLoader === props.address}>
                      {btnLoader === props.address ? 'Loading...' : 'Withdraw'}
                    </button>
                  </div>
                  </>
              ) : (
                ''
              )}
            </>
          )}
        </div>
      </div>
      {props.state !== 'Successful' && props.state !== 'Expired'? (
        <div className="w-full bg-gray-200 rounded-full">
          <div className="progress" style={{ width: `${props.progress}%` }}> {props.progress}% </div>
        </div>
      ) : (
        ''
      )}
    </div>
    
  );
};


export default FundRiserCard;
