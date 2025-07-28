"use client";
import SaleNode from "@/components/page/Sale/page";
import React, { Suspense } from "react";

const Index = () => {
  return (
    <Suspense fallback={<div>Loading Sale Page...</div>}>
      <SaleNode />
    </Suspense>
  );
};

export default Index;
