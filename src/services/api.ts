// src/services/api.ts

import apiInstance from "./apiInstance";

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

// Example: Add Expense API (POST)
