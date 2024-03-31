import prisma from "@/prisma/client"
import { NextResponse } from "next/server"

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