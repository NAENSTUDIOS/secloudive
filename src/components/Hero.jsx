import { ArrowRight, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return <section className="hero landing-hero">
    <div className="hero-copy">
      <div className="eyebrow"><span className="pulse-dot" /> CLOUD SECURITY / FIELD LAB</div>
      <h1>Learn to think like a <em>cloud security engineer.</em></h1>
      <p>Develop security judgment through real AWS security scenarios, architecture reviews, IAM analysis, networking assessments, and incident-thinking challenges.</p>
      <div className="hero-actions">
        <Link className="button button-primary" to="/investigations">
          Launch Investigation Simulator <ArrowRight size={17} />
        </Link>
        <Link className="button button-ghost" to="/categories">
          <Play size={16} /> Explore Scenario Lab
        </Link>
      </div>
      <div className="hero-proof"><div className="avatars"><span>AK</span><span>RM</span><span>+2k</span></div><span>Join 2,400+ aspiring cloud defenders</span></div>
    </div>
    <div className="hero-visual"><div className="signal-orb"><span /><span /><span /></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-console"><div className="console-top"><span><i /> <i /> <i /></span><span>secloudive / threat-model</span><span className="console-live">LIVE</span></div><div className="console-body"><div className="console-line muted">&gt; initializing security review...</div><div className="console-line">&gt; scanning <b>iam-prod-role</b></div><div className="console-line success">✓ trust boundary identified</div><div className="console-line">&gt; evaluating <b>12</b> policy statements</div><div className="risk-row"><span>RISK SCORE</span><strong>24 <small>/ 100</small></strong><span className="risk-low">LOW RISK</span></div><div className="console-line muted">&gt; recommendation ready_</div></div></div><div className="shield-float"><ShieldCheck size={28} /><span>Security posture<br /><b>Healthy</b></span></div><div className="hero-note"><Sparkles size={14} /> judgment over memorization</div></div>
  </section>
}
