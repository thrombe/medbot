import { ChatClient } from '@/components/chat/chat-client'
import React from 'react'
import { getAuthStatus } from '@/lib/get-auth-status'
import { UserType } from '@/lib/user-type'
import { redirect } from 'next/navigation'


export default async function Page() {

  const resp: any = await getAuthStatus()
  const data: UserType = resp?.data
  if (data === undefined) {
    redirect('/auth/sign-in');
  }

  return (
    <>
      <main className="flex h-[calc(100dvh)] flex-col items-center">
        <ChatClient
          user={data}
        />
      </main>
    </>
  )
}
