"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

import { useTRPC } from "@/trpc/client";

const StripeVerifyPage = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        location.href = data.url;
      },
      onError: () => {
        location.href = "/";
      },
    })
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <LoaderIcon className="text-muted-foreground animate-spin" />
    </div>
  );
};

export default StripeVerifyPage;
