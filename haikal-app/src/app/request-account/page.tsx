'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function RequestAccountPage() {
  const [namaLengkap, setNamaLengkap] = useState('')
  const [npm, setNpm] = useState('')
  const [jurusan, setJurusan] = useState('')
  const [email, setEmail] = useState('')
  const supabase = createClient()

  const handleRequestAccount = async () => {
    const { error } = await supabase.from('account_requests').insert({
      nama_lengkap: namaLengkap,
      npm,
      jurusan,
      email,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Account request submitted successfully!')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Request an Account</h1>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">NPM</label>
            <input
              type="text"
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Major</label>
            <input
              type="text"
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleRequestAccount}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md"
        >
          Request Account
        </button>
      </div>
    </div>
  )
}
