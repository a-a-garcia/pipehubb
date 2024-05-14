import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const foundLoan = await prisma.loan.findUnique({
        where: { id: body.loanId }
    })
    
    if (!foundLoan) {
        return NextResponse.json({error: "Could not find requested loan to associate file note with"}, { status: 404})
    }

    const newTask = await prisma.taskList.create({
        data: {
            loanId: body.loanId,
            userId: body.userId,
            title: body.title,
            description: body.description,
            dueDate: body.dueDate,
            important: body.important
        }
    })

    return NextResponse.json(newTask, {status: 201})
}

export async function PATCH(request: NextRequest, response: NextResponse){
    const body = await request.json();
    try {
        const updatedTaskItem = await prisma.taskList.update({
            where: {id: body.id},
            data: {
                title: body.title,
                description: body.description,
                dueDate: body.dueDate,
                important: body.important
            }
        })
        return NextResponse.json(updatedTaskItem, {status: 200})

    } catch {
        return NextResponse.json({error: `An error occurred while attempting to update task list item ${body.id}.`}, {status: 500})
    }

}