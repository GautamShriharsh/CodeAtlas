import { db } from "@/server/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  const body = await request.text(); // why text and not body
  const signature = (await headers()).get("Stripe-Signature") as string; // why await

  let event: Stripe.Event; // why let and not const

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  console.log(event.type);

  if (event.type === "checkout.session.completed") {
    const credits = Number(session.metadata?.credits);
    const userId = session.client_reference_id;
    if (!userId || !credits) {
      return NextResponse.json(
        { error: "Missing userId or credits" },
        { status: 400 },
      );
    }

    await db.stripeTransaction.create({
      data: {
        userId,
        credits,
      },
    });
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          increment: credits,
        },
      },
    });

    return NextResponse.json(
      { message: "Credits added successfully" },
      { status: 200 },
    );
  }

  return NextResponse.json({ error: "Invalid Event" }, { status: 400 });

}
