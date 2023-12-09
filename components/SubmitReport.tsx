"use client";

import { signAuthMessage } from "@/shared/utils/storage/encyptionSign";
import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { getSignature } from "@/shared/utils/signatures/sign";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { BOUNTY_CONTACT_ABI } from "@/lib/abis/bounty-contract.abi";

const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!;

export default function SubmitReport(params: any) {
  const { address } = useAccount();

  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [signature, setSignature] = useState("");
  const [accountNonce, setAccountNonce] = useState<bigint>();

  const { data } = useContractRead({
    address: params.bountyContract as `0x${string}`,
    abi: BOUNTY_CONTACT_ABI,
    functionName: "accountNonce",
    args: [address as `0x${string}`],
    onSuccess(result) {
      setAccountNonce(result);
    },
  });

  // Function to upload the encrypted file
  const uploadEncryptedFile = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage();
      if (!encryptionAuth) {
        console.error("Failed to sign the message.");
        return;
      }

      const { signature, signerAddress } = encryptionAuth;

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        signerAddress,
        signature
      );
      console.log("Encrypted File Status:", output);
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      const hash = output.data[0].Hash;
      console.log(`Decrypt at https://decrypt.mesh3.network/evm/${hash}`);

      const contractSignature = await getSignature(
        params.bountyContract,
        address!,
        accountNonce!
      );
      setSignature(contractSignature);
      setHash(hash);
    } catch (error) {
      console.error("Error uploading encrypted file:", error);
    }
  };

  console.log("hash", hash);
  console.log("signature", signature);
  console.log("accountNonce", accountNonce);
  // Function to handle file selection
  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const { config: uploadReportConfig } = usePrepareContractWrite({
    address: params.bountyContract as `0x${string}`,
    abi: BOUNTY_CONTACT_ABI,
    functionName: "uploadReport",
    args: [hash, signature as `0x${string}`],
  });
  const { write: uploadReport } = useContractWrite({
    ...uploadReportConfig,
  });

  const upload = async () => {
    await uploadEncryptedFile;
    await uploadReport;
  };

  return (
    <div className="mt-4 space-y-4 lg:mt-1">
      <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
        <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
          <h4 className="flex items-center font-semibold">Submit a Report</h4>
        </div>

        <div className="p-4 leading-5 sm:leading-6">
          <div className="flex flex-col">
            <input type="file" onChange={handleFileChange} />
            <div className="flex space-x-1">
              <button
                className="text-base mt-4 px-3 py-1 w-full font-medium border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
                onClick={uploadEncryptedFile}
                disabled={!file}
              >
                Upload (IPFS)
              </button>
              <button
                className="text-base mt-4 px-3 py-1 w-full font-medium border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
                onClick={() => uploadReport?.()}
              >
                Upload (Smart Contract)
              </button>
            </div>
            {/* <button
              className="text-base mt-4 px-3 py-1 w-full font-medium border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
              onClick={upload}
              disabled={!file}
            >
              Upload
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
