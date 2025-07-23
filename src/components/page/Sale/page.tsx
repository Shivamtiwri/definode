"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPhaseCategrayList, InsetBuyingNft } from "@/services/api";
import {
  ContractSaleABI,
  ContractSaleAddress,
  DepositToken,
  DepositTokenABI,
} from "@/constants/contract";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { parseUnits } from "viem";
// Define types for phase list
interface Phase {
  id: string;
  title: string;
  total: number;
  price: string;
  role: string;
  status: number;
  supply_cap: string;
  expected_earning?: string;
  start: string;
  end: string;
}

interface Phase {
  index: number;
  // Add other phase properties as needed
}

const SaleNode = () => {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string | null;
  const [phaseList, setPhaseList] = useState<Phase[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [refInput, setRefInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingPhases, setIsFetchingPhases] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isSettingReferral, setIsSettingReferral] = useState(false);
  const [countId, setconutID] = useState<number>(0);
  const [lastPurchaseAmount, setLastPurchaseAmount] = useState<bigint>(
    BigInt(0)
  ); // Store amount for buyHash
  const maxNodes = 10;

  console.log(countId, "countId");

  // Initialize counts for each phase
  useEffect(() => {
    if (phaseList.length > 0) {
      const initialCounts = phaseList.reduce((acc, phase) => {
        acc[phase.id] = 0; // <-- HERE
        return acc;
      }, {} as { [key: string]: number });
      setCounts(initialCounts);
    }
  }, [phaseList]);

  // Fetch phase list
  useEffect(() => {
    const fetchPhaseList = async () => {
      if (!id) {
        toast.error("No phase ID provided", { duration: 5000 });
        return;
      }
      setIsFetchingPhases(true);
      try {
        const data = await getPhaseCategrayList(id);
        setPhaseList(data.data);
      } catch (error) {
        console.error("Failed to fetch phase list:", error);
        toast.error("Failed to fetch phase list", { duration: 5000 });
      } finally {
        setIsFetchingPhases(false);
      }
    };
    fetchPhaseList();
  }, [id]);

  // Token approval
  const { data: approveHash, writeContract: approveToken } = useWriteContract();
  const approveTokenContract = async (amount: bigint) => {
    try {
      setIsApproving(true);
      await approveToken({
        address: DepositToken as `0x${string}`,
        abi: DepositTokenABI,
        functionName: "approve",
        args: [ContractSaleAddress as `0x${string}`, amount],
      });
      toast.loading("Approving tokens...", { duration: 5000 });
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve tokens", { duration: 5000 });
    } finally {
      setIsApproving(false);
    }
  };

  // Handle buyHash (transaction receipt processing)
  const { data: buyHash, writeContract: buyToken } = useWriteContract();

  // Buy NFT
  const buyTokenNodeContract = async (id1: number, price: bigint) => {
    try {
      setIsBuying(true);

      const ref = localStorage.getItem("ref");
      const refAddress =
        ref && ref !== "null"
          ? ref
          : "0x0000000000000000000000000000000000000000";

      // Ensure counts[id1] is available and a valid number
      const quantity = counts[id1];
      if (!quantity || quantity <= 0) {
        toast.error("Invalid quantity selected");
        setIsBuying(false);
        return;
      }

      // Calculate total amount (price * quantity) in bigint (wei)
      const amount = price * BigInt(quantity);
      setLastPurchaseAmount(amount);

      console.log(`Amount in ETH: ${Number(amount) / 10 ** 18}`, "amount");

      await buyToken({
        address: ContractSaleAddress as `0x${string}`,
        abi: ContractSaleABI,
        functionName: "buyNFT",
        args: [
          id!, // phase id
          id1, // category id
          amount.toString(), // amount in wei as string
          quantity, // quantity to purchase
          refAddress as `0x${string}`,
        ],
      });

      setconutID(Number(id1));

      console.log("Purchase Details:", {
        phaseId: id,
        categoryId: id1,
        amount: amount.toString(),
        quantity,
        refAddress,
      });

      toast.loading("Buying Node...", { duration: 5000 });
    } catch (error) {
      console.error("Buy token error:", error);
      toast.error("Failed to buy node", { duration: 5000 });
    } finally {
      setIsBuying(false);
    }
  };

  useEffect(() => {
    if (!buyHash) return;

    let isMounted = true;

    const processReceipt = async () => {
      const ref = localStorage.getItem("ref") || "";
      const payload = {
        phaseId: id || "0",
        totalAmount: Number(lastPurchaseAmount) / 10 ** 18,
        totalNFT: counts?.[countId] || 0,
        phaseCategoryId: countId,
        nft_ids: "0", // Replace with actual ID(s) if needed
        statusType: "Success", // Or make it dynamic if needed
        SponserAddress: ref,
        transation_hash: buyHash,
      };

      const result = await InsetBuyingNft(payload);

      if (!isMounted) return;

      if (result.success) {
        toast.success(result.message || "NFT purchase successful", {
          duration: 5000,
        });
      } else {
        toast.error(result.error?.message || "Failed to process NFT purchase", {
          duration: 5000,
        });
      }
    };

    processReceipt().catch((error) => {
      if (isMounted) {
        console.error("Error processing transaction receipt:", error);
        toast.error("Failed to process transaction", { duration: 5000 });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [buyHash, lastPurchaseAmount, id, counts, countId]);

  // Set referral code
  const setReferral = async () => {
    try {
      setIsSettingReferral(true);
      if (!refInput.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid Ethereum address");
      }
      localStorage.setItem("ref", refInput);
      toast.success("Referral code set successfully", { duration: 5000 });
      setIsModalOpen(false);
      setRefInput("");
    } catch (error) {
      console.error("Referral error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to set referral code",
        { duration: 5000 }
      );
    } finally {
      setIsSettingReferral(false);
    }
  };

  // Check allowance
  const { data: allowanceRaw } = useReadContract({
    address: DepositToken as `0x${string}`,
    abi: DepositTokenABI,
    functionName: "allowance",
    args: [address as `0x${string}`, ContractSaleAddress as `0x${string}`],
    query: { enabled: !!address },
  });
  const allowance = typeof allowanceRaw === "bigint" ? allowanceRaw : BigInt(0);

  // Handle approveHash
  useEffect(() => {
    if (approveHash) {
      toast.success("Tokens approved successfully", { duration: 5000 });
      window.location.reload();
    }
  }, [approveHash]);

  // Handle plus/minus buttons
  const handlePlus = (phaseId: string) => {
    setCounts((prev) => ({
      ...prev,
      [phaseId]: Math.min((prev[phaseId] || 1) + 1, maxNodes),
    }));
  };

  // Handle minus button
  const handleMinus = (phaseId: string) => {
    setCounts((prev) => ({
      ...prev,
      [phaseId]: Math.max((prev[phaseId] || 1) - 1, 1),
    }));
  };

  const publicClient = usePublicClient();

  const [prices, setPrices] = useState<[bigint, bigint, bigint, bigint][]>([]);
  // Replace with your dynamic categoryId if needed

  const fetchPrices = async () => {
    if (!publicClient) {
      console.error("publicClient is undefined");
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
            .catch((err) => {
              console.error(`Error at index ${i + 1}:`, err);
              return [BigInt(0), BigInt(0), BigInt(0), BigInt(0)] as [
                bigint,
                bigint,
                bigint,
                bigint
              ];
            })
        )
      )) as [bigint, bigint, bigint, bigint][];

      setPrices(results);
    } catch (err) {
      console.error("Failed to fetch phase records:", err);
      setPrices([]);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [id]);

  // const { data, error } = useReadContract({
  //   address: ContractSaleAddress as `0x${string}`,
  //   abi: ContractSaleABI,
  //   functionName: "getUserRecord",
  //   args: [address as `0x${string}`],
  //   query: { enabled: !!address },
  // });

  // const [phaseTotals, setPhaseTotals] = useState<bigint[]>(
  //   Array(5).fill(BigInt(0))
  // );
  // const [phaseCategoryTotals, setPhaseCategoryTotals] = useState<{
  //   [phase: number]: { [category: number]: bigint };
  // }>({});
  // useEffect(() => {
  //   if (error) {
  //     console.error("Contract error:", error);
  //     return;
  //   }

  //   if (!data || !Array.isArray(data) || data.length < 2) {
  //     console.log("Invalid data structure:", data);
  //     return;
  //   }

  //   const userRecords = data[1] as {
  //     phase: bigint;
  //     category: bigint;
  //     amount: bigint;
  //     timeStamp: bigint;
  //   }[];

  //   if (!Array.isArray(userRecords)) return;

  //   const totals: {
  //     [phase: number]: { [category: number]: bigint };
  //   } = {};

  //   for (const record of userRecords) {
  //     if (!record || typeof record !== "object") continue;

  //     const phase = Number(record.phase);
  //     const category = Number(record.category);
  //     const amount = record.amount;

  //     if (
  //       isNaN(phase) ||
  //       phase < 1 ||
  //       phase > 10 ||
  //       isNaN(category) ||
  //       category < 1 ||
  //       category > 5
  //     ) {
  //       console.log("Invalid record:", record);
  //       continue;
  //     }

  //     if (!totals[phase]) {
  //       totals[phase] = {};
  //     }

  //     // Initialize all categories 1–5 with 0 if not already present
  //     for (let cat = 1; cat <= 5; cat++) {
  //       if (!totals[phase][cat]) {
  //         totals[phase][cat] = BigInt(0);
  //       }
  //     }

  //     // Add amount to correct category
  //     totals[phase][category] += amount;

  //     console.log(
  //       `Added ${amount} to phase ${phase}, category ${category}, total: ${totals[phase][category]}`
  //     );
  //   }

  //   console.log("Phase-Category totals:", totals);
  //   setPhaseCategoryTotals(totals);
  // }, [data, error]);

  // useEffect(() => {
  //   console.log("Updated phaseTotals:", phaseTotals[0]);
  // }, [phaseTotals]);

  // const value = phaseCategoryTotals[0];
  // console.log(value, "value");

  const { data, error } = useReadContract({
    address: ContractSaleAddress as `0x${string}`,
    abi: ContractSaleABI,
    functionName: "getUserRecord",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // Array format: [ [Cat1–5 for Phase1], [Cat1–5 for Phase2], ..., [Cat1–5 for Phase10] ]
  const [phaseCategoryTotals, setPhaseCategoryTotals] = useState<bigint[][]>(
    Array.from({ length: 10 }, () => Array(5).fill(BigInt(0)))
  );

  useEffect(() => {
    if (error) {
      console.error("Contract error:", error);
      return;
    }

    if (!data || !Array.isArray(data) || data.length < 2) {
      // console.log("Invalid data structure:", data);
      return;
    }

    const userRecords = data[1] as {
      phase: bigint;
      category: bigint;
      amount: bigint;
      timeStamp: bigint;
    }[];

    if (!Array.isArray(userRecords)) return;

    const totals: {
      [phase: number]: { [category: number]: bigint };
    } = {};

    for (const record of userRecords) {
      if (!record || typeof record !== "object") continue;

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
      ) {
        console.log("Invalid record skipped:", record);
        continue;
      }

      if (!totals[phase]) totals[phase] = {};
      for (let cat = 1; cat <= 5; cat++) {
        if (!totals[phase][cat]) {
          totals[phase][cat] = BigInt(0);
        }
      }

      totals[phase][category] += amount;
    }

    // Convert totals to array of 10 phases × 5 categories
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
  console.log("Updated phaseCategoryTotals:", phaseCategoryTotals[0]?.[4]);

  const { data: balance } = useReadContract({
    address: DepositToken as `0x${string}`,
    abi: DepositTokenABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  console.log(Number(balance) / 10 ** 18, "balance");

  return (
    <>
      {isModalOpen && (
        <>
          <div className="modal-blur-overlay"></div>
          {isSettingReferral && (
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
                      disabled={isSettingReferral}
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    className="form-control"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    disabled={isSettingReferral}
                  />
                  <div className="my-3">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSettingReferral}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={setReferral}
                      className="btn btnpink3 ml-2"
                      disabled={isSettingReferral}
                    >
                      {isSettingReferral ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isFetchingPhases ? (
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
                {phaseList.map((phase, index) => (
                  <div className="col-lg-4" key={index + 1}>
                    <div className="bgSlot d-flex justify-content-between text-white font-weight-bold p-2">
                      <span>{phase.title}</span>
                      <span>${phase.price}</span>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm border position-relative mb-4">
                      <div className="container my-2">
                        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                          <p className="mb-0 small fw-bold">
                            Role: {phase.role || "N/A"}
                          </p>
                          <p className="mb-0 small fw-bold text-right">
                            Status: {phase.status === 1 ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">Supply Cap</span>
                          <span className="small fw-bold">
                            {phase.supply_cap || "N/A"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">Start</span>
                          <span className="small fw-bold">
                            {phase.start || "N/A"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold">End</span>
                          <span className="small fw-bold">
                            {phase.end || "N/A"}
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
                            }}
                            className="d-block mb-0"
                          >
                            BNB
                          </span>
                        </div>
                        <div>
                          <small className="text-muted">
                            1 NODE = {Number(prices[index]?.[0]) / 10 ** 18}
                            USDT
                          </small>
                        </div>
                      </div>
                      <div className="d-flex stsbox justify-content-between align-items-center border rounded p-2 mb-2">
                        <button
                          className="py-0 btn btn-outline-secondary"
                          onClick={() => handleMinus((index + 1).toString())}
                          disabled={isBuying || isApproving}
                        >
                          -
                        </button>
                        <span className="fw-bold">
                          {counts[index + 1] || 1}
                        </span>
                        <button
                          className="py-0 btn btn-outline-secondary"
                          onClick={() => handlePlus((index + 1).toString())}
                          disabled={isBuying || isApproving}
                        >
                          +
                        </button>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small mb-4">
                        <span>
                          Total Price:{" "}
                          {((counts[index + 1] || 1) *
                            Number(prices[index]?.[0])) /
                            10 ** 18}{" "}
                          USDT
                        </span>
                      </div>
                      {localStorage.getItem("ref") == null && (
                        <div className="text-center mb-3">
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isBuying || isApproving}
                          >
                            Use Referral Code
                          </button>
                        </div>
                      )}
                      {allowance >=
                      (counts[index + 1] || 1) * Number(prices[index]?.[0]) ? (
                        <button
                          onClick={() =>
                            buyTokenNodeContract(index + 1, prices[index]?.[0])
                          }
                          className="btn btnpink3 rounded-pill w-100 fw-bold py-2"
                          disabled={isBuying || isApproving}
                        >
                          {isBuying ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden"></span>
                            </div>
                          ) : (
                            "Purchase"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            approveTokenContract(
                              BigInt(
                                (counts[phase.id] || 1) *
                                  Number(prices[index]?.[0])
                              )
                            )
                          }
                          className="btn btn-warning rounded-pill w-100 fw-bold py-2 mb-2"
                          disabled={isBuying || isApproving}
                        >
                          {isApproving ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden"></span>
                            </div>
                          ) : (
                            "Approve Token"
                          )}
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
