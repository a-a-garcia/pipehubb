import React from 'react'
import LoanActions from '@/app/components/LoanActions'

const LoanActionsPage = ({params} : {params: {id: string}}) => {
  return (
    <div>
      <LoanActions params={params} />
    </div>
  )
}

export default LoanActionsPage