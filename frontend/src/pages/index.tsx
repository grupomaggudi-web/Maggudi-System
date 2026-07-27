import type { NextPage } from 'next'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Maggudi System
        </h1>
        {user && (
          <p className="text-xl text-gray-600">
            Hola, {user.firstName} {user.lastName}
          </p>
        )}

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <DashboardWidget
            title="Inventario"
            value="245"
            change="+12%"
            icon="📦"
          />
          <DashboardWidget
            title="Ventas Hoy"
            value="$12,450"
            change="+8%"
            icon="💰"
          />
          <DashboardWidget
            title="Clientes"
            value="1,230"
            change="+15%"
            icon="👥"
          />
          <DashboardWidget
            title="Órdenes Pendientes"
            value="45"
            change="-3%"
            icon="📋"
          />
        </div>
      </div>
    </div>
  )
}

interface DashboardWidgetProps {
  title: string
  value: string
  change: string
  icon: string
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  value,
  change,
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-semibold">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-green-600 font-semibold text-sm">{change}</p>
    </div>
  )
}

export default Home
