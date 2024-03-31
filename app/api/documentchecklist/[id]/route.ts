import { editDocumentChecklistStatusSchema } from "@/app/validationSchemas";
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

export async function PATCH(response:NextResponse, request:NextRequest) {
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
    })

    return NextResponse.json(updatedChecklistItem, {status: 200})
}

// export async function PUT(response:NextResponse, request:NextRequest) {

// }