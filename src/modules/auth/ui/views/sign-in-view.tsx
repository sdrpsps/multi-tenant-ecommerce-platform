"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { loginSchema } from "../../schemas";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const SignInView = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(trpc.auth.login.mutationOptions());

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-5", poppins.className)}>
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            className="flex flex-col gap-8 p-4 lg:p-16"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span className="text-2xl font-semibold">SunRoad</span>
              </Link>
              <Button
                asChild
                variant="ghost"
                className="text-base border-none underline"
              >
                <Link prefetch href="/sign-up">
                  Create account
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-semibold">
              Welcome back to SunRoad
            </h1>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              disabled={isPending}
            >
              Login in
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
