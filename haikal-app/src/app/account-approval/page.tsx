'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AccountApprovalPage() {
  const [requests, setRequests] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const getRequests = async () => {
      const { data } = await supabase
        .from('account_requests')
        .select('*')
        .eq('status', 'pending')
      if (data) {
        setRequests(data)
      }
    }
    getRequests()
  }, [])

  const handleApprove = async (requestId: number) => {
    const { error } = await supabase.functions.invoke('approve-account-request', {
      body: { request_id: requestId },
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Account approved successfully!')
      setRequests(requests.filter((req) => req.id !== requestId))
    }
  }

  const handleReject = async (requestId: number) => {
    const { error } = await supabase
      .from('account_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)

    if (error) {
      alert(error.message)
    } else {
      alert('Account rejected successfully!')
      setRequests(requests.filter((req) => req.id !== requestId))
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-t-xl">
            <tr>
              <th scope="col" className="px-6 py-3">Nama Pengaju</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">NPM</th>
              <th scope="col" className="px-6 py-3">Tanggal Pengajuan</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                  {req.nama_lengkap}
                </td>
                <td className="px-6 py-4">{req.email}</td>
                <td className="px-6 py-4">{req.npm}</td>
                <td className="px-6 py-4">{new Date(req.requested_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="font-medium text-emerald-600 hover:underline"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="font-medium text-rose-600 hover:underline"
                  >
                    Tolak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
