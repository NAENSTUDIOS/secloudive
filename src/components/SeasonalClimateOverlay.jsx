import { useEffect, useState, useRef } from 'react'
import { detectRegionAndClimate, applySeasonalThemeToDOM } from '../utils/seasonalThemeEngine'

export default function SeasonalClimateOverlay() {
  const [climateData, setClimateData] = useState(() => detectRegionAndClimate())
  const canvasRef = useRef(null)

  useEffect(() => {
    const data = applySeasonalThemeToDOM()
    if (data) setClimateData(data)

    // Re-check every hour in case of date/season transition
    const interval = setInterval(() => {
      const refreshed = applySeasonalThemeToDOM()
      if (refreshed) setClimateData(refreshed)
    }, 3600000)

    return () => clearInterval(interval)
  }, [])

  // Canvas particle backdrop rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Particle pool tailored to season
    const count = width < 768 ? 14 : 26
    const particles = []

    const color = climateData?.palette?.primaryAccent || '#38bdf8'

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() * 0.4 + 0.1) * (climateData?.seasonKey === 'monsoon' ? 2.5 : 1),
        opacity: Math.random() * 0.35 + 0.1,
        oscillation: Math.random() * Math.PI * 2
      })
    }

    const seasonKey = climateData?.seasonKey || 'summer'

    const render = () => {
      try {
        ctx.clearRect(0, 0, width, height)

        particles.forEach(p => {
          p.oscillation += 0.02
          p.x += p.speedX + Math.sin(p.oscillation) * 0.25
          p.y += p.speedY

          // Wrap around screen boundaries
          if (p.y > height) {
            p.y = -10
            p.x = Math.random() * width
          }
          if (p.x > width) p.x = 0
          if (p.x < 0) p.x = width

          ctx.beginPath()
          if (seasonKey === 'monsoon') {
            // Subtle rain streaks
            ctx.strokeStyle = color
            ctx.globalAlpha = p.opacity * 0.4
            ctx.lineWidth = 1
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x - 1, p.y + 10)
            ctx.stroke()
          } else if (seasonKey === 'winter') {
            // Hexagonal / crystalline glint
            ctx.fillStyle = color
            ctx.globalAlpha = p.opacity * 0.5
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Soft ambient spore / ember / bloom
            ctx.fillStyle = color
            ctx.globalAlpha = p.opacity * 0.35
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fill()
          }
        })

        animationFrameId = requestAnimationFrame(render)
      } catch (e) {
        console.debug('[SeasonalClimateOverlay] Animation frame bypassed:', e)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [climateData])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.75
      }}
    />
  )
}
