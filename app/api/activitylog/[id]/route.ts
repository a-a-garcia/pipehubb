import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { convertObjectIdsToString, authenticateUserAccess } from "../../helperFunctions"
import { getServerSession } from "next-auth"
import { serverSessionAuth } from "../../auth/authOptions"

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    const loansActivityLog = await prisma.activityLog.findMany({
        where: { loanId: BigInt(params.id) },
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
    
        
        const convertedActivityLog = await convertObjectIdsToString(loansActivityLog)
        
        return NextResponse.json(convertedActivityLog, {status: 200})
}