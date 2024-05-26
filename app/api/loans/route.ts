import { NextRequest, NextResponse } from "next/server";
import { createLoanSchema } from "../../validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions, serverSessionAuth } from "../auth/authOptions"
import { Loan } from "@prisma/client";
import { error } from "console";
import { convertBigIntToString, convertLoanIdsToString } from "../helperFunctions";

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

    const newLoanBigIntToString = await convertBigIntToString(newLoan)

    return NextResponse.json(newLoanBigIntToString, {status: 201})
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.searchParams);
        let teamNameParam = searchParams.get("teamName");
        
        const session = await serverSessionAuth()
        
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

            const loanTeamBigIntToString = await convertBigIntToString(loanTeam)
            
            const validateUser = await prisma.loanTeamMember.findFirst({
                where: {userId: session!.user!.id, loanTeamId: loanTeam.id}
            })
            
            if (!validateUser) {
                return NextResponse.json({message: "teamPermissions=false"}, {status: 403})
            }
            
            
            const loans = await prisma.loan.findMany({
                where: {loanTeamId: loanTeam.id}
            })
            
            let loansByStage = await organizeLoans(loans)
            
            loansByStage = await convertLoanIdsToString(loansByStage);

            return NextResponse.json([ loansByStage, loanTeamBigIntToString], {status: 200})
            
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
            

            let loansByStage;
            
            try {
                loansByStage = await organizeLoans(firstLoanTeamsLoans)
                loansByStage = await convertLoanIdsToString(loansByStage);
            } catch {
                console.error('Error organizing loans by stage: ', error);
            }

            console.log(loansByStage)
            //Ran into a bug here after the switch to cockroachdb. 
            //in Cockroachdb, all ids had to be changed to type `bigint` from `Int`, which is not serializable to JSON.
            //So, whenever you send a response back to the client, you must convert the id out of a `bigint`, to, in this case, a string.
            const firstLoanTeamWithIdAsString = await convertBigIntToString(firstLoanTeam)
            
            return NextResponse.json([loansByStage, firstLoanTeamWithIdAsString],{status: 200});
        }  
    } catch (error) {
        console.error('Error fetching loans: ', error);
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

