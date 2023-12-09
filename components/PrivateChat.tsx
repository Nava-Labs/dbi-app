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
import * as PushSDK from "@pushprotocol/restapi";
// import { EVENTS, createSocketConnection } from '@pushprotocol/socket';


export default function PrivateChat(props: any) {
     const { user, accountAddr, signer, privateChatId, organizations, hackerAddr } = props
     const [message, setMessage] = useState("");
     const [groupChats, setGroupChats] = useState<any>([]);
     const [myTrigger, setMyTrigger] = useState<any>();
     useEffect(() => {
          if (user) initStream()
          async function initStream() {
               console.log("how stream ")
               let groupChats = await user.chat.history(privateChatId);
               console.log("chat chat ", groupChats, organizations)
               let orgsAdmins = getOrgsAdmin(organizations);
               groupChats = formatGroupChats(groupChats, orgsAdmins);
               setGroupChats(groupChats)
               console.log("group chats", groupChats)
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
                    console.log("ada event ges", data);
                    handleIncomingMessage(data);
               })
               stream.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
                    console.log("Ada event chatops", data);
                    console.log(data)
               })
               await stream.connect()

          }
     }, [myTrigger])

     function formatGroupChats(groupChats: any, orgsAdmins: any) {
          // groupChats = groupChats.reverse();
          for (let i = 0; i < groupChats.length; i++) {
               let chatSender = groupChats[i].fromDID[0] == "e" ? formatDID(groupChats[i].fromDID).toLowerCase() : groupChats[i].fromDID; //depan nya ada e?
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

     function getFormatDIDFromIncomingMessage(message:any){ //from incoming
          let orgsAdmins = getOrgsAdmin(organizations);
          message.messageContent = message.message.content;
          message.timestamp = Number(message.timestamp)
          let chatSender = message.from[0] == "e" ? formatDID(message.from).toLowerCase() : message.from; //depan nya ada e?
          const truncated = truncateEthAddress(chatSender);
          console.log("chat sendeer ", chatSender)
          if (orgsAdmins[chatSender]) {
               message.fromDID = truncated + " - " + orgsAdmins[chatSender] + " Admin";
               message.logoUrl = orgsAdmins[chatSender].logoUrl;
          } else if (chatSender == hackerAddr) {
               message.fromDID = truncated + " - Hacker";
          } else {
               message.fromDID = truncated + " - Officer";
          }
          console.log("new message", message)
          return message;
     }

     const handleIncomingMessage = async (data: any) => {
          // setGroupChats([
          //      ...groupChats,
          //      getFormatDIDFromIncomingMessage(data)
          //    ]);
          // setGroupChats((prevGroupChats: any) => {
          //      prevGroupChats.push(getFormatDIDFromIncomingMessage(data))
          //      return prevGroupChats;
          // });
          setGroupChats((prevGroupChats: any) => {
               return [...prevGroupChats, getFormatDIDFromIncomingMessage(data)];
           });
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
          setMyTrigger("mytrigger")
          if (user) {
               try {
                    const joinGroup = await user.chat.group.join(privateChatId);
               } catch (err) {
                    console.log("error join group ", err);
               }
          }
     };

     console.log("groups ", groupChats)

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
