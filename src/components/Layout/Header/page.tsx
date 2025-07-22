"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { login } from "@/services/api";
import toast from "react-hot-toast";
import { encryptText } from "@/app/halper/encryption";

const HeaderMain = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, isConnected } = useAccount(); // Added isConnected for better connection state handling
  const [ref, setRef] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [nonce, setNonce] = useState("");
  const { data: signMessageData, signMessage } = useSignMessage();

  // Safe access to localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRef(localStorage.getItem("ref"));
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Generate nonce only when needed
  useEffect(() => {
    if (!token && isConnected && address) {
      const newNonce = generateNonce();
      setNonce(newNonce);
    }
  }, [token, isConnected, address]);

  // Sign message when nonce and address are available
  useEffect(() => {
    if (nonce && address && isConnected) {
      signMessage({ message: nonce });
    }
  }, [nonce, address, isConnected, signMessage]);

  const generateNonce = () => {
    return Math.floor(Math.random() * 0xffffff).toString(32);
  };

  const handleLogin = useCallback(async () => {
    if (!address || !signMessageData) return;

    try {
      const result = await login(
        address as `0x${string}`,
        ref || "0x0000000000000000000000000000000000000000",
        signMessageData as `0x${string}`,
        encryptText(nonce)
      );

      if (result.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", result.data.data.token);
          setToken(result.data.data.token);
        }
        toast.success(result.data.message);
      } else {
        toast.error(result.error.message);
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    }
  }, [address, ref, signMessageData, nonce]);

  useEffect(() => {
    if (signMessageData && nonce && isConnected) {
      handleLogin();
    }
  }, [signMessageData, nonce, isConnected, handleLogin]);

  return (
    <header id="header" className="fixed-top header-transparent">
      <div className="container d-flex align-items-center">
        <h1 className="logo mr-auto">
          <Link href="/" className="d-md-block d-none">
            <Image
              src="/assets/img/logo.png"
              alt="Logo"
              width={200}
              height={60}
              priority // Added for better LCP performance
            />
          </Link>
          <Link href="/" className="d-block d-md-none">
            <Image
              src="/assets/img/icon.png"
              alt="Logo"
              width={40}
              height={40}
              priority // Added for better LCP performance
            />
          </Link>
        </h1>
        <nav className="main-nav d-none d-lg-block">
          <ul className="align-items-center d-flex gap-3">
            <li className="active">
              <Link href="#">Web3 Services</Link>
            </li>
            <li>
              <Link href="#">Solution</Link>
            </li>
            <li>
              <Link href="#">Ecosystem</Link>
            </li>
            <li>
              <Link href="#">Upgrade</Link>
            </li>
            <li>
              <Link href="#">FAQ</Link>
            </li>

            <li>
              {isConnected && address ? (
                <button
                  onClick={openAccountModal}
                  className="btn btn-pink px-4 py-2 rounded-pill"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={openConnectModal}
                  className="btn btn-pink px-4 py-2 rounded-pill"
                >
                  Connect Wallet
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderMain;
