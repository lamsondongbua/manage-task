import { motion } from 'framer-motion'

export default function FluidBackground({ color1, color2, color3 }) {
  return (
    <div className="fluid-bg" aria-hidden="true">
      <motion.div className="fluid-orb orb-1" animate={{ background: color1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
      <motion.div className="fluid-orb orb-2" animate={{ background: color2 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
      <motion.div className="fluid-orb orb-3" animate={{ background: color3 }} transition={{ duration: 2.0, ease: 'easeInOut' }} />
    </div>
  )
}
