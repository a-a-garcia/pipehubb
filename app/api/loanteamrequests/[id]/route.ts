import prisma from "@/prisma/client"
import { LoanTeamRequest } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

function convertBigIntToString(arr: any[]): any[] {
    return arr.map(obj => {
        let newObj = {...obj};
        if (newObj.id) {
            newObj.id = BigInt(newObj.id).toString();
        }
        if (newObj.loanTeamId) {
            newObj.loanTeamId = BigInt(newObj.loanTeamId).toString();
        }
        return newObj;
    });
}

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    //find all loan team requests where the user is the requestor (requesting to join a team).
    const requestorTeamRequests = await prisma.loanTeamRequest.findMany({
        where: {requestorId: params.id}
    })

    if (!requestorTeamRequests) {
        return NextResponse.json({message: "requestorTeamRequests=0"}, {status: 404})
    }

    //find all loan team requests where the user is the requestee (being requested by another user to join their team).
    const requesteeTeamRequests = await prisma.loanTeamRequest.findMany({
        where: {requesteeId: params.id}
    })

    if (!requesteeTeamRequests) {
        return NextResponse.json({message: "requesteeTeamRequests=0"}, {status: 404})
    }

    // need to add the email of the requestor to each request object returned to the client. this array will represent all the requests that the user has made to join other teams.
    let outgoingLoanTeamRequests: LoanTeamRequest[] = await Promise.all(requestorTeamRequests.map(async (request) => {
        const teamName = await prisma.loanTeam.findUnique({
            where: {id: request.loanTeamId}
        })
        const requestee = await prisma.user.findUnique({
            where: {id: request.requesteeId}
        })
        return {...request, requesteeEmail: requestee?.email || null, teamName: teamName?.teamName || null};
    }))

    //need the email of the requestee added to each request object returned to the client, this array represents all requests that need to be approved or rejected by the user.
    let incomingLoanTeamRequests: LoanTeamRequest[] = await Promise.all(requesteeTeamRequests.map(async (request) => {
        const teamName = await prisma.loanTeam.findUnique({
            where: {id: request.loanTeamId}
        })
        const requestor = await prisma.user.findUnique({
            where: {id: request.requestorId}
        })
        return {...request, requestorEmail: requestor?.email || null, teamName: teamName?.teamName || null};
    }))

    outgoingLoanTeamRequests = convertBigIntToString(outgoingLoanTeamRequests);

    incomingLoanTeamRequests = convertBigIntToString(incomingLoanTeamRequests)

    outgoingLoanTeamRequests = outgoingLoanTeamRequests.filter(request => request.status !== "CONFIRMED")

    incomingLoanTeamRequests = incomingLoanTeamRequests.filter(request => request.status === "PENDING")

    return NextResponse.json([outgoingLoanTeamRequests, incomingLoanTeamRequests], {status: 200})
}
