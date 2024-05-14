import { editTaskStatusSchema } from "@/app/validationSchemas"
import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, {params} : {params: {id : string}}){
    const taskList = await prisma.taskList.findMany({
        where: {loanId: parseInt(params.id)},
        orderBy: [{status: "desc"}, {important: "desc"}, {createdAt: "desc"}],
        include: {user: {select: {name: true, image: true, email: true}}}
    })

    if (!taskList) {
        return NextResponse.json({error: "Could not find any task list items for requested loan."}, {status: 404})
    }

    return NextResponse.json(taskList, {status: 200})
}

export async function PATCH(response:NextResponse, request:NextRequest) {
    const body = await response.json();

    const validated = editTaskStatusSchema.safeParse(body)

    if (!validated.success) {
        return NextResponse.json({error: validated.error}, {status: 400})
    }

    const foundTaskItem = await prisma.taskList.findUnique({
        where: { id: parseInt(body.id) }
    })

    if (!foundTaskItem) {
        return NextResponse.json({error: "Could not find requested Task item."}, {status: 404})
    }

    const updatedTaskItem = await prisma.taskList.update({
            where: { id: parseInt(body.id) },
            data: { status: body.status }
        });

    return NextResponse.json(updatedTaskItem, {status: 200})
}

export async function DELETE(request:NextRequest, response:NextResponse) {
    const body = await request.json();

    if (body.deleteAll) {
        await prisma.taskList.deleteMany({
            where: {loanId: body.loanId}
        });
    } else {
        await prisma.taskList.delete({
            where: { id: body.taskId }
        });
    }
    
    return NextResponse.json({error: `An error occurred while attempting to delete loanId ${body.loanId}'s document checklist.`})
}
