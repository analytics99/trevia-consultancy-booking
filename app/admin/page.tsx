import { cookies } from 'next/headers'
import AdminDashboard from '@/components/AdminDashboard'
import AdminLogin from '@/components/AdminLogin'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  const isAuthenticated = authCookie?.value === process.env.ADMIN_PASSWORD

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
