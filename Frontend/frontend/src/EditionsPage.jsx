import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import './EditionsPage.css'
import FluidBackground from './components/ui/FluidBackground'
import ParticleCanvas from './components/ui/ParticleCanvas'
import CursorGlow from './components/ui/CursorGlow'


gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════
   DATA — Phiên bản Manage Task theo thực tế backend
═══════════════════════════════════════════════════════════════ */
const EDITIONS = [
  {
    id: 'q1-2024',
    tagLine: 'Foundation',
    headline: 'Nền tảng vững chắc',
    description:
      'Xây dựng kiến trúc Spring Boot hoàn chỉnh — JWT authentication, phân quyền theo Role, CRUD Task & Project đầy đủ.',
    season: 'Q1',
    year: '2024',
    color1: '#7c3aed',
    color2: '#4338ca',
    color3: '#6d28d9',
    icon: '🔐',
    endpoint: 'POST /api/auth/register',
    features: [
      { label: 'JWT Authentication',    detail: 'Access token + Refresh token' },
      { label: 'Role-based Access',     detail: 'ROLE_USER / ROLE_ADMIN' },
      { label: 'Project Management',    detail: 'CRUD đầy đủ, phân trang' },
      { label: 'Task CRUD',             detail: 'POST /api/tasks' },
    ],
  },
  {
    id: 'q2-2024',
    tagLine: 'Momentum',
    headline: 'Tìm kiếm thông minh',
    description:
      'Label hệ thống, bộ lọc đa chiều và tìm kiếm nâng cao giúp quản lý hàng trăm task một cách dễ dàng.',
    season: 'Q2',
    year: '2024',
    color1: '#ea580c',
    color2: '#dc2626',
    color3: '#c2410c',
    icon: '🏷️',
    endpoint: 'POST /api/tasks/search',
    features: [
      { label: 'Label System',          detail: 'GET /api/labels/task/{id}' },
      { label: 'Advanced Search',       detail: 'Lọc theo status, priority' },
      { label: 'Assignee Flow',         detail: 'Gắn user vào từng task' },
      { label: 'Pagination',            detail: 'Spring Data Pageable' },
    ],
  },
  {
    id: 'q3-2024',
    tagLine: 'Insight',
    headline: 'Phân tích & Dashboard',
    description:
      'Dashboard analytics thực tế, theo dõi tiến độ, thống kê hoàn thành và cảnh báo task sắp đến hạn.',
    season: 'Q3',
    year: '2024',
    color1: '#0d9488',
    color2: '#0891b2',
    color3: '#0f766e',
    icon: '📊',
    endpoint: 'GET /api/tasks',
    features: [
      { label: 'Dashboard Analytics',   detail: 'Thống kê hoàn thành' },
      { label: 'Completion Stats',      detail: 'TODO / IN_PROGRESS / DONE' },
      { label: 'Due-soon Tracking',     detail: 'Cảnh báo theo dueDate' },
      { label: 'Flyway Migrations',     detail: 'DB versioning tự động' },
    ],
  },
  {
    id: 'q4-2024',
    tagLine: 'Evolution',
    headline: 'API & Bảo mật nâng cao',
    description:
      'Swagger/OpenAPI documentation, Refresh Token lưu DB, Custom Validator và DB Index tối ưu hiệu năng.',
    season: 'Q4',
    year: '2024',
    color1: '#ca8a04',
    color2: '#b45309',
    color3: '#a16207',
    icon: '📋',
    endpoint: 'POST /api/auth/refresh-token',
    features: [
      { label: 'Swagger / OpenAPI',     detail: 'Tài liệu API tự động' },
      { label: 'Refresh Tokens DB',     detail: 'Bảo mật session kéo dài' },
      { label: 'Custom Validators',     detail: '@ValidPhone annotation' },
      { label: 'DB Indexes',            detail: 'create_task_indexes.sql' },
    ],
  },
  {
    id: 'q1-2025',
    tagLine: 'Profile',
    headline: 'Danh tính người dùng',
    description:
      'Chỉnh sửa profile cá nhân, xác thực số điện thoại, đánh giá độ mạnh mật khẩu và audit exception toàn hệ thống.',
    season: 'Q1',
    year: '2025',
    color1: '#2dd4bf',
    color2: '#6366f1',
    color3: '#8b5cf6',
    icon: '👤',
    endpoint: 'PUT /api/users/{id}',
    features: [
      { label: 'User Profile Edit',     detail: 'PUT /api/users/{id}' },
      { label: 'Phone Validation',      detail: '@ValidPhone custom rule' },
      { label: 'Password Strength',     detail: 'Min 8 ký tự, đặc biệt, số' },
      { label: 'Exception Audit',       detail: 'Global @ExceptionHandler' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════
   API CONFIG
═══════════════════════════════════════════════════════════════ */
const BASE_URL = 'http://localhost:8080'

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemV = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } },
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <motion.div className="ed-loading" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.85 } }}>
      <ParticleCanvas />
      <motion.div className="ed-loading-logo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <span className="ed-loading-icon">✓</span>
        <span>Manage Task</span>
      </motion.div>
      <div className="ed-loading-dots">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className="ed-loading-dot"
            animate={{ scale: [0.5, 1.3, 0.5], opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, delay: i * 0.17, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIVE API DEMO PANEL
═══════════════════════════════════════════════════════════════ */
function ApiDemoPanel({ edition }) {
  const [status, setStatus] = useState('idle') // idle | loading | ok | err
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('preview') // preview | raw

  const callApi = async () => {
    setStatus('loading')
    setData(null)
    try {
      // Dùng GET /api/tasks?size=3 làm demo an toàn (không cần body)
      const token = localStorage.getItem('accessToken')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${BASE_URL}/api/tasks?size=3&page=0`, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setStatus('ok')
    } catch (e) {
      setData({ error: e.message })
      setStatus('err')
    }
  }

  return (
    <div className="api-demo" style={{ '--demo-color': edition.color1 }}>
      <div className="api-demo-header">
        <span className="api-demo-label">Live API</span>
        <code className="api-demo-endpoint">GET /api/tasks?size=3</code>
        <span className={`api-demo-badge badge-${status}`}>
          {status === 'idle' && '●  Sẵn sàng'}
          {status === 'loading' && '◌  Đang gọi…'}
          {status === 'ok' && '✓  200 OK'}
          {status === 'err' && '✕  Lỗi'}
        </span>
      </div>

      <div className="api-demo-tabs">
        <button className={`api-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Preview</button>
        <button className={`api-tab${tab === 'raw' ? ' active' : ''}`} onClick={() => setTab('raw')}>JSON Raw</button>
      </div>

      <div className="api-demo-body">
        {status === 'idle' && (
          <p className="api-demo-hint">Nhấn <strong>Thử ngay</strong> để gọi API backend thật.</p>
        )}
        {status === 'loading' && (
          <div className="api-demo-spinner">
            {[0,1,2].map(i => <span key={i} className="spinner-dot" style={{ animationDelay: `${i * 0.18}s` }} />)}
          </div>
        )}
        {status === 'ok' && tab === 'preview' && data?.data?.content && (
          <div className="api-preview-list">
            {data.data.content.map((task, i) => (
              <div key={i} className="api-task-row">
                <span className={`task-status-dot status-${task.status?.toLowerCase()}`} />
                <span className="task-title">{task.title}</span>
                <span className={`task-priority priority-${task.priority?.toLowerCase()}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        )}
        {(status === 'ok' || status === 'err') && tab === 'raw' && (
          <pre className="api-json">{JSON.stringify(data, null, 2)}</pre>
        )}
        {status === 'err' && tab === 'preview' && (
          <p className="api-demo-error">
            Không thể kết nối backend.<br />
            <small>Hãy chắc chắn Spring Boot đang chạy tại <code>localhost:8080</code></small>
          </p>
        )}
      </div>

      <button className="api-demo-btn" onClick={callApi} disabled={status === 'loading'}
        style={{ background: edition.color1 }}>
        {status === 'loading' ? 'Đang gọi…' : '▶  Thử ngay'}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EDITION SECTION
═══════════════════════════════════════════════════════════════ */
function EditionSection({ edition, idx, onActive, isLast }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: '-36% 0px -36% 0px' })
  useEffect(() => { if (isInView) onActive(idx) }, [isInView, idx, onActive])

  return (
    <section ref={ref} className="ed-section" id={`edition-${edition.id}`}>
      <div className={`ed-section-inner${idx % 2 === 1 ? ' reverse' : ''}`}>

        {/* ── Visual card ── */}
        <motion.div className="ed-visual"
          initial={{ opacity: 0, x: -60, scale: 0.92 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -60, scale: 0.92 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="ed-visual-card" style={{ '--c1': edition.color1, '--c2': edition.color2 }}>

            <motion.div className="ed-visual-glow"
              animate={isInView ? { scale: [0.9, 1.2, 0.95], opacity: [0.3, 0.52, 0.3] } : {}}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: edition.color1 }}
            />

            {/* Grid cells */}
            <div className="ed-visual-grid-bg" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div key={i} className="ed-grid-cell"
                  animate={isInView ? { opacity: [0, 0.18 + (i % 3) * 0.08, 0], scale: [0.7, 1.05, 0.7] } : {}}
                  transition={{ duration: 3.5 + (i % 4) * 0.6, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: edition.color1 }}
                />
              ))}
            </div>

            <span className="ed-visual-season-label">{edition.season} {edition.year}</span>

            <motion.span className="ed-visual-icon" aria-hidden="true"
              animate={isInView ? { scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              {edition.icon}
            </motion.span>

            <motion.div className="ed-visual-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ background: edition.color1 }}>
              {String(idx + 1).padStart(2, '0')}
            </motion.div>

            {/* Endpoint chip */}
            <motion.div className="ed-endpoint-chip"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}>
              <span className="ed-endpoint-method">GET</span>
              <span className="ed-endpoint-path">{edition.endpoint.replace(/^(POST|GET|PUT|DELETE)\s/, '')}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Text side ── */}
        <motion.div className="ed-text"
          variants={containerV} initial="hidden"
          animate={isInView ? 'show' : 'hidden'}>

          <motion.div variants={itemV} className="ed-eyebrow">
            <span className="ed-eyebrow-dot" style={{ background: edition.color1 }} />
            {edition.season} · {edition.year}
          </motion.div>

          <motion.h2 variants={itemV} className="ed-tagline">{edition.tagLine}</motion.h2>
          <motion.p variants={itemV} className="ed-headline" style={{ color: edition.color1 }}>{edition.headline}</motion.p>
          <motion.p variants={itemV} className="ed-desc">{edition.description}</motion.p>

          <motion.ul variants={itemV} className="ed-feat-list">
            {edition.features.map((f, fi) => (
              <motion.li key={f.label} className="ed-feat-item" variants={itemV} custom={fi}>
                <span className="ed-feat-icon" style={{ background: edition.color1 }}>✓</span>
                <span className="ed-feat-main">{f.label}</span>
                <code className="ed-feat-detail">{f.detail}</code>
              </motion.li>
            ))}
          </motion.ul>

          {/* Live API demo */}
          <motion.div variants={itemV}>
            <ApiDemoPanel edition={edition} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   API OVERVIEW SECTION
═══════════════════════════════════════════════════════════════ */
const API_ROUTES = [
  { method: 'POST', path: '/api/auth/register',       desc: 'Đăng ký tài khoản' },
  { method: 'POST', path: '/api/auth/login',           desc: 'Đăng nhập, nhận JWT' },
  { method: 'POST', path: '/api/auth/refresh-token',   desc: 'Làm mới access token' },
  { method: 'GET',  path: '/api/tasks',                desc: 'Danh sách task (pageable)' },
  { method: 'POST', path: '/api/tasks',                desc: 'Tạo task mới' },
  { method: 'POST', path: '/api/tasks/search',         desc: 'Tìm kiếm & lọc task' },
  { method: 'PUT',  path: '/api/tasks/{id}',           desc: 'Cập nhật task' },
  { method: 'GET',  path: '/api/projects',             desc: 'Danh sách project' },
  { method: 'GET',  path: '/api/labels',               desc: 'Tất cả nhãn' },
  { method: 'PUT',  path: '/api/users/{id}',           desc: 'Chỉnh sửa profile' },
]

const METHOD_COLORS = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' }

function ApiOverviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <section ref={ref} className="ed-api-overview">
      <motion.div className="ed-api-inner"
        variants={containerV} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
        <motion.div variants={itemV} className="ed-api-header">
          <span className="ed-section-label">REST API</span>
          <h2 className="ed-api-title">Toàn bộ endpoints</h2>
          <p className="ed-api-sub">Spring Boot · PostgreSQL · JWT · Swagger</p>
        </motion.div>
        <motion.div variants={itemV} className="ed-api-table">
          {API_ROUTES.map((r, i) => (
            <motion.div key={i} className="ed-api-row"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 6 }}>
              <span className="api-method" style={{ color: METHOD_COLORS[r.method] }}>{r.method}</span>
              <code className="api-path">{r.path}</code>
              <span className="api-desc">{r.desc}</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.p variants={itemV} className="api-swagger-note">
          📖 Tài liệu đầy đủ tại{' '}
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">
            localhost:8080/swagger-ui.html
          </a>
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STATS SECTION
═══════════════════════════════════════════════════════════════ */
const STATS = [
  { num: '5',  suffix: ' phiên bản', label: 'Phát hành liên tục từ Q1 2024' },
  { num: '10', suffix: ' endpoints', label: 'REST API sẵn sàng tích hợp' },
  { num: '4',  suffix: ' entities',  label: 'User · Project · Task · Label' },
  { num: '∞',  suffix: '',           label: 'Tính năng sắp ra mắt' },
]

function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })
  return (
    <section ref={ref} className="ed-stats">
      <motion.div className="ed-stats-grid"
        variants={containerV} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
        {STATS.map(s => (
          <motion.div key={s.label} variants={itemV} className="ed-stat">
            <div className="ed-stat-num">{s.num}<span className="ed-stat-suffix">{s.suffix}</span></div>
            <div className="ed-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM STRIP
═══════════════════════════════════════════════════════════════ */
function BottomStrip({ activeIdx, setActiveIdx }) {
  const navigate = i => {
    setActiveIdx(i)
    const el = document.getElementById(`edition-${EDITIONS[i].id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <motion.nav className="ed-strip" aria-label="Điều hướng phiên bản"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      <div className="ed-strip-inner">
        {EDITIONS.map((ed, i) => (
          <button key={ed.id} id={`strip-btn-${ed.id}`}
            className={`ed-strip-btn${i === activeIdx ? ' active' : ''}`}
            onClick={() => navigate(i)} aria-current={i === activeIdx}>
            <span className="ed-strip-icon">{ed.icon}</span>
            <span className="ed-strip-meta">{ed.year} · {ed.season}</span>
            <span className="ed-strip-name">{ed.tagLine}</span>
            <motion.span className="ed-strip-bar"
              animate={{ scaleX: i === activeIdx ? 1 : 0, background: ed.color1 }}
              transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </button>
        ))}
      </div>
    </motion.nav>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════════ */
export default function EditionsPage() {
  const [loaded, setLoaded] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const active = EDITIONS[activeIdx]
  const navigate = useNavigate()

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, smooth: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = t => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy(); gsap.ticker.remove(tick) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1700)
    return () => clearTimeout(t)
  }, [])

  const handleActive = useCallback(i => setActiveIdx(i), [])

  return (
    <div className="editions-root">
      <FluidBackground color1={active.color1} color2={active.color2} color3={active.color3} />
      <ParticleCanvas />
      <div className="grain-overlay" aria-hidden="true" />
      <CursorGlow color={active.color1} />

      <AnimatePresence>{!loaded && <LoadingScreen key="loader" />}</AnimatePresence>

      {/* ── NAVBAR ── */}
      <motion.nav className="ed-nav" aria-label="Main navigation"
        initial={{ y: -70, opacity: 0 }}
        animate={loaded ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="ed-nav-inner">
          <a href="/" className="ed-logo" aria-label="Manage Task home">
            <motion.span className="ed-logo-icon"
              animate={{ background: `linear-gradient(135deg,${active.color1},${active.color2})` }}
              transition={{ duration: 1.3 }}>✓</motion.span>
            <span className="ed-logo-text">Manage Task</span>
            <span className="ed-logo-sep" aria-hidden="true">|</span>
            <span className="ed-logo-sub">Editions</span>
          </a>
          <div className="ed-nav-right">
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="ed-nav-link">Swagger UI</a>
            <a href="http://localhost:8080" target="_blank" rel="noreferrer" className="ed-nav-link">API Docs</a>
            <motion.a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="ed-nav-cta"
              whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
              Đăng nhập
            </motion.a>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="ed-hero" aria-label="Hero">
          <motion.div className="ed-hero-inner"
            variants={containerV} initial="hidden"
            animate={loaded ? 'show' : 'hidden'}>

            <motion.div variants={itemV} className="ed-hero-eyebrow">
              <motion.span className="ed-eyebrow-pulse"
                animate={{ scale: [1, 1.65, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }} />
              Manage Task · Editions
            </motion.div>

            <motion.h1 variants={itemV} className="ed-hero-title">
              Xây dựng từng ngày.
              <br />
              <span className="ed-hero-title-dim">Ra mắt mỗi quý.</span>
            </motion.h1>

            <motion.p variants={itemV} className="ed-hero-sub">
              Từ JWT authentication đến profile người dùng — mỗi phiên bản là một bước tiến thực sự của{' '}
              <strong style={{ color: '#fff' }}>Manage Task</strong>.
              Spring Boot · PostgreSQL · React.
            </motion.p>

            <motion.div variants={itemV} className="ed-hero-stack">
              {['Spring Boot', 'PostgreSQL', 'JWT', 'Flyway', 'Swagger', 'React'].map(t => (
                <span key={t} className="ed-stack-chip">{t}</span>
              ))}
            </motion.div>

            <motion.div variants={itemV} className="ed-hero-actions">
              <motion.a href={`#edition-${EDITIONS[0].id}`} className="ed-btn-primary"
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                Khám phá Editions
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </motion.a>
              <motion.a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer"
                className="ed-btn-secondary"
                whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                Swagger UI →
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div className="ed-scroll-hint"
            initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 2.3 }} aria-hidden="true">
            <span className="ed-scroll-label">Cuộn để khám phá</span>
            <motion.div className="ed-scroll-line"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>
        </section>

        {/* ── EDITION SECTIONS ── */}
        {EDITIONS.map((ed, i) => (
          <EditionSection key={ed.id} edition={ed} idx={i}
            onActive={handleActive} isLast={i === EDITIONS.length - 1} />
        ))}

        {/* ── API OVERVIEW ── */}
        <ApiOverviewSection />

        {/* ── STATS ── */}
        <StatsSection />

      </main>

      <BottomStrip activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
    </div>
  )
}
