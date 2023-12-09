import lighthouse from '@lighthouse-web3/sdk'
import { SIGNER, signerWalletClient } from '../signerWallet';

export const signAuthMessage = async () => {
    try {
        const signerAddress = "0x5E61132B8883FD54Bf620ca7728c37360e3EB839";

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