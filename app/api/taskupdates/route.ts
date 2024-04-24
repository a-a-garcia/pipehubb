import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const foundTask = await prisma.taskList.findUnique({
        where: {id: body.taskId}
    })

    if (!foundTask) {
        return NextResponse.json({error: "Could not find requested task, therefore could not create a new task update for requested task."}, {status:404})
    }

    try {
        const newTaskUpdate = await prisma.taskUpdates.create({
            data: {
                taskListId: foundTask.id,
                message: body.message,
                important: body.important
            }
        })
        return NextResponse.json(newTaskUpdate, {status: 201})
    } catch {
        return NextResponse.json({error: "An error occurred while attempting to create a new task update."}, {status: 500})
    }
}