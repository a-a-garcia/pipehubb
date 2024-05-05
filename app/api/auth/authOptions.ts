import NextAuth, { DefaultSession, getServerSession, NextAuthOptions, Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma/client"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

type SessionProps = {
  session: any;
  token: any;
};

export const authOptions: NextAuthOptions = {
  // Must infer adapter as Adapter or TypeScript will complain that `Types of property 'createUser' are incompatible.` 
  adapter: PrismaAdapter(prisma) as Adapter,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: `Credentials`,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        //check if user is valid
        //if user doesn't enter an email or password, return null
        if (!credentials?.email || !credentials?.password) return null;
        // else look for user
        const user = await prisma.user.findUnique({
          where: {email: credentials.email}
        })
        //if user is not found, return null
        if (!user) return null;
        //if user is found, compare entered pw with pw in db
        //compare doesn't accept null so we need to use `!` to tell typescript that we know hashedPassword will not be null
        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)

        return passwordsMatch ? user : null
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }: SessionProps) => {
      if (session?.user) {
        session.user.id = token.sub;
        delete session.user.email; // sanitize data for security
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
//   when we use an adapter next auth changes the session strategy from jwt to database, but databse strategy doesnt work with oAuth providers like google. So we need to change the session strategy back to jwt
  session: {
    strategy: "jwt"
  },
} satisfies NextAuthOptions

export default authOptions

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"

// Use it in server contexts
export function serverSessionAuth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}