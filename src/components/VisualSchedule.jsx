import React from 'react'

export default function VisualSchedule({ now='Practice', next='Game', done='Break' }){
  return (
    <div className="schedule" aria-label="Visual schedule Now, Next, Done">
      <div className="pill"><strong>Now</strong>: {now}</div>
      <div className="pill"><strong>Next</strong>: {next}</div>
      <div className="pill"><strong>Done</strong>: {done}</div>
    </div>
  )
}
