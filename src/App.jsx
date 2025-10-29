import React, { useMemo, useState } from 'react'
import VisualSchedule from './components/VisualSchedule'
import ActivityCard from './components/ActivityCard'
import ProgressPanel from './components/ProgressPanel'
import ErrorBoundary from './components/ErrorBoundary'
import TeacherPanel from './components/TeacherPanel'
import TurnTokenFlyer from './components/MiniGames/TurnTokenFlyer'
import { QUESTION_BANK } from './data/questions'
import { loadSettings } from './utils/storage'

const TABS = ['Communication','Emotions','Social Skills','Progress']

function pickNext(domain, i){
  const pool = QUESTION_BANK[domain]
  return pool[(i+1) % pool.length]
}

export default function App(){
  const [tab, setTab] = useState(TABS[0])
  const [teacherOpen, setTeacherOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const [domain, setDomain] = useState(TABS[0])
  const [settings, setSettings] = useState(loadSettings())

  const item = useMemo(()=>QUESTION_BANK[domain][idx % QUESTION_BANK[domain].length], [domain, idx])

  const onNext = () => {
    // adaptive: make it harder by randomizing choice order or adding choice
    setIdx(i=> i+1)
  }

  const lowSensoryClass = settings.lowSensory ? {filter:'saturate(0) contrast(1.2)'} : {}

  return (
    <div className="app" style={lowSensoryClass}>
      <header className="header">
        <div>
          <div className="badge">BrightSteps</div>
          <h1 className="title">Social & Emotion Coach</h1>
          <p className="small">Designed for elementary learners • Evidence‑informed • Accessible</p>
        </div>
        <div className="buttons">
          <button className="btn" onClick={()=>setTeacherOpen(true)} aria-label="Open Teacher Mode (PIN)">
            🔒 Teacher Mode
          </button>
        </div>
      </header>

      <VisualSchedule now={tab} next="Mini‑game" done="Break" />

      <nav className="nav" role="tablist" aria-label="Main sections">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} role="tab" aria-selected={tab===t}
            onClick={()=>{ setTab(t); if(t !== 'Progress'){ setDomain(t); setIdx(0) } }}>
            {t}
          </button>
        ))}
      </nav>

      <section style={{marginTop:12}}>
        {tab !== 'Progress' ? (
          <div className="row">
            <ActivityCard domain={domain} item={item} onNext={onNext}/>
            <TurnTokenFlyer/>
          </div>
        ) : (
          <div className="row">
            <ErrorBoundary>
              <ProgressPanel/>
            </ErrorBoundary>
          </div>
        )}
      </section>

      <footer style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(255,255,255,0.9)',backdropFilter:'blur(6px)',borderTop:'1px solid rgba(2,6,23,0.06)',padding:10}}>
        <div className="app" style={{paddingBottom:0}}>
          <p className="small">
            📝 This educational tool supports communication, emotion recognition, and social skills practice.
            It does not diagnose conditions and is not a medical device.
          </p>
        </div>
      </footer>

      <TeacherPanel open={teacherOpen} onClose={()=>setTeacherOpen(false)}/>
    </div>
  )
}
