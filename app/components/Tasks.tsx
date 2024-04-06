import React from 'react'
import TabHeader from './TabHeader'
import { Loan } from '@prisma/client'

const Tasks = ({loan} : {loan: Loan}) => {
  return (
    <div>
        <TabHeader isTasks={true} />
    </div>
  )
}

export default Tasks