import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\n/g, '\n'),
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        code: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        const valid = await verifyOtp(credentials.phone, credentials.code);
        if (!valid) throw new Error("Invalid OTP");
        return { id: credentials.phone };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      name,
    },
  });

  return NextResponse.json(user);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json(session);
}
