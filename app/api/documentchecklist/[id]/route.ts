import { editDocumentChecklistStatusSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    const documentChecklist = await prisma.documentChecklist.findMany({
        where: {loanId: parseInt(params.id)},
        orderBy : [{status: "desc"}, {important: "desc"}, {createdAt: "desc"}],
        include: { user: { select: {name: true, image: true, email: true}}}
    })

    if (!documentChecklist) {
        return NextResponse.json({error: "Could not find any document checklist items for requested loan."}, {status: 404})
    }

    return NextResponse.json(documentChecklist, {status: 200})
}


export async function PATCH(request:NextRequest, response: NextResponse) {
    const body = await response.json();

    const validated = editDocumentChecklistStatusSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json({error: validated.error}, {status: 400})
    }

    const foundChecklistItem = await prisma.documentChecklist.findUnique({
        where: { id: parseInt(body.id) }
    })

    if (!foundChecklistItem) {
        return NextResponse.json({error: "Could not find requested checklist item."}, {status: 404})
    }

    const updatedChecklistItem = await prisma.documentChecklist.update({
            where: { id: parseInt(body.id) },
            data: { status: body.status }
        });

    return NextResponse.json(updatedChecklistItem, {status: 200})
}

export async function DELETE(request:NextRequest, response:NextResponse) {
    const body = await request.json();

    if (body.deleteAll) {
        await prisma.documentChecklist.deleteMany({
            where: {loanId: body.loanId}
        });
    } else {
        await prisma.documentChecklist.delete({
            where: { id: body.checklistId }
        });
    }
    
    return NextResponse.json({error: `An error occurred while attempting to delete loanId ${body.loanId}'s document checklist.`})
}
