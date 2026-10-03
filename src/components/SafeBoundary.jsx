import React, { Component } from 'react'
import { reportCrashToSupervisor } from '../solutions/crashSupervisor.js'

/**
 * Lightweight, non-intrusive component-level error boundary.
 * Prevents non-critical UI overlays, modals, and monitors from
 * bringing down the entire application if an unexpected error occurs.
 */
export default class SafeBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`[SafeBoundary] Isolated caught exception in <${this.props.name || 'Component'}>:`, error?.message || error, errorInfo)
    try {
      reportCrashToSupervisor(error, errorInfo, `<${this.props.name || 'Component'}> SafeBoundary`)
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}
