import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FluidBackground from '../components/ui/FluidBackground'
import ParticleCanvas from '../components/ui/ParticleCanvas'
import CursorGlow from '../components/ui/CursorGlow'
import './AuthPage.css'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const colors = { color1: '#7c3aed', color2: '#4338ca', color3: '#6d28d9' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra')
      }

      if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        navigate('/dashboard')
      } else {
        // If register success but no token (depends on backend flow)
        if (!isLogin) {
          setIsLogin(true)
          setError('Đăng ký thành công, vui lòng đăng nhập!')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <FluidBackground color1={colors.color1} color2={colors.color2} color3={colors.color3} />
      <ParticleCanvas />
      <CursorGlow color={colors.color1} />
      <div className="grain-overlay" aria-hidden="true" />

      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-header">
          <motion.div className="ed-logo-icon" style={{ margin: '0 auto 16px', display: 'flex', width: 48, height: 48, background: `linear-gradient(135deg,${colors.color1},${colors.color2})` }}>
            ✓
          </motion.div>
          <h1 className="auth-title">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h1>
          <p className="auth-sub">
            {isLogin ? 'Chào mừng trở lại với Manage Task' : 'Bắt đầu hành trình quản lý hiệu quả'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="auth-error">
              {error}
            </motion.div>
          )}

          {!isLogin && (
            <div className="auth-input-group">
              <label>Họ và tên</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="auth-input" 
                placeholder="Nhập họ và tên" 
                required 
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="auth-input" 
              placeholder="example@email.com" 
              required 
            />
          </div>

          {!isLogin && (
            <AnimatePresence>
              <motion.div 
                className="auth-input-group"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="auth-input" 
                  placeholder="0912345678" 
                />
              </motion.div>
            </AnimatePresence>
          )}

          <div className="auth-input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="auth-input" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
