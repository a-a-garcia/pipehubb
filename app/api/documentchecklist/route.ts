import prisma from "@/prisma/client";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

//When testing in Postman, make sure you send an array of objects (even if it's just one object) because we are using createMany

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

export async function PATCH(request: NextRequest, response: NextResponse){
    const body = await request.json();

    try {
        const updatedChecklistItem = await prisma.documentChecklist.update({
            where: {id: body.id},
            data: {
                documentName: body.documentName,
                dueDate: body.dueDate,
                important: body.important
            }
        })
        return NextResponse.json(updatedChecklistItem, {status: 200})

    } catch {
        return NextResponse.json({error: `An error occurred while attempting to update document checklist item ${body.id}.`}, {status: 500})
    }

}