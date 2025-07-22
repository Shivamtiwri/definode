import apiInstance from "./apiInstance";
export interface BuyNftPayload {
  phaseId: string;
  totalAmount: number;
  totalNFT: number;
  phaseCategoryId: number; // 🔄 changed from string to number
  nft_ids: string;
  statusType: string;
  SponserAddress: string;
}

interface ApiResponse {
  success: boolean;
  data?: { message: string };
  error?: { message: string };
  message?: string; // optional, for top-level generic message
}
// Example: Login API
import { AxiosError } from "axios";

export const login = async (
  wallectAddress: string,
  sponsorAddress: string,
  signature: string,
  nonce: string
) => {
  try {
    const response = await apiInstance.post("/user/Login", {
      wallectAddress,
      sponsorAddress,
      signature,
      nonce,
    });
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message || "Login failed",
      };
    } else {
      return {
        success: false,
        data: null,
        error: "An unexpected error occurred",
      };
    }
  }
};

export const getPhaseList = async () => {
  const response = await apiInstance.get("/user/Phase-List", {});
  return response.data;
};

export const getPhaseCategrayList = async (id: string) => {
  const response = await apiInstance.post("/user/Phase-Category-List", {
    phaseId: id,
  });
  return response.data;
};

export const InsetBuyingNft = async (
  payload: BuyNftPayload
): Promise<ApiResponse> => {
  try {
    const response = await apiInstance.post("/user/Buy-Node-Final", payload);

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid API response");
    }

    return response.data as ApiResponse;
  } catch (error: unknown) {
    let errorMessage = "Failed to complete NFT purchase";

    if (typeof error === "object" && error !== null) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      errorMessage = err.response?.data?.message || err.message || errorMessage;
    }

    return {
      success: false,
      error: { message: errorMessage },
    };
  }
};

// Example: Add Expense API (POST)
