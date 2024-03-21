import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(response: NextResponse, {params} : {params: {id: string}}) {
    try {
        const loan = await prisma.loan.findUnique({
            where: {id: parseInt(params.id)}
        })
        if (!loan) {
            return NextResponse.json({message: "Loan not found"}, {status: 404})
        }
        return NextResponse.json(loan, {status: 200})
    }
    catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

export async function PATCH(request: NextResponse, { params } : {params : {id: string}}) {
    console.log(request, params)
    try {
        // prisma.loan.update( {
        //     where: { id: parseInt(params.id) },
        //     data: {
        //         pipelineStage:
        //     }
        // })
    } catch {

    }
}
