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

    if (teamRequest.status === "ACCEPTED" || teamRequest.status === "CONFIRMED") {
        return NextResponse.json({error: "This request has already been accepted."}, {status: 400})
    }

    if (teamRequest.status === "REJECTED") {
        return NextResponse.json({error: "This request has already been rejected."}, {status: 400})
    }

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