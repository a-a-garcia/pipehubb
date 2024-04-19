'use client'
import FileNotesComponent from '@/app/components/FileNotes';
import LoanTabs from '@/app/components/LoanTabs';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const FileNotesPage = ({params} : {params: {id: string}}) => {
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
        <LoanTabs params={params} isFileNotes={true}/>
        <FileNotesComponent loan={loan}/>
    </div>
  )
}

export default FileNotesPage