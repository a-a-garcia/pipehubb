import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { LoanTeam } from "@prisma/client";

type LoanTeamStringId = {
    id: string;
    teamName: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function GET(request:NextRequest, {params} : {params: {id: string}}) {
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

    const loanTeams: LoanTeamStringId[] = [];

    //wrap prisma call to loanTeam in a Promise.all(), to ensure that all promises returned by the map() are resolved before proceeding futher. By using Promise.all(), we can execute all the promises concurrently. This means that all the promises are initiated at the same time, and the code doesn't wait for each promise to resolve before moving on to the next one.
    await Promise.all(usersLoanTeams.map(async (team) => {
        const loanTeam = await prisma.loanTeam.findUnique({
            where: {id: team.loanTeamId}
        })
        if (loanTeam) {
            loanTeams.push({...loanTeam, id: loanTeam.id.toString()})
        }
    }))


    return NextResponse.json(loanTeams, {status: 200})
}




// in Next.js API routes, only two arguments are passed: request and response.

// In your function signature, you're expecting three arguments: request, response, and an object with a params property. If only two arguments are passed to this function (as is the case with Next.js API routes), then the third argument ({params}) will be undefined.

// When you omit the request: NextRequest parameter, the function signature changes to expect only two arguments: response and {params}. In this case, when two arguments are passed to the function, the second argument will correctly match {params}.

// `GET(response: NextResponse, {params} : {params: {id: string}}) ` instead of `GET(request: NextRequest, response: NextResponse, {params} : {params: {id: string}}) `