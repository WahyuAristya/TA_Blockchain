// FundRiserForm.js
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { startFundRaising } from '../redux/interactions';
import { useDispatch, useSelector } from 'react-redux';
import { etherToWei, ethToIdrConverter, unixToDate } from '../helper/helper';
import { toastSuccess, toastError } from '../helper/toastMessage';
import { maxUint256 } from 'viem';

const FundRiserForm = () => {
  const crowdFundingContract = useSelector(state => state.fundingReducer.contract);
  const account = useSelector(state => state.web3Reducer.account);
  const web3 = useSelector(state => state.web3Reducer.connection);

  const [convertedTargetedAmount, setConvertedTargetedAmount] = useState(null);
  const [convertedMinimumAmount, setConvertedMinimumAmount] = useState(null);

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetedContributionAmount, setTargetedContributionAmount] = useState('');
  const [minimumContributionAmount, setMinimumContributionAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const riseFund = (e) => {
    e.preventDefault();
    const targetedContribution = Number(targetedContributionAmount);

    if (targetedContribution <= 0) {
      toastError('Targeted contribution amount should be greater than 0.');
      return;
    }

    // Validasi tanggal deadline tidak boleh kurang dari tanggal sekarang
    const selectedDate = moment(`${deadline} 23:59:59`);
    console.log(selectedDate)
    console.log(deadline)
    const currentDate = moment();
    if (selectedDate.isBefore(currentDate, 'day')) {
      toastError('Deadline cannot be before today.');
      return;
    }

    setBtnLoading(true);
    const unixDate = moment(`${deadline} 23:59:59`).valueOf();

    const onSuccess = () => {
      setBtnLoading(false);
      setTitle('');
      setDescription('');
      setTargetedContributionAmount('');
      setMinimumContributionAmount('');
      setDeadline('');
      setConvertedTargetedAmount(null);
      setConvertedMinimumAmount(null);
      toastSuccess('Fund rising started 🎉');
    };

    const onError = (error) => {
      setBtnLoading(false);
      toastError(error);
    };

    const data = {
      minimumContribution: etherToWei(minimumContributionAmount),
      deadline: Number(unixDate),
      targetContribution: etherToWei(targetedContributionAmount),
      projectTitle: title,
      projectDesc: description,
      account: account
    };

    console.log(selectedDate)

    startFundRaising(web3, crowdFundingContract, data, onSuccess, onError, dispatch);
  };

  const handleTargetedContributionChange = async (value) => {
    try {
      const targetedContributionEth = parseFloat(value);
      const targetedContributionIdr = await ethToIdrConverter(targetedContributionEth);
      setConvertedTargetedAmount(targetedContributionIdr);
    } catch (error) {
      console.error('Error converting targeted contribution to IDR:', error);
    }
  };

  const handleMinimumContributionChange = async (value) => {
    try {
      const minimumContributionEth = parseFloat(value);
      const minimumContributionIdr = await ethToIdrConverter(minimumContributionEth);
      setConvertedMinimumAmount(minimumContributionIdr);
    } catch (error) {
      console.error('Error converting minimum contribution to IDR:', error);
    }
  };

  return (
    <>
      <h1 className="font-sans font-bold text-xl">Start a fund riser</h1>
      <form onSubmit={(e) => riseFund(e)}>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Title :</label>
          <input type="text" placeholder="Type here" className="form-control-input border-neutral-400 focus:ring-neutral-200" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Description :</label>
          <textarea placeholder="Type here" className="form-control-input border-neutral-400 focus:ring-neutral-200" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Targeted contribution amount :</label>
          <input
            type="number"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={targetedContributionAmount}
            onChange={(e) => {
              setTargetedContributionAmount(e.target.value);
              handleTargetedContributionChange(e.target.value);
            }}
            required
          />
        </div>
        {convertedTargetedAmount !== null && (
          <div className="text-sm text-neutral-500 mt-2">
            Target contribution in IDR : Rp.{convertedTargetedAmount.toLocaleString()}
          </div>
        )}
        <div className="form-control my-1">
          <label className="text-sm text-gray-700">Minimum contribution amount :</label>
          <input
            type="number"
            placeholder="Type here"
            className="form-control-input border-neutral-400 focus:ring-neutral-200"
            value={minimumContributionAmount}
            onChange={(e) => {
              setMinimumContributionAmount(e.target.value);
              handleMinimumContributionChange(e.target.value);
            }}
            required
          />
        </div>
        {convertedMinimumAmount !== null && (
          <div className="text-sm text-neutral-500 mt-2">
            Minimum contribution in IDR : Rp.{convertedMinimumAmount.toLocaleString()}
          </div>
        )}
        <div className="form-control date-picker my-1">
          <label className="text-sm text-gray-700">Deadline :</label>
          <input type="date" placeholder="Type here" className="form-control-input border-neutral-400 focus:ring-neutral-200" value={deadline} onChange={e => setDeadline(e.target.value)} min={moment().format('DD-MM-YYYY')} required />
        </div>

        <button className="p-2 w-full bg-[#F56D91] text-white rounded-md hover:bg-[#d15677]" disabled={btnLoading}>{btnLoading ? 'Loading...' : 'Rise fund'}</button>
      </form>
    </>
  );
};

export default FundRiserForm;
