import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { API, apiFetch } from '../lib/api'
import './Analytics.css'

// ─── 3D Bar Chart Components ───────────────────────────────────────────────

function AnimatedBar({ position, height, color, label, value, maxHeight, index }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const targetHeight = useRef(0)
  const currentHeight = useRef(0)

  useEffect(() => {
    targetHeight.current = height
  }, [height])

  useFrame((state) => {
    if (!meshRef.current) return
    // Animate height with spring
    const delay = index * 0.15
    const elapsed = state.clock.getElapsedTime() - delay
    if (elapsed > 0) {
      currentHeight.current = THREE.MathUtils.lerp(
        currentHeight.current,
        targetHeight.current,
        0.06
      )
      meshRef.current.scale.y = currentHeight.current / height || 0.001
      meshRef.current.position.y = (currentHeight.current / height || 0.001) * height / 2 - height / 2 + position[1]
    }

    // Floating effect
    if (hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05
    }
  })

  const emissiveColor = hovered ? color : '#000000'

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Shadow plane */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>

      {/* 3D Bar */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.4 : 0}
          roughness={0.15}
          metalness={0.6}
          envMapIntensity={1}
        />
      </mesh>

      {/* Glowing top cap */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Value label on top */}
      <Text
        position={[0, height + 0.6, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {value}
      </Text>

      {/* Bottom label */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="rgba(255,255,255,0.8)"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        maxWidth={2}
      >
        {label}
      </Text>
    </group>
  )
}

function BarChart3D({ data }) {
  const spacing = 2.2
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const maxBarH = 5

  return (
    <group position={[-(data.length - 1) * spacing / 2, 0, 0]}>
      {/* Base grid */}
      <mesh position={[((data.length - 1) * spacing) / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[data.length * spacing + 1, 4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>

      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map(i => (
        <mesh key={i} position={[((data.length - 1) * spacing) / 2, (i / 5) * maxBarH, -1.5]}>
          <planeGeometry args={[data.length * spacing + 1, 0.02]} />
          <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.15} />
        </mesh>
      ))}

      {data.map((d, i) => (
        <AnimatedBar
          key={d.label}
          index={i}
          position={[i * spacing, 0, 0]}
          height={Math.max((d.value / maxVal) * maxBarH, 0.05)}
          color={d.color}
          label={d.label}
          value={d.value}
          maxHeight={maxBarH}
        />
      ))}

      {/* Ambient light for depth */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 3]} intensity={0.8} color="#5eead4" />
      <pointLight position={[0, 2, -3]} intensity={0.4} color="#6366f1" />
    </group>
  )
}

// ─── 3D Donut / Pie Chart Components ──────────────────────────────────────

function DonutSegment({ startAngle, endAngle, color, label, percentage, index, total }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return
    const delay = index * 0.2
    const elapsed = state.clock.getElapsedTime() - delay
    if (elapsed > 0) {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, 0.05)
      meshRef.current.scale.setScalar(scaleRef.current)
    }
    // Slow rotation
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.12
    if (hovered) {
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1.08, 0.1))
    }
  })

  const arc = endAngle - startAngle
  const midAngle = startAngle + arc / 2
  const outerR = 2.2
  const innerR = 1.2
  const thickness = 0.6

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const segments = Math.max(Math.floor(arc * 20), 2)
    s.moveTo(Math.cos(startAngle) * outerR, Math.sin(startAngle) * outerR)
    for (let i = 0; i <= segments; i++) {
      const a = startAngle + (arc * i) / segments
      s.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR)
    }
    for (let i = segments; i >= 0; i--) {
      const a = startAngle + (arc * i) / segments
      s.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR)
    }
    s.closePath()
    return s
  }, [startAngle, endAngle])

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4
    })
  }, [shape])

  const labelX = Math.cos(midAngle) * (outerR + 0.8)
  const labelY = Math.sin(midAngle) * (outerR + 0.8)

  return (
    <group ref={meshRef}>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -thickness / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.15}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>

      {/* Percentage label */}
      <Text
        position={[labelX, 0.5, labelY]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`${percentage}%`}
      </Text>

      {/* Category label */}
      <Text
        position={[labelX, 0.05, labelY]}
        fontSize={0.22}
        color="rgba(255,255,255,0.75)"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {label}
      </Text>
    </group>
  )
}

function DonutChart3D({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let currentAngle = 0
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2
    const seg = { ...d, startAngle: currentAngle, endAngle: currentAngle + angle - 0.04, index: i }
    currentAngle += angle
    return seg
  })

  return (
    <group>
      {segments.map((seg) => (
        <DonutSegment key={seg.label} {...seg} percentage={Math.round((seg.value / total) * 100)} />
      ))}
      {/* Center label */}
      <Text position={[0, 0.5, 0]} fontSize={0.45} color="#fff" anchorX="center" anchorY="middle">
        {total}
      </Text>
      <Text position={[0, 0.0, 0]} fontSize={0.22} color="rgba(255,255,255,0.6)" anchorX="center" anchorY="middle">
        Dự án
      </Text>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
      <pointLight position={[0, 6, 3]} intensity={0.8} color="#818cf8" />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#34d399" />
    </group>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon, delay = 0 }) {
  return (
    <motion.div
      className="analytics-stat-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--accent': color }}
    >
      <span className="stat-icon">{icon}</span>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-glow" style={{ background: color }} />
    </motion.div>
  )
}

// ─── Legend Item ─────────────────────────────────────────────────────────

