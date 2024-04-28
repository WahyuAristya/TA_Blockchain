import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';
import { loadAccount } from '../redux/interactions';
import { ConnectWallet, darkTheme, useConnectionStatus, useConnect, metamaskWallet, useAddress, useWallet } from '@thirdweb-dev/react';
import Image from 'next/image';

export default function Home() {

  const router = useRouter();
  const dispatch = useDispatch();
  const web3 = useSelector(state => state.web3Reducer.connection)
  const wallet = useWallet();



  const connect = async() =>{
    // const onSuccess = async() =>{
      loadAccount(web3,dispatch)
      router.push('/dashboard')
    // }
    // connectWithWallet(onSuccess)
    // const wallet =await connects(metamaskConfig)
  }

  useEffect(() => {
     (async()=>{
      if(web3){
        // const account = await loadAccount(web3,dispatch)
        // const account = useAddress()
        // localStorage.setItem("ADDRESSbaru",account)
        // if(account.length > 0){
        //   router.push('/dashboard')
        // }
      }
     })()
  }, [web3])

  const connectionStatus = useConnectionStatus();
  console.log(connectionStatus)
  const address = useAddress();
  if (typeof window !== "undefined") {
    localStorage.setItem("addressBaru",address)
  }
  
  console.log(address)

  const YourComponent = () => {
    return (
      <div style={{ textAlign: 'center', position: 'absolute', marginTop: "100px" }}>
        <Image
          src="/logo.gif" // Ganti URL gambar bergerak Anda di sini
          alt="Animated Title"
          width={'200%'}
          height={'200%'}
          maxWidth= {'200px'}
          marginBottom= {'20px'}
          display= {'block'}
          margin= {'0 auto'}
        />
      <h1 style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight:'1.6', margin: '0.6rem ' }}>Your Gateway to the New Decentralized Crowdfunding World</h1>
      <p style={{ fontWeight: 'normal ', fontSize: '1rem',  margin: '0.5rem ' }}> Please Connect a Wallet to Proceed</p>
      </div>
    );
  };


  return (
    <div className="relative h-screen flex flex-col lg:flex-row items-center justify-center">
      <div className="absolute top-8 left-10 flex-shrink-0 flex items-center">
        <Image
          src="/donation.ico"
          width={'40%'}
          height={'40%'}
          loading="eager"
        />
        <h4 className='font-mono text-xl text-gray-900 font-bold lg:block' style={{marginLeft: '10px'}}>CROWDFUNDING DONATION</h4>
      </div>
      <div className="flex justify-center w-full items-center" style={{padding: '0 100px'}}>
        <div className="flex flex-col w-full lg:w-2/3 px-8 lg:px-0" >
          <h1 className="text-5xl font-bold mb-4 lg:text-5xl" style={{lineHeight:'1.1'}}>Your Gateway to the New Decentralized Crowdfunding World</h1>
          <p className="text-2xl ,t-3">Welcome to the Crowdfunding Donation Web3</p>
          <div className="mt-8">
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
              welcomeScreen={() => {
                return <YourComponent />;
              }}
              showThirdwebBranding={false}
              onConnect={connect}
              autoConnect={true}
              switchToActiveChain={true}
              showFullAddress={true}
              style={{ fontSize: "1.5rem", padding: "0.9rem 1.7rem" }}
            />
          </div>
        </div>
        <div className="flex-shrink-0 mt-6 lg:mt-0 ml-auto" style={{ marginLeft: '50px' }}>
          <Image
            src="/blockchain.png"
            alt="Ethereum Logo"
            width={'600%'}
            height={'600%'}
            loading="eager"
            // style={{ width: '100%', maxWidth: '600px', height: 'auto'}}
          />
        </div>
      </div>
    </div>
  );



}