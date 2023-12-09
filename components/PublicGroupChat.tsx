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

export default function CustomPushChat (props: any) {
  const { groupChatId , organizations} = props
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<PushAPI>()
  const [signer, setSigner] = useState<PushSDK.SignerType>()
  const [groupChats, setGroupChats] = useState<any>()
  // PushAPI.initialize(useWalletClient() );
  const { data: walletClient, isError, isLoading } = useWalletClient()
  console.log("wallet client ", walletClient)
  useEffect(() => {
    if (walletClient) {
      getAccount(walletClient)
    }
    async function getAccount (walletClient: WalletClient) {
      let signer = walletClientToSigner(walletClient)
      setSigner(signer)
      const userPush = await PushAPI.initialize(signer)
      setUser(userPush)
      let groupChats = await userPush.chat.history(groupChatId);
      let groupInfo = await userPush.chat.group.info(groupChatId);
      let groupPermissions = await userPush.chat.group.permissions(groupChatId);
      console.log("group info ini bos ", groupInfo)
      console.log("group permission ", groupPermissions)
      if (groupChats[0].messageObj == "Unable to Decrypt Message"){
        console.log("You need to join the group or pass quiz test first")
      }else {
        console.log("wtf")
      }
      console.log("group chatsx ", groupChats)
      groupChats = formatGroupChats(groupChats)
      setGroupChats(groupChats)
    }
  }, [walletClient])

  function formatGroupChats(groupChats:any){
    let orgsAdmins:any = {};
    for(let i=0;i<organizations.length;i++){
      orgsAdmins[organizations[i].creator.toLowerCase()] = organizations[i].name;
    }
    for(let i=0;i<groupChats.length;i++){
      let chatSender = formatDID(groupChats[i].fromDID).toLowerCase();
      if (orgsAdmins[chatSender]){
        groupChats[i].fromDID = groupChats[i].fromDID + " - " + orgsAdmins[chatSender] + " Admin"
      }
    }
    return groupChats
  }

  function formatDID (did: string) {
    const splitted = did.split(':')
    return splitted[1]
  }
  const handleInputChange = (e: any) => {
    setMessage(e.target.value)
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

  const handleCreateSpace = async () => {
    if (user) {
      const encrypted = (await user.info()).encryptedPrivateKey
      const pgpDecryptedPvtKey = await PushSDK.chat.decryptPGPKey({
        encryptedPGPPrivateKey: encrypted, 
        signer: signer
      });

      // const pgpDecryptedPvtKey = await PushAPI.

      // actual api
      const response = await PushSDK.space.create({
        spaceName:'wasteful_indigo_warbler',
        spaceDescription: 'boring_emerald_gamefowl',
        listeners: [],
        spaceImage:"space image link",
        speakers: ['0x3829E53A15856d1846e1b52d3Bdf5839705c29e5'],
        isPublic: true,
        signer: signer!,
        pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
        scheduleAt: new Date("2024-07-15T14:48:00.000Z"),
        scheduleEnd: new Date("2024-07-15T15:48:00.000Z")
      });
    }
  }

  const handleCreateGroup = async () => {
    if (user) {
      try {
        const name = 'Kyber Hack'
        const description = 'lfg'
        const image = 'data:image/png;base64,iVBORw0K'

        const createdGroup = await user.chat.group.create(name, {
          image,
          description
        })
        console.log('created group ', createdGroup)
      } catch (err) {
        console.log('error create group ', err)
      }
    }
  }

  const handleCreateGroupWithHacker = async () => {
    if (user) {
      try {
        const hackerAddr = '0x000'
        const name = '[Private] Kyber Hack With Hacker'
        const description = 'lfg'
        const image = 'data:image/png;base64,iVBORw0K'

        const createdGroup = await user.chat.group.create(name, {
          private: true,
          image,
          description,
          members: [hackerAddr]
        })
        console.log('created group ', createdGroup)
      } catch (err) {
        console.log('error create group ', err)
      }
    }
  }

  const handleCreateGroupNFTGated = async () => {
    console.log("trying to handle create group nft 1");

    if (user) {
      try {
        console.log("trying to handle create group nft 2");
        const hackerAddr = '0x000'
        const name = '[Private] Kyber Hack With Hacker'
        const description = 'lfg'
        const image = 'data:image/png;base64,iVBORw0K'

        const createTokenGatedGroup = await user.chat.group.create(
          name,
          {
            description: "Token gated web3 native chat example", // provide short description of group
            image: "data:image/png;base64,iVBORw0K...", // provide base64 encoded image
            members: [], // not needed, rules define this, can omit
            admins: [], // not needed as per problem statement, can omit
            private: true,
            rules: {
              "entry": { // entry is based on conditions
                "conditions": {
                  "any": [ // any of the decider should allow entry
                    { // decider 1 - If admin or owner invites someone
                      "any": [ 
                        { // criteria 1
                          "type": "PUSH",
                          "category": "INVITE",
                          "subcategory": "DEFAULT",
                          "data": {
                              "inviterRoles": [
                                  "ADMIN",
                                  "OWNER"
                              ]
                          }
                        }
                      ]
                    },
                    { // decicder 2 - If wallet holds 1 NFT on polygon testnet
                      "any": [
                        { // criteria 1
                          type: "PUSH", // define type that rules engine should go for
                          category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                          subcategory: "holder", // define if you are checking 'holder'
                          data: { 
                            "contract": "eip155:80001:0xFB89d695b8007dcA98080dcbb282E1a0A6440C13", //addr deputy
                            "comparison": ">=", // what comparison needs to pass
                            "amount": 1, // amount that needs to passed
                            "decimals": 18,
                          }
                        }
                      ]
                    }
                  ]
                }
              }
            }
          },
        );
        console.log('created group ', createTokenGatedGroup)
      } catch (err) {
        console.log('error create group ', err)
      }
    }
  }

  return (
    <div>
      <button onClick={handleCreateGroupNFTGated}>Create new group Deputy</button>
      <br></br>
      <button onClick={handleCreateSpace}>Create new space</button>
      <br></br>
      <button onClick={handleJoinGroup}>Join</button>
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
