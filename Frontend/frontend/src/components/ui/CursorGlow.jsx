import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow({ color }) {
  const mx = useMotionValue(-300)
  const my = useMotionValue(-300)
  const sx = useSpring(mx, { stiffness: 75, damping: 18 })
  const sy = useSpring(my, { stiffness: 75, damping: 18 })
  
  useEffect(() => {
    const mv = e => { 
      mx.set(e.clientX)
      my.set(e.clientY) 
    }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [mx, my])
  
  return (
    <motion.div 
      className="cursor-glow" 
      style={{ left: sx, top: sy }}
      animate={{ background: color }} 
      transition={{ duration: 1.4 }}
    />
  )
}
