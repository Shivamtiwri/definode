"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckSponser } from "@/services/api";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface CircleSettings {
  ttl: number;
  xmax: number;
  ymax: number;
  rmax: number;
  rt: number;
  xdef: number;
  ydef: number;
  xdrift: number;
  ydrift: number;
  random: boolean;
  blink: boolean;
}

class Circle {
  s: CircleSettings;
  width: number;
  height: number;
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  hl: number;
  rt: number;
  stop: number;

  constructor(width: number, height: number, settings: CircleSettings) {
    this.s = { ...settings };
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.dx = 0;
    this.dy = 0;
    this.hl = 0;
    this.rt = 0;
    this.stop = 0;
    this.reset();
  }

  reset() {
    this.x = this.s.random ? Math.random() * this.width : this.s.xdef;
    this.y = this.s.random ? Math.random() * this.height : this.s.ydef;
    this.r = (this.s.rmax - 1) * Math.random() + 1;
    this.dx = Math.random() * this.s.xmax * (Math.random() < 0.5 ? -1 : 1);
    this.dy = Math.random() * this.s.ymax * (Math.random() < 0.5 ? -1 : 1);
    this.hl = (this.s.ttl / 70) * (this.r / this.s.rmax);
    this.rt = Math.random() * this.hl;
    this.s.rt = Math.random() + 1;
    this.stop = Math.random() * 0.2 + 0.4;
    this.s.xdrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
    this.s.ydrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
  }

  fade() {
    this.rt += this.s.rt;
  }

  draw(con: CanvasRenderingContext2D) {
    if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) {
      this.s.rt = -this.s.rt;
    } else if (this.rt >= this.hl) {
      this.reset();
    }

    const opacity = 1 - this.rt / this.hl;
    con.beginPath();
    con.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    con.closePath();

    const cr = this.r * opacity;
    const gradient = con.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      Math.max(cr, 1)
    );
    gradient.addColorStop(0.0, `rgba(193,254,254,${opacity})`);
    gradient.addColorStop(this.stop, `rgba(193,254,254,${opacity * 0.2})`);
    gradient.addColorStop(1.0, "rgba(193,254,254,0)");
    con.fillStyle = gradient;
    con.fill();
  }

  move() {
    this.x += (this.rt / this.hl) * this.dx;
    this.y += (this.rt / this.hl) * this.dy;
    if (this.x > this.width || this.x < 0) this.dx *= -1;
    if (this.y > this.height || this.y < 0) this.dy *= -1;
  }
}

const SlideSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Circle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const galaxyWrapper = canvas.parentElement as HTMLElement;
    const WIDTH = galaxyWrapper.clientWidth;
    const HEIGHT = galaxyWrapper.clientHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const settings: CircleSettings = {
      ttl: 15000,
      xmax: 5,
      ymax: 2,
      rmax: 17,
      rt: 1,
      xdef: WIDTH / 2,
      ydef: HEIGHT / 2,
      xdrift: 2,
      ydrift: 2,
      random: true,
      blink: true,
    };

    particlesRef.current = Array.from(
      { length: 100 },
      () => new Circle(WIDTH, HEIGHT, settings)
    );

    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.globalCompositeOperation = "lighter";

      particlesRef.current.forEach((p) => {
        p.fade();
        p.move();
        p.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      const newWidth = galaxyWrapper.clientWidth;
      const newHeight = galaxyWrapper.clientHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      particlesRef.current.forEach((p) => {
        p.width = newWidth;
        p.height = newHeight;
      });
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const txtGoldStyle = {
    color: "rgb(218,165,32)",
    background:
      "linear-gradient(to top, rgba(218,165,32,1) 0%, rgba(213,173,109,1) 26%, rgba(226,186,120,1) 35%, rgba(163,126,67,1) 45%, rgba(212,175,55,1) 61%, rgba(213,173,109,1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  // This runs only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      // setRefParam(ref);

      if (ref) {
        const fetchPhaseList = async () => {
          try {
            const data = await CheckSponser(ref);
            localStorage.setItem("ref", data.data.ValidAddress);
            // console.log("Phase List:", data);
          } catch (error) {
            console.error("Failed to fetch phase list:", error);
          }
        };

        fetchPhaseList();
      }
    }
  }, []);

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  // const { address, isConnected } = useAccount();
  return (
    <section id="hero" className="clearfix position-relative">
      <div
        className="galaxy-wrapper"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* <div
        style={{
          position: "absolute",
          right: "-90px",
          top: 0,
          maxWidth: "45%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
        }}
      >
        <Image
          src="/assets/img/blockchain3.png"
          className="img-fluid"
          alt="Blockchain"
          width={500}
          height={500}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          priority
        />
      </div> */}

      <div
        style={{
          position: "absolute",
          right: isMobile ? "-150px" : "-220px",
          top: "30px",
          maxWidth: isMobile ? "70%" : "49%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
        }}
      >
        <Image
          src="/assets/img/circle1.png"
          className="img-fluid rotate2 linear2 infinite2"
          alt="Blockchain"
          width={900}
          height={900}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          priority
        />
      </div>

      <div
        id="service"
        className="container d-flex h-100"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div
          className="row justify-content-center align-items-center w-100"
          data-aos="fade-up"
        >
          <div
            className="col-md-8 intro-info order-md-first order-last"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <span className="text-white-50">Simple. Secure. Scalable.</span>
            <h2 className="mb-3 text-white">
              Your Trusted Gateway to Limitless{" "}
              <span style={txtGoldStyle} className="uppercase">
                DeFi Opportunities
              </span>
            </h2>
            <h5 className="text-white">
              Experience decentralized finance with full control, transparency,
              and unlimited earning potential.
            </h5>
            {isConnected && address ? (
              <div className="mt-3">
                <Link
                  href="/BuyNode"
                  className="gold-button shine-button px-4 py-2 rounded-pill"
                >
                  Buy Node
                </Link>
              </div>
            ) : (
              <div onClick={openConnectModal} className="mt-3">
                <Link
                  href="#"
                  className="gold-button shine-button px-4 py-2 rounded-pill"
                >
                  Buy Node
                </Link>
              </div>
            )}
          </div>
          <div
            className="col-md-4 intro-img order-md-last order-first"
            data-aos="zoom-out"
            data-aos-delay="200"
          />
        </div>
      </div>
    </section>
  );
};

export default SlideSection;
