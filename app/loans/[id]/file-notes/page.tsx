'use client'
import ErrorMessage from '@/app/components/ErrorMessage';
import FileNotesComponent from '@/app/components/FileNotes';
import LoanTabs from '@/app/components/LoanTabs';
import { Loan } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const FileNotesPage = ({params} : {params: {id: string}}) => {
  const queryClient = useQueryClient();
  const loan = queryClient.getQueryData<Loan>(["loan"]);

  if (!loan) {
    return <ErrorMessage>Could not find loan.</ErrorMessage>
  }

  return (
    <div>
        <LoanTabs params={params} isFileNotes={true}/>
        <FileNotesComponent loan={loan}/>
    </div>
  )
}

export default FileNotesPage