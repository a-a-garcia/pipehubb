import LoanForm from "@/app/components/LoanForm";
import prisma from "@/prisma/client";
import React from "react";

const EditLoanPage = async ({ params }: { params: { id: string } }) => {
  const loanToEdit = await prisma.loan.findUnique({
    where: { id: BigInt(params.id) },
  });
  if (!loanToEdit) {
    return <div>Loan not found</div>;
  }
  return (
    <div>
      <LoanForm loan={loanToEdit} />
    </div>
  );
};

export default EditLoanPage;
