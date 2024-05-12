import React from 'react';
import authWrapper from '../helper/authWrapper';
import { useConnectionStatus, ConnectWallet  } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const WithdrawAndTrusteesInfo = () => {
    const connectionStatus = useConnectionStatus();
    const router = useRouter();

    if (connectionStatus === "disconnected") {
        router.push("/");
        return null;
      }

    return (
        <div className="flex flex-row justify-between gap-6 m-10">
            {/* Bagian kiri - Informasi Tata Cara Withdraw Request */}
            <div className="w-2/3 p-4 bg-grey-200 rounded-md shadow-md"> {/* Tambahkan bg-[#F7C984] untuk warna background dan rounded-md shadow-md untuk membuat tampilan seperti card */}
                <h2 className="text-3xl font-bold mb-4">Withdraw Request Guidelines</h2>
                <p className="mb-4">To request a withdrawal from the crowdfunding platform, please follow these guidelines:</p>
                <ol className="list-decimal list-inside">
                    <li className="mb-2 text-lg">Ensure that your contribution amount or withdraw status is eligible for create withdraw request according to the platform's withdrawal policy.</li>
                    <li className="mb-2 text-lg">Press the withdrawal request button on confirm in your crypto wallet.</li>
                    <li className="mb-2 text-lg">Wait for trustees to vote your withdraw request. This process takes approximately 2x24 hours (you can contract the trustees to confirm your withdraw reqeust)</li>
                    <li className="mb-2 text-lg">Once approved, withdrawals can be made by pressing the withdraw button.</li>
                    <li className="mb-2 text-lg">If the request is rejected, the withdrawal cannot be made and the contributors has the right to refund.</li>
                </ol>
            </div>
            

            {/* Bagian kanan - Informasi Trustees */}
            <div className="w-1/3 p-4 bg-grey-200 rounded-md shadow-md"> {/* Tambahkan bg-[#F7C984] untuk warna background dan rounded-md shadow-md untuk membuat tampilan seperti card */}
                <h2 className="text-xl font-bold mb-4">Trustees Information</h2>
                <p className="text-sm mb-2">The following individuals are designated as trustees for the crowdfunding platform:</p>
                <ul className="list-disc list-inside">
                    <li className="text-sm mb-4">
                        <strong>Wahyu Aristya</strong><br/>
                        Wallet Address: 0x04fb8aA93070ccB375ECA12e98d6a995555e2017<br/>
                        Email: wahyuaristya@gmail.com<br/>
                        Phone: +62 81339442244
                    </li>
                    <li className="text-sm mb-4">
                        <strong>Wahyu Aristya</strong><br/>
                        Wallet Address: 0xe0b0d918dCefE0f414b77A2d81850eA8776A34A9<br/>
                        Email: wahyuaristya@gmail.com<br/>
                        Phone: +62 81339442244
                    </li>
                    <li className="text-sm mb-4">
                        <strong>Wahyu Aristya</strong><br/>
                        Wallet Address: 0xba83D2D5f76F34D0592452D3441902016878CB1a<br/>
                        Email: wahyuaristya@gmail.com<br/>
                        Phone: +62 81339442244
                    </li>
                    <li className="text-sm mb-4">
                        <strong>Wahyu Aristya</strong><br/>
                        Wallet Address: 0xcFf2EE28902259E8d00E1198E5565EB946F2A897<br/>
                        Email: wahyuaristya@gmail.com<br/>
                        Phone: +62 81339442244
                    </li>
                    <li className="text-sm mb-4">
                        <strong>Wahyu Aristya</strong><br/>
                        Wallet Address: 0x316Fd248ceF6aA4d17267cF2B8f2065bA71fEB7f<br/>
                        Email: wahyuaristya@gmail.com<br/>
                        Phone: +62 81339442244
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default authWrapper(WithdrawAndTrusteesInfo);
