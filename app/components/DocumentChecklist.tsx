import {
  DocumentChecklist as DocumentChecklistType,
  Loan,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import Checklist from "./Checklist";
import TabHeader from "./TabHeader";
//cannot conditionally declare (if (isDocumentChecklist) {} ) state, useEffects because it violates rules of hooks - hooks must be called at top level of component.

const DocumentChecklist = ({ loan }: { loan: Loan }) => {
  const [documentChecklist, setDocumentChecklist] = useState<
    DocumentChecklistType[] | null
  >(null);

  const fetchDocumentChecklist = async (loanId: string) => {
    const parsedLoanId = parseInt(loanId);
    const response = await fetch(`/api/documentchecklist/${parsedLoanId}`);
    const data = await response.json();
    console.log(data);
    setDocumentChecklist(data);
  };

  useEffect(() => {
    if (!documentChecklist) {
      fetchDocumentChecklist(String(loan.id));
    }
  }, []);

return (
    <div>
        <TabHeader
        isDocumentChecklist={true}
        loan={loan}
      />
        <Checklist
            isTasks={false}
            loan={loan}
            isDocumentChecklist={true}
            documentChecklist={documentChecklist!}
            fetchDocumentChecklist={() => fetchDocumentChecklist(String(loan.id))} 
        />
    </div>
);
};
export default DocumentChecklist;
