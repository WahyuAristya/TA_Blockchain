import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../helper/toastMessage';
import { voteWithdrawRequest, withdrawAmount, requestRefund, getTrustees  } from '../redux/interactions';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const colorMaker = (state) => {
  if (state === 'Pending') {
    return 'bg-blue-600';
  } else if (state === 'Approved'){
    return 'bg-yellow-600'
  } else if (state === 'Rejected') {
    return 'bg-red-500';
  } else {
    return 'bg-cyan-500'
  }
};

const WithdrawRequestCard = ({ props, withdrawReq, setWithdrawReq, contractAddress, contributors }) => {
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [trustees, setTrustees] = useState([]);
  const [hasRefund, setHasRefund] = useState(false);
  // const isContributor = contributors.some(contributor => contributor.contributor === currentContributorAddress);


  
  useEffect(() => {
    const hasVotedValue = localStorage.getItem(`voted_${contractAddress}_${props.requestId}_${account}`);
    setHasVoted(hasVotedValue === 'true');
  }, [contractAddress, props.requestId, account]);


  useEffect(() => {
    const storedYesVotes = localStorage.getItem(`yesVotes_${contractAddress}_${props.requestId}`);
    const storedNoVotes = localStorage.getItem(`noVotes_${contractAddress}_${props.requestId}`);
    setYesVotes(storedYesVotes ? parseInt(storedYesVotes) : 0);
    setNoVotes(storedNoVotes ? parseInt(storedNoVotes) : 0);
  }, [contractAddress, props.requestId]);

  useEffect(() => {
    if (props.status === 'Pending' && yesVotes + noVotes === 5 && noVotes > yesVotes) {
      const updatedWithdrawReq = withdrawReq.map((data) =>
        data.requestId === props.requestId ? { ...data, status: 'Rejected' } : data
      );
      setWithdrawReq(updatedWithdrawReq);
    } else if (props.status === 'Pending' && yesVotes + noVotes === 5 && yesVotes > noVotes) {
      const updatedWithdrawReq = withdrawReq.map((data) =>
        data.requestId === props.requestId ? { ...data, status: 'Approved' } : data
      );
      setWithdrawReq(updatedWithdrawReq);
    }
  }, [yesVotes, noVotes, props.status, props.requestId, withdrawReq]);

  useEffect(() => {
    const fetchTrusteesData = async () => {
      try {
        const trusteesData = await getTrustees(web3, contractAddress);
        setTrustees(trusteesData);
      } catch (error) {
        console.error("Error fetching trustees:", error);
        // Handle error
      }
    };

    fetchTrusteesData();
  }, [web3, contractAddress]);


  const withdrawBalance = (reqId) => {
    setBtnLoader(reqId);
    const data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
      amount: props.amount,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      const updatedWithdrawReq = withdrawReq.map((data) =>
        data.requestId === props.requestId ? { ...data, status: 'Completed' } : data
      );
      setWithdrawReq(updatedWithdrawReq);
      toastSuccess(`Successfully withdraw for request id ${reqId}`);
    };
    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };
    withdrawAmount(web3, dispatch, data, onSuccess, onError);
  };

  const vote = (reqId, option) => {
    setBtnLoader(reqId);
    const data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
      vote: option,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      if (option === 'Yes') {
        const updatedYesVotes = yesVotes + 1;
        setYesVotes(updatedYesVotes);
        localStorage.setItem(`yesVotes_${contractAddress}_${reqId}`, updatedYesVotes.toString());
      } else {
        const updatedNoVotes = noVotes + 1;
        setNoVotes(updatedNoVotes);
        localStorage.setItem(`noVotes_${contractAddress}_${reqId}`, updatedNoVotes.toString());
      }
      const updatedWithdrawReq = withdrawReq.map((data) =>
        data.requestId === props.requestId ? { ...data, totalVote: Number(data.totalVote) + 1 } : data
      );
      setWithdrawReq(updatedWithdrawReq);
      setHasVoted(true);
      localStorage.setItem(`voted_${contractAddress}_${reqId}_${account}`, 'true');
      toastSuccess(`Vote Successful for request id ${reqId}`);
    };
    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };
    voteWithdrawRequest(web3, data, onSuccess, onError);
  };

  useEffect(() => {
    // Memeriksa status refund dari localStorage saat komponen dimuat
    const storedRefundStatus = localStorage.getItem(`refund_${contractAddress}_${props.requestId}_${account}`);
    setHasRefund(storedRefundStatus === 'true');
  }, [contractAddress, props.requestId, account]); // Efek dijalankan kembali saat ada perubahan pada contractAddress atau props.requestId
  

  const handleRefund = () => { 
    setBtnLoader(true);
    const data = {
      contractAddress: contractAddress,
      account: account,
    };

  // Memeriksa apakah pengguna adalah kontributor dan belum melakukan refund sebelumnya
  const hasRefundKey = `refund_${contractAddress}_${props.requestId}_${account}`;
  const hasRefunded = localStorage.getItem(hasRefundKey);
  if (!isContributor(account, contributors) || hasRefunded) {
    setBtnLoader(false);
    toastError("Can't make a refund because you are not a contributor of this fund.");
    return; // Stop further execution
  }

    const onSuccess = () => {
      setHasRefund(true);
      setBtnLoader(false);
      localStorage.setItem(hasRefundKey, 'true');
      console.log("Refund successful, hasRefund:", hasRefund);
    };
    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
      console.log("Refund failed, hasRefund:", hasRefund);
    };
    requestRefund(web3, data, onSuccess, onError);
  };

  const isContributor = (account, contributors) => {
    // Loop through contributors array to check if the account is present
    for (let i = 0; i < contributors.length; i++) {
      if (contributors[i].contributor === account) {
        return true; // If the account is found in the contributors list, return true
      }
    }
    return false; // If the account is not found in the contributors list, return false
  };
  

