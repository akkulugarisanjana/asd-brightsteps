import React, { useState } from 'react'
import { loadSettings, saveSettings } from '../utils/storage'

export default function TeacherPanel({ open, onClose }){
  const [locked, setLocked] = useState(true)
  const [pin, setPin] = useState('')
  const [settings, setSettings] = useState(loadSettings())

  const correctPIN = '1234'

  const unlock = () => {
    if(pin === correctPIN){ setLocked(false) } else { alert('Wrong PIN') }
  }

  const update = (patch) => {
    const s = {...settings, ...patch}
    setSettings(s); saveSettings(s)
  }

  const grayVolume = settings.muted

  return (
    <aside className={`sidepanel ${open ? 'open':''}`} role="dialog" aria-label="Teacher panel">
      <h3>Teacher Mode</h3>
      <button className="btn" onClick={onClose}>Close</button>
      <hr/>
      {locked ? (
        <div>
          <label htmlFor="pin">Enter 4-digit PIN</label>
          <input id="pin" inputMode="numeric" maxLength={4} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} />
          <div className="buttons">
            <button className="btn primary" onClick={unlock}>Unlock</button>
          </div>
          <p className="small">Default PIN is <span className="tag">1234</span>. Change in code before deploying.</p>
        </div>
      ) : (
        <div>
          <div className="switch">
            <span>Confetti (big wins only)</span>
            <input type="checkbox" checked={settings.confetti} onChange={e=>update({confetti:e.target.checked})}/>
          </div>
          <div className="switch">
            <span>Adaptive difficulty</span>
            <input type="checkbox" checked={settings.adaptive} onChange={e=>update({adaptive:e.target.checked})}/>
          </div>
          <div className="switch">
            <span>Sound effects</span>
            <input type="checkbox" checked={settings.sound} onChange={e=>update({sound:e.target.checked})}/>
          </div>
          <div className="switch">
            <span>Mute all</span>
            <input type="checkbox" checked={settings.muted} onChange={e=>update({muted:e.target.checked})}/>
          </div>
          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={e=>update({volume:parseFloat(e.target.value)})} disabled={grayVolume}/>
          <div className="switch">
            <span>Low Sensory Mode</span>
            <input type="checkbox" checked={settings.lowSensory} onChange={e=>update({lowSensory:e.target.checked})}/>
          </div>
        </div>
      )}
    </aside>
  )
}
