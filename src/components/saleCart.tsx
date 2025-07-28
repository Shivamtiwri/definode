"use client";

import { ContractSaleABI, ContractSaleAddress } from "@/constants/contract";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import styles from "./Marquee.module.css";
import { motion } from "framer-motion";
import { log } from "console";
import { text } from "stream/consumers";
export interface SaleItem {
  id: string;
  title: string;
  total: number;
  price_range?: string;
  role?: string;
  status?: number;
  supply_cap?: string;
  expected_earning?: string;
  start?: string;
  end?: string;
  price?: string;
  total_nft?: string;
}

interface SaleCartProps {
  saleDataArr: SaleItem[];
  allowance: bigint;
  isBuying: boolean;
  isApproving: boolean;
  isLoading: boolean;
  approveTokenContract: (id: string) => void;
  buyTokenNodeContract: (
    id: string,
    price: string,
    count: number,
    priceO: bigint
  ) => void;
  setIsModalOpen: (value: boolean) => void;
  isIdLoader: string;
  isApIdLoader: string;
  balance: number;
  id: string;
}

export default function SaleCart({
  saleDataArr = [],
  allowance,
  isBuying,
  isApproving,
  approveTokenContract,
  buyTokenNodeContract,
  isLoading,
  setIsModalOpen,
  isIdLoader,
  isApIdLoader,
  balance,
  id,
}: SaleCartProps) {
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const maxNodes = 10;
  const { address } = useAccount();

  useEffect(() => {
    if (saleDataArr.length > 0) {
      const initialCounts = saleDataArr.reduce((acc, phase) => {
        acc[phase.id] = 1;
        return acc;
      }, {} as { [key: string]: number });
      setCounts(initialCounts);
    }
  }, [saleDataArr]);

  const handlePlus = (phaseId: string) => {
    setCounts((prevCounts) => {
      if (prevCounts[phaseId] < maxNodes) {
        return { ...prevCounts, [phaseId]: prevCounts[phaseId] + 1 };
      }
      return prevCounts;
    });
  };

  const handleMinus = (phaseId: string) => {
    setCounts((prevCounts) => {
      if (prevCounts[phaseId] > 1) {
        return { ...prevCounts, [phaseId]: prevCounts[phaseId] - 1 };
      }
      return prevCounts;
    });
  };

  const publicClient = usePublicClient();
  const [prices, setPrices] = useState<[bigint, bigint, bigint, bigint][]>([]);

  const fetchPrices = async () => {
    if (!publicClient) {
      // console.error("publicClient is undefined");
      setPrices([]);
      return;
    }

    try {
      const results = (await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          publicClient
            .readContract({
              address: ContractSaleAddress as `0x${string}`,
              abi: ContractSaleABI,
              functionName: "phaseRecordsPerCat_",
              args: [id, i + 1],
            })
            .catch(
              () =>
                [BigInt(0), BigInt(0), BigInt(0), BigInt(0)] as [
                  bigint,
                  bigint,
                  bigint,
                  bigint
                ]
            )
        )
      )) as [bigint, bigint, bigint, bigint][];
      setPrices(results);
    } catch (err) {
      // console.error("Failed to fetch phase records:", err);
      setPrices([]);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const { data, error } = useReadContract({
    address: ContractSaleAddress as `0x${string}`,
    abi: ContractSaleABI,
    functionName: "getUserRecord",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const [phaseCategoryTotals, setPhaseCategoryTotals] = useState<bigint[][]>(
    Array.from({ length: 10 }, () => Array(5).fill(BigInt(0)))
  );

  console.log(phaseCategoryTotals, "phaseCategoryTotals ");

  useEffect(() => {
    if (error) {
      // console.error("Contract error:", error);
      return;
    }

    if (!data || !Array.isArray(data) || data.length < 2) return;

    const userRecords = data[1] as {
      phase: bigint;
      category: bigint;
      amount: bigint;
      timeStamp: bigint;
    }[];

    const totals: {
      [phase: number]: { [category: number]: bigint };
    } = {};

    for (const record of userRecords) {
      const phase = Number(record.phase);
      const category = Number(record.category);
      const amount = record.amount;

      if (
        isNaN(phase) ||
        phase < 1 ||
        phase > 10 ||
        isNaN(category) ||
        category < 1 ||
        category > 5
      )
        continue;

      if (!totals[phase]) totals[phase] = {};
      for (let cat = 1; cat <= 5; cat++) {
        if (!totals[phase][cat]) {
          totals[phase][cat] = BigInt(0);
        }
      }

      totals[phase][category] += amount;
    }

    const resultArray: bigint[][] = [];
    for (let phase = 1; phase <= 10; phase++) {
      const catTotals: bigint[] = [];
      for (let cat = 1; cat <= 5; cat++) {
        const value = totals[phase]?.[cat] ?? BigInt(0);
        catTotals.push(value);
      }
      resultArray.push(catTotals);
    }

    setPhaseCategoryTotals(resultArray);
  }, [data, error]);

  return (
    <div className="row">
      {saleDataArr?.map((phase, index) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`col-lg-4 ${styles.saleCard}`}
          key={phase.id}
          // style={{ border: "1px solid red" }}
        >
          <div className="bgSlot d-flex justify-content-between text-white font-weight-bold p-2">
            <span>{phase.title}</span>
            <span>${phase.price}</span>
          </div>
          <div className="p-3 bg-white rounded shadow-sm border position-relative mb-4">
            <div className={styles.marqueeWrapper}>
              <div className={styles.marquee}>
                🚨{" "}
                {phase.role === "Premium"
                  ? "Premium Node Live Now – Exclusive Mining Access! 🚀"
                  : phase.role === "Standard"
                  ? "Standard Node Available – Get Started Today! 🔥"
                  : "Live Now! Secure Your Node & Start Earning! 💰"}
              </div>
            </div>

            <div className="container">
              <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                <p className="mb-0 small fw-bold text-muted">
                  Role: {phase.role}
                </p>
                <p className="mb-0 small fw-bold text-muted">
                  Status:{" "}
                  {phase.status === 1 ? (
                    <span className="text-success">Active</span>
                  ) : (
                    <span className="text-danger">Inactive</span>
                  )}
                </p>
              </div>
              <div className="d-flex justify-content-between mb-1 text-muted small fw-bold">
                <span>Supply Cap</span>
                <span>{phase.supply_cap}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 text-muted small fw-bold">
                <span>Current Available</span>
                <span>
                  {Number(phase.total_nft) - Number(prices[index]?.[2])}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1 text-muted small fw-bold">
                <span>Start</span>
                <span>{phase.start}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 text-muted small fw-bold">
                <span>End</span>
                <span>{phase.end}</span>
              </div>

              {Number(phaseCategoryTotals[Number(id) - 1]?.[index]) >
                Number(0) && (
                <div
                  className={`d-flex justify-content-between mb-1 small fw-bold ${
                    phaseCategoryTotals[Number(id) - 1]?.[index] > BigInt(0)
                      ? styles.highlighted
                      : "text-muted"
                  }`}
                >
                  <span>You occupied</span>
                  <span style={{ color: "red" }}>
                    {phaseCategoryTotals[Number(id) - 1]?.[index]} NODE
                  </span>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="d-flex align-items-center"
                style={{ width: "120px" }}
              >
                <Image
                  src="/assets/img/bnb.png"
                  width={32}
                  height={32}
                  alt="BNB"
                />
                <span className="ms-2 text-muted small">Network(BEP20)</span>
              </div>
              <div>
                <small className="text-muted">
                  1 NODE = {phase.price} USDT
                </small>
              </div>
            </div>

            {Number(allowance) > 0 && (
              <div className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleMinus(phase.id)}
                >
                  -
                </button>
                <span className="fw-bold text-danger">
                  {counts[phase.id] || 0}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handlePlus(phase.id)}
                >
                  +
                </button>
              </div>
            )}
            <div
              className="d-flex   justify-content-between mb-3"
              style={{ height: "50px" }}
            >
              <div className="d-flex justify-content-between mb-2 small mb-4 text-muted">
                <span>
                  Your Balance: {(Number(balance) / 10 ** 18).toFixed(2)} USDT
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2 small mb-4 text-muted">
                <span>
                  Total Price: {(counts[phase.id] || 0) * Number(phase.price)}{" "}
                  USDT
                </span>
              </div>
            </div>

            {localStorage.getItem("ref") == null && (
              <div className="text-center mb-3">
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => setIsModalOpen(true)}
                >
                  Use Referral Code
                </button>
              </div>
            )}

            {Number(allowance) > 0 ? (
              Number(isIdLoader) === index + 1 ? (
                <button
                  className="btn btnpink3 w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                  disabled
                >
                  <CircularProgress color="inherit" size={25} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    buyTokenNodeContract(
                      (index + 1).toString(),
                      phase.price?.toString() ?? "0",
                      counts[index + 1] || 1,
                      prices[index]?.[0]
                    )
                  }
                  className="btn btnpink3 w-100 fw-bold py-2"
                  disabled={isLoading}
                >
                  Purchase
                </button>
              )
            ) : isApIdLoader === (index + 1).toString() ? (
              <button
                className="btn bg-warning w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                disabled
              >
                <CircularProgress color="inherit" size={25} />
              </button>
            ) : (
              <button
                onClick={() => approveTokenContract((index + 1).toString())}
                className="gold-button rounded-pill w-100 fw-bold py-2 mb-2"
                disabled={isLoading}
              >
                Approve Token
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
