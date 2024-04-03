import { useEffect, useState } from 'react';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { wrapper } from '../redux/store';
import { useDispatch } from 'react-redux';
import { getAllFunding, loadAccount, loadCrowdFundingContract, loadWeb3 } from '../redux/interactions';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { chainOrAccountChangedHandler } from '../helper/helper';


import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  zerionWallet,
  darkTheme
} from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    loadBlockchain();
  }, []);

  const loadBlockchain = async () => {
    const web3 = await loadWeb3(dispatch);
    const account = await loadAccount(web3, dispatch);
    const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
    await getAllFunding(crowdFundingContract, web3, dispatch);
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = await loadWeb3(dispatch);
        const account = await loadAccount(web3, dispatch);
        setIsWalletConnected(true);
        registerMetaMaskEvents();
        const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
        await getAllFunding(crowdFundingContract, web3, dispatch);
      } else {
        console.error('Wallet not detected.');
      }
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  };

  const registerMetaMaskEvents = async () => {
    try {
      window.ethereum.on('accountsChanged', chainOrAccountChangedHandler);
      window.ethereum.on('chainChanged', chainOrAccountChangedHandler);
    } catch (error) {
      console.error('Failed to register MetaMask events:', error);
    }
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <>
      <ToastContainer />
      {isWalletConnected ? (
        <Component {...pageProps} />
      ) : (
        <div className="flex flex-col items-center justify-center my-40">
          <h1 className='font-mono text-3xl text-greay font-bold hidden lg:block'>CROWDFUNDING DONATION</h1>
          <div className="flex flex-col items-center justify-center my-40">
            <ThirdwebProvider
              activeChain="localhost"
              clientId="7e19a827c2ddf24b50144bf6a906cfc5"
              autoConnect={false}
              // locale={en()}
              supportedWallets={[
                metamaskWallet({ recommended: true }),
                coinbaseWallet(),
                walletConnect(),
                zerionWallet(),
              ]}
            >
              <ConnectWallet
                theme={darkTheme({
                  colors:{
                    primaryButtonBg: "#4CAF50",
                    primaryButtonText: "#ededef",
                  }
                })}
                modalTitle={"Choose Your Wallet"}
                modalSize={"compact"}
                welcomeScreen={{
                  title: "Welcome To Crowdfunding Donation",
                  subtitle: "Please Connect a Wallet to Proceed",
                }}
                showThirdwebBranding={false}
                onConnect={connectWallet}
                autoConnect={false}
                switchToActiveChain={false}
                style={{ fontSize: "1.5rem", padding: "0.9rem 1.7rem" }}
              />
            <p style={{ marginTop: "1rem" }}>Connect your wallet to proceed.</p>
            </ThirdwebProvider>
          </div>
        </div>
      )}
    </>
  );

}

export default wrapper.withRedux(MyApp);

