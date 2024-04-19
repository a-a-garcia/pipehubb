import React, { useEffect, useState } from 'react'
import TabHeader from './TabHeader'
import { Loan, TaskList } from '@prisma/client'
import Checklist from './Checklist'

const Tasks = ({loan} : {loan: Loan}) => {
  const [taskList, setTaskList] = useState<TaskList[] | null>(null)

  const fetchTaskList = async (loanId: string) => {
    const parsedLoanId = parseInt(loanId);
    const response = await fetch(`/api/tasklist/${parsedLoanId}`)
    const data = await response.json();
    console.log(data)
    setTaskList(data)
  }

  useEffect(() => {
    if (!taskList) {
      fetchTaskList(String(loan.id))
    }
  }, [])

  return (
    <div>
        <TabHeader isTasks={true} />
        <Checklist loan={loan} taskList={taskList} fetchTaskList={() => fetchTaskList(String(loan.id))}/>
    </div>
  )
}

export default Tasks