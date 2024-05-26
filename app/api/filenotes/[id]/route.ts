import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { convertBigIntToString, convertObjectIdsToString } from "../../helperFunctions"

export async function GET(request: NextRequest, {params} : {params : {id: string}}) {
    const loanFileNotes = await prisma.fileNotes.findMany({
        where: {loanId: BigInt(params.id)},
        orderBy: [{important: "desc"}, {createdAt: "desc"}],
        include: {user: {select: {name: true, image: true, email: true}}}
    })

    if (!loanFileNotes) {
        return NextResponse.json({error: "Could not find any file notes for requested loan."}, {status: 404})
    }

    const convertedLoanFileNotes = await convertObjectIdsToString(loanFileNotes)

    return NextResponse.json(convertedLoanFileNotes, {status: 200})
}

export async function PATCH(request: NextRequest, response: NextResponse) {
    const body = await request.json();
   try {
       const updatedFileNote = await prisma.fileNotes.update({
           where: {id: body.noteId},
           data: {
               note: body.note,
               important: body.important
           }
       })

       const convertedUpdatedFileNote = await convertBigIntToString(updatedFileNote)
   
       return NextResponse.json(convertedUpdatedFileNote, {status: 200})
   } catch {
    return NextResponse.json({error: `An error occurred while attempting to update file note ${body.noteId}.`})
   }
}

export async function DELETE(request:NextRequest, response:NextResponse) {
    const body = await request.json();

    try {
        if (body.deleteAll) {
            await prisma.fileNotes.deleteMany({
                where: {loanId: body.loanId}
            })
            return NextResponse.json({}, {status:200})
        } else {
            await prisma.fileNotes.delete({
                where: { id: body.noteId}
            })
            return NextResponse.json({}, {status:200})
        }
    } catch {
        return NextResponse.json({error: `An error occurred while attempting to delete loanId ${body.loanId}'s file notes.`})
    }
    
}
