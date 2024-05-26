
//helper function to convert bigint to string, needed to avoid serialization issues when sending response back to client
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
