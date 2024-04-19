import { TabNav } from "@radix-ui/themes";
import React from "react";

const LoanTabs = ({
  params,
  isActivityLog,
  isTasks,
  isFileNotes,
  isDocumentChecklist,
  isLoanActions,
}: {
  params: { id: string };
  isActivityLog?: boolean | undefined;
  isTasks?: boolean | undefined;
  isFileNotes?: boolean | undefined;
  isDocumentChecklist?: boolean | undefined;
  isLoanActions?: boolean | undefined;
}) => {
  return (
    <TabNav.Root className="!text-white">
      <TabNav.Link
        active={isActivityLog}
        href={`/loans/${params.id}/activity-log`}
        className="hover:cursor-pointer"
      >
        Activity Log
      </TabNav.Link>
      <TabNav.Link
        active={isTasks}
        href={`/loans/${params.id}/tasks`}
        className="hover:cursor-pointer"
      >
        Tasks
      </TabNav.Link>
      <TabNav.Link
        active={isFileNotes}
        href={`/loans/${params.id}/file-notes`}
        className="hover:cursor-pointer"
      >
        File Notes
      </TabNav.Link>
      <TabNav.Link
        active={isDocumentChecklist}
        href={`/loans/${params.id}/document-checklist`}
        className="hover:cursor-pointer"
      >
        Document Checklist
      </TabNav.Link>
      <TabNav.Link
        active={isLoanActions}
        href={`/loans/${params.id}/loan-actions`}
        className="hover:cursor-pointer"
      >
        Loan Actions
      </TabNav.Link>
    </TabNav.Root>
  );
};

export default LoanTabs;
