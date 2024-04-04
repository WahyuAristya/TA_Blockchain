// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { connectWithWallet } from '../helper/helper';
// import { loadAccount } from '../redux/interactions';
// import { ThirdwebProvider, ConnectWallet, darkTheme } from '@thirdweb-dev/react';

// export default function Home() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const web3 = useSelector(state => state.web3Reducer.connection);
//   const [isWalletConnected, setIsWalletConnected] = useState(false);

//   const connect = () => {
//     const onSuccess = async () => {
//       await loadAccount(web3, dispatch);
//       setIsWalletConnected(true);
//       router.push('/dashboard');
//     };
//     connectWithWallet(onSuccess);
//   };

//   useEffect(() => {
//     const checkWalletConnection = async () => {
//       if (web3) {
//         const account = await loadAccount(web3, dispatch);
//         if (account.length > 0) {
//           setIsWalletConnected(true);
//           router.push('/dashboard');
//         }
//       }
//     };
//     checkWalletConnection();
//   }, [web3]);

// console.log('isWalletConnected', isWalletConnected);

//   return (
//     <div className="flex flex-col items-center justify-center my-40">
//       <ThirdwebProvider>
//         {!isWalletConnected && (
//           <ConnectWallet
//             theme={darkTheme({
//               colors: {
//                 primaryButtonBg: "#4CAF50",
//                 primaryButtonText: "#ededef",
//               }
//             })}
//             modalTitle={"Choose Your Wallet"}
//             modalSize={"compact"}
//             welcomeScreen={{
//               title: "Welcome To Crowdfunding Donation",
//               subtitle: "Please Connect a Wallet to Proceed",
//             }}
//             showThirdwebBranding={false}
//             onConnect={connect}
//             autoConnect={false}
//             switchToActiveChain={false}
//             style={{ fontSize: "1.5rem", padding: "0.9rem 1.7rem" }}
//           />
//         )}
//         {!isWalletConnected && <p style={{ marginTop: "1rem" }}>Connect your wallet to proceed.</p>}
//       </ThirdwebProvider>
//     </div>
//   );
// }



import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';
import { loadAccount } from '../redux/interactions';
import { ConnectWallet, darkTheme, useConnectionStatus, useConnect, metamaskWallet, useAddress } from '@thirdweb-dev/react';

export default function Home() {

  const router = useRouter();
  const dispatch = useDispatch();
  const web3 = useSelector(state => state.web3Reducer.connection)



  const connect = async() =>{
    const onSuccess = async() =>{
      loadAccount(web3,dispatch)
      router.push('/dashboard')
    }
    connectWithWallet(onSuccess)
    // const wallet =await connects(metamaskConfig)
  }

  useEffect(() => {
     (async()=>{
      if(web3){
        const account = await loadAccount(web3,dispatch)
        if(account.length > 0){
          // router.push('/dashboard')
        }
      }
     })()
  }, [web3])
  
  const connectionStatus = useConnectionStatus();
  console.log(connectionStatus)
  const address = useAddress();
  console.log(address)

  return (
    <div className="flex flex-col items-center justify-center my-40">
          <ConnectWallet
            theme={darkTheme({
              colors: {
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
            showThirdwebBranding={true}
            onConnect={connect}
            autoConnect={true}
            switchToActiveChain={false}
            style={{ fontSize: "1.5rem", padding: "0.9rem 1.7rem" }}
          />
  </div>
  )
}