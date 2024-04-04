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

  const YourComponent = () => {
    return (
      <div style={{ textAlign: 'center', position: 'absolute', marginTop: "100px" }}>
        <img 
          src="/logo.gif" // Ganti URL gambar bergerak Anda di sini
          alt="Animated Title"
          style={{ width: '100%', maxWidth: '200px', marginBottom: '20px', display: 'block', margin: '0 auto' }}
        />
      <h1 style={{ fontWeight: 'bold', fontSize: '1.3rem', margin: '0rem 0' }}>Your Gateway to the New Decentralized Crowdfunding World</h1>
      <p style={{ fontWeight: 'light', fontSize: '1rem', margin: '0.5rem 0' }}> Please Connect a Wallet to Proceed</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center my-40">
          <ConnectWallet
            theme={darkTheme({
              colors: {
                primaryButtonBg: "#4CAF50",
                primaryButtonText: "#ededef",
                modalBg: "#F7C984",
                dropdownBg: "#F7C984",
                borderColor: "#262830",
                separatorLine: "#262830",
                primaryText: "#1a1523",
                secondaryText: "#616161",
                accentButtonText: "#ededef",
                accentButtonBg: "#001433",
                accentText: "#001433",
                walletSelectorButtonHoverBg: "#ededef",
              }
            })}
            modalTitle={"Choose Your Wallet"}
            modalSize={"wide"}
            // welcomeScreen={{
            //   img: {
            //     src: "/donation.ico",
            //     width: 150,
            //     height: 150,
            //   },
            //   title: "Your Gateway to the New Decentralized Crowdfunding World",
            //   subtitle: "Please Connect a Wallet to Proceed",
            // }}
            welcomeScreen={() => {
              return <YourComponent />;
            }}
            showThirdwebBranding={false}
            onConnect={connect}
            autoConnect={true}
            switchToActiveChain={false}
            showFullAddress={true}
            style={{ fontSize: "1.5rem", padding: "0.9rem 1.7rem" }}
          />
  </div>
  )
}