"use client";

import React from "react";
import {
  darkTheme,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

export default function RainbowKitWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RainbowKitProvider theme={midnightTheme()}>{children}</RainbowKitProvider>
  );
}
