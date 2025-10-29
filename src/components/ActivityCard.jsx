import React, { useEffect, useMemo, useRef, useState } from 'react'
import { pushEvent, loadSettings } from '../utils/storage'

function useBeep(){
  const ctxRef = useRef(null)
  useEffect(()=>()=>{ if(ctxRef.current){ ctxRef.current.close() } },[])
  return (freq=880, duration=0.12, vol=0.1) => {
    const settings = loadSettings()
    if(!settings.sound || settings.muted) return
    const ctx = ctxRef.current || new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    g.gain.value = (settings.volume ?? vol) * 0.4
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = freq
    o.start()
    setTimeout(()=>{ o.stop() }, duration*1000)
  }
}

export default function ActivityCard({ domain, item, onNext }){
  const [settings, setSettings] = useState(loadSettings())
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(null)
  const [startTs, setStartTs] = useState(Date.now())
  const beep = useBeep()

  useEffect(()=>{
    const handler = () => setSettings(loadSettings())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  useEffect(()=>{ setStartTs(Date.now()); setSelected(null) }, [item?.id])

  const onChoice = (idx) => {
    if(paused || selected !== null) return
    const correct = idx === item.answerIndex
    const rt = Math.max(0, Date.now() - startTs)
    setSelected(idx)
    pushEvent({ts:Date.now(), domain, id:item.id, correct, rt})
    if(correct){
      if(navigator.vibrate) navigator.vibrate(10)
      beep(1200, .1)
      if(settings.confetti){
        // lightweight star burst
        const el = document.createElement('div')
        el.textContent = '⭐'
        el.style.position='fixed'
        el.style.left = (Math.random()*80+10)+'vw'
        el.style.top = (Math.random()*40+20)+'vh'
        el.style.fontSize = (Math.random()*30+24)+'px'
        el.style.transition='all .6s ease'
        document.body.appendChild(el)
        setTimeout(()=>{ el.style.transform='translateY(-60px)'; el.style.opacity='0' }, 10)
        setTimeout(()=>{ el.remove() }, 650)
      }
      setTimeout(()=> onNext?.(), 500)
    } else {
      if(navigator.vibrate) navigator.vibrate([30,40,30])
      beep(200, .08)
      // brief right-action hint
    }
  }

  const repeatPrompt = () => {
    const utter = new SpeechSynthesisUtterance(item.prompt)
    utter.rate = 0.95
    if(!settings.muted && settings.sound) speechSynthesis.speak(utter)
  }

  return (
    <div className="card" aria-live="polite">
      <img src={(item?.img) || (domain==='Communication'?'images/communication.svg':domain==='Emotions'?'images/emotions.svg':'images/social.svg')} alt={`${domain} illustration`} style={{width:'100%',height:140,objectFit:'cover',borderRadius:12}}/>
      <div className="tag">Prompt</div>
      <p className="kid-text" style={{marginTop:8}}>{item.prompt}</p>

      <div className="buttons">
        {item.choices.map((c, idx)=>(
          <button
            key={idx}
            className={`btn ${selected===idx ? (idx===item.answerIndex ? 'primary':'warn') : ''}`}
            onClick={()=>onChoice(idx)}
            aria-label={`Choice ${idx+1}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="buttons">
        <button className="btn" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="btn" onClick={repeatPrompt}>Repeat</button>
      </div>

      <p className="small">Tap the right answer. {paused && 'Paused.'}</p>
    </div>
  )
}
