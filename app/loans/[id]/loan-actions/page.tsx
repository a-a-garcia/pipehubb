import React from 'react'
import LoanActions from '@/app/components/LoanActions'
import { getServerSession } from 'next-auth'

type User = {
  id: string
  name: string
  email: string
  image: string
}

const LoanActionsPage = async ({params} : {params: {id: string}}) => {
  const session = await getServerSession()
  if (!session) {
    return <div>No session found</div>
  }
  const user = session.user
  return (
    <div>
      <LoanActions params={params} user={user}/>
    </div>
  )
}

export default LoanActionsPage