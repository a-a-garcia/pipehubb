import { Flex, Spinner, TabNav } from "@radix-ui/themes";
import React, { useState } from "react";

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
  const [isActivityLogLoading, setIsActivityLogLoading] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isFileNotesLoading, setIsFileNotesLoading] = useState(false);
  const [isDocumentChecklistLoading, setIsDocumentChecklistLoading] = useState(false);
  const [isLoanActionsLoading, setIsLoanActionsLoading] = useState(false);
  return (
    <TabNav.Root className="!text-white">
      <TabNav.Link
        active={isActivityLog}
        href={`/loans/${params.id}/activity-log`}
        className="hover:cursor-pointer"
        onClick={() => setIsActivityLogLoading(true)}
      >
        <Flex align="center" gap="2">
          Activity Log
          {isActivityLogLoading && <Spinner />}
        </Flex>
      </TabNav.Link>
      <TabNav.Link
        active={isTasks}
        href={`/loans/${params.id}/tasks`}
        className="hover:cursor-pointer"
        onClick={() => setIsTasksLoading(true)}
      >
        <Flex align="center" gap="2">
          Tasks
          {isTasksLoading && <Spinner />}
        </Flex>
      </TabNav.Link>
      <TabNav.Link
        active={isFileNotes}
        href={`/loans/${params.id}/file-notes`}
        className="hover:cursor-pointer"
        onClick={() => setIsFileNotesLoading(true)}
      >
        <Flex align="center" gap="2">
          File Notes
          {isFileNotesLoading && <Spinner />}
        </Flex>
      </TabNav.Link>
      <TabNav.Link
        active={isDocumentChecklist}
        href={`/loans/${params.id}/document-checklist`}
        className="hover:cursor-pointer"
        onClick={() => setIsDocumentChecklistLoading(true)}
      >
        <Flex align="center" gap="2">
          Document Checklist
          {isDocumentChecklistLoading && <Spinner />}
        </Flex>
      </TabNav.Link>
      <TabNav.Link
        active={isLoanActions}
        href={`/loans/${params.id}/loan-actions`}
        className="hover:cursor-pointer"
        onClick={() => setIsLoanActionsLoading(true)}
      >
        <Flex align="center" gap="2">
          Loan Actions
          {isLoanActionsLoading && <Spinner />}
        </Flex>
      </TabNav.Link>
    </TabNav.Root>
  );
};

export default LoanTabs;
