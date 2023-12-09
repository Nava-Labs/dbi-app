"use client";

import { BOUNTY_CONTACT_ABI } from "@/lib/abis/bounty-contract.abi";
import React from "react";
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export default function CaseFulfillButton(params: any) {
  const { config: fulfillConfig } = usePrepareContractWrite({
    address: params.bountyContract as `0x${string}`,
    abi: BOUNTY_CONTACT_ABI,
    functionName: "fulfill",
  });
  const { write: fulfill, isLoading: isFulfilling } =
    useContractWrite(fulfillConfig);

  return (
    <button
      onClick={() => fulfill?.()}
      className="text-base mt-4 px-3 py-1 w-full font-medium border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
    >
      Fulfill
    </button>
  );
}
