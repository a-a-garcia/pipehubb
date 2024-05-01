import { createUserSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const validated = createUserSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(
            validated.error.format(),
            {status: 400}
        )
    }
    
    const emailExists = await prisma.user.findUnique({
        where: { email: body.email }
    })
    
    if (emailExists) {
        return NextResponse.json({error: "Email already exists."}, {status: 400})
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            hashedPassword: hashedPassword,
        }
    })

    if (body.existingUserEmail) {
        const existingUser = await prisma.user.findUnique({
            where: { email: body?.existingUserEmail }
        })
        if (body.existingUserEmail === body.email) {
            return NextResponse.json({error: "New user email and existing user email cannot be the same."}, {status: 400})
        }
        if (!existingUser) {
            return NextResponse.json({error: "Couldn't find a user with that email."}, {status: 400})
        }
        const newLoanTeamRequest = await prisma.loanTeamRequest.create({
            data: {
                requestorId: newUser.id,
                requesteeId: existingUser.id
            }
        })
        return NextResponse.json([newUser, newLoanTeamRequest], {status:200})
    } else {
        const newLoanTeam = await prisma.loanTeam.create({
            data: {}
        })
    
        const newLoanTeamMember = await prisma.loanTeamMember.create({
            data: {
                userId: newUser.id,
                loanTeamId: newLoanTeam.id
            }
        })
    
        return NextResponse.json([newUser, newLoanTeam, newLoanTeamMember],{status: 200})
    }
}

export async function GET(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    // const userPipelines = await prisma.loanTeamMember.findMany({
    //     where: { userId: body.id },
    // })
}