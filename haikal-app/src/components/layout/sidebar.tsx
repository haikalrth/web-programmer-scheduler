'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/programmers', label: 'Programmer' },
  { href: '/teams', label: 'Team Management' },
  { href: '/account-approval', label: 'Account Approval' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/calendar', label: 'Calendar' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-sm flex-shrink-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          {/* SVG Icon */}
        </div>
        <span className="text-xl font-bold text-slate-800">DeskFlo</span>
      </div>
      <nav className="mt-6 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-4 py-3 mt-2 rounded-lg ${
              pathname === link.href
                ? 'bg-slate-100 text-indigo-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
