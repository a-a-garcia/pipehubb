import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(response:NextResponse, {params} : {params : {id: string}}) {
    const loanFileNotes = await prisma.fileNotes.findMany({
        where: {loanId: parseInt(params.id)},
        orderBy: [{important: "desc"}, {createdAt: "desc"}]
    })

    if (!loanFileNotes) {
        return NextResponse.json({error: "Could not find any file notes for requested loan."}, {status: 404})
    }

    return NextResponse.json(loanFileNotes, {status: 200})
}

export async function DELETE(request:NextRequest, response:NextResponse) {
    const body = await request.json();

    if (body.deleteAll) {
        await prisma.fileNotes.deleteMany({
            where: {loanId: body.loanId}
        })
        return NextResponse.json({}, {status:200})
    }
    
    return NextResponse.json({error: `An error occurred while attempting to delete loanId ${body.loanId}'s file notes.`})
}
