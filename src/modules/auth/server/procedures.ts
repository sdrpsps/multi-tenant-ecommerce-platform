import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      if (existingUser.docs.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      await ctx.db.create({
        collection: "users",
        data: input,
      });

      const data = await ctx.db.login({
        collection: "users",
        data: input,
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // TODO: CORS
        // sameSite: "none",
        // domain: "",
      });
    }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.login({
      collection: "users",
      data: input,
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to login",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      // TODO: CORS
      // sameSite: "none",
      // domain: "",
    });

    return data;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
});
