"use state";

import { useEffect, useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { MicrophoneIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import React from "react";
import * as PushSDK from "@pushprotocol/restapi";

const speaker = [
  {
    name: "vitalik.eth",
    img: "https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg",
  },
  {
    name: "Sandeep 💜",
    img: "https://pbs.twimg.com/profile_images/1692578421530935300/l4hnpDNc_400x400.jpg",
  },
  {
    name: "Steven (💙,🧡,🖊️,🦀)",
    img: "https://pbs.twimg.com/profile_images/1696947038590529536/rt6GSewe_400x400.png",
  },
];

const listener = [
  {
    name: "Nava Labs",
    img: "https://pbs.twimg.com/profile_images/1655960259641614336/YCTL4YU__400x400.png",
  },
  {
    name: "Jonas Sunandar",
    img: "https://pbs.twimg.com/profile_images/1535960380626718720/lxrv_gOd_400x400.png",
  },
  {
    name: "0xMyro",
    img: "https://pbs.twimg.com/profile_images/1721738700600868864/zc6d13bz_400x400.jpg",
  },
  {
    name: "0xBenimaru",
    img: "https://pbs.twimg.com/profile_images/1631546641500225536/Ew-jOIcM_400x400.jpg",
  },
  {
    name: "the.watcher",
    img: "https://pbs.twimg.com/profile_images/1552569753474330624/T4dTsoET_400x400.jpg",
  },
  {
    name: "yedija.eth",
    img: "https://pbs.twimg.com/profile_images/1587313836906147840/emH3DKlC_400x400.jpg",
  },
  {
    name: "deeners 🎭",
    img: "https://pbs.twimg.com/profile_images/1628083376975675394/pA8I-v9w_400x400.jpg",
  },
  {
    name: "ArtKuma 🐻‍❄️",
    img: "https://pbs.twimg.com/profile_images/1713033410955128832/11RAGKfL_400x400.jpg",
  },
  {
    name: "jojee.eth",
    img: "https://pbs.twimg.com/profile_images/1628414759711408130/VTSQnDBz_400x400.jpg",
  },
  {
    name: "k",
    img: "https://pbs.twimg.com/profile_images/1612156261646368768/LhktjSnj_400x400.jpg",
  },
  {
    name: "jeetmex.eth",
    img: "https://pbs.twimg.com/profile_images/1716149694286712832/AbzgRHKD_400x400.jpg",
  },
  {
    name: "paper trader",
    img: "https://pbs.twimg.com/profile_images/1731902811699544064/SYLRcnCY_400x400.jpg",
  },
];

type SpaceListener = {
  wallet: string;
  publicKey: string;
  isSpeaker: boolean;
  image: string;
}

function PushSpace(props: any) {
  const { pushSpaceId, user, accountAddr, signer} = props
  
  const [listeningUsers, setListeningUsers] = useState<SpaceListener[]>([]);
  const [spaceDescription, setSpaceDescription] = useState("");
  const [spaceName, setSpaceName] = useState("");

  useEffect(() => {
    async function getSpaceDetail() {

      const response = await PushSDK.space.get({
        spaceId: pushSpaceId
      });
      let listening = response.members;
      setListeningUsers(listening);
      setSpaceDescription(response.spaceDescription)
      setSpaceName(response.spaceName)
    }
    getSpaceDetail()
  }, []);

  const handleJoinSpace = async () => {
    try {
      const response = await PushSDK.space.approve({
        senderAddress: pushSpaceId
      });
    } catch (err) {
      console.log("error join space ", err)
    }
  }

  const addListener = async ()=>{
    try {
      if (user && accountAddr){
        const encrypted = (await user.info()).encryptedPrivateKey
        const pgpDecryptedPvtKey = await PushSDK.chat.decryptPGPKey({
          encryptedPGPPrivateKey: encrypted, 
          signer: signer
        });

        const response = await PushSDK.space.addListeners({
          spaceId: pushSpaceId,
          listeners: [
            accountAddr
          ],
          signer: signer,
          pgpPrivateKey: pgpDecryptedPvtKey,
        });
      }
      
    } catch (err) {
      console.log("error join space ", err)
    }
  }
  return (
    <div className="w-full h-full mt-3">
      <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
        <div className="group flex justify-between items-center rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
          <div className="flex flex-col space-x-2 items-center">
            <h4 className="flex items-center font-semibold">Case Space</h4>
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
            onClick={handleJoinSpace}
            className="text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
          >
            Join Space
          </button>
        </div>

        <div className="p-4 leading-5 sm:leading-6">
          <div className="flex flex-col">
            <div className="text-lg font-medium">{spaceName}</div>
            <div className="flex space-x-2 items-center ">
              <div className="flex items-center text-sm text-neutral-400">
                <MicrophoneIcon className="h-4 mr-1" />
                <div>3 speaking</div>
              </div>
              <div className="flex items-center text-sm text-neutral-400">
                <UserGroupIcon className="h-4 mr-1" />
                <div>{setListeningUsers.length} listening</div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-center m-1 space-x-2 pb-5 border-b-[1px] border-neutral-600">
              {speaker.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center h-64 w-72 transition-all p-2 border-[1px] rounded-xl border-neutral-600 hover:border-neutral-400 cursor-pointer text-base shadow-md shadow-neutral-700"
                >
                  <div className="w-full p-4 leading-5 sm:leading-6">
                    <div className="flex items-center justify-center mb-2">
                      <img
                        src={item.img}
                        alt="organization logo"
                        className="rounded-full bg-neutral-900 object-cover h-20 w-20 min-w-20 mb-1"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <h3 className="text-lg font-medium bg-neutral-500 bg-opacity-20 rounded-lg px-2 py-1">
                        {item.name}
                      </h3>
                      <SpeakerWaveIcon className="h-4 ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 w-full justify-center m-1 pt-5 border-neutral-600">
              {listener.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-2 text-base"
                >
                  <div className="w-full p-2 leading-5 sm:leading-6 hover:bg-neutral-700 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <img
                        src={item.img}
                        alt="organization logo"
                        className="rounded-full bg-neutral-900 object-cover h-12 w-12 mb-1"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <h3 className="text-base font-medium bg-neutral-500 bg-opacity-20 rounded-lg px-2 py-1">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PushSpace;
