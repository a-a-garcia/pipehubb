import prisma from "@/prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { convertBigIntToString } from "../helperFunctions";

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
                userId: body.userId,
                taskListId: foundTask.id,
                message: body.message,
                important: body.important
            }
        })
        const convertedNewTaskUpdate = await convertBigIntToString(newTaskUpdate)
        return NextResponse.json(convertedNewTaskUpdate, {status: 201})
    } catch {
        return NextResponse.json({error: "An error occurred while attempting to create a new task update."}, {status: 500})
    }
}

export async function PATCH(request: NextRequest, response: NextResponse){
    const body = await request.json();

    try {
        const taskToUpdate = await prisma.taskUpdates.findUnique({
            where: {id: body.taskUpdateId}
        })

        if (!taskToUpdate) {
            return NextResponse.json({error: "Could not find requested task update item to update"}, {status: 404})
        }

        const updatedTaskUpdate = await prisma.taskUpdates.update({
            where: {id: body.taskUpdateId},
            data: {
                message: body.message,
                important: body.important
            }
        })

        const convertedUpdatedTaskUpdate = await convertBigIntToString(updatedTaskUpdate)
        return NextResponse.json(convertedUpdatedTaskUpdate, {status: 200})
    } catch {
        return NextResponse.json({error: `An error occurred while attempting to update task update item ${body.id}.`}, {status: 500})
    }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    try {
        if (body.deleteAll) {
            const foundTask = await prisma.taskList.findUnique({
                where: {id: body.taskListId}
            })
            
            if (!foundTask) {
                return NextResponse.json({error: "Could not find task, so could not delete any task updates"}, {status: 404})
            }
            await prisma.taskUpdates.deleteMany({
                where: {id: body.id}
            });
        } else {
            await prisma.taskUpdates.delete({
                where: {id: body.taskUpdateId}
            });
        }

        return NextResponse.json({}, {status: 200})

    } catch {
        return NextResponse.json({error: error}, {status: 500})
    }
}
