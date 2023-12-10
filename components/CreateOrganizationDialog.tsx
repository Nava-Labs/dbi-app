"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TwitterLogin } from "./button/TwitterLoginButton";
import { ConnectButton } from "./button/ConnectButton";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { addNewOrgs } from "@/shared/utils/storage/entityActions";
import { cn } from "@/lib/utils";
import { DBI_CASE_FACTORY_ABI } from "@/lib/abis/dbi-case-factory.abi";
import { useForm, useWatch } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./Form";
import useConfig from "@/shared/hooks/useConfig";
import PolygonIdButton from "./PolygonIdButton";
import { parseEther } from "viem";

export default function CreateOrganizationDialog({ websiteContent }: any) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { DBI_CONTRACT, DBI_OFFICER, DBI_DEPUTY } = useConfig(chain!);

  let [isOpen, setIsOpen] = useState(false);

  //useForm
  const form = useForm({
    defaultValues: {
      name: "",
      logoUrl: "",
      treasuryAddress: "",
      tokenAddress: "",
      minRequired: 0,
      creator: address as `0x${string}`,
      posts: [],
      chainId: 0,
    },
  });
  const orgName = useWatch({
    control: form.control,
    name: "name",
  });
  const orgLogoUrl = useWatch({
    control: form.control,
    name: "logoUrl",
  });
  const orgTreasuryAddress = useWatch({
    control: form.control,
    name: "treasuryAddress",
  });
  const orgTokenAddress = useWatch({
    control: form.control,
    name: "tokenAddress",
  });
  const orgMinRequired = useWatch({
    control: form.control,
    name: "minRequired",
  });
  const orgCreator = useWatch({
    control: form.control,
    name: "creator",
  });
  const orgPosts = useWatch({
    control: form.control,
    name: "posts",
  });
  const orgChainId = useWatch({
    control: form.control,
    name: "chainId",
  });

  let organisationData = {
    name: orgName,
    logoUrl: orgLogoUrl,
    treasuryAddress: orgTreasuryAddress,
    tokenAddress: orgTokenAddress,
    minRequired: orgMinRequired,
    creator: orgCreator,
    posts: orgPosts,
    chainId: orgChainId,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addNewOrgs(websiteContent, organisationData);
  };

  const { config: addOrganizationConfig } = usePrepareContractWrite({
    address: DBI_CONTRACT as `0x${string}`,
    abi: DBI_CASE_FACTORY_ABI,
    functionName: "addOrganization",
    args: [
      {
        name: orgName,
        token: orgTokenAddress as `0x${string}`,
        treasury: orgTreasuryAddress as `0x${string}`,
        thresholdTokenAmount: parseEther(orgMinRequired.toString()),
        twitterName: orgName,
      },
    ],
    //name, token, treasury, thresholdtokenAmount, twitterName
  });
  const { write: addOrganisation, isLoading: isaddingOrganisation } =
    useContractWrite({
      ...addOrganizationConfig,
    });

    const fillForm = () => {
      form.setValue("name", "1inch");
      form.setValue("chainId", 80001);
      form.setValue(
        "logoUrl",
        "https://cdn.stamp.fyi/space/1inch.eth?s=96&cb=d3a5b0a6de310910"
      );
      form.setValue(
        "treasuryAddress",
        "0x070E00B90bE22f409B0aE0719A3511Ae6DbFd3Cc" //Account 1a
      );
      form.setValue("tokenAddress", "0x4344d04691D0cB32039dd78405D2894fFb6B46A9");
      form.setValue("minRequired", 100);
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => handleSubmit)}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
        >
          Create Organization
        </button>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Create an organization
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-400">
                        Decentralized Bureau of Investigation is a free,
                        open-source platform for hack and exploit refund. Create
                        your own organization and demand that refund.
                      </p>
                    </div>

                    <div className="flex flex-col mt-4">
                      <div className="flex items-center justify-center border border-neutral-600 rounded-full px-1 align-middle mb-2 text-neutral-400 text-sm">
                        Authenticate
                      </div>
                      <div className="flex justify-between items-center space-x-1">
                        <ConnectButton />
                        <TwitterLogin />
                        <PolygonIdButton />
                      </div>
                    </div>

                    <div className="flex flex-col mt-4">
                      <div
                        onClick={fillForm}
                        className="flex items-center justify-center border border-neutral-600 rounded-full px-1 align-middle mb-2 text-neutral-400 text-sm"
                      >
                        Details
                      </div>
                      <div className="flex justify-between items-center space-x-1">
                        <form
                          onSubmit={handleSubmit}
                          className="w-full mx-auto flex flex-col space-y-2"
                        >
                          <div>
                            <label
                              id="name"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Name
                            </label>
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="text"
                                      placeholder="e.g., Uniswap"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <label
                              id="chainId"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Chain ID
                            </label>
                            <FormField
                              control={form.control}
                              name="chainId"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="number"
                                      placeholder="e.g., 80001 (Polygon Mumbai)"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <label
                              id="logoUrl"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Logo URL
                            </label>
                            <FormField
                              control={form.control}
                              name="logoUrl"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="url"
                                      placeholder="e.g., https://cdn.stamp.fyi/space/uniswap?s=96&cb=7b5f087c16a60022"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <label
                              id="treasuryAddress"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Treasury Address
                            </label>
                            <FormField
                              control={form.control}
                              name="treasuryAddress"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="text"
                                      placeholder="e.g., 0x1a9c8182c09f50c8318d769245bea52c32be35bc"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <label
                              id="tokenAddress"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Token Address
                            </label>
                            <FormField
                              control={form.control}
                              name="tokenAddress"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="text"
                                      placeholder="e.g., 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div>
                            <label
                              id="minRequired"
                              className="block text-sm font-medium text-neutral-400"
                            >
                              Min. Required to Create a Bounty
                            </label>
                            <FormField
                              control={form.control}
                              name="minRequired"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <input
                                      {...field}
                                      required
                                      type="number"
                                      placeholder="e.g., 1000000"
                                      className="bg-neutral-900 border border-neutral-600 text-sm rounded-full focus:ring-neutral-300 focus:border-neutral-300 block w-full p-2.5 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              // disabled={!addOrganisation}
                              onClick={() => addOrganisation?.()}
                              className={cn(
                                "flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer",
                                !!!isConnected && "grayscale"
                              )}
                            >
                              1. Add
                            </button>
                            <button
                              type="submit"
                              disabled={!!!isConnected}
                              className={cn(
                                "flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer",
                                !!!isConnected && "grayscale"
                              )}
                            >
                              2. Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </form>
    </Form>
  );
}
