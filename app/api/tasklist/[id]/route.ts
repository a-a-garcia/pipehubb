import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, {params} : {params: {id : string}}){
    const taskList = await prisma.taskList.findMany({
        where: {loanId: parseInt(params.id)},
        orderBy : [{status: "desc"}, {important: "desc"}, {createdAt: "desc"}]
    })

    if (!taskList) {
        return NextResponse.json({error: "Could not find any task list items for requested loan."}, {status: 404})
    }

    return NextResponse.json(taskList, {status: 200})
}
