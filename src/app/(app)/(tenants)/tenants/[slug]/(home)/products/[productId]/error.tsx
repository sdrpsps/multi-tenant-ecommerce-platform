"use client";

import { TriangleAlertIcon } from "lucide-react";

const Product = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border border-black flex flex-col items-center justify-center p-8 gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlertIcon />
        <p className="text-base font-medium">Something went wrong</p>
      </div>
    </div>
  );
};

export default Product;
