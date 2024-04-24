'use client'
import DocumentChecklist from '@/app/components/DocumentChecklist';
import LoanTabs from '@/app/components/LoanTabs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const DocumentChecklistPage = ({params} : {params: {id: string}}) => {
    const queryClient = useQueryClient();

    const {
        isFetching,
        isStale,
        isFetched,
        error,
        isPending,
        data: loan,
      } = useQuery({
        queryKey: ["loan", params.id],
        queryFn: () => fetch(`/api/loans/${params.id}`).then((res) => res.json()),
      });
  return (
    <div>
        <LoanTabs params={params} isDocumentChecklist={true}/>
        <DocumentChecklist loan={loan} queryClient={queryClient}/>
    </div>
  )
}

export default DocumentChecklistPage