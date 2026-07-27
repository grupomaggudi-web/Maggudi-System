import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import '@/styles/globals.css'

const publicRoutes = ['/auth/login', '/auth/register']

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated && !publicRoutes.includes(router.pathname)) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (publicRoutes.includes(router.pathname)) {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
