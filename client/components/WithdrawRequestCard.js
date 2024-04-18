import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../helper/toastMessage';
import { voteWithdrawRequest, withdrawAmount } from '../redux/interactions';

const colorMaker = (state) => {
  if (state === 'Pending') {
    return 'bg-blue-600';
  } else {
    return 'bg-cyan-500';
  }
};

const WithdrawRequestCard = ({ props, withdrawReq, setWithdrawReq, contractAddress }) => {
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);

  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const hasVotedValue = localStorage.getItem(`voted_${contractAddress}_${props.requestId}_${account}`);
    setHasVoted(hasVotedValue === 'true');
  }, [contractAddress, props.requestId, account]);

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

  const vote = (reqId) => {
    setBtnLoader(reqId);
    const data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      const updatedWithdrawReq = withdrawReq.map((data) =>
        data.requestId === props.requestId ? { ...data, totalVote: Number(data.totalVote) + 1 } : data
      );
      setWithdrawReq(updatedWithdrawReq);
      setHasVoted(true);
      localStorage.setItem(`voted_${contractAddress}_${reqId}_${account}`, 'true');
      toastSuccess(`Vote Successfull for request id ${reqId}`);
    };
    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };
    voteWithdrawRequest(web3, data, onSuccess, onError);
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
          <p className="text-md font-bold font-sans text-gray">Approved vote</p>
          <p className="text-sm font-bold font-sans text-gray-600">{props.totalVote}</p>
        </div>
        <div className="inner-card my-6 w-full lg:w-3/5">
          <p className="text-md font-bold font-sans text-gray">Recipient address</p>
          <p className="text-sm font-bold font-sans text-gray-600">{props.reciptant}</p>
          <p className="text-sm text-red-600"> <span className="font-bold">Note : </span> Only Trustees Can Vote</p>
          {account === props.reciptant ? (
            props.status === 'Completed' ? (
              <button className="withdraw-button" disabled>
                Withdraw Success
              </button>
            ) : (
              <button className="withdraw-button" onClick={() => withdrawBalance(props.requestId)} disabled={btnLoader === props.requestId}>
                {btnLoader === props.requestId ? 'Loading...' : 'Withdraw'}
              </button>
            )
          ) : (
            <div>
              {props.status === 'Completed' ? (
              <button className="withdraw-button" disabled>
              Withdraw Has Been Made
            </button>
              ) : (
                <button className="withdraw-button" disabled={hasVoted} onClick={() => vote(props.requestId)}>
                  {btnLoader === props.requestId ? 'Loading...' : 'Vote'}
                  {hasVoted ? ' Success' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 

export default WithdrawRequestCard;
