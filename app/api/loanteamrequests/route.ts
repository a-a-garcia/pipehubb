import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request:NextRequest) {
    const body = await request.json();

    const teamRequest = await prisma.loanTeamRequest.findUnique({
        where: {id: body.id}
    })

    if (!teamRequest) {
        return NextResponse.json({error: "Could not locate the team request."}, {status: 404})
    }

    //add error handling to ensure that teamRequest.status is one of the acceptable values - "PENDING", "ACCEPTED", "REJECTED", "CONFIRMED"
    const updatedRequest = await prisma.loanTeamRequest.update({
        where: {id: teamRequest.id},
        data: {
            status: body.status
        }
    })

    if (updatedRequest.status === "ACCEPTED") {
        await prisma.loanTeamMember.create({
            data: {
                userId: updatedRequest.requestorId,
                loanTeamId: updatedRequest.loanTeamId
            }
        })
    }

    return NextResponse.json(updatedRequest, {status: 200})
}