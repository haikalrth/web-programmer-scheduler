'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header({ title }: { title: string }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center space-x-5">
        {/* Notification button */}
        <div className="relative">
          {/* Profile button */}
          {user && (
            <div className="flex items-center space-x-3 cursor-pointer">
              <div>
                <p className="font-semibold text-sm">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="text-sm text-rose-600 hover:underline">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
