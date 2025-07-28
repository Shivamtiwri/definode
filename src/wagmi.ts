// src/wagmi/index.ts
"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "DEFI NODE",
  projectId: "91d0138547dbe410357be928a7063205",
  appUrl: "https://definode.io/",
  appIcon: "https://definode.io/assets/img/logo.png",
  appDescription: "Defi Node is the future of innovation and metaVerse.",
  chains: [
    bsc,
    // ✅ Always include BSC Testnet
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [bsc] : []),
  ],
  ssr: true,
});
