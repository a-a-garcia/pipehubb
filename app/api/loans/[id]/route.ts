import prisma from "@/prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
import { editLoanSchema } from "@/app/validationSchemas";

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

export async function PUT(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        const body = await request.json();
        
        const validated = editLoanSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                validated.error.format(),
                {status: 400}
            )
        }
        const updatedLoan = await prisma.loan.update({
            where: {id: parseInt(params.id)},
            data: {
                transactionType: body.transactionType ? body.transactionType.trim() : undefined,
                borrowerName: body.borrowerName ? body.borrowerName.trim() : undefined,
                loanAmount: body.loanAmount ? body.loanAmount : undefined,
                borrowerEmail: body.borrowerEmail ? body.borrowerEmail : undefined,
                propertyAddress: body.propertyAddress ? body.propertyAddress.trim() : undefined,
                purchasePrice: body.purchasePrice ? body.purchasePrice : undefined,
                creditScore: body.creditScore ? body.creditScore : undefined,
                borrowerPhone: body.borrowerPhone ? body.borrowerPhone.trim() : undefined,
                referralSource: body.referralSource ? body.referralSource.trim() : undefined
            }
        })
        return NextResponse.json(updatedLoan, {status: 200})
    } catch {
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
        // locate loan to delete
        const loanToDelete = await prisma.loan.findUnique({
           where: { id: parseInt(params.id) }
        })
   
        // if loan not found, return 404
        if (!loanToDelete) {
            return NextResponse.json({message: "Loan not found"}, {status: 404})
        } else {
            // otherwise, locate activity logs associated with said loan
            const activityLogsToDelete = await prisma.activityLog.findMany({
                where: {loanId: loanToDelete.id}
            })

            // delete all logs with associated loan - there should normally always be at least one log to delete because a log is editd on loan creation
            if (activityLogsToDelete) {
                await prisma.activityLog.deleteMany({
                    where: {loanId: loanToDelete.id}
                })
            } else {
                // error handling just in case
                return NextResponse.json({message: "Could not find activity logs to delete"}, {status: 404})
            }
            
            // delete loan after deleting associated logs
            await prisma.loan.delete({
                where: {id: loanToDelete.id}
              })

                // return success message
             return NextResponse.json({message: "Loan and related activity logs (if any) deleted."}, {status: 200})
        }
        // error handling


       } catch (error) {
         console.error(error)
         return NextResponse.json({message: "An error occurred"}, {status: 500})
       }
  }


