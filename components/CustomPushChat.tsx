"use client"

import { useEffect, useState } from 'react'
import { createWalletClient, custom } from 'viem'
// import { mainnet } from 'viem/chains'
import { WalletClient, useSignMessage, useWalletClient } from 'wagmi'
import { PushAPI } from '@pushprotocol/restapi'
import * as React from 'react'
import { Wallet, providers } from 'ethers'
import * as PushSDK from "@pushprotocol/restapi";

export function walletClientToSigner (walletClient: WalletClient) {
 const { account, chain, transport } = walletClient
 const network = {
   chainId: chain.id,
   name: chain.name,
   ensAddress: chain.contracts?.ensRegistry?.address
 }
 const provider = new providers.Web3Provider(transport, network)
 const signer = provider.getSigner(account.address)
 return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner ({ chainId }: { chainId?: number } = {}) {
 const { data: walletClient } = useWalletClient({ chainId })
 return React.useMemo(
   () => (walletClient ? walletClientToSigner(walletClient) : undefined),
   [walletClient]
 )
}
function formatDID (did: string) {
 const splitted = did.split(':')
 return splitted[1]
}

export default function CustomPushChat(props: any) {
 const { groupChatId } = props

 const [user, setUser] = useState<PushAPI>()
 const [message, setMessage] = useState('')

 const [groupChats, setGroupChats] = useState<any>()
 const { data: walletClient, isError, isLoading } = useWalletClient()

 useEffect(() => {
  if (walletClient) {
   getAccount(walletClient)
 }
 async function getAccount (walletClient: WalletClient) {
   let signer = walletClientToSigner(walletClient)
   const userPush = await PushAPI.initialize(signer)
   setUser(userPush)
   let groupChats = await userPush.chat.history(groupChatId);
   let groupInfo = await userPush.chat.group.info(groupChatId);
   console.log("group info: ", groupInfo)
   console.log("group chat: ", groupChats)
   // groupChats = formatGroupChats(groupChats)
   setGroupChats(groupChats)
 }
 }, [walletClient])
 
 const handleJoinGroup = async () => {
  if (user) {
    try {
      const joinGroup = await user.chat.group.join(groupChatId)
      console.log("console join group ", joinGroup);
    } catch (err) {
      console.log('error join group ', err)
    }
  }
}
const handleSendMessage = async () => {
 if (message.trim() !== '') {
   if (user) {
     try {
       console.log('message ', message, user)
       await user.chat.send(groupChatId, {
         type: 'Text',
         content: message
       })
     } catch (err) {
       console.log(err)
     }
   } else {
     console.log('error handle send message : user not found')
   }
   setMessage('')
 }
}
const handleInputChange = (e: any) => {
 setMessage(e.target.value)
}

 return (
  <div>
   <button onClick={handleJoinGroup}>Send</button>
      <br></br>
      <input
        type='text'
        value={message}
        onChange={handleInputChange}
        placeholder='Type your message...'
      />
      <button onClick={handleSendMessage}>Send</button>
    <ol>
        <li>yoo</li>
        {groupChats &&
          groupChats?.map(function (chat: any) {
            return (
              <li>
                <p>From: {formatDID(chat.fromDID)}</p>
                <p>Chat: {chat.messageContent}</p>
                <p>Timestamp: {chat.timestamp}</p>
              </li>
            )
          })}
      </ol>
  </div>
 )
}