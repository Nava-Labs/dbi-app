import {
 ChatUIProvider,
 ChatView,
 CreateGroupModal,
 MODAL_POSITION_TYPE,
 darkChatTheme,
} from "@pushprotocol/uiweb";
import { useAccount, useWalletClient } from "wagmi";

export default function PushChat() {
 const { address, isConnected } = useAccount();

 return (
   <div className="border-y border-neutral-600 text-base md:rounded-xl md:border mt-2">
     <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
       <h4 className="flex items-center font-semibold">Chat</h4>
     </div>

     <div className="p-4 leading-5 sm:leading-6">
       <ChatUIProvider theme={darkChatTheme}>
         <ChatView
           chatId="ca21ff2388999fe0e254248a8a194a8ce98f79ec072c20cf74e5cd016474ca2f"
           limit={10}
           isConnected={true}
           verificationFailModalPosition={MODAL_POSITION_TYPE.RELATIVE}
         />
       </ChatUIProvider>
     </div>
   </div>
 );
}
