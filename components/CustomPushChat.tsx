"use client";

import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
// import { mainnet } from 'viem/chains'
import { WalletClient, useSignMessage, useWalletClient } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import * as React from "react";
import { Wallet, providers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import {getOrgsAdmin} from "@/shared/utils/organizations";
import PushSpace from "./PushSpace";

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

export default function CustomPushChat(props: any) {
  const { groupChatId, organizations, pushSpaceId } = props;
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<PushAPI>();
  const [groupChats, setGroupChats] = useState<any>();
  // PushAPI.initialize(useWalletClient() );
  const { data: walletClient, isError, isLoading } = useWalletClient();
  console.log("wallet client ", walletClient);
  useEffect(() => {
    if (walletClient) {
      getAccount(walletClient);
    }
    async function getAccount(walletClient: WalletClient) {
      let signer = walletClientToSigner(walletClient);
      const userPush = await PushAPI.initialize(signer);
      setUser(userPush);
      let groupChats = await userPush.chat.history(groupChatId);
      groupChats = formatGroupChats(groupChats);
      setGroupChats(groupChats);
    }
  }, [walletClient]);
  console.log("groupChats", groupChats);

  function formatGroupChats(groupChats: any) {
    groupChats = groupChats.reverse();
    let orgsAdmins: any = getOrgsAdmin(organizations);
    
    for (let i = 0; i < groupChats.length; i++) {
      let chatSender = formatDID(groupChats[i].fromDID).toLowerCase();
      groupChats[i].logoUrl = ""; //officer logo

      groupChats[i].fromDID = truncateEthAddress(
        formatDID(groupChats[i].fromDID)
      );
      console.log(groupChats[i].fromDID);

      if (orgsAdmins[chatSender]) {
        groupChats[i].fromDID =
          groupChats[i].fromDID + " - " + orgsAdmins[chatSender] + " Admin";
        groupChats[i].logoUrl = orgsAdmins[chatSender].logoUrl;
      } else {
        groupChats[i].fromDID = groupChats[i].fromDID + " - Officer";
      }
      // groupChats[i].fromDID = groupChats[i].fromDID + " - Officer";
    }
    return groupChats;
  }

  function formatDID(did: string) {
    const splitted = did.split(":");
    return splitted[1];
  }
  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      if (user) {
        try {
          console.log("message ", message, user);
          await user.chat.send(groupChatId, {
            type: "Text",
            content: message,
          });
          let tempGroupChats = await user.chat.history(groupChatId);
          tempGroupChats = formatGroupChats(tempGroupChats);
          setGroupChats(tempGroupChats);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("error handle send message : user not found");
      }
      setMessage("");
    }
  };

  const handleJoinGroup = async () => {
    if (user) {
      try {
        const joinGroup = await user.chat.group.join(groupChatId);
      } catch (err) {
        console.log("error join group ", err);
      }
    }
  };

  const handleCreateSpace = async () => {
    if (user) {
      const userPush = (await user.info()).encryptedPrivateKey;

      // const pgpDecryptedPvtKey = await PushAPI.

      // actual api
      // const response = await PushAPI.space.create({
      //   spaceName:'wasteful_indigo_warbler',
      //   spaceDescription: 'boring_emerald_gamefowl',
      //   listeners: ['0x9e60c47edF21fa5e5Af33347680B3971F2FfD464','0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
      //   spaceImage: &lt;space image link&gt; ,
      //   speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
      //   isPublic: true,
      //   account: '0xD993eb61B8843439A23741C0A3b5138763aE11a4',
      //   env: 'staging',
      //   pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
      //   scheduleAt: new Date("2024-07-15T14:48:00.000Z"),
      //   scheduleEnd: new Date("2024-07-15T15:48:00.000Z")
      // });
    }
  };

  const handleCreateGroup = async () => {
    if (user) {
      try {
        const name = "Kyber Hack";
        const description = "lfg";
        const image = "data:image/png;base64,iVBORw0K";

        const createdGroup = await user.chat.group.create(name, {
          image,
          description,
        });
        console.log("created group ", createdGroup);
      } catch (err) {
        console.log("error create group ", err);
      }
    }
  };

  const handleCreateGroupWithHacker = async () => {
    if (user) {
      try {
        const hackerAddr = "0x000";
        const name = "[Private] Kyber Hack With Hacker";
        const description = "lfg";
        const image = "data:image/png;base64,iVBORw0K";

        const createdGroup = await user.chat.group.create(name, {
          private: true,
          image,
          description,
          members: [hackerAddr],
        });
        console.log("created group ", createdGroup);
      } catch (err) {
        console.log("error create group ", err);
      }
    }
  };

  // const handleJoinGroupNFTGated = async () => {
  //   if (user) {
  //     try {
  //       const hackerAddr = '0x000'
  //       const name = '[Private] Kyber Hack With Hacker'
  //       const description = 'lfg'
  //       const image = 'data:image/png;base64,iVBORw0K'

  //       const createdGroup = await user.chat.group.create(name, {
  //         private: true,
  //         image,
  //         description,
  //         members: [hackerAddr]
  //       })
  //       console.log('created group ', createdGroup)
  //     } catch (err) {
  //       console.log('error create group ', err)
  //     }
  //   }
  // }

  const handleCreateGroupNFTGated = async () => {
    console.log("trying to handle create group nft 1");

    if (user) {
      try {
        console.log("trying to handle create group nft 2");
        const hackerAddr = "0x000";
        const name = "[Private] Kyber Hack With Hacker";
        const description = "lfg";
        const image = "data:image/png;base64,iVBORw0K";

        // const createdGroup = await user.chat.group.create(name, {
        //   private: true,
        //   image,
        //   description,
        //   members: [hackerAddr]
        // })

        const createTokenGatedGroup = await user.chat.group.create(name, {
          description: "Token gated web3 native chat example", // provide short description of group
          image: "data:image/png;base64,iVBORw0K...", // provide base64 encoded image
          members: [], // not needed, rules define this, can omit
          admins: [], // not needed as per problem statement, can omit
          private: true,
          rules: {
            entry: {
              // entry is based on conditions
              conditions: {
                any: [
                  // any of the decider should allow entry
                  {
                    // decider 1 - If admin or owner invites someone
                    any: [
                      {
                        // criteria 1
                        type: "PUSH",
                        category: "INVITE",
                        subcategory: "DEFAULT",
                        data: {
                          inviterRoles: ["ADMIN", "OWNER"],
                        },
                      },
                    ],
                  },
                  {
                    // decicder 2 - If wallet holds 1 NFT on polygon testnet
                    any: [
                      {
                        // criteria 1
                        type: "PUSH", // define type that rules engine should go for
                        category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                        subcategory: "holder", // define if you are checking 'holder'
                        data: {
                          contract:
                            "eip155:80001:0xE8e935B4aD367ccb44dd124c834AC91A483a28eA",
                          comparison: ">=", // what comparison needs to pass
                          amount: 1, // amount that needs to passed
                          decimals: 18,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        });
        console.log("created group ", createTokenGatedGroup);
      } catch (err) {
        console.log("error create group ", err);
      }
    }
  };

  return (
    <>
    
    <div className="w-full h-full mt-3">
      <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
        <div className="group flex justify-between items-center rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
          <div className="flex flex-col space-x-2 items-center">
            <h4 className="flex items-center font-semibold">Case Discussion</h4>
            <div className="flex items-center space-x-1">
              <p className="text-neutral-600 text-sm font-light">Powered by</p>
              <img
                src="/Push-Logo-Standard-White.png"
                alt="Push Logo Standard White"
                className="h-5"
              />
            </div>
          </div>
          <button
            onClick={handleJoinGroup}
            className="text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
          >
            Join Group Chat
          </button>
        </div>

        <div className="p-4 leading-5 sm:leading-6">
          <div>
            {/* <button onClick={handleCreateGroupNFTGated}>Create new group</button> */}
            {/* <button onClick={handleCreateSpace}>Create new space</button> */}
            {/* <button onClick={handleJoinGroup}>Join</button>
            <br></br> */}
            <div className="space-y-2">
              {groupChats &&
                groupChats?.map(function (chat: any, index: any) {
                  return (
                    <div
                      key={index}
                      className="border border-neutral-600 rounded-lg p-2"
                    >
                      <div className="flex">
                        <p className="font-semibold text-sm text-neutral-300">
                          {chat.fromDID} :
                        </p>
                      </div>
                      <div className="flex justify-between items-center align-middle">
                        <p className="font-light text-sm">
                          {chat.messageContent}
                        </p>
                        <div className="flex text-[10px] space-x-2 text-neutral-600">
                          <p>{new Date(chat.timestamp).toLocaleDateString()}</p>
                          <p>{new Date(chat.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {!!groupChats && (
              <div className="flex justify-between items-center mt-2 text-sm font-medium p-3 border rounded-full border-neutral-600 focus:border-neutral-300 align-middle bg-inherit">
                <input
                  type="text"
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full text-sm bg-inherit border-hidden focus:ring-transparent focus:outline-none"
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      <PushSpace pushSpaceId={pushSpaceId} />
    </>
  );
}
