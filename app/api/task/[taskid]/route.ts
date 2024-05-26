import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { convertBigIntToString, convertObjectIdsToString } from "../../helperFunctions";

export async function GET(request: NextRequest, {params} : {params: {taskid : string}}){
    const taskItem = await prisma.taskList.findUnique({
        where: {id: BigInt(params.taskid)},
        include: {user: {select: {name: true, image: true, email: true}}}
    })

    
    if (!taskItem) {
        return NextResponse.json({error: "Could not find requested task item."}, {status: 404})
    }
    
    const taskItemConverted = await convertBigIntToString(taskItem)

    const taskUpdates = await prisma.taskUpdates.findMany({
        where: {taskListId: BigInt(params.taskid)},
        // if you're ordering by more than one field, you need to pass it as an array of objects.
        orderBy: [{createdAt: "desc"}, {important: "desc"}],
        include: {user: {select: {name: true, image: true, email: true}}}
    })

    const taskUpdatesConverted = await convertObjectIdsToString(taskUpdates)

    console.log({taskItemConverted, taskUpdatesConverted})

    return NextResponse.json({taskItemConverted, taskUpdatesConverted}, { status: 200 });
}
