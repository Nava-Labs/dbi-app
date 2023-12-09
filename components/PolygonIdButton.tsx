"use client";

import React, { useState } from "react";
import PolygonIDVerifier from "./PolygonIDVerifier";

function PolygonIdButton() {

  const [provedAccessBirthday, setProvedAccessBirthday] = useState(false);
  
  function a() {
    <PolygonIDVerifier
    publicServerURL={
      process.env.NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL
    }
    localServerURL={
      process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL
    }
    credentialType={"KYCAgeCredential"}
    issuerOrHowToLink={
      "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
    }
    onVerificationResult={setProvedAccessBirthday}
    />
    console.log("hi")
  }

  return (
    <>
      <div className="flex w-full bg-[#562ef4] justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer">
        {/* <button type="button"></button> */}
        <PolygonIDVerifier
    publicServerURL={
      process.env.NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL
    }
    localServerURL={
      process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL
    }
    credentialType={"KYCAgeCredential"}
    issuerOrHowToLink={
      "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
    }
    onVerificationResult={setProvedAccessBirthday}
    />
 
        <img src="/polygon-logo.png" alt="Polygon logo" className="h-5 ml-2" />
      </div>
    </>
  );
}

export default PolygonIdButton;
