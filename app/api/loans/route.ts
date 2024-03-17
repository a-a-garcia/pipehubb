import { NextRequest, NextResponse } from "next/server";
import { createLoanSchema } from "../../validationSchemas";
import prisma from "@/prisma/client";

export async function POST(request:NextRequest) {
    const body = await request.json();

    const validated = createLoanSchema.safeParse(body);

    if (!validated.success) {
        return NextResponse.json(
            validated.error.format(),
            {status: 400}
        )
    }

    const newLoan = await prisma.loan.create({
        data: {
            transactionType: body.transactionType,
            borrowerName: body.borrowerName ? body.borrowerName.trim() : undefined,
            loanAmount: body.loanAmount,
            borrowerEmail: body.borrowerEmail,
            propertyAddress: body.propertyAddress ? body.propertyAddress.trim() : undefined,
            purchasePrice: body.purchasePrice,
            creditScore: body.creditScore,
            borrowerPhone: body.borrowerPhone ? body.borrowerPhone.trim() : undefined,
            referralSource: body.referralSource ? body.referralSource.trim() : undefined
        }
    })

    return NextResponse.json(newLoan, {status: 201})
}

export async function GET(request:NextRequest) {
    const pipelineStages = ['PROSPECT', 'APPLICATION', 'PROCESSING', 'UNDERWRITING', 'CONDITIONAL', 'CLOSED'];

    try {
        // initialze object to store loans for each stage
        const loansByStage: {[key: string]: {}} = {};
        // get all loans
        const loans = await prisma.loan.findMany();

        //iterate over loans and filter them into their respective stages
        pipelineStages.forEach(stage => {
            loansByStage[stage] = loans.filter(loan => loan.pipelineStage === stage)
        })


        return NextResponse.json(loansByStage, {status: 200});
    } catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}