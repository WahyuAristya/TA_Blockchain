import {useEffect, useState } from 'react'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {wrapper} from '../redux/store'
import { useDispatch } from 'react-redux';
import { getAllFunding, loadAccount, loadCrowdFundingContract, loadWeb3, subscribeCrowdFundingEvents } from '../redux/interactions';
import { Router } from 'next/router';
import NProgress from 'nprogress'
import "nprogress/nprogress.css";
import { chainOrAccountChangedHandler } from '../helper/helper';
import Script from "next/script";

import {
	ThirdwebProvider,
	coinbaseWallet,
	metamaskWallet,
	phantomWallet,
	trustWallet,
	walletConnect,
	zerionWallet,
  xdefiWallet,
  rainbowWallet,
  cryptoDefiWallet,
  rabbyWallet,
  okxWallet,
  useConnectionStatus} from "@thirdweb-dev/react";
  


function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch()


  useEffect(() => {
    loadBlockchain()
  }, [])
  

  const loadBlockchain = async () => {
    const web3 = await loadWeb3(dispatch);
    if (web3) {
        const account = await loadAccount(web3, dispatch);
        const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
        await getAllFunding(crowdFundingContract, web3, dispatch);
    }
};

  Router.events.on("routeChangeStart",()=> NProgress.start())
  Router.events.on("routeChangeComplete",()=> NProgress.done())
  Router.events.on("routeChangeError",()=> NProgress.done())
  
  useEffect(() => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', chainOrAccountChangedHandler);
        window.ethereum.on('chainChanged', chainOrAccountChangedHandler);
    }
}, []);

  return (
    <>
      <ToastContainer/>
      <ThirdwebProvider
				activeChain="sepolia"
        clientId="7e19a827c2ddf24b50144bf6a906cfc5"
        autoConnect={true}
        supportedWallets={[
          metamaskWallet({ recommended: true }),
          rainbowWallet(),
          xdefiWallet(),
          rabbyWallet(),
          okxWallet(),
        ]}
        dAppMeta={{
          name: "thirdweb powered dApp",
          url: "http://localhost:3000/",
        }}
			>
				<Component {...pageProps} />
        <Script src="https://kit.fontawesome.com/e6ef8c1f6f.js" crossOrigin="anonymous"></Script>
			</ThirdwebProvider>
    </>
  )
}

export default wrapper.withRedux(MyApp)

