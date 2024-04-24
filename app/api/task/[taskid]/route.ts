import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, {params} : {params: {taskid : string}}){
    const taskItem = await prisma.taskList.findUnique({
        where: {id: parseInt(params.taskid)}
    })

    if (!taskItem) {
        return NextResponse.json({error: "Could not find requested task item."}, {status: 404})
    }

    const taskUpdates = await prisma.taskUpdates.findMany({
        where: {taskListId: parseInt(params.taskid)}
    })


    return NextResponse.json({taskItem, taskUpdates}, { status: 200 });
}


