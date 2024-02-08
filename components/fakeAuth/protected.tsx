'use client'

import { redirect } from 'next/navigation'

interface IProtected {
  children: React.ReactNode
}

export const Protected = ({ children }: IProtected) => {
  const userData = window.localStorage.getItem('userData')

  if (!userData) {
    redirect('/login')
  }

  return <>{children}</>
}
