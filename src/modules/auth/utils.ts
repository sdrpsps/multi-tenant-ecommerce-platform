import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "./constants";

interface GenerateAuthCookiesProps {
  value: string;
}

export const generateAuthCookies = async ({
  value,
}: GenerateAuthCookiesProps) => {
  const cookies = await getCookies();
  cookies.set({
    name: AUTH_COOKIE,
    value,
    httpOnly: true,
    path: "/",
  });
};
