"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPhaseList } from "@/services/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
const BuyNode = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [phaseList, setPhaseList] = useState<
    { id: string; title: string; total: number }[]
  >([]);
  const { address } = useAccount();

  const [referralLink] = useState(`https://definode.io/?ref=${address}`);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral copied");
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchPhaseList = async () => {
      try {
        const data = await getPhaseList();
        setPhaseList(data.data);
        setIsLoading(false);
        console.log("Phase List:", data);
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to fetch phase list:", error);
      }
    };
    fetchPhaseList();
  }, []);

  const goToDashboard = (userId: string) => {
    router.push(`/Sale?id=${userId}`);
  };

  return (
    <main id="main">
      <div className="header2"></div>
      <div
        id="about"
        className="bg-light about section-header position-relative overflow-hidden"
      >
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-9">
              <div className="text-center">
                <span className="textpink">DeFi Node</span>
              </div>
              <h3>
                How the <span className="textpink2">Socket System Works</span>
              </h3>
              <p className="text-center">
                The DeFi Node sale includes 10 simultaneous Sockets, each
                delivering unique rewards and exclusive benefits.
              </p>

              {/* Referral Link Section */}
              <div className="text-center mt-4">
                <p>
                  <strong>Your Referral Link:</strong>
                </p>
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    className="form-control w-50 me-2"
                    value={referralLink}
                    readOnly
                  />
                  <button className="btn btn-primary" onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
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
              {phaseList?.map(
                (phase, index) =>
                  index == 0 && (
                    <div key={phase.id} className="col-lg-4 col-md-6 col-12">
                      <div className="sbox grade2">
                        <div className="ribbon ribbon-top-right">
                          <span>Sale</span>
                        </div>
                        <div className="d-flex justify-content-between ltop">
                          <div>
                            <h5 className="text-white font-weight-bold mb-0">
                              <Image
                                height={30}
                                width={30}
                                src="/assets/img/zcash.png"
                                alt="Defi"
                              />{" "}
                              {phase.title}
                            </h5>
                          </div>
                          <div>
                            <Image
                              src="/assets/img/zcash.png"
                              height={25}
                              width={25}
                              alt="Defi"
                            />
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
                          <span>0</span>
                        </div>
                        <div className="text-center mt-3">
                          <button
                            onClick={() => goToDashboard(phase.id)}
                            className="btnpink3 btn px-4 py-2 rounded-pill"
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BuyNode;
