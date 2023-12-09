"use client";

import { WalletIcon } from "@heroicons/react/24/outline";
import { ConnectKitButton } from "connectkit";

export function ConnectButton() {
  return (
    <>
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
    </>
  );
}
