import {
  DocumentChecklist as DocumentChecklistType,
  Loan,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import Checklist from "./Checklist";
import TabHeader from "./TabHeader";
import { QueryClient } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";
//cannot conditionally declare (if (isDocumentChecklist) {} ) state, useEffects because it violates rules of hooks - hooks must be called at top level of component.

interface User {
  name: string;
  email: string;
  image: string;
}

interface DocumentChecklistWithUser extends DocumentChecklistType {
  user: User;
}

const DocumentChecklist = ({
  loan,
  queryClient,
}: {
  loan: Loan;
  queryClient: QueryClient;
}) => {
  const [documentChecklist, setDocumentChecklist] = useState<
    DocumentChecklistWithUser[] | null
  >(null);

  const fetchDocumentChecklist = async (loanId: string) => {
    const parsedLoanId = BigInt(loanId);
    const response = await fetch(`/api/documentchecklist/${parsedLoanId}`);
    const data = await response.json();
    console.log(data);
    setDocumentChecklist(data);
  };
  
  useEffect(() => {
    if (loan && loan.id) {
      fetchDocumentChecklist(String(loan.id));
    }
  }, [loan]);

  return (
    <>
      {loan && loan.id ? (
        <div>
          <TabHeader isDocumentChecklist={true} loan={loan} /> {/* Fix the syntax error */}
          <Checklist
            loan={loan}
            queryClient={queryClient}
            documentChecklist={documentChecklist!}
            fetchDocumentChecklist={() => fetchDocumentChecklist(String(loan.id))}
          />
        </div>
      ) : (
        <ErrorMessage>An error has occurred.</ErrorMessage>
      )}
    </>
  );
}
export default DocumentChecklist;
