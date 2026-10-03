import React from 'react'

/**
 * SeCloudiveLogo - Ultra-Crisp Cyber Pixel Typography
 * 
 * Faithfully extracted and rendered from the official SeCloudive 7-row pixel matrix.
 * Implemented as pure SVG vectors with shape-rendering="crispEdges" to guarantee
 * 100% razor-sharp, neat, unblurred rendering across all devices, DPI levels, and zoom factors.
 * 
 * Props:
 * - size: 'xs' (16px) | 'sm' (22px) | 'md' (30px) | 'lg' (42px) | 'xl' (56px) | number (height in px)
 * - variant: 'two-tone' (White SE + Cyan CLOUDIVE) | 'cyan' (All Cyan matching original asset) | 'monochrome'
 * - glow: boolean (adds subtle cyber neon drop-shadow)
 * - className: custom class names
 * - style: custom inline styles
 */

// Optimized horizontal pixel spans for SE (Prefix) and CLOUDIVE (Suffix)
// Grid: 58 columns x 7 rows
const PREFIX_RECTS = [
  // S (Columns 0-4)
  { x: 1, y: 0, w: 4, h: 1 },
  { x: 0, y: 1, w: 1, h: 1 }, { x: 4, y: 1, w: 1, h: 1 },
  { x: 0, y: 2, w: 1, h: 1 },
  { x: 1, y: 3, w: 3, h: 1 },
  { x: 4, y: 4, w: 1, h: 1 },
  { x: 0, y: 5, w: 1, h: 1 }, { x: 4, y: 5, w: 1, h: 1 },
  { x: 0, y: 6, w: 4, h: 1 },

  // E (Columns 6-10)
  { x: 6, y: 0, w: 5, h: 1 },
  { x: 6, y: 1, w: 1, h: 1 },
  { x: 6, y: 2, w: 1, h: 1 },
  { x: 6, y: 3, w: 4, h: 1 },
  { x: 6, y: 4, w: 1, h: 1 },
  { x: 6, y: 5, w: 1, h: 1 },
  { x: 6, y: 6, w: 5, h: 1 }
]

