"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const SlideSection = () => {
  useEffect(() => {
    // This runs only on the client
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");

    if (refParam) {
      localStorage.setItem("ref", refParam);
      // optionally store it in state
    }
  }, []);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  return (
    <>
      <section id="hero" className="clearfix position-relative">
        <div
          className="d-md-block d-none"
          style={{
            position: "absolute",
            right: "-90px",
            top: 0,
            maxWidth: "45%",
            height: "100%",
            objectFit: "contain",
          }}
        >
          <Image
            src="/assets/img/blockchain3.png"
            className="img-fluid"
            alt="Blockchain"
            width={500}
            height={500}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <div className="container d-flex h-100">
          <div
            className="row justify-content-center align-items-center w-100"
            data-aos="fade-up"
          >
            <div
              className="col-md-7 intro-info order-md-first order-last"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <span className="text-white-50">Simple. Secure. Scalable.</span>
              <h2 className="mb-3 text-white">
                Your Trusted Gateway to Limitless{" "}
                <span className="text-uppercase">DeFi Opportunities</span>
              </h2>
              <h5 className="text-white">
                Experience decentralized finance with full control,
                transparency, and unlimited earning potential.
              </h5>
              {isConnected && address ? (
                <div className="mt-3">
                  <Link
                    href="/BuyNode"
                    className="btn btn-pink px-4 py-2 rounded-pill"
                  >
                    Buy Node
                  </Link>
                </div>
              ) : (
                <div onClick={openConnectModal} className="mt-3">
                  <Link
                    href="#"
                    className="btn btn-pink px-4 py-2 rounded-pill"
                  >
                    Buy Node
                  </Link>
                </div>
              )}
            </div>

            <div
              className="col-md-5 intro-img order-md-last order-first"
              data-aos="zoom-out"
              data-aos-delay="200"
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SlideSection;
