"use client";

import Link from "next/link";
import React from "react";

function Footer() {
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
      </div>
    </div>
  );
}

export default Footer;