const SUFFIX_RECTS = [
  // C (Columns 13-17)
  { x: 14, y: 0, w: 3, h: 1 },
  { x: 13, y: 1, w: 1, h: 1 }, { x: 17, y: 1, w: 1, h: 1 },
  { x: 13, y: 2, w: 1, h: 1 },
  { x: 13, y: 3, w: 1, h: 1 },
  { x: 13, y: 4, w: 1, h: 1 },
  { x: 13, y: 5, w: 1, h: 1 }, { x: 17, y: 5, w: 1, h: 1 },
  { x: 14, y: 6, w: 3, h: 1 },

  // L (Columns 19-23)
  { x: 19, y: 0, w: 1, h: 1 },
  { x: 19, y: 1, w: 1, h: 1 },
  { x: 19, y: 2, w: 1, h: 1 },
  { x: 19, y: 3, w: 1, h: 1 },
  { x: 19, y: 4, w: 1, h: 1 },
  { x: 19, y: 5, w: 1, h: 1 },
  { x: 19, y: 6, w: 5, h: 1 },

  // O (Columns 25-29)
  { x: 26, y: 0, w: 3, h: 1 },
  { x: 25, y: 1, w: 1, h: 1 }, { x: 29, y: 1, w: 1, h: 1 },
  { x: 25, y: 2, w: 1, h: 1 }, { x: 29, y: 2, w: 1, h: 1 },
  { x: 25, y: 3, w: 1, h: 1 }, { x: 29, y: 3, w: 1, h: 1 },
  { x: 25, y: 4, w: 1, h: 1 }, { x: 29, y: 4, w: 1, h: 1 },
  { x: 25, y: 5, w: 1, h: 1 }, { x: 29, y: 5, w: 1, h: 1 },
  { x: 26, y: 6, w: 3, h: 1 },

  // U (Columns 31-35)
  { x: 31, y: 0, w: 1, h: 1 }, { x: 35, y: 0, w: 1, h: 1 },
  { x: 31, y: 1, w: 1, h: 1 }, { x: 35, y: 1, w: 1, h: 1 },
  { x: 31, y: 2, w: 1, h: 1 }, { x: 35, y: 2, w: 1, h: 1 },
  { x: 31, y: 3, w: 1, h: 1 }, { x: 35, y: 3, w: 1, h: 1 },
  { x: 31, y: 4, w: 1, h: 1 }, { x: 35, y: 4, w: 1, h: 1 },
  { x: 31, y: 5, w: 1, h: 1 }, { x: 35, y: 5, w: 1, h: 1 },
  { x: 32, y: 6, w: 3, h: 1 },

  // D (Columns 37-41)
  { x: 37, y: 0, w: 4, h: 1 },
  { x: 37, y: 1, w: 1, h: 1 }, { x: 41, y: 1, w: 1, h: 1 },
  { x: 37, y: 2, w: 1, h: 1 }, { x: 41, y: 2, w: 1, h: 1 },
  { x: 37, y: 3, w: 1, h: 1 }, { x: 41, y: 3, w: 1, h: 1 },
  { x: 37, y: 4, w: 1, h: 1 }, { x: 41, y: 4, w: 1, h: 1 },
  { x: 37, y: 5, w: 1, h: 1 }, { x: 41, y: 5, w: 1, h: 1 },
  { x: 37, y: 6, w: 4, h: 1 },

  // I (Column 43)
  { x: 43, y: 0, w: 1, h: 1 },
  { x: 43, y: 1, w: 1, h: 1 },
  { x: 43, y: 2, w: 1, h: 1 },
  { x: 43, y: 3, w: 1, h: 1 },
  { x: 43, y: 4, w: 1, h: 1 },
  { x: 43, y: 5, w: 1, h: 1 },
  { x: 43, y: 6, w: 1, h: 1 },

  // V (Columns 45-49)
  { x: 45, y: 0, w: 1, h: 1 }, { x: 49, y: 0, w: 1, h: 1 },
  { x: 45, y: 1, w: 1, h: 1 }, { x: 49, y: 1, w: 1, h: 1 },
  { x: 45, y: 2, w: 1, h: 1 }, { x: 49, y: 2, w: 1, h: 1 },
  { x: 46, y: 3, w: 1, h: 1 }, { x: 48, y: 3, w: 1, h: 1 },
  { x: 46, y: 4, w: 1, h: 1 }, { x: 48, y: 4, w: 1, h: 1 },
  { x: 47, y: 5, w: 1, h: 1 },
  { x: 47, y: 6, w: 1, h: 1 },

  // E (Columns 51-55)
  { x: 51, y: 0, w: 5, h: 1 },
  { x: 51, y: 1, w: 1, h: 1 },
  { x: 51, y: 2, w: 1, h: 1 },
  { x: 51, y: 3, w: 4, h: 1 },
  { x: 51, y: 4, w: 1, h: 1 },
  { x: 51, y: 5, w: 1, h: 1 },
  { x: 51, y: 6, w: 5, h: 1 }
]

const SIZE_MAP = {
  xs: { height: 16, width: 132 },
  sm: { height: 21, width: 174 },
  md: { height: 28, width: 232 },
  lg: { height: 40, width: 331 },
  xl: { height: 54, width: 447 }
}

export default function SeCloudiveLogo({
  size = 'sm',
  variant = 'two-tone',
  glow = true,
  className = '',
  style = {}
}) {
  const dimensions = typeof size === 'number'
    ? { height: size, width: Math.round((size / 7) * 58) }
    : (SIZE_MAP[size] || SIZE_MAP.sm)

  const prefixColor = variant === 'cyan' ? '#38bdf8' : (variant === 'monochrome' ? 'currentColor' : '#f8fafc')
  const suffixColor = variant === 'monochrome' ? 'currentColor' : '#38bdf8'

  const filterStyle = glow
    ? { filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.45)) drop-shadow(0 0 14px rgba(56, 189, 248, 0.2))' }
    : {}

  return (
    <svg
      role="img"
      aria-label="SeCloudive"
      viewBox="0 0 58 7"
      width={dimensions.width}
      height={dimensions.height}
      className={`secloudive-pixel-logo ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        shapeRendering: 'crispEdges',
        overflow: 'visible',
        transition: 'transform 0.2s ease, filter 0.2s ease',
        ...filterStyle,
        ...style
      }}
    >
      <title>SeCloudive</title>
      
      {/* SE Prefix */}
      <g className="secloudive-prefix" fill={prefixColor}>
        {PREFIX_RECTS.map((r, i) => (
          <rect
            key={`pre-${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
          />
        ))}
      </g>

      {/* CLOUDIVE Suffix */}
      <g className="secloudive-suffix" fill={suffixColor}>
        {SUFFIX_RECTS.map((r, i) => (
          <rect
            key={`suf-${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
          />
        ))}
      </g>
    </svg>
  )
}
