import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency, referenceId } = await req.json();

    const response = await fetch("https://pg-sandbox.paymaya.com/payments/v1/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${process.env.MAYA_PUBLIC_KEY}`,
      },
      body: JSON.stringify({
        totalAmount: {
          value: amount,
          currency: currency || "PHP",
        },
        requestReferenceNumber: referenceId,
        redirectUrl: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed`,
          cancel: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancelled`,
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
