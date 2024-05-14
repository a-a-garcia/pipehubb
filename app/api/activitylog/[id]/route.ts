import prisma from "@/prisma/client"
import { NextResponse } from "next/server"

export async function GET(response: NextResponse, {params} : {params: {id: string}}) {
    const loansActivityLog = await prisma.activityLog.findMany({
        where: { loanId: parseInt(params.id) },
        orderBy: { createdAt: "desc"},
        include: { 
            user: {
                select: { 
                    name: true, 
                    image: true}
                }
            }
    })

    if (!loansActivityLog) {
        return NextResponse.json({error: "Could not find any activity logs for requested loan."}, {status: 404})
    }

    return NextResponse.json(loansActivityLog, {status: 200})
}