"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { getDashboard, login } from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { encryptText } from "@/app/halper/encryption";
import CustomDrawer from "../SidebarDrawer/page";

const HeaderMain = () => {
  const navigation = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpen = () => setOpenDrawer(true);
  const handleClose = () => setOpenDrawer(false);
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, isConnected, isDisconnected } = useAccount(); // Added isConnected for better connection state handling
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

  useEffect(() => {
    if (isConnected) {
      async () => await getDashboard();
      navigation.push("/BuyNode");
    }
  }, [isConnected]);

  useEffect(() => {
    if (isDisconnected) {
      navigation.push("/");
    }
  }, [isDisconnected]);

  const handleLogin = useCallback(async () => {
    if (!address) return;

    try {
      const result = await login(
        address as `0x${string}`,
        ref || "0x0000000000000000000000000000000000000000",
        "hbfbhrb" as `0x${string}`,
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
    if (isConnected) {
      handleLogin();
    }
  }, [isConnected, handleLogin]);

  return (
    <header id="header" className="fixed-top header-transparent">
      <div
        className="container d-flex align-items-center"
        style={{
          display: "flex !important",
          justifyContent: "center !important",
          alignItems: "center !important",
        }}
      >
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
          <ul className="align-items-center gap-3">
            <li className="active">
              <p
                className="hover-text"
                // style={{
                //   color: "#dd9f03",
                //   fontFamily: "serif",
                //   fontWeight: "bold",
                // }}
                onClick={() => {
                  const section = document.getElementById("service");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Web3 Services
              </p>
            </li>
            <li>
              <p
                className="hover-text"
                onClick={() => {
                  const section = document.getElementById("solution");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Solution
              </p>
            </li>
            <li>
              <p
                className="hover-text"
                onClick={() => {
                  const section = document.getElementById("ecosystem");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Ecosystem
              </p>
            </li>
            <li>
              <p
                className="hover-text"
                onClick={() => {
                  const section = document.getElementById("upgrade");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Upgrade
              </p>
            </li>
            <li>
              <p
                className="hover-text"
                onClick={() => {
                  const section = document.getElementById("FAQ");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                FAQ
              </p>
            </li>

            <li>
              <YourApp />
            </li>
          </ul>
        </nav>
        <div className="text-end d-md-none d-inline-block">
          {/* IoClose  */}
          {openDrawer ? (
            <IoClose
              onClick={() => setOpenDrawer(false)}
              size={35}
              style={{ color: "white" }}
            />
          ) : (
            <IoMenuSharp
              onClick={() => setOpenDrawer(true)}
              size={35}
              style={{ color: "white" }}
            />
          )}
          <CustomDrawer
            open={openDrawer}
            onClose={handleClose}
            anchor="left"
            width={400}
            size={30}
          >
            <div className="text-white">
              <ul
                style={{ display: "flex", flexDirection: "column", gap: 15 }}
                // className="nav gap-3 align-items-center"
              >
                <li className="nav-item">
                  <p
                    onClick={() => {
                      const section = document.getElementById("service");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDrawer(false);
                    }}
                  >
                    Web3 Services
                  </p>
                </li>
                <li className="nav-item">
                  <p
                    onClick={() => {
                      const section = document.getElementById("solution");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDrawer(false);
                    }}
                  >
                    Solution
                  </p>
                </li>
                <li className="nav-item">
                  <p
                    onClick={() => {
                      const section = document.getElementById("ecosystem");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDrawer(false);
                    }}
                  >
                    Ecosystem
                  </p>
                </li>
                <li className="nav-item">
                  <p
                    onClick={() => {
                      const section = document.getElementById("upgrade");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDrawer(false);
                    }}
                  >
                    Upgrade
                  </p>
                </li>
                <li className="nav-item">
                  <p
                    onClick={() => {
                      const section = document.getElementById("FAQ");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDrawer(false);
                    }}
                  >
                    FAQ
                  </p>
                </li>
                <li className="nav-item">
                  <YourApp />
                </li>
              </ul>
            </div>
          </CustomDrawer>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;

const YourApp = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="gold-button shine-button px-4 py-2 rounded-pill"
                    // type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="gold-button shine-button px-4 py-2 rounded-pill"
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div>
                  {/* <button
                    onClick={openChainModal}
                    className="gold-button shine-button px-4 py-2 rounded-pill"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button> */}

                  <button
                    onClick={openAccountModal}
                    className="gold-button text-nowrap shine-button px-4 py-2 rounded-pill"
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
