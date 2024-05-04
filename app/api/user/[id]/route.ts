import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(response: NextResponse, {params} : {params: {id: string}}) {
    try {
        const user = await prisma.user.findUnique({
            where: {id: params.id}
        })
        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }
        return NextResponse.json(user, {status: 200})
    }
    catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

export async function PUT(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const newUser = await prisma.user.findUnique({
        where: {id: body.id}
    })

    if (!newUser) {
        return NextResponse.json({error: "User not found."}, {status: 404})
    }

    if (body.existingUserEmail) {
        const existingUser = await prisma.user.findUnique({
            where: { email: body?.existingUserEmail }
        })
        if (body.existingUserEmail === newUser?.email) {
            return NextResponse.json({error: "Existing user email and new user email can't be the same. If you want to create a new team, continue without providing an existing user email."}, {status: 400})
        }
        if (!existingUser) {
            return NextResponse.json({error: "Couldn't find a user with that email."}, {status: 400})
        }
        
        await prisma.loanTeamRequest.create({
            data: {
                requestorId: body.id,
                requesteeId: existingUser.id
            }
        })
    } else {
        const newLoanTeam = await prisma.loanTeam.create({
            data: {
                teamName: body.teamName
            }
        })
        await prisma.loanTeamMember.create({
            data: {
                userId: body.id,
                loanTeamId: newLoanTeam.id
            }
        })
    }

    const updatedUser = await prisma.user.update({
        where: {id: newUser.id},
        data: {
            firstTimeLogin: false
        }
    })

    return NextResponse.json(updatedUser, {status: 200})
}

// export async function PUT(request:NextRequest, response:NextResponse) {

// }