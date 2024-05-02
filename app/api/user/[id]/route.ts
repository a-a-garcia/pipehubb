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

// export async function PUT(request:NextRequest, response:NextResponse) {

// }