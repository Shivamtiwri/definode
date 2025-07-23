"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPhaseList } from "@/services/api";
import { useAccount, useReadContract } from "wagmi";
import { ContractSaleABI, ContractSaleAddress } from "@/constants/contract";
type RecordItem = {
  phase: bigint;
  category: bigint;
  amount: bigint;
  timeStamp: bigint;
};
const BuyNode = () => {
  const router = useRouter();
  const { address } = useAccount();

  const [datahest, setdatahest] = useState<RecordItem[]>([]);
  const [phaseList, setPhaseList] = useState<
    { id: string; title: string; total: number }[]
  >([]);

  useEffect(() => {
    const fetchPhaseList = async () => {
      try {
        const data = await getPhaseList();
        setPhaseList(data.data);
        // console.log("Phase List:", data);
      } catch (error) {
        console.error("Failed to fetch phase list:", error);
      }
    };
    fetchPhaseList();
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
      console.error("Contract error:", error);
      return;
    }

    // Validate data structure
    if (!data || !Array.isArray(data) || data.length < 2) {
      console.log("Invalid data structure:", {
        data,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : undefined,
      });
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
    setdatahest(userRecords);
    console.log("Raw userRecords:", userRecords);

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
        console.log("Invalid record skipped:", record);
        continue;
      }

      const phase = Number(record.phase); // Convert bigint to number
      const amount = record.amount; // Already bigint

      if (isNaN(phase) || phase < 1 || phase > 10) {
        console.log(`Invalid phase ${phase} in record:`, record);
        continue;
      }

      // Update array at index (phase - 1)
      totals[phase - 1] = (totals[phase - 1] || BigInt(0)) + amount;
      console.log(
        `Added ${amount} to phase ${phase}, new total: ${totals[phase - 1]}`
      );
    }

    console.log("Final totals before setting:", totals);
    setPhaseTotals(totals);
  }, [data, error]);

  useEffect(() => {
    console.log("Updated phaseTotals:", phaseTotals[0]);
  }, [phaseTotals]);

  const goToDashboard = (userId: string) => {
    router.push(`/Sale?id=${userId}`);
  };

  // const dataContect = datahest
  //   .filter((item) => item.phase === 1n) // Compare with bigint, not string
  //   .map((item) => {
  //     return {
  //       phase: item.phase,
  //       category: item.category,
  //       amount: item.amount,
  //       timeStamp: item.timeStamp,
  //     };
  //   });
  // console.log(dataContect, "dataContect");

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
                    <span>{phaseTotals[index]}</span>
                  </div>
                  {/* {index == 0 && (
                    <div className=" flex-column mt-2">
                      {dataContect.map((ite) => {
                        return (
                          <div
                            className="d-flex flex-wrap justify-content-between align-items-center border p-2 mb-2 rounded"
                            key={ite.category.toString()}
                          >
                            <p className="mb-0 fw-bold text-white">
                              {ite.category.toString() == "1"
                                ? "Premium Validator"
                                : ite.category.toString() == "2"
                                ? "Standard Validator"
                                : ite.category.toString() == "3"
                                ? "Observer Node"
                                : ite.category.toString() == "4"
                                ? "Rating Node"
                                : ite.category.toString() == "5"
                                ? "Micro Node"
                                : "---"}
                            </p>
                            <p className="mb-0  text-white">
                              {ite.amount.toString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )} */}

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
