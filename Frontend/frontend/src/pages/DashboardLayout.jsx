import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, CheckSquare, User, LogOut, BarChart2 } from 'lucide-react'
import FluidBackground from '../components/ui/FluidBackground'
import ParticleCanvas from '../components/ui/ParticleCanvas'
import CursorGlow from '../components/ui/CursorGlow'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const navigate = useNavigate()
  // Sử dụng màu sắc của Q3-2024 (Teal) cho Dashboard
  const colors = { color1: '#0d9488', color2: '#0891b2', color3: '#0f766e' }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <div className="dashboard-root">
      <FluidBackground color1={colors.color1} color2={colors.color2} color3={colors.color3} />
      <ParticleCanvas />
      <CursorGlow color={colors.color1} />
      <div className="grain-overlay" aria-hidden="true" />

      <motion.aside 
        className="dashboard-sidebar"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href="/" className="dashboard-logo">
          <motion.span 
            className="dashboard-logo-icon"
            animate={{ background: `linear-gradient(135deg,${colors.color1},${colors.color2})` }}
            transition={{ duration: 1.3 }}
          >✓</motion.span>
          <span className="dashboard-logo-text">Manage Task</span>
        </a>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard/projects" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="nav-icon" />
            <span>Dự án</span>
          </NavLink>
          <NavLink to="/dashboard/tasks" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare className="nav-icon" />
            <span>Công việc</span>
          </NavLink>
          <NavLink to="/dashboard/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <User className="nav-icon" />
            <span>Hồ sơ</span>
          </NavLink>
          <NavLink to="/dashboard/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 className="nav-icon" />
            <span>Thống kê</span>
          </NavLink>
        </nav>

        <button className="dashboard-logout" onClick={handleLogout}>
          <LogOut className="nav-icon" />
          <span>Đăng xuất</span>
        </button>
      </motion.aside>

      <main className="dashboard-main">
        <motion.div 
          className="dashboard-content-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
