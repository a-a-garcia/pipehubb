import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const foundLoan = await prisma.loan.findUnique({
        where: { id: body[0].loanId}
    })

    if (!foundLoan) {
        return NextResponse.json({error: "Could not find requested loan to associate document checklist with"}, {status: 404})
    }

    const newDocumentChecklist = await prisma.documentChecklist.createMany({
       data: body 
    })

    return NextResponse.json(newDocumentChecklist, {status: 201})
}