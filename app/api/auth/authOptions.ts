import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma/client"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

const authOptions: NextAuthOptions = {
    // Must infer adapter as Adapter or TypeScript will complain that `Types of property 'createUser' are incompatible.` 
    adapter: PrismaAdapter(prisma) as Adapter,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
//   when we use an adapter next auth changes the session strategy from jwt to database, but databse strategy doesnt work with oAuth providers like google. So we need to change the session strategy back to jwt
  session: {
    strategy: "jwt"
  }
}

export default NextAuth(authOptions)