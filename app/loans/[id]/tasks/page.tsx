'use client'
import LoanTabs from '@/app/components/LoanTabs';
import Tasks from '@/app/components/Tasks';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const TasksListPage = ({params} : {params: {id: string}}) => {
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
        <LoanTabs params={params} isTasks={true}/>
        <Tasks loan={loan}/>
    </div>
  )
}

export default TasksListPage