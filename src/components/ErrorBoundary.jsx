import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surfaces the real problem in the browser console (F12 → Console) instead of
    // failing silently, so it's easy to see exactly what went wrong and where.
    console.error('Section failed to render:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 rounded-xl border border-dashed border-[var(--line)] text-sm opacity-70">
          <p className="font-mono text-xs uppercase tracking-wide mb-2">This part couldn't load.</p>
          <p>{this.props.hint || 'Please check back shortly.'}</p>
        </div>
      )
    }
    return this.props.children
  }
}
