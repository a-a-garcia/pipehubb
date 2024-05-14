import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createFileNoteSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    const foundLoan = await prisma.loan.findUnique({
        where: { id: body.loanId }
    })
    
    if (!foundLoan) {
        return NextResponse.json({error: "Could not find requested loan to associate file note with"}, { status: 404})
    }
    
    const validated = createFileNoteSchema.safeParse(body);
    
    if (!validated.success) {
        return NextResponse.json(validated.error.errors, {status:400})
    }

    const newFileNote = await prisma.fileNotes.create({
        data: {
            userId: body.userId,
            loanId: body.loanId,
            note: body.note,
            important: body.important
        }
    })

    return NextResponse.json(newFileNote, {status: 201})
}