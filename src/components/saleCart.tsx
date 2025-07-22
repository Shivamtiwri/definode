"use client";

import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

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

// Define props for the component
interface SaleCartProps {
  saleDataArr: SaleItem[];
  allowance: bigint;
  isBuying: boolean;
  isApproving: boolean;
  isLoading: boolean;
  approveTokenContract: (id: string) => void;
  buyTokenNodeContract: (id: string, price: string, count: number) => void;
  setIsModalOpen: (value: boolean) => void;
  isIdLoader: string;
  isApIdLoader: string;
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
}: SaleCartProps) {
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const maxNodes = 10;

  console.log(isIdLoader, "isIdLoader==>");

  useEffect(() => {
    if (saleDataArr.length > 0) {
      const initialCounts = saleDataArr.reduce((acc, phase) => {
        acc[phase.id] = 0; // Default count of 1 for each phase
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

  console.log(allowance, "allowance");

  return (
    <div className="row">
      {saleDataArr?.map((phase, index) => (
        <div className="col-lg-4" key={phase.id}>
          <div className="bgSlot d-flex justify-content-between text-white font-weight-bold p-2">
            <span>{phase.title}</span>
            <span>${phase.price}</span>
          </div>
          <div className="p-3 bg-white rounded shadow-sm border position-relative mb-4">
            <div className="container my-2">
              <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                <p className="mb-0 small fw-bold" style={{ color: "gray" }}>
                  Role: {phase.role}
                </p>
                <p
                  className="mb-0 small fw-bold text-right"
                  style={{ color: "gray" }}
                >
                  Status: {phase.status === 1 ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="small  fw-bold" style={{ color: "gray" }}>
                  Supply Cap
                </span>
                <span className="small fw-bold" style={{ color: "gray" }}>
                  {phase.supply_cap}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="small  fw-bold" style={{ color: "gray" }}>
                  Current Available
                </span>
                <span className="small fw-bold" style={{ color: "gray" }}>
                  {phase.total_nft}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-bold" style={{ color: "gray" }}>
                  Start
                </span>
                <span className="small fw-bold" style={{ color: "gray" }}>
                  {phase.start}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-bold" style={{ color: "gray" }}>
                  End
                </span>
                <span className="small fw-bold" style={{ color: "gray" }}>
                  {phase.end}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                style={{
                  width: "120px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/assets/img/bnb.png"
                  width={32}
                  height={32}
                  alt="BNB"
                  className="me-3"
                />
                <span
                  style={{
                    lineHeight: ".3rem",
                    marginTop: "6px",
                    marginLeft: "8px",
                    color: "gray",
                  }}
                  className="d-block mb-0"
                >
                  BNB
                </span>
              </div>
              <div>
                <small className="text-muted" style={{ color: "gray" }}>
                  1 NODE = {phase.price} USDT
                </small>
              </div>
            </div>
            {Number(allowance) > 0 && (
              <div className="d-flex stsbox justify-content-between align-items-center border rounded p-2 mb-2">
                <button
                  className="py-0 btn btn-outline-secondary"
                  onClick={() => handleMinus(phase.id)}
                >
                  -
                </button>
                <span className="fw-bold text-danger">
                  {counts[phase.id] || 0}
                </span>
                <button
                  className="py-0 btn btn-outline-secondary"
                  onClick={() => handlePlus(phase.id)}
                >
                  +
                </button>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2 small mb-4">
              <span style={{ color: "gray" }}>
                Total Price: {(counts[phase.id] || 0) * Number(phase.price)}{" "}
                USDT
              </span>
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
                  className="btn btnpink3 rounded-pill w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                  disabled
                >
                  <CircularProgress color="inherit" size={25} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    buyTokenNodeContract(
                      (index + 1).toString(),
                      phase.price?.toString() ?? "0", // <-- Default fallback
                      counts[index + 1] || 1
                    )
                  }
                  className="btn btnpink3 rounded-pill w-100 fw-bold py-2"
                  disabled={isLoading}
                >
                  Purchase
                </button>
              )
            ) : // ) : isApproving ? (
            isApIdLoader === (index + 1).toString() ? (
              <button
                className="btn bg-warning rounded-pill w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                disabled
              >
                <CircularProgress color="inherit" size={25} />
              </button>
            ) : (
              <button
                onClick={() => approveTokenContract((index + 1).toString())}
                className="btn btn-warning rounded-pill w-100 fw-bold py-2 mb-2"
                disabled={isLoading}
              >
                Approve Token
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
