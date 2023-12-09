import lighthouse from '@lighthouse-web3/sdk'
import { SIGNER, signerWalletClient } from '../signerWallet';

export const signAuthMessage = async () => {
    try {
        const signerAddress = "0x650D2486309202DA8Ea87EDB7ED3Bdc63573DBa2";

        // Fetch a message from Lighthouse to sign
        const { message } = (await lighthouse.getAuthMessage(signerAddress)).data;

        const signature = await signerWalletClient.signMessage({ 
            account: SIGNER,
            message,
        })

        // Return both the signature and signer's address
        return { signature, signerAddress };
    } catch (error) {
        console.error("Error signing lighthouse auth message", error);
        return null;
    }
};