import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

export default function AccountApprovalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Account Approval" />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
