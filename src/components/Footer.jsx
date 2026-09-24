import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() { return <footer className="footer"><div className="footer-brand"><span>© 2025 SeCloudive</span><span>Built for the next generation of cloud defenders.</span></div><nav className="footer-links" aria-label="Footer navigation"><a href="https://github.com/SeCloudive" target="_blank" rel="noreferrer">GitHub Repository <ExternalLink size={12} /></a><a href="https://secloudive.amplifyapp.com" target="_blank" rel="noreferrer">Live Demo <ExternalLink size={12} /></a><Link to="/about">About Project</Link><Link to="/categories">Learning Paths</Link></nav><span className="footer-status"><i /> All systems operational</span></footer> }
