"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaRegCopy, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getDashboard, getPhaseList } from "@/services/api";
import CircularProgress from "@mui/material/CircularProgress";
import { RiTelegram2Line } from "react-icons/ri";
import { BiUserCheck } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { useAccount, useReadContract } from "wagmi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ContractSaleABI, ContractSaleAddress } from "@/constants/contract";
const BuyNode = () => {
  const router = useRouter();
  const [dashBoardData, setDashboardData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phaseList, setPhaseList] = useState<
    { id: string; title: string; total: number }[]
  >([]);
  const { address } = useAccount();

  const referralLink = `https://definode.io/?ref=${dashBoardData}`;
  const referralLink1 = `${dashBoardData}`;

  const [copied, setCopied] = useState(false);
  const [copied1, setCopied1] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral copied");
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    });
  };
  const copyToClipboard1 = () => {
    navigator.clipboard.writeText(referralLink1).then(() => {
      setCopied1(true);
      toast.success("Referral copied");
      setTimeout(() => setCopied1(false), 2000); // Reset after 2s
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchPhaseList = async () => {
      try {
        const data = await getPhaseList();
        setPhaseList(data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchPhaseList();
  }, []);

  const goToDashboard = (userId: string) => {
    router.push(`/Sale?id=${userId}`);
  };

  useEffect(() => {
    // setIsLoading(true);
    const fetchDashList = async () => {
      try {
        const data = await getDashboard();
        setDashboardData(data.data.ProfileInfo.userSponsorCode);
        // setIsLoading(false);
        // console.log("Phase dash List:", data);
      } catch (error) {
        // setIsLoading(false);
        // console.error("Failed to fetch phase list:", error);
      }
    };
    fetchDashList();
  }, []);

  const { data, error } = useReadContract({
    address: ContractSaleAddress as `0x${string}`,
    abi: ContractSaleABI,
    functionName: "getUserRecord",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const [phaseTotals, setPhaseTotals] = useState<bigint[]>(
    Array(10).fill(BigInt(0))
  );

  useEffect(() => {
    // Log contract errors
    if (error) {
      // console.error("Contract error:", error);
      return;
    }

    // Validate data structure
    if (!data || !Array.isArray(data) || data.length < 2) {
      // console.log("Invalid data structure:", {
      //   data,
      //   isArray: Array.isArray(data),
      //   length: Array.isArray(data) ? data.length : undefined,
      // });
      return;
    }

    const userRecords = data[1] as {
      phase: bigint;
      category: bigint;
      amount: bigint;
      timeStamp: bigint;
    }[];

    // Check if userRecords is an array
    if (!Array.isArray(userRecords)) {
      // console.log("userRecords is not an array:", userRecords);
      return;
    }

    // Initialize array for phases 1 to 10 (index 0 to 9)
    const totals = Array(10).fill(BigInt(0));

    for (const record of userRecords) {
      // Validate record
      if (
        !record ||
        typeof record !== "object" ||
        !("phase" in record) ||
        !("amount" in record)
      ) {
        continue;
      }

      const phase = Number(record.phase); // Convert bigint to number
      const amount = record.amount; // Already bigint

      if (isNaN(phase) || phase < 1 || phase > 10) {
        continue;
      }

      // Update array at index (phase - 1)
      totals[phase - 1] = (totals[phase - 1] || BigInt(0)) + amount;
    }

    setPhaseTotals(totals);
  }, [data, error]);

  // share the social media link code

  const message = `https://definode.io/?ref=${dashBoardData}`;
  const encodedMessage = encodeURIComponent(message);
  const shareUrl = `https://wa.me/?text=${encodedMessage}`; // share for the whatsapp

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    message
  )}}`;

  const twitterUrl = `https://x.com/${message}`;
  // const instagramUrl = "https://www.instagram.com/definode.io/";
  // const telegramUrl = "t.me/definode";
  // const facebookUrl = "https://www.facebook.com/profile.php?id=61578764065780";

  // +919214872305

  return (
    <main id="main">
      <div className="header2"></div>
      <div
        id="about"
        className="bg-light about section-header position-relative overflow-hidden"
      >
        <div className="container-xl container-lg container ">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-9">
              <div className="text-center">
                <span className="textpink">DeFi Node</span>
              </div>
              <h3>
                How the{" "}
                <span className="textpink2">DeFi Node System Works</span>
              </h3>
              <p className="text-center">
                The DeFi Node sale includes 10 simultaneous Phases, each
                delivering unique rewards and exclusive benefits.
              </p>

              {!isLoading && (
                <div className="px-3 col-12 mx-auto  justify-content-center max-w-full py-4 mb-4">
                  <div
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(175, 120, 227, 1) 0%, rgba(96, 44, 144, 1) 100%)",
                      padding: "25px",
                      borderRadius: "15px",
                      boxShadow: "-3px 9px 15px -8px #000000",
                      WebkitBoxShadow: "-3px 9px 15px -8px #000000",
                    }}
                    className="p-3"
                  >
                    <h5 className="text-center font-weight-bold mb-3 text-white">
                      Invite your friend
                    </h5>
                    <div className="col-12 text-center mb-2">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-start">
                          <strong className="text-white">
                            Your Referral Code:
                          </strong>
                        </div>
                        <div className="px-0 col-md-8">
                          <div className="position-relative">
                            <span
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "5px",
                              }}
                            >
                              <button
                                className="bg-transparent border-0  text-dark"
                                onClick={copyToClipboard1}
                              >
                                {copied1 ? (
                                  <FaCheck style={{ color: "#602c90" }} />
                                ) : (
                                  <FaRegCopy style={{ color: "#602c90" }} />
                                )}
                              </button>
                            </span>
                            <input
                              type="text"
                              className="form-control w-100 me-2"
                              value={referralLink1}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-12 text-center">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-start">
                          <strong className="text-white">
                            Your Referral Link:
                          </strong>
                        </div>
                        <div className="px-0 col-md-8">
                          <div className="position-relative">
                            <span
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "5px",
                              }}
                            >
                              {" "}
                              <button
                                style={{
                                  width: "15px",
                                  backgroundColor: "#ecebeb",
                                }}
                                className=" px-3  border-0 text-dark"
                                onClick={copyToClipboard}
                              >
                                {copied ? (
                                  <FaCheck style={{ color: "#602c90" }} />
                                ) : (
                                  <FaRegCopy style={{ color: "#602c90" }} />
                                )}
                              </button>
                            </span>
                            <input
                              type="text"
                              className="form-control w-100 me-2"
                              value={referralLink}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-4"></div>
                      </div>
                    </div>
                    <div className=" col-12 my-2">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                          <strong className="text-white ">
                            Share Your Link:
                          </strong>
                        </div>
                        <div className="col-md-8 mx-auto  d-flex align-items-center socialShare justify-content-center">
                          <a href={shareUrl}>
                            <FaWhatsapp />
                          </a>{" "}
                          <a href={twitterUrl}>
                            <FaXTwitter />
                          </a>
                          <a href={telegramUrl}>
                            <RiTelegram2Line />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "50px",
                margin: "auto",
              }}
            >
              <CircularProgress
                color="secondary"
                className="text-center "
                size={50}
              />
            </div>
          ) : (
            <div className="row my-3 ">
              {phaseList?.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  whileHover={{ scale: 1.05 }}
                  style={{ cursor: "pointer" }}
                  className="col-lg-4 col-md-6 col-12"
                >
                  <div
                    className="sbox grade2"
                    // style={{ border: "2px solid #FFD700 " }}
                  >
                    <div className="ribbon ribbon-top-right">
                      <span>Sale</span>
                    </div>
                    <div className="d-flex justify-content-center ltop mt-3">
                      <div>
                        <h5 className="text-white font-weight-bold mb-0">
                          <BiUserCheck size={40} style={{ color: "#ffd710" }} />{" "}
                          {phase.title}
                        </h5>
                      </div>
                    </div>
                    <div className="list2">
                      <ul>
                        <li>
                          Node for Sale<span>31010 Nodes/Slot</span>
                        </li>
                        <li>
                          Pay in<span>USDT (BEP-20)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="prnode">
                      <span>Purchased Node</span>
                      <span>{phaseTotals[index]}</span>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        onClick={() => goToDashboard(phase.id)}
                        className="gold-button shine-button px-4 py-2 rounded-pill"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BuyNode;
