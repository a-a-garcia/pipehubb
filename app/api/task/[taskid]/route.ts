import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, {params} : {params: {taskid : string}}){
    const taskItem = await prisma.taskList.findUnique({
        where: {id: parseInt(params.taskid)},
        include: {user: {select: {name: true, image: true, email: true}}}
    })

    if (!taskItem) {
        return NextResponse.json({error: "Could not find requested task item."}, {status: 404})
    }

    const taskUpdates = await prisma.taskUpdates.findMany({
        where: {taskListId: parseInt(params.taskid)},
        // if you're ordering by more than one field, you need to pass it as an array of objects.
        orderBy: [{createdAt: "desc"}, {important: "desc"}],
        include: {user: {select: {name: true, image: true, email: true}}}
    })


    return NextResponse.json({taskItem, taskUpdates}, { status: 200 });
}
