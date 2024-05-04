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


    
    return NextResponse.json(newUser ,{status: 200})
}


export async function GET(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    // const userPipelines = await prisma.loanTeamMember.findMany({
    //     where: { userId: body.id },
    // })
}