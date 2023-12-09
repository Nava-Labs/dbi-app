"use client";

import { addNewPost } from "@/shared/utils/storage/entityActions";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { providers } from "ethers";
import { PushAPI } from "@pushprotocol/restapi";
import { WalletClient, useWalletClient, usePrepareContractWrite } from "wagmi";
import { DBI_CASE_FACTORY_ABI } from "@/lib/abis/dbi-case-factory.abi";
import { waitForTransaction } from "wagmi/actions";
import { decodeAbiParameters, parseEther } from "viem";
import { useForm, useWatch } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./Form";
import { useRouter } from "next/navigation";
import useConfig from "@/shared/hooks/useConfig";
import * as PushSDK from "@pushprotocol/restapi";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

export default function OpenCaseForm({ websiteContent, orgName }: any) {
  const router = useRouter();
  const { address } = useAccount();
  const [user, setUser] = useState<PushAPI>();
  const [signer, setSigner] = useState<PushAPIPushSDK.SignerType>();
  const { chain } = useNetwork();
  const { DBI_CONTRACT, DBI_OFFICER, DBI_DEPUTY } = useConfig(chain!);

  const { data: walletClient } = useWalletClient();
  useEffect(() => {
    if (walletClient) {
      getAccount(walletClient);
    }
    async function getAccount(walletClient: WalletClient) {
      let signer = walletClientToSigner(walletClient);
      setSigner(setSigner);
      const userPush = await PushAPI.initialize(signer);
      setUser(userPush);
    }
  }, [walletClient]);

  const orgIndex = websiteContent.organisations.findIndex(
    (org: any) => org.name === orgName
  );

  //useForm
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      stolenTokenAddress: [] as string[],
      stolenAmount: [] as string[],
      caseDeadline: 0,
      bountyOffered: 0,
      bountyContract: "" as `0x${string}`,
      caseCreator: address as `0x${string}`,
      hackerAddr: "",
      pushPublicGroupId: "",
      pushPrivateGroupId: "",
      breadcrumbsUrl: "",
      pushSpaceId: "",
    },
  });
  const caseTitle = useWatch({
    control: form.control,
    name: "title",
  });
  const caseDescription = useWatch({
    control: form.control,
    name: "description",
  });
  const caseStolenTokenAddress: string[] = useWatch({
    control: form.control,
    name: "stolenTokenAddress",
  });
  const caseStolenAmount = useWatch({
    control: form.control,
    name: "stolenAmount",
  });
  const caseCaseDeadline = useWatch({
    control: form.control,
    name: "caseDeadline",
  });
  const caseBountyOffered = useWatch({
    control: form.control,
    name: "bountyOffered",
  });
  const caseBountyContract = useWatch({
    control: form.control,
    name: "bountyContract",
  });
  const caseCaseCreator = useWatch({
    control: form.control,
    name: "caseCreator",
  });
  const caseHackerAddr = useWatch({
    control: form.control,
    name: "hackerAddr",
  });
  const casePushPublicGroupId = useWatch({
    control: form.control,
    name: "pushPublicGroupId",
  });
  const casePushPrivateGroupId = useWatch({
    control: form.control,
    name: "pushPrivateGroupId",
  });
  const caseBreadcrumbsUrl = useWatch({
    control: form.control,
    name: "breadcrumbsUrl",
  });
  const casePushSpaceId = useWatch({
    control: form.control,
    name: "pushSpaceId",
  });

  let caseData = {
    title: caseTitle,
    description: caseDescription,
    stolenTokenAddress: caseStolenTokenAddress,
    stolenAmount: caseStolenAmount,
    caseDeadline: caseCaseDeadline,
    bountyOffered: caseBountyOffered,
    bountyContract: caseBountyContract,
    caseCreator: address as `0x${string}`,
    hackerAddr: caseHackerAddr,
    pushPublicGroupId: casePushPublicGroupId,
    pushPrivateGroupId: casePushPrivateGroupId,
    breadcrumbsUrl: caseBreadcrumbsUrl,
    pushSpaceId: casePushSpaceId,
  };

  const handleCreateGroup = async () => {
    if (user) {
      try {
        const name = caseTitle;
        const description = caseDescription.slice(0, 150);
        const image = "data:image/png;base64,iVBORw0K";
        const createdPublicGroup = await user.chat.group.create(name, {
          image,
          description,
        });

        const createdPrivateGroup = await user.chat.group.create(name, {
          private: true,
          image,
          description,
          members: [caseHackerAddr],
        });

        const encrypted = (await user.info()).encryptedPrivateKey
        const pgpDecryptedPvtKey = await PushSDK.chat.decryptPGPKey({
          encryptedPGPPrivateKey: encrypted, 
          signer: signer
        });
        
        let addr = walletClient?.account.address!;
        // actual api
        const response = await PushSDK.space.create({
          spaceName: caseTitle + " Space",
          spaceDescription: description,
          listeners: [],
          spaceImage:"space image link",
          speakers: [addr],
          isPublic: true,
          signer: signer!,
          pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
          scheduleAt: new Date("2023-07-15T14:48:00.000Z"),
          scheduleEnd: new Date("2024-07-15T15:48:00.000Z")
        });
        form.setValue("pushSpaceId", response.spaceId);

        await user.chat.send(createdPublicGroup.chatId, {
          type: "Text",
          content: "This is initial public message",
        });

        await user.chat.send(createdPrivateGroup.chatId, {
          type: "Text",
          content: "This is initial private message",
        });
        form.setValue("pushPublicGroupId", createdPublicGroup.chatId);
        form.setValue("pushPrivateGroupId", createdPrivateGroup.chatId);
        console.log(
          "created public group ",
          createdPublicGroup,
          createdPublicGroup.chatId
        );
        console.log(
          "created private group ",
          createdPrivateGroup,
          createdPrivateGroup.chatId
        );
      } catch (err) {
        console.log("error create group ", err);
      }
    }
  };

  const fillForm = () => {
    form.setValue("title", "Hack Exploit");
    form.setValue(
      "description",
      "Summary: On April 13, 2023, This protocol on the Ethereum chain was attacked due to a misconfiguration in their vault. The attackers exploited this vulnerability and stole approximately $11.54 million."
    );
    form.setValue("stolenTokenAddress", [
      "0xF03274e634997f108786339cc9679498D323e214",
      "0xC769E60549E04ceaE55410780f6733eBa0747a33",
    ]);
    form.setValue("stolenAmount", ["5", "10"]);
    form.setValue("caseDeadline", 1701873236);
    form.setValue("bountyOffered", 500);
    form.setValue("caseCreator", address as `0x${string}`);
    form.setValue("hackerAddr", "0x2d7e2DF65C1B06fa60FAf2a7D4C260738BB553D9");
    form.setValue(
      "breadcrumbsUrl",
      "https://www.breadcrumbs.app/embed/session/2939072AC751876E02C17D4C9B4C82F0"
    );
  };

  const { config: deployCaseConfig } = usePrepareContractWrite({
    address: DBI_CONTRACT as `0x${string}`,
    abi: DBI_CASE_FACTORY_ABI,
    functionName: "createPost",
    args: [
      BigInt(orgIndex),
      caseStolenTokenAddress as `0x${string}`[],
      caseStolenAmount.map((item) => parseEther(item)) as bigint[],
      BigInt(caseCaseDeadline),
      BigInt(caseBountyOffered),
      caseTitle,
    ],
    //orgsId, stolenToken[], stolenTokenAmount[], deadline, bountyRewardinBps, postDetails
  });
  const { write: deployCase, isLoading: isDeployingCase } = useContractWrite({
    ...deployCaseConfig,
    onSuccess: async (result) => {
      const tx = await waitForTransaction({
        hash: result.hash,
        confirmations: 8,
      });
      const decodeResult = decodeAbiParameters(
        [
          { name: "timestamp", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "post", type: "address" },
          { name: "postDetails", type: "string" },
        ],
        tx.logs[0].data
      );
      console.log("tx", tx);
      console.log("tx.contractAddress", decodeResult[2]);
      form.setValue("bountyContract", decodeResult[2] as `0x${string}`);
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleSubmit = async () => {
    await addNewPost(websiteContent, orgIndex, caseData);
    router.push(`/${orgName}/${caseBountyContract}`);
  };

  console.log("caseData", caseData);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full lg:w-2/3 lg:pr-5 space-y-2"
      >
        <div className="w-full">
          <p onClick={fillForm} className="text-neutral-400 cursor-pointer">
            Title
          </p>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    {...field}
                    required
                    type="text"
                    className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full">
          <p className="text-neutral-400">Description</p>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <textarea
                    {...field}
                    required
                    className="w-full bg-transparent border border-neutral-600 rounded-lg !selection:border-neutral-400 px-2 py-1 h-60"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full">
          <p className="text-neutral-400">Hacker Address</p>
          <FormField
            control={form.control}
            name="hackerAddr"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    {...field}
                    required
                    type="text"
                    className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full">
          <p className="text-neutral-400">Breadcrumbs URL</p>
          <FormField
            control={form.control}
            name="breadcrumbsUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    {...field}
                    required
                    type="url"
                    className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="z-0 w-full group">
            <p className="text-neutral-400">Stolen Token Address</p>
            <FormField
              control={form.control}
              name="stolenTokenAddress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      {...field}
                      required
                      type="text"
                      className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="relative z-0 w-full group">
            <p className="text-neutral-400">Stolen Amount</p>
            <FormField
              control={form.control}
              name="stolenAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <input
                      {...field}
                      required
                      type="text"
                      className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <p className="text-neutral-400">Case Deadline (in epoch)</p>
          <FormField
            control={form.control}
            name="caseDeadline"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    {...field}
                    required
                    type="number"
                    placeholder="e.g., 2023/12/15 = 1702598400"
                    className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full">
          <p className="text-neutral-400">Bounty Offered (in bps)</p>
          <FormField
            control={form.control}
            name="bountyOffered"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    {...field}
                    required
                    type="number"
                    placeholder="Bounty percentage * 100 e.g., 5% = 500"
                    className="w-full bg-transparent border border-neutral-600 rounded-full !selection:border-neutral-400 px-2 py-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex space-x-1">
          <button
            type="button"
            className="flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
            onClick={() => handleCreateGroup()}
          >
            1. Create Group Chat
          </button>
          <button
            type="button"
            className="flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
            onClick={() => deployCase?.()}
          >
            2. Deploy Case Contract
          </button>
          <button
            type="submit"
            className="flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
          >
            3. Open the Case
          </button>
        </div>
      </form>
    </Form>
  );
}
