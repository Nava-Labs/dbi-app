import { createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { polygonMumbai } from "viem/chains"

export const signerWalletClient = createWalletClient({
    chain: polygonMumbai,
    transport: http()
})

export const SIGNER_PK = process.env.NEXT_PUBLIC_SIGNER_PK!
export const SIGNER = privateKeyToAccount(SIGNER_PK as `0x${string}`)