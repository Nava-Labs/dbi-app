"use client";

import { WalletIcon } from "@heroicons/react/24/outline";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="w-full px-20 py-3 top-0 border-b-[1px] border-neutral-600">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex flex-col items-center">
          <h1 className="font-semibold text-lg">Decentralized</h1>
          <h1 className="font-semibold text-lg">Bureau of Investigation</h1>
        </Link>
        <div>
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, chain }) => {
              return (
                <div className="flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer">
                  <button onClick={show}>
                    {isConnected ? truncatedAddress : "Connect wallet"}
                  </button>
                  <WalletIcon className="h-5 ml-2" />
                </div>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </div>
  );
}
