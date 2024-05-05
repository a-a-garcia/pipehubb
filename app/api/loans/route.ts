import { NextRequest, NextResponse } from "next/server";
import { createLoanSchema } from "../../validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions, serverSessionAuth } from "../auth/authOptions"
import { Loan } from "@prisma/client";

// helper function to organize loans, whether it's on first load or pipeline switch, once they are fetched from prisma
async function organizeLoans(loans: Loan[]) {
    // define pipeline stages
    const pipelineStages = ['PROSPECT', 'APPLICATION', 'PROCESSING', 'UNDERWRITING', 'CONDITIONAL', 'CLOSED'];
    // initialze object to store loans for each stage
    const loansByStage: Record<string, {}> = {};
    //iterate over loans and filter them into their respective stages
    pipelineStages.forEach(stage => {
        loansByStage[stage] = loans.filter(loan => loan.pipelineStage === stage)
    })

    return loansByStage
}

export async function POST(request:NextRequest, response:NextResponse) {

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
            loanTeamId: body.loanTeamId,
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

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.searchParams);
        console.log("searchParams: " + searchParams.get("teamName"))
        let teamNameParam = searchParams.get("teamName");

        const session = await serverSessionAuth()
        console.log("session contents ", session)
        const user = await prisma.user.findUnique({
            where: {id: session!.user!.id}
        })

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }
        
        if (teamNameParam) {
            const loanTeam = await prisma.loanTeam.findUnique({
                where: {teamName: teamNameParam}
            })

            if (!loanTeam) {
                return NextResponse.json({"Could not find team with name: " : teamNameParam}, {status: 404})
            }

            const validateUser = await prisma.loanTeamMember.findFirst({
                where: {userId: session!.user!.id, loanTeamId: loanTeam.id}
            })

            if (!validateUser) {
                return NextResponse.json({message: "User isn't a member of this team."}, {status: 403})
            }

            const loans = await prisma.loan.findMany({
                where: {loanTeamId: loanTeam.id}
            })

            const loansByStage = await organizeLoans(loans)
            return NextResponse.json([ loansByStage, loanTeam], {status: 200})

        } else {

            const firstLoanTeamMembership = await prisma.loanTeamMember.findFirst({
                where: {userId: session!.user!.id}
            })
            
            if (!firstLoanTeamMembership) {
                return NextResponse.json({message: "Could not find any teams that user is a team member of."}, {status: 404})
            }
            
            const firstLoanTeam = await prisma.loanTeam.findFirst({
                where: {id : firstLoanTeamMembership.loanTeamId}
            })
    
            if (!firstLoanTeam) {
                return NextResponse.json({message: "Could not find at leat one team for user."}, {status: 404})
            }
    
            const firstLoanTeamsLoans = await prisma.loan.findMany({
                where: {loanTeamId: firstLoanTeamMembership.loanTeamId}
            })
    
            if (!firstLoanTeamsLoans) {
                return NextResponse.json({message: "Could not find any loans for the user's team."}, {status: 404})
            }
            const loansByStage = organizeLoans(firstLoanTeamsLoans)
    
    
            return NextResponse.json([loansByStage, firstLoanTeam, url, searchParams],{status: 200});
        }  
    } catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

