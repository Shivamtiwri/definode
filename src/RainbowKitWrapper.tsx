"use client";

import React from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function RainbowKitWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RainbowKitProvider>{children}</RainbowKitProvider>;
}
