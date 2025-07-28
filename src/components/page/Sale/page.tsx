"use client";
import React, { useEffect, useState } from "react";
import {
  CheckSponser,
  getPhaseCategrayList,
  InsetBuyingNft,
} from "@/services/api";
import {
  ContractSaleABI,
  ContractSaleAddress,
  DepositToken,
  DepositTokenABI,
} from "@/constants/contract";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import SaleCart from "@/components/saleCart";
import { CircularProgress } from "@mui/material";
import PurchaseSuccessModal from "@/components/Home/purchageSuccessModal";
import {
  useParams,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";
import { Router } from "next/router";

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
  const [initialCount, setInitialCount] = useState<number>(Number(0));
  const [refInput, setRefInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Main loading state for fetching phase list
  const [isIdLoader, setIsIdLoader] = useState(""); // Main loading state for fetching phase list
  const [isApIdLoader, setApIsIdLoader] = useState(""); // Main loading state for fetching phase list
  const [isModalLoading, setIsModalLoading] = useState(false); // Loading state for modal operations
  const [isOpen, setIsOpen] = useState(false); // Loading state for modal operations

  const [categoryId, setCategoryId] = useState(""); // Loading state for modal operations
  const [lastPurchaseAmount, setLastPurchaseAmount] = useState<number>(
    Number(0)
  );

  const {
    data: buyHash,
    writeContract: buyToken,
    isPending: isBuying,
    isSuccess,

    error,
  } = useWriteContract();

  const stakeAmountWei = BigInt(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  );

  const params = useParams();
  console.log(params, "params");

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (isSuccess && buyHash) {
      const isMounted = true;
      setIsOpen(true);
      setIsIdLoader("");

      const processReceipt = async () => {
        const ref = localStorage.getItem("ref") || "";

        const refAddress =
          ref && ref !== "null"
            ? ref
            : "0x0000000000000000000000000000000000000000";
        const payload = {
          phaseId: id || "0",
          totalAmount: Number(lastPurchaseAmount) / 10 ** 18,
          totalNFT: initialCount || 0,
          phaseCategoryId: categoryId,
          nft_ids: "0",
          statusType: "Success",
          SponserAddress: refAddress,
          transation_hash: buyHash,
        };

        const result = await InsetBuyingNft(payload);

        if (!isMounted) return;

        if (result.success) {
          toast.success(result.message || "NFT purchase successful", {
            duration: 5000,
          });
        } else {
          // toast.error(
          //   result.error?.message || "Failed to process NFT purchase",
          //   {
          //     duration: 5000,
          //   }
          // );
        }
      };

      processReceipt().catch((error) => {
        if (isMounted) {
          toast.error("Failed to process transaction", { duration: 5000 });
        }
      });
    }

    // return () => {
    //   isMounted = false;
    // };
  }, [isSuccess, buyHash, lastPurchaseAmount, id, initialCount, categoryId]);
  const { data: balance } = useReadContract({
    address: DepositToken as `0x${string}`,
    abi: DepositTokenABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // console.log(typeof balance);

  const {
    data: approveHash,
    writeContract: approveToken,
    isPending: isApproving,
    error: errorApprove,
  } = useWriteContract();

  useEffect(() => {
    if (errorApprove) {
      // console.log(errorApprove, "errroe");
      setApIsIdLoader("");
    }
  }, [errorApprove]);

  const approveTokenContract = async (id: string) => {
    try {
      // console.log("call");
      setApIsIdLoader(id);
      setIsLoading(true);
      await approveToken({
        address: DepositToken as `0x${string}`,
        abi: DepositTokenABI,
        functionName: "approve",
        args: [ContractSaleAddress as `0x${string}`, stakeAmountWei],
      });
    } catch (error) {
      setApIsIdLoader("");
      // console.error("Approval error:", error);
      toast.error("Failed to approve tokens", { duration: 5000 });
    } finally {
      setIsLoading(false); // Hide loader after approval
    }
  };

  const setReferral = async () => {
    try {
      const data = await CheckSponser(refInput || "");
      localStorage.setItem("ref", data.data.ValidAddress);
      toast.success("Referral code set successfully", { duration: 5000 });
      setIsModalOpen(false);
      setRefInput("");
    } catch (error) {
      // console.error("Failed to fetch phase list:", error);
    }
  };

  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: DepositToken as `0x${string}`,
    abi: DepositTokenABI,
    functionName: "allowance",
    args: [address as `0x${string}`, ContractSaleAddress as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });
  let allowance = typeof allowanceRaw === "bigint" ? allowanceRaw : BigInt(0);

  useEffect(() => {
    if (approveHash) {
      refetchAllowance();
      toast.success("Tokens approved successfully", { duration: 5000 });
      allowance = BigInt(12473128);
      setApIsIdLoader("");
    }
  }, [approveHash, refetchAllowance]);

  useEffect(() => {
    if (error) {
      setIsIdLoader("");
    }
  }, [error]);

  useEffect(() => {
    const fetchPhaseList = async () => {
      if (!id) return;
      setIsLoading(true); // Show loader for fetching phase list
      const phaseId = Array.isArray(id) ? id[0] : id;
      try {
        const data = await getPhaseCategrayList(phaseId);
        setPhaseList(data.data);
      } catch (error) {
        toast.error("Failed to fetch phase list", { duration: 5000 });
      } finally {
        setIsLoading(false); // Hide loader after fetching
      }
    };
    fetchPhaseList();
  }, [id]);

  const buyTokenNodeContract = async (
    id1: string,
    price: string,
    counts: number,
    priceO: bigint
  ) => {
    try {
      setIsIdLoader(id1);
      setCategoryId(id1);
      setInitialCount(counts);

      const filPrice = Math.floor(Number(price));
      setIsLoading(true); // Show loader for buying
      const ref = localStorage.getItem("ref");
      const refAddress =
        ref && ref !== "null"
          ? ref
          : "0x0000000000000000000000000000000000000000";

      if (ref === String(address)) {
        toast.error("You can't buy node from yourself referral code", {
          duration: 5000,
        });
        setIsIdLoader("");
        setIsLoading(false);
        setCategoryId("");
        setInitialCount(0);
        return;
      }

      const amount = Number(priceO) * counts;

      setLastPurchaseAmount(amount);
      await buyToken({
        address: ContractSaleAddress as `0x${string}`,
        abi: ContractSaleABI,
        functionName: "buyNFT",
        args: [id, id1, amount, counts, refAddress],
      });

      toast.loading("Buying Node...", { duration: 5000 });
    } catch (error) {
      setIsIdLoader("");

      toast.error("Failed to buy node", { duration: 5000 });
    } finally {
      setIsLoading(false); // Hide loader after buying
    }
  };

  useEffect(() => {
    if (buyHash) {
      setIsIdLoader("");
      toast.success("Transaction successful", { duration: 5000 });
    }
  }, [buyHash]);

  return (
    <>
      {isOpen && (
        <PurchaseSuccessModal
          hash={buyHash?.toString() || ""}
          categoryId={Number(categoryId)}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
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

      <main id="main">
        <div className="header2"></div>
        <div
          id="about"
          className="bg-light about section-header position-relative overflow-hidden"
        >
          <div className="container-xl container-lg container ">
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

            {isLoading ? (
              <div className=" flex items-center justify-center mx-auto text-center">
                <CircularProgress color="secondary" size={50} />
              </div>
            ) : (
              <SaleCart
                saleDataArr={phaseList}
                allowance={allowance}
                isBuying={isBuying}
                isApproving={isApproving}
                approveTokenContract={approveTokenContract}
                isLoading={isLoading}
                buyTokenNodeContract={buyTokenNodeContract}
                setIsModalOpen={setIsModalOpen}
                isIdLoader={isIdLoader}
                isApIdLoader={isApIdLoader}
                balance={Number(balance)}
                id={id || "0"}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default SaleNode;
