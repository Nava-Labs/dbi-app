"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full px-20 py-3 border-t-[1px] border-neutral-600">
      <div className="flex justify-between">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-sm mb-2 text-neutral-600 font-medium">
            Created by:
          </h1>
          <Link href="https://navalabs.io/" target="_blank">
            <img
              src="/nava-labs-logo.png"
              alt="Nava Labs Logo"
              className="h-3"
            />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-sm text-neutral-600 font-medium">Created at:</h1>
          <Link href="https://ethindia.co/" target="_blank">
            <img src="/ethindia-logo.png" alt="ETHIndia Logo" className="h-7" />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-sm mb-2 text-neutral-600 font-medium">
            Powered by:
          </h1>
          <div className="flex space-x-2 items-center">
            <img
              src="/Push-Logo-Standard-White.png"
              alt="Push Protocol Logo"
              className="h-5"
            />
            <img
              src="https://devs.polygonid.com/img/polygon-id.svg"
              alt="Polygon ID Logo"
              className="h-4"
            />
            <img
              src="https://www.lighthouse.storage/logo.svg"
              alt="Lighthouse Storage Logo"
              className="h-5"
            />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-sm mb-2 text-neutral-600 font-medium">
            Built on:
          </h1>
          <div className="flex space-x-2 items-center">
            <img
              src="/chain-logo/polygon.svg"
              alt="Polygon Logo"
              className="h-5"
            />
            <img
              src="/chain-logo/arbitrum.png"
              alt="Arbitrum Logo"
              className="h-5"
            />
            <img
              src="/chain-logo/scroll.svg"
              alt="Scroll Logo"
              className="h-5"
            />
            <img src="/chain-logo/base.svg" alt="Base Logo" className="h-5" />
            <img
              src="/chain-logo/mantle.png"
              alt="Mantle Logo"
              className="h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
