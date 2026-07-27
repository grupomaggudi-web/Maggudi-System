import React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/router'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Inventario', href: '/inventory', icon: '📦' },
  { label: 'CRM', href: '/crm', icon: '👥' },
  { label: 'Ventas', href: '/sales', icon: '💰' },
  { label: 'Compras', href: '/buying', icon: '🛒' },
  { label: 'RRHH', href: '/hr', icon: '👨‍💼' },
  { label: 'Contabilidad', href: '/accounting', icon: '📊' },
]

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Maggudi</h1>
        <p className="text-sm text-gray-400 mt-2">{user?.role}</p>
      </div>

      <nav className="p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                router.pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-gray-700 p-4">
        <button
          onClick={() => {
            logout()
            router.push('/auth/login')
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
