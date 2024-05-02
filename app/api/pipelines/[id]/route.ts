import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/authOptions";
import prisma from "@/prisma/client";

export async function GET(response: NextResponse, {params} : {params: {id: string}}) {
    const user = await prisma.user.findUnique({
        where: {id: params.id}
    })

    if (!user) {
        return NextResponse.json({error: "User not found."}, {status: 404})
    }

    const usersLoanTeams = await prisma.loanTeamMember.findMany({
        where: {userId: params.id}
    })

    if (!usersLoanTeams) {
        return NextResponse.json({error: "User is not a member of any loan teams. User should be a member of at least one team."}, {status: 404})
    }

    return NextResponse.json([user, usersLoanTeams], {status: 200})
}




// in Next.js API routes, only two arguments are passed: request and response.

// In your function signature, you're expecting three arguments: request, response, and an object with a params property. If only two arguments are passed to this function (as is the case with Next.js API routes), then the third argument ({params}) will be undefined.

// When you omit the request: NextRequest parameter, the function signature changes to expect only two arguments: response and {params}. In this case, when two arguments are passed to the function, the second argument will correctly match {params}.

// `GET(response: NextResponse, {params} : {params: {id: string}}) ` instead of `GET(request: NextRequest, response: NextResponse, {params} : {params: {id: string}}) `