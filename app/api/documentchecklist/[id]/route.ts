import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(response:NextResponse, {params} : {params: {id: string}}) {
    const documentChecklist = await prisma.documentChecklist.findMany({
        where: {loanId: parseInt(params.id)}
    })

    if (!documentChecklist) {
        return NextResponse.json({error: "Could not find any document checklist items for requested loan."}, {status: 404})
    }

    return NextResponse.json(documentChecklist, {status: 200})
}