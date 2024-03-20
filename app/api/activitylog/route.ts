import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createActivityLogSchema } from "../../validationSchemas";

export async function POST(request:NextRequest) {
    const body = await request.json()

    const findLoan = await prisma.loan.findUnique({
        where: {
            id: body.loanId
        }
    })

    if (!findLoan) {
        return NextResponse.json({error: "Could not find requested loan to associate activity with."}, {status: 404})
    }
    
    const validated = createActivityLogSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json(validated.error.errors, {status: 400})
    }

    const newActivity = await prisma.activityLog.create({
        data: {
            loanId: body.loanId,
            message: body.message,
        }
    })

    return NextResponse.json(newActivity, {status: 201})
}

