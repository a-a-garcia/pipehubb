import prisma from "@/prisma/client";
import { serverSessionAuth } from "./auth/authOptions";

//helper function to convert bigint to string for a single object, needed to avoid serialization issues when sending response back to client
export async function convertBigIntToString(object: Record<string, any>) {
    const newObj:Record<string, any> = {};

    for (const [key, value] of Object.entries(object)) {
        if (typeof value === 'bigint') {
            newObj[key] = value.toString();
        } else {
            newObj[key] = value;
        }
    }

    return newObj
}

//helper function to convert LoanIds to Strings when organizing loans on the pipeline into their respective stages. 
export async function convertLoanIdsToString(loansByStage: any) {
    const stages = Object.keys(loansByStage);
    for (const stage of stages) {
      loansByStage[stage] = loansByStage[stage].map((loan: any) => {
        if (loan.id) loan.id = loan.id.toString();
        if (loan.loanTeamId) loan.loanTeamId = loan.loanTeamId.toString();
        return loan;
      });
    }
    return loansByStage;
  }

// helper function to convert objectIds to strings when handling responses that are an array of objects
export async function convertObjectIdsToString(objArray: any[]) {
  return objArray.map(obj => {
    const newObj = { ...obj };
    for (const key in newObj) {
      if (typeof newObj[key] === 'bigint') {
        newObj[key] = newObj[key].toString();
      }
    }
    return newObj;
  });
}

export async function authenticateUserAccess(loanId: bigint) {
  const session = await serverSessionAuth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  console.log(session)
  const loanExists = await prisma.loan.findUnique({
    where: { id: loanId }
  })
  if (!loanExists) {
    throw new Error("Loan not found")
  }
  const loanTeamMatch = await prisma.loanTeamMember.findFirst({
    where: { loanTeamId: loanExists.loanTeamId, userId: session.user.id}
  })
  if (!loanTeamMatch) {
    throw new Error("User does not have access to this loan.")
  }
}
