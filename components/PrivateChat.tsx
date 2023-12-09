"use client";

import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
// import { mainnet } from 'viem/chains'
import { WalletClient, useSignMessage, useWalletClient } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import * as React from "react";
import { Wallet, providers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import { getOrgsAdmin } from "@/shared/utils/organizations";
import PushSpace from "./PushSpace";
import * as PushSDK from "@pushprotocol/restapi";
import { EVENTS, createSocketConnection } from '@pushprotocol/socket';


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

export default function PrivateChat(props: any) {
 const { orgsAdmins, user, accountAddr, signer, privateChatId, organizations, hackerAddr } = props

 const [message, setMessage] = useState("");
 const [groupChats, setGroupChats] = useState<any>();

 useEffect(() => {
  async function initStream() {
   const stream = await user.initStream([CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS], {
    filter: {
     channels: ['*'], // pass in specific channels to only listen to those
     chats: [privateChatId], // pass in specific chat ids to only listen to those
    },
    connection: {
     retries: 3, // number of retries in case of error
    },
    raw: false // enable true to show all data
   })
   stream.on(CONSTANTS.STREAM.CHAT, (data: any) => {
    handleIncomingMessage(data);
   })
   let groupChats = await user.chat.history(privateChatId);
   groupChats = formatGroupChats(groupChats);
  }
  initStream()
 }, [])

 function formatGroupChats(groupChats: any) {
  groupChats = groupChats.reverse();
  for (let i = 0; i < groupChats.length; i++) {
   let chatSender = formatDID(groupChats[i].fromDID).toLowerCase();
   groupChats[i].logoUrl = ""; //officer logo

   groupChats[i].fromDID = truncateEthAddress(
    formatDID(groupChats[i].fromDID)
   );

   if (orgsAdmins[chatSender]) {
    groupChats[i].fromDID =
     groupChats[i].fromDID + " - " + orgsAdmins[chatSender] + " Admin";
    groupChats[i].logoUrl = orgsAdmins[chatSender].logoUrl;
   } else if (chatSender == hackerAddr) {
    groupChats[i].fromDID = groupChats[i].fromDID + " - Hacker";
   } else {
    groupChats[i].fromDID = groupChats[i].fromDID + " - Officer";
   }
  }
  return groupChats;
 }

 const handleIncomingMessage = async (data: any) => {
  let currentChat = groupChats;
  currentChat.push({
   fromDID: data.from,
   messageContent: data.message.content,
   timestamp: data.timestamp
  })
  currentChat = formatGroupChats(currentChat);
  setGroupChats(currentChat);
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
     await user.chat.send(privateChatId, {
      type: "Text",
      content: message,
     });
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
    const joinGroup = await user.chat.group.join(privateChatId);
   } catch (err) {
    console.log("error join group ", err);
   }
  }
 };

 return (
  <>

   <div className="w-full h-full mt-3">
    <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
     <div className="group flex justify-between items-center rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
      <div className="flex flex-col space-x-2 items-center">
       <h4 className="flex items-center font-semibold">Private Discussion</h4>
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
  </>
 );
}
