import { Media, Tenant } from "@/payload-types";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { generateTenantUrl } from "@/lib/utils";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { PLATFORM_FEE_PERCENTAGE } from "../constants";
import { getProductsSchema, purchaseSchema } from "../schemas";
import { CheckoutMetadata, ProductMetadata } from "./types";

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0,
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const tenantId = user.tenants?.[0].tenant as string;

    const tenant = await ctx.db.findByID({
      collection: "tenants",
      id: tenantId,
      depth: 0,
    });

    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant not found",
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink.url) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "Failed to create account link",
      });
    }

    return { url: accountLink.url };
  }),
  getProducts: baseProcedure
    .input(getProductsSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        where: {
          and: [
            { id: { in: input.ids } },
            { isArchived: { not_equals: true } },
          ],
        },
      });

      if (data.totalDocs !== data.docs.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);

        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
  purchase: protectedProcedure
    .input(purchaseSchema)
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        where: {
          and: [
            { id: { in: input.productIds } },
            { "tenant.slug": { equals: input.tenantSlug } },
            { isArchived: { not_equals: true } },
          ],
        },
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      const tenantData = await ctx.db.find({
        collection: "tenants",
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      if (!tenant.stripeDetailSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant details not submitted",
        });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100, // Stripe handles prices in cents
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
            },
          },
        }));

      const totalAmountCents = products.docs.reduce(
        (acc, item) => acc + item.price * 100,
        0
      );
      const platformFeeAmount = Math.round(
        totalAmountCents * (PLATFORM_FEE_PERCENTAGE / 100)
      );

      const domain = generateTenantUrl;

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId: ctx.session.user.id,
          } as CheckoutMetadata,
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        }
      );

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: checkout.url };
    }),
});
