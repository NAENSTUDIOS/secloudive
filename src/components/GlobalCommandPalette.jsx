import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  Award,
  Radio,
  BookOpen,
  Terminal,
  ShieldAlert,
  Skull,
  Layers,
  Calculator,
  Download,
  Mail,
  ArrowRight,
  X,
  Compass,
  FileCheck2,
  FileCode2,
  CheckCircle2,
  Cpu,
  Users,
  Cloud
} from 'lucide-react'
import { learningAcademyPaths } from '../data/learning/index.js'
import { realLabs } from '../data/jobLabs.js'
import { investigations } from '../data/investigations.js'
import { battleRooms } from '../data/battleRooms.js'
import downloadsData from '../data/cloudive/downloads.json'

export default function GlobalCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'topics' | 'labs' | 'investigations' | 'arena' | 'tools' | 'actions'
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Build indexed items across the entire platform
  const allItems = useMemo(() => {
    const items = []

    // 1. Quick Actions & NAEN AI
    items.push({
      id: 'action-naen-ai',
      type: 'actions',
      category: 'NAEN AI Co-Pilot',
      title: 'Ask NAEN AI (Socratic Pedagogical Engine)',
      subtitle: 'Ask technical questions, get analogies, quizzes, and career guidance',
      icon: <Sparkles size={16} className="text-cyan" />,
      badge: 'Ctrl+K',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-naen-ai'))
      }
    })

    items.push({
      id: 'action-welcome-tour',
      type: 'actions',
      category: 'Onboarding & Orientation',
      title: 'Open Platform Welcome & Identity Guide',
      subtitle: 'Choose between Sign In (Google/Cloud ID sync) or Guest Sandbox mode with full platform overview',
      icon: <Sparkles size={16} className="text-cyan" />,
      badge: 'Welcome',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-welcome-modal'))
      }
    })

    items.push({
      id: 'action-diagnostic-test',
      type: 'actions',
      category: 'Skill Placement',
      title: 'Take 2-Minute Diagnostic Placement Test',
      subtitle: 'Benchmark your knowledge across IAM, Networking & Architecture for an automatic learning path recommendation',
      icon: <Compass size={16} className="text-amber" />,
      badge: 'Placement',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-diagnostic-test'))
      }
    })

    items.push({
      id: 'action-flashcards',
      type: 'actions',
      category: 'Exam Prep',
      title: 'Launch AWS Certification Flashcard Drills',
      subtitle: 'Interactive spaced-repetition drills for SCS-C02, SAA-C03 & Security Port matrix',
      icon: <Sparkles size={16} className="text-sky" />,
      badge: '3D Drills',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-flashcard-drill'))
      }
    })

    items.push({
      id: 'action-user-sync',
      type: 'actions',
      category: 'User Profiles & Sync',
      title: 'Manage User Profiles & Auto-Sync Engine',
      subtitle: 'Switch student profiles, view live auto-save telemetry, or export JSON backup',
      icon: <Users size={16} className="text-cyan" />,
      badge: 'Profiles',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
      }
    })

    items.push({
      id: 'action-certificate',
      type: 'actions',
      category: 'Credential',
      title: 'View Official Verifiable Certificate',
      subtitle: 'Generate printable cloud credential issued by NAEN Studios',
      icon: <Award size={16} className="text-amber" />,
      badge: 'Verifiable',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-certificate'))
      }
    })

    items.push({
      id: 'action-latency',
      type: 'actions',
      category: 'Diagnostic Tool',
      title: 'Test AWS Global Regional Latency',
      subtitle: 'Live HTTP ping benchmark to 8 AWS regions (us-east-1, ap-south-1, etc.)',
      icon: <Radio size={16} className="text-emerald" />,
      badge: 'Live Ping',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-latency-monitor'))
      }
    })

    items.push({
      id: 'action-send-script',
      type: 'actions',
      category: 'Script Dispatch',
      title: 'Auto Dispatch Script to NAEN Studios (naenstudios@gmail.com)',
      subtitle: 'Package and send your active Terraform architecture, incident forensic runbooks, or telemetry',
      icon: <FileCode2 size={16} className="text-sky" />,
      badge: 'Auto Mail',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-script-dispatch'))
      }
    })

    items.push({
      id: 'action-support-mail',
      type: 'actions',
      category: 'Support',
      title: 'Email NAEN Studios (naenstudios@gmail.com)',
      subtitle: 'Send official feedback, inquiry, or curriculum questions directly to creator',
      icon: <Mail size={16} className="text-rose" />,
      badge: 'Support',
      action: () => {
        window.location.href = 'mailto:naenstudios@gmail.com?subject=SeCloudive%20Platform%20Inquiry'
      }
    })

    // 2. Tools & Simulators
    const systemTools = [
      {
        id: 'tool-studio',
        title: 'Cloudive Studio (Dual-Pane Architecture Builder)',
        subtitle: 'Drag-and-drop AWS topologies, cost modeling & Terraform HCL generation',
        path: '/cloudive-studio',
        icon: <Layers size={16} className="text-sky" />,
        badge: 'Studio'
      },
      {
        id: 'tool-cost-calc',
        title: 'Safe Lab Cost Calculator ($0 Tier Simulator)',
        subtitle: 'Estimate free-tier safety thresholds and set budget alerts',
        path: '/cost-calculator',
        icon: <Calculator size={16} className="text-emerald" />,
        badge: 'FinOps'
      },
      {
        id: 'tool-interview',
        title: 'Technical Interview Simulator (Voice / Text)',
        subtitle: 'Real-time SAA-C03 / DevSecOps mock interview with rubric scoring',
        path: '/interview-simulator',
        icon: <Cpu size={16} className="text-purple" />,
        badge: 'Interview'
      },
      {
        id: 'tool-internship',
        title: 'Virtual Cloud Security Internship',
        subtitle: 'Multi-week enterprise sprints, ticket assignments, and PR reviews',
        path: '/internship-simulator',
        icon: <Compass size={16} className="text-blue" />,
        badge: 'Internship'
      },
      {
        id: 'tool-live-portal',
        title: 'SOC Live Threat & Activity Hub',
        subtitle: 'Streaming AWS telemetry, real-time security events, and community feed',
        path: '/live-portal',
        icon: <Radio size={16} className="text-emerald" />,
        badge: 'Live Feed'
      },
      {
        id: 'tool-report',
        title: 'Executive Cloud Security Audit Report',
        subtitle: 'Exportable compliance scorecard, MITRE coverage, and gap analysis',
        path: '/report',
        icon: <FileCheck2 size={16} className="text-amber" />,
        badge: 'Audit'
      },
      {
        id: 'tool-career-rampup',
        title: 'Career Ramp-Up & External Lab Guides',
        subtitle: 'TryHackMe, HackTheBox, and AWS Skill Builder alignment paths',
        path: '/ramp-up',
        icon: <BookOpen size={16} className="text-teal" />,
        badge: 'Career'
      },
      {
        id: 'tool-downloads',
        title: 'Free Career Resource Packs (15 Bundles)',
        subtitle: 'Download complete AWS interview playbooks and architecture guides',
        path: '/downloads',
        icon: <Download size={16} className="text-orange" />,
        badge: 'Downloads'
      }
    ]

    systemTools.forEach(t => {
      items.push({
        id: t.id,
        type: 'tools',
        category: 'Platform Tool',
        title: t.title,
        subtitle: t.subtitle,
        icon: t.icon,
        badge: t.badge,
        action: () => navigate(t.path)
      })
    })

    // 3. Learning Academy Topics (52 Topics)
    learningAcademyPaths.forEach(path => {
      path.topics?.forEach(topic => {
        items.push({
          id: `topic-${topic.id}`,
          type: 'topics',
          category: `Academy • ${path.title}`,
          title: topic.title,
          subtitle: `${path.title} • ${topic.timeEstimate || '15 mins'} • ${topic.certificationAlignment || 'AWS SAA-C03'}`,
          icon: <BookOpen size={16} className="text-cyan" />,
          badge: topic.level || 'Foundational',
          action: () => navigate(`/learning?track=${path.id}&topic=${topic.id}`)
        })
      })
    })

    // 4. Real Job Labs (16 SOPs)
    realLabs.forEach(lab => {
      items.push({
        id: `lab-${lab.id}`,
        type: 'labs',
        category: 'Real Job Lab SOP',
        title: `${lab.title}`,
        subtitle: `${lab.targetRole || 'Cloud Security'} • ${lab.estimatedMinutes || 30}m • ${lab.mitreTechnique || 'MITRE ATT&CK'}`,
        icon: <Terminal size={16} className="text-emerald" />,
        badge: lab.difficulty || 'Hands-On',
        action: () => navigate(`/labs?tab=sops&lab=${lab.id}`)
      })
    })

    // 5. SOC Investigation Tickets (25 Tickets)
    investigations.forEach(inv => {
      items.push({
        id: `inv-${inv.id}`,
        type: 'investigations',
        category: `Investigation • ${inv.category || 'Incident'}`,
        title: `${inv.ticket}: ${inv.title}`,
        subtitle: `${inv.riskLevel} Risk • ${(inv.affectedServices || []).join(', ')}`,
        icon: <ShieldAlert size={16} className="text-rose" />,
        badge: inv.riskLevel || 'Incident',
        action: () => navigate(`/investigations?ticket=${inv.ticket}`)
      })
    })

    // 6. Threat Battle Arenas (5 Rooms)
    battleRooms.forEach(room => {
      items.push({
        id: `arena-${room.id}`,
        type: 'arena',
        category: 'Adversarial Battle Arena',
        title: room.title,
        subtitle: `${room.category} • ${room.duration} • ${room.points} XP • ${room.flag ? 'CTF Flag' : ''}`,
        icon: <Skull size={16} className="text-purple" />,
        badge: room.difficulty || 'Battle',
        action: () => navigate(`/battle-rooms?room=${room.id}`)
      })
    })

    return items
  }, [navigate])

  // Filter items by active tab and search query
  const filteredItems = useMemo(() => {
    let result = allItems
    if (activeFilter !== 'all') {
      result = result.filter(item => item.type === activeFilter)
    }

    if (!query.trim()) {
      // Default initial view: top recommended items
      return result.slice(0, 18)
    }

    const q = query.toLowerCase().trim()
    return result.filter(item => {
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchSub = item.subtitle?.toLowerCase().includes(q)
      const matchCat = item.category?.toLowerCase().includes(q)
      return matchTitle || matchSub || matchCat
    }).slice(0, 24)
  }, [allItems, activeFilter, query])

  // Open/Close listeners: Ctrl+/ or custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+/ or Cmd+/ or Ctrl+P
      if ((e.ctrlKey || e.metaKey) && (e.key === '/' || (e.shiftKey && e.key.toLowerCase() === 'p'))) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => {
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        setSelectedIndex(0)
      }, 50)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard navigation through search results (Up / Down / Enter)
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleExecute(filteredItems[selectedIndex])
      }
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex]
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleExecute = (item) => {
    setIsOpen(false)
    if (item.action) {
      item.action()
    }
  }

  if (!isOpen) return null

  return (
    <div className="cmd-palette-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="cmd-palette-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Omnisearch Command Palette"
      >
        {/* Header Search Input */}
        <div className="cmd-palette-header">
          <Search size={20} className="cmd-palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder="Search all 52 topics, 25 incidents, 16 labs, tools, or ask NAEN AI..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
          />
          {query && (
            <button 
              className="cmd-palette-clear-btn"
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <span className="cmd-palette-esc-badge">ESC</span>
        </div>

        {/* Filter Pills */}
        <div className="cmd-palette-filters">
          <button 
            className={`cmd-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('all'); setSelectedIndex(0) }}
          >
            All Items
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'topics' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('topics'); setSelectedIndex(0) }}
          >
            Topics (52)
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'labs' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('labs'); setSelectedIndex(0) }}
          >
            Real Labs (16)
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'investigations' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('investigations'); setSelectedIndex(0) }}
          >
            Incidents (25)
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'arena' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('arena'); setSelectedIndex(0) }}
          >
            Battle Arena
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'tools' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('tools'); setSelectedIndex(0) }}
          >
            Tools
          </button>
          <button 
            className={`cmd-filter-pill ${activeFilter === 'actions' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('actions'); setSelectedIndex(0) }}
          >
            Actions
          </button>
        </div>

        {/* Results List */}
        <div className="cmd-palette-list" ref={listRef}>
          {filteredItems.length === 0 ? (
            <div className="cmd-palette-empty">
              <Compass size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <p>No matching resources found for "{query}"</p>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Try searching for 'IAM', 'S3', 'PassRole', 'KMS', 'Studio', or ask NAEN AI.
              </span>
              <button 
                className="cmd-empty-ask-btn"
                onClick={() => {
                  setIsOpen(false)
                  window.dispatchEvent(new CustomEvent('open-naen-ai'))
                }}
              >
                <Sparkles size={14} /> Ask NAEN AI: "{query}"
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <div
                  key={item.id}
                  className={`cmd-palette-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="cmd-item-icon-box">
                    {item.icon}
                  </div>
                  <div className="cmd-item-body">
                    <div className="cmd-item-top">
                      <span className="cmd-item-category">{item.category}</span>
                      {item.badge && (
                        <span className="cmd-item-badge">{item.badge}</span>
                      )}
                    </div>
                    <div className="cmd-item-title">{item.title}</div>
                    {item.subtitle && (
                      <div className="cmd-item-subtitle">{item.subtitle}</div>
                    )}
                  </div>
                  <ArrowRight size={14} className="cmd-item-arrow" />
                </div>
              )
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="cmd-palette-footer">
          <div className="cmd-footer-keys">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>Ctrl</kbd>+<kbd>/</kbd> Toggle</span>
            <span><kbd>Ctrl</kbd>+<kbd>K</kbd> NAEN AI</span>
          </div>
          <div className="cmd-footer-branding">
            <span>NAEN Studios • naenstudios@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