function LegendItem({ color, label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="legend-item">
      <span className="legend-dot" style={{ background: color }} />
      <span className="legend-label">{label}</span>
      <span className="legend-value">{value}</span>
      <div className="legend-bar-bg">
        <motion.div
          className="legend-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

// ─── Main Analytics Page ──────────────────────────────────────────────────

export default function Analytics() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const headers = { 'Authorization': `Bearer ${token}` }

      const [taskRes, projectRes] = await Promise.all([
        apiFetch(`${API}/tasks`, { headers }),
        apiFetch(`${API}/projects`, { headers })
      ])

      if (taskRes.ok) {
        const json = await taskRes.json()
        setTasks(json.data.content || [])
      }
      if (projectRes.ok) {
        const json = await projectRes.json()
        setProjects(json.data.content || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ── Compute stats ──
  const taskStats = useMemo(() => {
    const todo = tasks.filter(t => t.status === 'TODO').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const done = tasks.filter(t => t.status === 'DONE').length
    return { todo, inProgress, done, total: tasks.length }
  }, [tasks])

  const projectStats = useMemo(() => {
    // Count tasks per project
    const projectTaskMap = {}
    tasks.forEach(t => {
      if (t.project?.id) {
        projectTaskMap[t.project.id] = (projectTaskMap[t.project.id] || 0) + 1
      }
    })
    const withTask = projects.filter(p => projectTaskMap[p.id] > 0).length
    const withoutTask = projects.length - withTask
    return { withTask, withoutTask, total: projects.length }
  }, [tasks, projects])

  // ── Chart data ──
  const barData = [
    { label: 'Chờ xử lý', value: taskStats.todo, color: '#94a3b8' },
    { label: 'Đang làm', value: taskStats.inProgress, color: '#3b82f6' },
    { label: 'Hoàn thành', value: taskStats.done, color: '#22c55e' },
  ]

  const donutData = [
    { label: 'Có task', value: projectStats.withTask, color: '#0d9488' },
    { label: 'Chưa có task', value: projectStats.withoutTask, color: '#6366f1' },
  ]

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner" />
        <p>Đang tải dữ liệu thống kê...</p>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Thống kê</h1>
          <p className="page-sub">Tổng quan hiệu suất và phân tích dữ liệu dạng 3D.</p>
        </div>
        <button className="analytics-refresh-btn" onClick={fetchData}>
          ↻ Làm mới
        </button>
      </div>

      {/* Stat cards row */}
      <div className="analytics-stats-grid">
        <StatCard label="Tổng công việc" value={taskStats.total} color="#3b82f6" icon="📋" delay={0} />
        <StatCard label="Hoàn thành" value={taskStats.done} color="#22c55e" icon="✅" delay={0.08} />
        <StatCard label="Đang thực hiện" value={taskStats.inProgress} color="#f59e0b" icon="⚡" delay={0.16} />
        <StatCard label="Tổng dự án" value={projectStats.total} color="#0d9488" icon="🗂️" delay={0.24} />
      </div>

      {/* Charts row */}
      <div className="analytics-charts-grid">
        {/* Bar Chart - Task Status */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="chart-card-header">
            <h2 className="chart-title">📊 Công việc theo trạng thái</h2>
            <span className="chart-badge">3D Bar Chart</span>
          </div>
          <div className="chart-canvas-wrapper">
            <Canvas
              camera={{ position: [0, 5, 10], fov: 50 }}
              shadows
              gl={{ antialias: true, alpha: true }}
            >
              <fog attach="fog" args={['#030303', 15, 40]} />
              <BarChart3D data={barData} />
              <OrbitControls
                enablePan={false}
                minPolarAngle={0.3}
                maxPolarAngle={Math.PI / 2}
                minDistance={6}
                maxDistance={18}
                autoRotate
                autoRotateSpeed={0.6}
              />
            </Canvas>
          </div>
          {/* Legend */}
          <div className="chart-legend">
            {barData.map(d => (
              <LegendItem key={d.label} color={d.color} label={d.label} value={d.value} total={taskStats.total} />
            ))}
          </div>
        </motion.div>

        {/* Donut Chart - Projects */}
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="chart-card-header">
            <h2 className="chart-title">🍩 Dự án theo task</h2>
            <span className="chart-badge">3D Donut Chart</span>
          </div>
          <div className="chart-canvas-wrapper">
            <Canvas
              camera={{ position: [0, 5, 8], fov: 55 }}
              shadows
              gl={{ antialias: true, alpha: true }}
            >
              <fog attach="fog" args={['#030303', 12, 35]} />
              <DonutChart3D data={donutData} />
              <OrbitControls
                enablePan={false}
                minPolarAngle={0.2}
                maxPolarAngle={1.4}
                minDistance={5}
                maxDistance={14}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>
          {/* Legend */}
          <div className="chart-legend">
            {donutData.map(d => (
              <LegendItem key={d.label} color={d.color} label={d.label} value={d.value} total={projectStats.total} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Completion rate card */}
      <motion.div
        className="analytics-completion-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="completion-header">
          <h2 className="chart-title">🎯 Tỷ lệ hoàn thành tổng thể</h2>
          <span className="completion-pct">
            {taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0}%
          </span>
        </div>
        <div className="completion-bar-bg">
          <motion.div
            className="completion-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: taskStats.total > 0 ? `${(taskStats.done / taskStats.total) * 100}%` : '0%' }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="completion-bar-glow"
            initial={{ width: 0 }}
            animate={{ width: taskStats.total > 0 ? `${(taskStats.done / taskStats.total) * 100}%` : '0%' }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="completion-labels">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{taskStats.done} / {taskStats.total} công việc hoàn thành</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>
            {projectStats.withTask} / {projectStats.total} dự án đang hoạt động
          </span>
        </div>
      </motion.div>
    </div>
  )
}
