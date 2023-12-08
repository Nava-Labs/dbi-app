"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { polygonMumbai } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";

const config = createConfig(
  getDefaultConfig({
    alchemyId: "",
    walletConnectProjectId: "",
    appName: "Decentralized Bureau of Investigation",
    chains: [polygonMumbai],
  })
);

export default function providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="auto" mode="dark">
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
