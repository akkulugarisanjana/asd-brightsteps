import React, { useEffect, useRef, useState } from 'react'
import { pushEvent, loadSettings } from '../../utils/storage'

export default function TurnTokenFlyer(){
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [msg, setMsg] = useState('Tap Start to play. Collect only “My Turn” rings.')
  const [score, setScore] = useState({good:0,bad:0})

  useEffect(()=>{
    if(!running) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = canvas.clientWidth * devicePixelRatio
    let h = canvas.height = canvas.clientHeight * devicePixelRatio
    let rafId, t0 = performance.now()

    const player = {x: 60, y: h/2, vy: 0}
    const rings = []
    const settings = loadSettings()

    const spawn = () => {
      const y = Math.random()* (h*0.8) + h*0.1
      const type = Math.random() < 0.5 ? 'MY' : 'YOUR'
      rings.push({x: w+40, y, r: 18*devicePixelRatio, type})
    }

    let spawnTimer = 0
    const onResize = () => { w = canvas.width = canvas.clientWidth * devicePixelRatio; h = canvas.height = canvas.clientHeight * devicePixelRatio }
    window.addEventListener('resize', onResize)

    const beep = (freq=600) => {
      if(!settings.sound || settings.muted) return
      const ctxA = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctxA.createOscillator(); const g = ctxA.createGain()
      g.gain.value = (settings.volume ?? 0.6) * 0.3
      o.connect(g); g.connect(ctxA.destination); o.frequency.value = freq; o.start()
      setTimeout(()=>{ o.stop(); ctxA.close() }, 120)
    }

    const loop = (t)=>{
      const dt = Math.min(32, t - t0); t0 = t
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0,0,w,h)

      // gravity
      player.vy += 0.0008*dt*h/600
      player.y += player.vy
      if(player.y > h-20){ player.y = h-20; player.vy = 0 }
      if(player.y < 20){ player.y = 20; player.vy = 0 }

      // rings
      spawnTimer += dt
      if(spawnTimer > 900){ spawn(); spawnTimer = 0 }
      for(const r of rings){ r.x -= 0.22*dt*h/600 }
      while(rings.length && rings[0].x < -60) rings.shift()

      // collisions
      for(const r of rings){
        const dx = (player.x - r.x), dy = (player.y - r.y)
        const hit = (dx*dx + dy*dy) < (r.r*r.r)
        if(hit){
          if(r.type === 'MY'){ setScore(s=>({...s,good:s.good+1})); beep(900) }
          else { setScore(s=>({...s,bad:s.bad+1})); beep(220); if(navigator.vibrate) navigator.vibrate([50,40,50]) }
          rings.splice(rings.indexOf(r),1)
        }
      }

      // draw player
      ctx.fillStyle = '#7dd3fc'; ctx.beginPath(); ctx.arc(player.x, player.y, 14*devicePixelRatio, 0, Math.PI*2); ctx.fill()

      // draw rings
      for(const r of rings){
        ctx.strokeStyle = r.type==='MY' ? '#34d399' : '#fb7185'
        ctx.lineWidth = 4*devicePixelRatio
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI*2); ctx.stroke()
        ctx.font = `${12*devicePixelRatio}px system-ui`; ctx.fillStyle = '#cbd5e1'
        ctx.textAlign = 'center'; ctx.fillText(r.type==='MY'?'My Turn':'Your Turn', r.x, r.y - 20*devicePixelRatio)
      }

      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return ()=>{ cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize) } }, [running])

  const tap = ()=>{
    const c = canvasRef.current
    const rect = c.getBoundingClientRect()
    const y = rect.height / 2
    // jump
    const ev = new Event('jump')
    c.dispatchEvent(ev)
  }

  useEffect(()=>{
    const c = canvasRef.current
    const onClick = (e)=>{
      // apply jump to player via storing on element
      c.playerVy = (c.playerVy||0) - 4
    }
    c.addEventListener('click', onClick)
    return ()=> c.removeEventListener('click', onClick)
  }, [])

  const onStop = ()=>{ setRunning(()=>false); pushEvent({ts:Date.now(), domain:'Social Skills', id:'turn-token-flyer', correct:true, rt: score.good*1000}) }

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Turn‑Token Flyer</h3>
        <span className="tag">Practice waiting turns</span>
      </div>
      <p className="small">{msg}</p>
      <div style={{width:'100%',height:240,border:'1px solid rgba(255,255,255,.1)',borderRadius:12,overflow:'hidden',background:'#f1f5f9'}}>
        <canvas ref={canvasRef} style={{width:'100%',height:'100%'}} />
      </div>
      <div className="buttons">
        <button className="btn primary" onClick={()=>setRunning(true)}>Start</button>
        <button className="btn" onClick={onStop}>Stop</button>
      </div>
      <p className="small">Good: {score.good} • Avoided: {score.bad}</p>
    </div>
  )
}
