import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let raf
    let w = window.innerWidth
    let h = window.innerHeight
    
    const resize = () => { 
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h 
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * w, 
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.4, 
      vy: -(Math.random() * 0.42 + 0.18),
      vx: (Math.random() - 0.5) * 0.22, 
      alpha: Math.random() * 0.45 + 0.08, 
      life: Math.random(),
    }))
    
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.0022
        if (p.y < -10 || p.life >= 1) { 
          p.y = h + 10
          p.x = Math.random() * w
          p.life = 0 
        }
        const a = p.alpha * Math.sin(p.life * Math.PI)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    
    draw()
    return () => { 
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize) 
    }
  }, [])
  
  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
}
