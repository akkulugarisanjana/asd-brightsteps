import React, { useEffect, useMemo, useState } from 'react'
import { loadProgress, clearProgress, saveSnapshot, exportJSON, loadSnapshots, deleteSnapshot, setSnapshots, restoreProgressFromSnapshot } from '../utils/storage'
import { exportCSV } from '../utils/csv'

function safeLoad(){
  try{
    const p = loadProgress()
    if(!p || !Array.isArray(p.history)) return { history: [] }
    return p
  }catch{
    return { history: [] }
  }
}

function summarize(history){
  if(!Array.isArray(history)) return []
  const byDomain = {}
  for(const h of history){
    if(!h || typeof h !== 'object') continue
    const d = String(h.domain || 'General')
    byDomain[d] = byDomain[d] || {n:0, correct:0, rt:[]}
    byDomain[d].n++
    if(h.correct) byDomain[d].correct++
    if(typeof h.rt === 'number') byDomain[d].rt.push(h.rt)
  }
  const rows = []
  for(const [domain, v] of Object.entries(byDomain)){
    const acc = v.n ? Math.round(100 * v.correct / v.n) : 0
    const avgRt = v.rt.length ? (v.rt.reduce((a,b)=>a+b,0)/v.rt.length/1000).toFixed(2) : '0.00'
    rows.push({domain, attempts:v.n, accuracy:acc, avgResponseSec:avgRt})
  }
  return rows
}

export default function ProgressPanel(){
  const [progress, setProgress] = useState(safeLoad())
  const [snapshots, setLocalSnapshots] = useState(loadSnapshots())
  const refreshSnapshots = ()=> setLocalSnapshots(loadSnapshots())

  useEffect(()=>{
    const onUpdate = ()=> { setProgress(safeLoad()); refreshSnapshots() }
    window.addEventListener('progress-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return ()=>{
      window.removeEventListener('progress-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  },[])

  const rows = useMemo(()=> summarize(progress.history), [progress])
  const latest20 = (Array.isArray(progress.history) ? progress.history : []).slice(-20).map(h=>({
    timestamp: h?.ts ? new Date(h.ts).toISOString() : '',
    domain: h?.domain ?? '',
    question: h?.id ?? '',
    correct: h?.correct ? 1 : 0,
    responseTime: typeof h?.rt === 'number' ? h.rt : ''
  }))

  const overallAcc = rows.length ? (rows.reduce((a,b)=>a+b.accuracy,0) / rows.length) : 0

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:'8px 0'}}>Progress</h3>
        <div className="buttons">
          <button className="btn" onClick={()=> latest20.length ? exportCSV(latest20) : null} disabled={!latest20.length}>Share CSV</button>
          <button className="btn print-btn" onClick={()=>window.print()} disabled={!rows.length}>Print</button>
          <button className="btn" onClick={()=> exportJSON({generatedAt:new Date().toISOString(), rows, latest20})} disabled={!rows.length}>Export JSON</button>
          <button className="btn" onClick={()=>{ saveSnapshot({savedAt:new Date().toISOString(), rows, latest20, history: (Array.isArray(progress.history)?progress.history:[]) }); refreshSnapshots(); alert('Snapshot saved.'); }} disabled={!rows.length}>Save Snapshot</button>
          <button className="btn ghost" onClick={()=> setProgress(safeLoad())}>Refresh</button>
          <button className="btn warn" onClick={()=>{ clearProgress(); setProgress(safeLoad()) }}>Reset</button>
        </div>
      </div>

      <div className="progressbar" aria-label="overall accuracy">
        <div style={{width:`${overallAcc||0}%`}}/>
      </div>
      <p className="small">Overall accuracy: {isNaN(overallAcc)?0:overallAcc.toFixed(0)}%</p>
      <hr/>
      <div className="print-only" style={{marginBottom:12}}>
        <h2 style={{margin:'4px 0'}}>BrightSteps Progress Report</h2>
        <p className="small">Printed: {new Date().toLocaleString()}</p>
      </div>

      {rows.length===0 && <p className="small">No attempts yet. Try a few activities to see your progress here.</p>}
      {rows.map((r,i)=>(
        <div key={i} style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <strong>{r.domain}</strong>
            <span className="small">{r.accuracy}% • {r.attempts} tries • {r.avgResponseSec}s</span>
          </div>
          <div className="progressbar"><div style={{width:`${r.accuracy}%`}}/></div>
        </div>
      ))}
      <hr/>
      <h4 style={{margin:'6px 0'}}>Snapshot History</h4>
      {(!snapshots || snapshots.length===0) && <p className="small">No snapshots yet. Use <strong>Save Snapshot</strong> to store a copy of your current progress.</p>}
      {snapshots && snapshots.length>0 && (
        <div>
          {snapshots.map((s, i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(2,6,23,0.06)'}}>
              <div>
                <div><strong>{new Date(s.savedAt || Date.now()).toLocaleString()}</strong></div>
                <div className="small">{(s.rows?.length||0)} categories • {(s.history?.length||0)} events saved</div>
              </div>
              <div className="buttons">
                <button className="btn" onClick={()=> exportJSON(s, `snapshot_${i+1}.json`)}>View / Download</button>
                <button className="btn ghost" onClick={()=> { restoreProgressFromSnapshot(s); setProgress(safeLoad()); }}>Restore</button>
                <button className="btn warn" onClick={()=> { deleteSnapshot(i); refreshSnapshots() }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
