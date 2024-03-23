import prisma from "@/prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

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

export async function PATCH(request: NextRequest, { params } : {params : {id: string}}) {
    const body = await request.json();
    try {
        await prisma.loan.update( {
            where: { id: parseInt(params.id) },
            data: {
                pipelineStage: body.pipelineStage
            }
        })
        return NextResponse.json({message: "Loan successfully updated", status: 200})
    } catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

export async function DELETE(response:NextResponse, {params} : {params : {id: string}}) {
    try {
        const loanToDelete = await prisma.loan.findUnique({
           where: { id: parseInt(params.id) }
        })
   
        if (!loanToDelete) {
            return NextResponse.json({message: "Loan not found"}, {status: 404})
        } else {
            const activityLogsToDelete = await prisma.activityLog.findMany({
                where: {loanId: loanToDelete.id}
            })
            
            if (activityLogsToDelete) {
                await prisma.activityLog.deleteMany({
                    where: {loanId: loanToDelete.id}
                })
            } else {
                return NextResponse.json({message: "Could not find activity logs to delete"}, {status: 404})
            }
            
            await prisma.loan.delete({
                where: {id: loanToDelete.id}
              })


             return NextResponse.json({message: "Loan and related activity logs (if any) deleted."}, {status: 200})
        }
        
       } catch (error) {
         console.error(error)
         return NextResponse.json({message: "An error occurred"}, {status: 500})
       }
  }