return (
  <div className="card relative overflow-hidden my-4">
    <div className={`ribbon ${colorMaker(props.status)}`}>{props.status}</div>
    <h1 className="font-sans text-xl text-gray font-semibold">{props.desc}</h1>
    <div className="flex flex-col lg:flex-row">
      <div className="inner-card my-6 w-full lg:w-2/5">
        <p className="text-md font-bold font-sans text-gray">Requested amount</p>
        <p className="text-sm font-bold font-sans text-gray-600 ">{props.amount} ETH </p>
        <p className="text-md font-bold font-sans text-gray">Trustees Total</p>
        <p className="text-sm font-bold font-sans text-gray-600">5</p>
        <p className="text-md font-bold font-sans text-gray">Approved vote - Yes</p>
        <p className="text-sm font-bold font-sans text-gray-600">{yesVotes}</p>
        <p className="text-md font-bold font-sans text-gray">Approved vote - No</p>
        <p className="text-sm font-bold font-sans text-gray-600">{noVotes}</p>
      </div>
      <div className="inner-card my-6 w-full lg:w-3/5">
        <p className="text-md font-bold font-sans text-gray">Recipient address</p>
        <p className="text-sm font-bold font-sans text-gray-600">{props.reciptant}</p>
        <p className="text-sm text-red-600"> <span className="font-bold">Note : </span> Only Trustees Can Vote</p>
        {(props.status !== 'Completed' && trustees.includes(account)) && (
          <>
            <button className="withdraw-button" disabled={hasVoted} onClick={() => vote(props.requestId, 'Yes')}>
              {btnLoader === props.requestId ? 'Loading...' : 'Yes'}
              {hasVoted ? ' Success' : ''}
            </button>
            <button className="withdraw-button" disabled={hasVoted} onClick={() => vote(props.requestId, 'No')}>
              {btnLoader === props.requestId ? 'Loading...' : 'No'}
              {hasVoted ? ' Success' : ''}
            </button>
          </>
        )}
        {(account === props.reciptant && props.status !== 'Completed') && (
          <>
            {props.status === 'Rejected' && (
              <div className="flex flex-col items-center justify-center">
                <ExclamationCircleIcon className="h-8 w-8 mr-1 text-red-600" />
                <p className="text-red-600 font-bold text-center max-w-[200px]">Withdraw Request has been Rejected by Trustees</p>
                <p className="text-sm text-red-600">Balance will be refund to all contributors</p>
              </div>
            )}
            {props.status !== 'Rejected' && (
              <button className="withdraw-button" onClick={() => withdrawBalance(props.requestId)} disabled={btnLoader === props.requestId}>
                {btnLoader === props.requestId ? 'Loading...' : 'Withdraw'}
              </button>
            )}
          </>
        )}

{(props.status !== 'Completed' && (yesVotes + noVotes === 5 && noVotes > yesVotes) && account !== props.reciptant ) && (
  <>
    {hasRefund ? (
      <button className="withdraw-button" disabled>
        Refund has been processed
      </button>
    ) : (
      <button className="withdraw-button" onClick={handleRefund} disabled={btnLoader || hasRefund}>
        {btnLoader ? 'Loading...' : 'Refund'}
        {hasRefund ? ' Success' : ''}
      </button>
    )}
    <div className="flex flex-col items-center justify-center">
      <p className="text-red-600 font-bold text-center max-w-[300px]">Withdraw Request has been Rejected by Trustees</p>
      <p className="text-sm text-red-600">Balance will be refund to all contributors</p>
    </div>
  </>
)}

      </div>
    </div>
  </div>
);
}

export default WithdrawRequestCard;
