import {useState, useRef} from 'react'
import Link from "next/link";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ethToIdrConverter } from '../helper/helper';
import authWrapper from "../helper/authWrapper";
import Loader from "../components/Loader";
import { darkTheme, ConnectWallet} from "@thirdweb-dev/react";
import { ExternalLinkIcon } from '@heroicons/react/outline'; // Import icon library

const Navbar = () => {

    const router = useRouter()
    const [openMenu,setOpenMenu] = useState(false);
    const account = useSelector(state=>state.web3Reducer.account);
    const [ethToIdrRate, setEthToIdrRate] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchEthToIdrRate = async () => {
            try {
                const rate = await ethToIdrConverter(1); // Konversi 1 ETH ke IDR
                setEthToIdrRate(rate);
            } catch (error) {
                console.error('Error fetching ETH to IDR rate:', error);
            }
        };
        fetchEthToIdrRate();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownClick = () => {
        setOpenMenu(!openMenu);
    };


    
  return (
    <div>
        {/* <!-- This example requires Tailwind CSS v2.0+ --> */}
        <nav className="bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* <!-- Mobile menu button--> */}
                <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-greay hover:bg-[#F7C984] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" onClick={()=>setOpenMenu(!openMenu)}>
                <span className="sr-only">Open main menu</span>
                <i className="fa-solid fa-bars"></i>
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                <img src="/donation.ico"
                style={{ width: '100%', maxWidth: '40px', marginRight: '10px', display: 'block', margin: '1 auto' }}
                />
                      <h4 className='font-mono text-xl text-greay font-bold hidden lg:block'>CROWDFUNDING DONATION</h4>
                </div>
                <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                    <Link href="/dashboard"  ><span className={`${router.pathname === "/dashboard"?"bg-[#F7C984]":""} text-greay px-3 py-2 rounded-md text-sm font-medium hover:cursor-pointer hover:bg-[#F7C984] hover:text-greay`}>Dashboard</span></Link>
                    <Link href="/my-contributions"><span className={`${router.pathname === "/my-contributions"?"bg-[#F7C984]":""} text-greay px-3 py-2 rounded-md text-sm font-medium hover:cursor-pointer hover:bg-[#F7C984] hover:text-greay`}>My contribution</span></Link>
                    {/* Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleDropdownClick}
                            type="button"
                            className={`${openMenu ? 'bg-[#F7C984] text-greay' : ''} text-greay px-3 py-2 rounded-md text-sm font-medium hover:cursor-pointer hover:bg-[#F7C984] hover:text-greay`}
                        >
                            View Etherscan
                            <ExternalLinkIcon className="h-4 w-4 inline-block ml-1 text-gray-400" />
                        </button>
                        {/* Dropdown */}
                        {openMenu && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <Link href="https://sepolia.etherscan.io/address/0xb52F06F7890346FFd1F004AA831a0937F24CEAEc" passHref>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F7C984] hover:text-gray-900"
                                        >
                                            Fund Data
                                            <ExternalLinkIcon className="h-4 w-4 inline-block ml-1 text-gray-400" />
                                        </a>
                                    </Link>
                                    <Link href="https://sepolia.etherscan.io/address/0xd7029c9b1dd23ccef2e61d5a1277bf10ff2fdebe" passHref>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F7C984] hover:text-gray-900"
                                        >
                                            Withdraw & Vote Data
                                            <ExternalLinkIcon className="h-4 w-4 inline-block ml-1 text-gray-400" />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        )}
                        </div>
                </div>
                </div>
                
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button type="button" className="p-1 w-70 truncate rounded-full text-greay hover:text-greay " >
                  <span >{account}</span>
                </button> */}
                
                

                {/* <!-- Profile  --> */}
                <div className="ml-3 relative " style={{marginTop: "2rem"}}>
                    <div>
                    <ConnectWallet
                        theme={darkTheme({
                            colors: {
                                modalBg: "#F7C984",
                                dropdownBg: "#F7C984",
                                borderColor: "#262830",
                                separatorLine: "#262830",
                                primaryText: "#262830",
                                secondaryText: "#001433",
                                accentButtonText: "#ededef",
                                primaryButtonBg: "#ededef",
                                accentButtonBg: "#001433",
                                accentText: "#001433",
                                secondaryButtonBg: "#ededef",
                                secondaryButtonHoverBg: "#ededef",
                                walletSelectorButtonHoverBg:"#ededef",
                                selectedTextColor: "#22232b",
                                connectedButtonBgHover: "#ededef",
                                connectedButtonBg: "#F7C984",
                                selectedTextBg: "#22232b",
                                secondaryButtonText: "#22232b",
                            }
                            })}
                            modalTitle={"Choose Your Wallet"}
                            modalSize={"compact"}
                            welcomeScreen={{
                            title: "Welcome To Crowdfunding Donation",
                            subtitle: "Please Connect a Wallet to Proceed",
                            }}
                            showThirdwebBranding={true}
                            autoConnect={true}
                            switchToActiveChain={true}
                            showFullAddress={true}
                            modalTitleIconUrl={
                                "https://drive.google.com/file/d/1XlBpJj_89UMGr7wqUdLwirQvD4a7iuaF/view?usp=drive_link"
                              }
                            style={{ fontSize: "1.2rem", padding: "0.7rem 2rem" }}
                    />
                        {/* <button
                        type="button"
                        className="flex items-center text-sm rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-white"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        >
                        <span className="sr-only">Open user menu</span>
                        <img
                            src="/acc.ico"
                            alt="User account"
                            className="h-8 w-8 rounded-full shadow-md"
                        />
                        </button> */}
                        <div>
                    </div>
                    </div>
                    </div>

                {/* <div className="ml-3 relative">
                <div>
                    <button type="button" className="bg-[#F7C984] flex text-sm rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full" ></div>
                    </button>
                </div>
                </div> */}
            </div>
            </div>
            {/* Box untuk menampilkan informasi konversi */}
            {ethToIdrRate !== null && (
                <div className="ml-auto border border-[#F7C984] border-2 border-solid rounded-md text-sm text-greay mt-1 p-2 max-w-[417px]" style={{marginTop: "2rem"}}>
                    <div className="flex flex-col">
                    <div className="font-mono">Eth Price Information</div>
                    <div className="text-left font-bold">
                        1 ETH ≈ IDR.{ethToIdrRate.toLocaleString()}
                    </div>
                    <div className="text-right text-xs text-neutral-500 mt-1">
                        Updated at {new Date().toLocaleString()}
                    </div>
                    </div>
                </div>
                )}
            </div>
        
        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div className={`sm:hidden ${!openMenu?"hidden":""}`} id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="bg-[#F7C984] text-greay block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Dashboard</a>

            <a href="#" className="text-greay hover:bg-[#F7C984] hover:text-greay block px-3 py-2 rounded-md text-base font-medium">Team</a>

            <a href="#" className="text-greay hover:bg-[#F7C984] hover:text-greay block px-3 py-2 rounded-md text-base font-medium">Projects</a>

            <a href="#" className="text-greay hover:bg-[#F7C984] hover:text-greay block px-3 py-2 rounded-md text-base font-medium">Calendar</a>
            </div>
        </div>
        </nav>

    </div>
  )
}

export default Navbar