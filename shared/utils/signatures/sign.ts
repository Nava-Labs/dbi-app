import { SIGNER, signerWalletClient } from '../signerWallet';

export const getSignature = async (contractAddress: string, account: string, nonce: BigInt) => { 
    const domain = {
      name: "DBI",
      version: "1.0.0",
      chainId: 80001,
      verifyingContract: contractAddress as `0x${string}`
    }
  
    const types = {
      DBI: [
        { name: "contractAddress", type: "address" },
        { name: "account", type: "address" },
        { name: "nonce", type: "uint256"}
      ]
    }
  
    const value = {
      contractAddress,
      account,
      nonce
    }
  
    const signature = await signerWalletClient.signTypedData({
        account: SIGNER, 
        domain, 
        types, 
        primaryType: 'DBI',
        message: value
    });
  
    return signature
}
  