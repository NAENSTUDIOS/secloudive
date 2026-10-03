import React from 'react'

/**
 * Official Vector Graphics Suite for NAEN Studios & SeCloudive
 * High-definition, scalable SVG graphics with vibrant cyber aesthetic.
 */

// 1. Official NAEN Studios Insignia Badge
export function NaenStudiosLogoBadge({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NAEN Studios Official Logo"
    >
      <defs>
        <linearGradient id="naenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="naenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
        </linearGradient>
        <filter id="naenBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Outer Frame */}
      <polygon
        points="50,6 92,28 92,72 50,94 8,72 8,28"
        fill="#070d1d"
        stroke="url(#naenGrad)"
        strokeWidth="3.5"
        filter="url(#naenBlur)"
      />

      {/* Inner Concentric Diamond */}
      <polygon
        points="50,18 80,50 50,82 20,50"
        fill="url(#naenGlow)"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Stylized 'N' & Orbit Vector */}
      <path
        d="M32 66 V34 L68 66 V34"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Core Node Pulse */}
      <circle cx="50" cy="50" r="5" fill="#38bdf8" />
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
    </svg>
  )
}

// 2. Official Gold Accreditation Seal (Watermarks & Certificates)
export function OfficialAccreditationSeal({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NAEN Studios Accreditation Seal"
    >
      <defs>
        <radialGradient id="sealGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Scalloped Starburst Border */}
      <circle cx="100" cy="100" r="92" fill="url(#sealGold)" stroke="#fef08a" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="82" fill="#0f172a" stroke="url(#ringGold)" strokeWidth="1.8" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

      {/* Text Ring */}
      <path id="sealPathTop" d="M 35,100 A 65,65 0 0,1 165,100" fill="none" />
      <text fill="#fef08a" fontSize="10" fontWeight="800" letterSpacing="2.5">
        <textPath href="#sealPathTop" startOffset="50%" textAnchor="middle">
          NAEN STUDIOS • VERIFIED
        </textPath>
      </text>

      <path id="sealPathBottom" d="M 165,100 A 65,65 0 0,1 35,100" fill="none" />
      <text fill="#fef08a" fontSize="9" fontWeight="800" letterSpacing="2">
        <textPath href="#sealPathBottom" startOffset="50%" textAnchor="middle">
          SECLOUDIVE 2026
        </textPath>
      </text>

      {/* Center Shield & Stars */}
      <g transform="translate(75, 75)">
        <polygon points="25,5 45,15 45,35 25,48 5,35 5,15" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
        <path d="M15 26 L22 33 L35 18" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

// 3. AWS Multi-Tier Cloud Architecture Graphic
export function CloudArchitectureGraphic({ width = '100%', height = 240, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 700 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible', maxWidth: '100%' }}
    >
      <defs>
        <linearGradient id="cloudBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.85)" />
          <stop offset="100%" stopColor="rgba(30, 41, 59, 0.6)" />
        </linearGradient>
        <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Outer VPC Boundary */}
      <rect x="15" y="15" width="670" height="210" rx="14" fill="url(#cloudBoxGrad)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="35" y="38" fill="#38bdf8" fontSize="11" fontWeight="800" letterSpacing="0.08em" fontFamily="monospace">
        AWS VPC /// 10.0.0.0/16 [MULTI-AZ ZERO-TRUST ARCHITECTURE]
      </text>

      {/* Ingress / WAF Tier */}
      <g transform="translate(40, 60)">
        <rect width="160" height="140" rx="10" fill="rgba(11, 20, 38, 0.9)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
        <rect x="0" y="0" width="160" height="26" rx="10" fill="rgba(56, 189, 248, 0.15)" />
        <text x="12" y="18" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">PUBLIC SUBNET</text>
        
        {/* WAF & ALB Boxes */}
        <rect x="15" y="38" width="130" height="38" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#ef4444" strokeWidth="1" />
        <text x="25" y="54" fill="#f8fafc" fontSize="10" fontWeight="700">AWS WAF v2</text>
        <text x="25" y="68" fill="#94a3b8" fontSize="8" fontFamily="monospace">Rate-Limit + SQLi</text>

        <rect x="15" y="86" width="130" height="42" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#38bdf8" strokeWidth="1" />
        <text x="25" y="103" fill="#f8fafc" fontSize="10" fontWeight="700">Application Load Balancer</text>
        <text x="25" y="118" fill="#38bdf8" fontSize="8" fontFamily="monospace">HTTPS 443 → TLS 1.3</text>
      </g>

      {/* Connector 1 */}
      <path d="M 200 135 H 250" stroke="url(#wireGrad)" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="225" cy="135" r="3" fill="#38bdf8" />

      {/* Application / Compute Tier */}
      <g transform="translate(250, 60)">
        <rect width="180" height="140" rx="10" fill="rgba(11, 20, 38, 0.9)" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.5" />
        <rect x="0" y="0" width="180" height="26" rx="10" fill="rgba(129, 140, 248, 0.15)" />
        <text x="12" y="18" fill="#818cf8" fontSize="10" fontWeight="700" fontFamily="monospace">PRIVATE COMPUTE SUBNET</text>

        {/* EKS / EC2 with IMDSv2 */}
        <rect x="15" y="38" width="150" height="42" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#818cf8" strokeWidth="1" />
        <text x="25" y="55" fill="#f8fafc" fontSize="10" fontWeight="700">EKS Cluster / IRSA</text>
        <text x="25" y="70" fill="#a5b4fc" fontSize="8" fontFamily="monospace">IAM OIDC Role Tokens</text>

        <rect x="15" y="88" width="150" height="40" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#10b981" strokeWidth="1" />
        <text x="25" y="105" fill="#f8fafc" fontSize="10" fontWeight="700">EC2 Auto Scaling Fleet</text>
        <text x="25" y="119" fill="#10b981" fontSize="8" fontFamily="monospace">IMDSv2 Enforced (Hop=1)</text>
      </g>

      {/* Connector 2 */}
      <path d="M 430 135 H 480" stroke="url(#wireGrad)" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="455" cy="135" r="3" fill="#10b981" />

      {/* Data & Security Vault Tier */}
      <g transform="translate(480, 60)">
        <rect width="185" height="140" rx="10" fill="rgba(11, 20, 38, 0.9)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
        <rect x="0" y="0" width="185" height="26" rx="10" fill="rgba(16, 185, 129, 0.15)" />
        <text x="12" y="18" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="monospace">DATA & SECURITY VAULT</text>

        {/* S3 Block Public & KMS */}
        <rect x="15" y="38" width="155" height="42" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#f59e0b" strokeWidth="1" />
        <text x="25" y="55" fill="#f8fafc" fontSize="10" fontWeight="700">Amazon S3 Secure Lake</text>
        <text x="25" y="70" fill="#fbbf24" fontSize="8" fontFamily="monospace">Block Public Access ON</text>

        <rect x="15" y="88" width="155" height="40" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="#10b981" strokeWidth="1" />
        <text x="25" y="105" fill="#f8fafc" fontSize="10" fontWeight="700">AWS KMS (CMK Keys)</text>
        <text x="25" y="119" fill="#34d399" fontSize="8" fontFamily="monospace">Auto-Rotation Active</text>
      </g>

      {/* Security Telemetry Header */}
      <g transform="translate(420, 26)">
        <circle cx="6" cy="6" r="4" fill="#10b981" />
        <text x="16" y="9" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace">
          GUARDDUTY & CLOUDTRAIL ACTIVE
        </text>
      </g>
    </svg>
  )
}

// 4. Subtle Diagonal Background Watermark Overlay for PDFs and Certificates
export function DocumentWatermark({ text = 'NAEN STUDIOS • SECLOUDIVE • VERIFIED SPECIFICATION' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.04,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        userSelect: 'none'
      }}
      aria-hidden="true"
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            transform: 'rotate(-25deg)',
            whiteSpace: 'nowrap',
            fontSize: '28px',
            fontWeight: 900,
            letterSpacing: '8px',
            color: '#ffffff',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '150%',
            marginLeft: '-25%'
          }}
        >
          {text} • {text}
        </div>
      ))}
    </div>
  )
}
