export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Perlu Tinjauan (1)</h2>
          <div className="space-y-4">
            {/* Task item */}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Progres Proyek</h2>
          <div className="space-y-5">
            {/* Project progress item */}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Aktivitas Tim</h2>
          <div className="space-y-4">
            {/* Team activity item */}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tugas Individual Aktif</h2>
          <div className="space-y-4">
            {/* Individual task item */}
          </div>
        </div>
      </div>
    </div>
  )
}
