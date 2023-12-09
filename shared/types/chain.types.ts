export const supportedChainID = [ // sort by name
  5001, // Mantle Testnet
  421613, // Arbitrum Goerli
  80001, // Polygon Mumbai
  534351, // Scroll Sepolia
  84531, // Base Goerl
] as const;
export type SupportedChainID = typeof supportedChainID[number]
