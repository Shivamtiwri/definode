"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPhaseList } from "@/services/api";

const BuyNode = () => {
  const router = useRouter();
  const [phaseList, setPhaseList] = useState<
    { id: string; title: string; total: number }[]
  >([]);

  useEffect(() => {
    const fetchPhaseList = async () => {
      try {
        const data = await getPhaseList();
        setPhaseList(data.data);
        console.log("Phase List:", data);
      } catch (error) {
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
                The DeFi Node sale includes 10 simultaneous Socket, each
                delivering unique rewards and exclusive benefits.
              </p>
            </div>
          </div>
          <div className="row my-3 justify-content-center">
            {phaseList?.map((phase, index) => (
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
                        Node for Sale<span>{phase.total} Nodes/Slot</span>
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
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BuyNode;
