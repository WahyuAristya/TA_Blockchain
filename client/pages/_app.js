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

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    loadBlockchain();
    checkForMetaMask();
  }, []);

  const loadBlockchain = async () => {
    const web3 = await loadWeb3(dispatch);
    const account = await loadAccount(web3, dispatch);
    // const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
    // await getAllFunding(crowdFundingContract, web3, dispatch);
  }

  const checkForMetaMask = () => {
    if (window.ethereum) {
      setHasMetaMask(true);
    }
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
        console.error('MetaMask extension not detected.');
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

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <>
      <ToastContainer />
      {isWalletConnected ? (
        <Component {...pageProps} />
      ) : (
        <>
          {hasMetaMask ? (
            <div className="flex flex-col items-center justify-center my-40">
              <p>Connect your wallet to proceed.</p>
              <button onClick={connectWallet} className="p-4 my-10 text-lg font-bold text-white rounded-md w-56 bg-[#4CAF50] drop-shadow-md hover:bg-[#357a38] hover:drop-shadow-xl">
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-40">
              <p>MetaMask is not detected. Please install MetaMask to use this website.</p>
              <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                <button className="p-4 my-10 text-lg font-bold text-white rounded-md w-56 bg-[#8D8DAA] drop-shadow-md hover:bg-[#b1b1d6] hover:drop-shadow-xl">
                  Download MetaMask
                </button>
              </a>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default wrapper.withRedux(MyApp);



// "react": "17.0.2",



// import { useEffect, useState } from 'react';
// import '../styles/globals.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';
// import { wrapper } from '../redux/store';
// import { useDispatch } from 'react-redux';
// import { getAllFunding, loadAccount, loadCrowdFundingContract, loadWeb3 } from '../redux/interactions';
// import { Router } from 'next/router';
// import NProgress from 'nprogress';
// import "nprogress/nprogress.css";
// import { chainOrAccountChangedHandler } from '../helper/helper';


// import {
//   useConnectionStatus,
//   useDisconnect,
//   ThirdwebProvider,
//   ConnectWallet,
//   metamaskWallet,
//   coinbaseWallet,
//   walletConnect,
//   trustWallet
// } from "@thirdweb-dev/react";

// function MyApp({ Component, pageProps }) {
//   const dispatch = useDispatch();
//   const [isWalletConnected, setIsWalletConnected] = useState(false);

//   useEffect(() => {
//     loadBlockchain();
//   }, []);

//   const loadBlockchain = async () => {
//     const web3 = await loadWeb3(dispatch);
//     const account = await loadAccount(web3, dispatch);
//     const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
//     await getAllFunding(crowdFundingContract, web3, dispatch);
//   }

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const web3 = await loadWeb3(dispatch);
//         const account = await loadAccount(web3, dispatch);
//         setIsWalletConnected(true);
//         registerMetaMaskEvents();
//         const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch);
//         await getAllFunding(crowdFundingContract, web3, dispatch);
//       } else {
//         console.error('MetaMask extension not detected.');
//       }
//     } catch (error) {
//       console.error('Failed to connect to wallet:', error);
//     }
//   };

//   const registerMetaMaskEvents = async () => {
//     try {
//       window.ethereum.on('accountsChanged', chainOrAccountChangedHandler);
//       window.ethereum.on('chainChanged', chainOrAccountChangedHandler);
//     } catch (error) {
//       console.error('Failed to register MetaMask events:', error);
//     }
//   };

//   useEffect(() => {
//     Router.events.on("routeChangeStart", () => NProgress.start());
//     Router.events.on("routeChangeComplete", () => NProgress.done());
//     Router.events.on("routeChangeError", () => NProgress.done());
//   }, []);

//   return (
//     <>
//       <ToastContainer />
//       {isWalletConnected ? (
//         <Component {...pageProps} />
//       ) : (
//         <div className="flex flex-col items-center justify-center my-40">
//           <div className="flex flex-col items-center justify-center my-40">
//             <ThirdwebProvider
//               activeChain="localhost"
//               clientId="7e19a827c2ddf24b50144bf6a906cfc5"
//               autoConnect={false}
//               // locale={en()}
//               supportedWallets={[
//                 metamaskWallet(),
//                 coinbaseWallet({ recommended: true }),
//                 walletConnect(),
//                 trustWallet(),
//               ]}
//             >
//               <ConnectWallet
//                 theme={"dark"}
//                 modalTitle={"Choose Your Wallet"}
//                 modalSize={"compact"}
//                 welcomeScreen={{
//                   title: "Welcome To Crowdfunding Donation",
//                   subtitle: "Please Connect a Wallet to Proceed",
//                 }}
//                 showThirdwebBranding={false}
//                 onConnect={connectWallet}
//                 switchToActiveChain={true}
//               />
//             </ThirdwebProvider>
//           </div>
//           <p>Connect your wallet to proceed.</p>
//         </div>
//       )}
//     </>
//   );

// }

// export default wrapper.withRedux(MyApp);

