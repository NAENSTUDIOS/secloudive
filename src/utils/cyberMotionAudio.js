// =========================================================================
// SeCloudive Procedural Cyber Motion Audio Engine
// Zero-latency procedural UI sound synthesis via native Web Audio API
// No external assets required. 100% lightweight and configurable.
// =========================================================================

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function isAudioFXEnabled() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('secloudive_audio_fx') === 'true'
}

export function setAudioFXEnabled(enabled) {
  if (typeof window === 'undefined') return
  localStorage.setItem('secloudive_audio_fx', enabled ? 'true' : 'false')
  window.dispatchEvent(new CustomEvent('secloudive_audio_fx_change', { detail: { enabled } }))
}

// Crisp tactical click sound
export function playTactileClick() {
  if (!isAudioFXEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(900, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035)

    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch (err) {
    // Ignore audio restrictions
  }
}

// Subtle futuristic tab whoosh
export function playTabWhoosh() {
  if (!isAudioFXEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(450, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.06)

    gain.gain.setValueAtTime(0.025, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.065)
  } catch (err) {
    // Ignore
  }
}

// Harmonic success chime for milestones and completions
export function playSuccessChime() {
  if (!isAudioFXEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 chord

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.045)

      gain.gain.setValueAtTime(0.035, now + idx * 0.045)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.045)
      osc.stop(now + idx * 0.045 + 0.38)
    })
  } catch (err) {
    // Ignore
  }
}

// Radar blip alert for critical findings
export function playThreatAlert() {
  if (!isAudioFXEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(680, now + 0.08)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  } catch (err) {
    // Ignore
  }
}
