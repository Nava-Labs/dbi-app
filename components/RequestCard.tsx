"use client";

import React from "react";
import Countdown from "./Countdown";
import truncateEthAddress from "truncate-eth-address";

export default function RequestCard(params: any) {
  return (
    <div className="border-[1px] border-neutral-600 rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-sm">
          {truncateEthAddress(params.caseCreator)}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="text-xl font-semibold">{params.title}</div>
        <div>{params.description}</div>
        <div className="text-neutral-400 text-sm">
          <Countdown epochInSeconds={params.caseDeadline} />{" "}
        </div>
      </div>
    </div>
  );
}
