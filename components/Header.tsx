"use client";

import { WalletIcon } from "@heroicons/react/24/outline";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "./button/ConnectButton";

export default function Header() {
  return (
    <div className="w-full px-20 py-3 top-0 border-b-[1px] border-neutral-600">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex flex-col items-center">
          <h1 className="font-semibold text-lg">Decentralized</h1>
          <h1 className="font-semibold text-lg">Bureau of Investigation</h1>
        </Link>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
