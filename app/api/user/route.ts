import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const emailExists = await prisma.user.findUnique({
        where: { email: body.email }
    })

    if (body.existingUserEmail) {
        const existingUserEmail = await prisma.user.findUnique({
            where: { email: body?.existingUserEmail }
        })
        if (!existingUserEmail) {
            return NextResponse.json({error: "Couldn't find a user with that email."}, {status: 400})
        }
    }
    
    if (emailExists) {
        return NextResponse.json({error: "Email already exists."}, {status: 400})
    }

    return NextResponse.json("End of API endpoint",{status: 200})
}