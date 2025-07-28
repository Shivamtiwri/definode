"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RainbowKitProvider, Locale } from "@rainbow-me/rainbowkit";

export default function RainbowKitWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathLocale = pathname.split("/")[1] as Locale;
  const supportedLocales: Locale[] = ["en", "fr", "de", "es"];

  const locale: Locale = supportedLocales.includes(pathLocale)
    ? pathLocale
    : "en";

  return <RainbowKitProvider locale={locale}>{children}</RainbowKitProvider>;
}
