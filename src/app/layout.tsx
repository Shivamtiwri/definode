import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderMain from "@/components/Layout/Header/page";
import FooterMain from "@/components/Layout/Footer/page";
import Script from "next/script";
import PageLoader from "@/components/PageLoader/page";
import Providers from "@/Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeFi Node",
  description:
    "Experience decentralized finance with full control, transparency, and unlimited earning potential",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <HeaderMain />
          <PageLoader />
          {children}
          <FooterMain />

          {/* Scripts */}
          <Script
            src="/assets/vendor/jquery/jquery.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="/assets/vendor/jquery.easing/jquery.easing.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="/assets/vendor/isotope-layout/isotope.pkgd.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="/assets/vendor/counterup/counterup.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="/assets/vendor/venobox/venobox.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="/assets/vendor/owl.carousel/owl.carousel.min.js"
            strategy="lazyOnload"
          />
          <Script src="/assets/vendor/aos/aos.js" strategy="lazyOnload" />
          <Script src="/assets/js/main.js" strategy="lazyOnload" />
          <Toaster position="top-right" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
