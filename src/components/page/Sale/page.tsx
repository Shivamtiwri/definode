"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPhaseCategrayList } from "@/services/api";
import {
  ContractSaleABI,
  ContractSaleAddress,
  DepositToken,
  DepositTokenABI,
} from "@/constants/contract";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const SaleNode = () => {
  const { address } = useAccount();
  const [phaseList, setPhaseList] = useState<
    {
      id: string;
      title: string;
      total: number;
      price_range?: string;
      prcie?: string;
      role?: string;
      status?: number;
      supply_cap?: string;
      expected_earning?: string;
      start?: string;
      end?: string;
      price?: string;
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [refInput, setRefInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Main loading state for fetching phase list
  const [isModalLoading, setIsModalLoading] = useState(false); // Loading state for modal operations
  const maxNodes = 10;

  // Initialize counts for each phase when phaseList is loaded
  useEffect(() => {
    if (phaseList.length > 0) {
      const initialCounts = phaseList.reduce((acc, phase) => {
        acc[phase.id] = 1; // Default count of 1 for each phase
        return acc;
      }, {} as { [key: string]: number });
      setCounts(initialCounts);
    }
  }, [phaseList]);

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

  const stakeAmountWei = BigInt(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  );

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: approveHash,
    writeContract: approveToken,
    isPending: isApproving,
  } = useWriteContract();

  const approveTokenContract = async () => {
    try {
      setIsLoading(true); // Show loader for approval
      await approveToken({
        address: DepositToken as `0x${string}`,
        abi: DepositTokenABI,
        functionName: "approve",
        args: [ContractSaleAddress as `0x${string}`, stakeAmountWei],
      });
      toast.loading("Approving tokens...");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve tokens", { duration: 5000 });
    } finally {
      setIsLoading(false); // Hide loader after approval
    }
  };

  const setReferral = async () => {
    try {
      setIsModalLoading(true); // Show loader for modal
      localStorage.setItem("ref", refInput);
      toast.success("Referral code set successfully", { duration: 5000 });
      setIsModalOpen(false);
      setRefInput("");
    } catch (error) {
      console.error("Referral error:", error);
      toast.error("Failed to set referral code", { duration: 5000 });
    } finally {
      setIsModalLoading(false); // Hide modal loader
    }
  };

  const { data: allowanceRaw } = useReadContract({
    address: DepositToken as `0x${string}`,
    abi: DepositTokenABI,
    functionName: "allowance",
    args: [address as `0x${string}`, ContractSaleAddress as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });
  const allowance = typeof allowanceRaw === "bigint" ? allowanceRaw : BigInt(0);

  useEffect(() => {
    if (approveHash) {
      toast.success("Tokens approved successfully", { duration: 5000 });
      window.location.reload();
    }
  }, [approveHash]);

  useEffect(() => {
    const fetchPhaseList = async () => {
      if (!id) return;
      setIsLoading(true); // Show loader for fetching phase list
      const phaseId = Array.isArray(id) ? id[0] : id;
      try {
        const data = await getPhaseCategrayList(phaseId);
        setPhaseList(data.data);
        console.log("Phase List:", data);
      } catch (error) {
        console.error("Failed to fetch phase list:", error);
        toast.error("Failed to fetch phase list", { duration: 5000 });
      } finally {
        setIsLoading(false); // Hide loader after fetching
      }
    };
    fetchPhaseList();
  }, [id]);

  const {
    data: buyHash,
    writeContract: buyToken,
    isPending: isBuying,
  } = useWriteContract();

  const buyTokenNodeContract = async (id1: string, price: bigint) => {
    try {
      setIsLoading(true); // Show loader for buying
      const ref = localStorage.getItem("ref");
      const refAddress =
        ref && ref !== "null"
          ? ref
          : "0x0000000000000000000000000000000000000000";

      const amount = BigInt(price) * BigInt(counts[id1]) * BigInt(10 ** 18);

      console.log("Calling buyNFT with:", {
        id,
        id1,
        amount: amount.toString(),
        count: counts[id1],
        ref: refAddress,
      });

      await buyToken({
        address: ContractSaleAddress as `0x${string}`,
        abi: ContractSaleABI,
        functionName: "buyNFT",
        args: [id, id1, amount, counts[id1], refAddress],
      });

      toast.loading("Buying Node...", { duration: 5000 });
    } catch (error) {
      console.error("Buy token error:", error);
      toast.error("Failed to buy node", { duration: 5000 });
    } finally {
      setIsLoading(false); // Hide loader after buying
    }
  };

  useEffect(() => {
    if (buyHash) {
      toast.success("Transaction successful", { duration: 5000 });
    }
  }, [buyHash]);

  return (
    <>
      {isModalOpen && (
        <>
          <div className="modal-blur-overlay"></div>
          {isModalLoading && (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="stsbox border-0 modal-content">
                <div className="modal-body">
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="modal-title">Apply Referral Code</h5>
                    <button
                      type="button"
                      className="btn-close border-0 bg-transparent"
                      onClick={() => setIsModalOpen(false)}
                    >
                      X
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    className="form-control"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                  />
                  <div className="my-3">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={setReferral}
                      className="btn btnpink3 ml-2"
                      disabled={isModalLoading}
                    >
                      {isModalLoading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : (
        <main id="main">
          <div className="header2"></div>
          <div
            id="about"
            className="bg-light about section-header position-relative overflow-hidden"
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-4">
                    <h3>
                      Limited <span className="textpink2">Node Sale</span>
                    </h3>
                    <p className="lead text-muted small font-weight-bold">
                      Secure Your Spot & Earn More
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                {phaseList?.map((phase, index) => (
                  <div className="col-lg-4" key={phase.id}>
                    <div className="bgSlot d-flex justify-content-between text-white font-weight-bold p-2">
                      <span>{phase.title}</span>
                      <span>${phase.price}</span>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm border position-relative mb-4">
                      <div className="container my-2">
                        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                          <p className="mb-0 small fw-bold">
                            Role: {phase.role}
                          </p>
                          <p className="mb-0 small fw-bold text-right">
                            Status: {phase.status === 1 ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">Supply Cap</span>
                          <span className="small fw-bold">
                            {phase.supply_cap}
                          </span>
                        </div>
                        {/* <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">
                            Expected Earning
                          </span>
                          <span className="small fw-bold">
                            {phase.expected_earning}
                          </span>
                        </div> */}
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">Start</span>
                          <span className="small fw-bold">{phase.start}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">End</span>
                          <span className="small fw-bold">{phase.end}</span>
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
                            }}
                            className="d-block mb-0"
                          >
                            BNB
                          </span>
                        </div>
                        <div>
                          <small className="text-muted">
                            1 NODE = {phase.price} USDT
                          </small>
                        </div>
                      </div>
                      <div className="d-flex stsbox justify-content-between align-items-center border rounded p-2 mb-2">
                        <button
                          className="py-0 btn btn-outline-secondary"
                          onClick={() => handleMinus(phase.id)}
                        >
                          -
                        </button>
                        <span className="fw-bold">{counts[phase.id] || 1}</span>
                        <button
                          className="py-0 btn btn-outline-secondary"
                          onClick={() => handlePlus(phase.id)}
                        >
                          +
                        </button>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small mb-4">
                        {/* <span>Your Balance: 0 BNB</span> */}
                        <span>
                          Total Price:{" "}
                          {(counts[phase.id] || 1) * Number(phase.price)} USDT
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
                        isBuying ? (
                          <button
                            className="btn btnpink3 rounded-pill w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                            disabled
                          >
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden"></span>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              buyTokenNodeContract(
                                (index + 1).toString(),
                                BigInt(Math.floor(Number(phase.price)))
                              )
                            }
                            className="btn btnpink3 rounded-pill w-100 fw-bold py-2"
                            disabled={isLoading}
                          >
                            Purchase
                          </button>
                        )
                      ) : isApproving ? (
                        <button
                          className="btn btnpink3 rounded-pill w-100 fw-bold py-2 d-flex justify-content-center align-items-center"
                          disabled
                        >
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden"></span>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={approveTokenContract}
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
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default SaleNode;
