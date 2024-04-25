'use client'
import DocumentChecklist from '@/app/components/DocumentChecklist';
import ErrorMessage from '@/app/components/ErrorMessage';
import LoanTabs from '@/app/components/LoanTabs';
import { Loan } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const DocumentChecklistPage = ({params} : {params: {id: string}}) => {
    const queryClient = useQueryClient();
    const loan = queryClient.getQueryData<Loan>(["loan"]);
    if (!loan) {
        return <ErrorMessage>Could not find loan.</ErrorMessage>
    }
  return (
    <div>
        <LoanTabs params={params} isDocumentChecklist={true}/>
        <DocumentChecklist loan={loan} queryClient={queryClient}/>
    </div>
  )
}

export default DocumentChecklistPage