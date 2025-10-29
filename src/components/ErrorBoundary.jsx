import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error){
    return { hasError: true, error }
  }
  componentDidCatch(error, info){
    // Keep a breadcrumb so we can inspect in console
    console.error('[Progress ErrorBoundary]', error, info)
  }
  render(){
    if(this.state.hasError){
      return (
        <div className="card">
          <h3>Progress could not load</h3>
          <p className="small">Something went wrong while rendering Progress. Try refreshing the page. If the issue persists, use <strong>Reset</strong> to clear saved data.</p>
          <details style={{whiteSpace:'pre-wrap'}}>
            <summary className="small">Error details</summary>
            {String(this.state.error)}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
