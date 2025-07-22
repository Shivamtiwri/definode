// src/wagmi/index.ts
"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "91d0138547dbe410357be928a7063205",
  chains: [
    bsc,
    bscTestnet,
    // ✅ Always include BSC Testnet
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [bsc] : []),
  ],
  ssr: true,
});
