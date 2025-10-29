export const loadSettings = () => {
  try{ return JSON.parse(localStorage.getItem('settings')) || {
    confetti: true, adaptive: true, sound: true, muted: false, volume: 0.7, lowSensory:false
  }}catch{ return { confetti:true, adaptive:true, sound:true, muted:false, volume:0.7, lowSensory:false } }
}

export const saveSettings = (s) => {
  localStorage.setItem('settings', JSON.stringify(s))
  try { window.dispatchEvent(new Event('settings-updated')) } catch {}
}

export const loadProgress = () => {
  try{ return JSON.parse(localStorage.getItem('progress')) || {
    history: [], // {ts, domain, id, correct, rt}
  }}catch{ return { history: [] } }
}

export const pushEvent = (evt) => {
  const p = loadProgress()
  p.history.push(evt)
  localStorage.setItem('progress', JSON.stringify(p))
  try { window.dispatchEvent(new Event('progress-updated')) } catch {}
}

export const clearProgress = () => {
  localStorage.removeItem('progress')
  try { window.dispatchEvent(new Event('progress-updated')) } catch {}
}


export const loadSnapshots = () => {
  try{ return JSON.parse(localStorage.getItem('progress_snapshots')) || [] }catch{ return [] }
}

export const saveSnapshot = (snapshot) => {
  const all = loadSnapshots()
  all.push(snapshot)
  localStorage.setItem('progress_snapshots', JSON.stringify(all))
  try { window.dispatchEvent(new Event('progress-updated')) } catch {}
}

export const exportJSON = (obj, filename='progress.json') => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}


export const setSnapshots = (arr) => {
  localStorage.setItem('progress_snapshots', JSON.stringify(arr || []))
  try { window.dispatchEvent(new Event('progress-updated')) } catch {}
}

export const deleteSnapshot = (index) => {
  const all = loadSnapshots()
  all.splice(index, 1)
  setSnapshots(all)
}

export const restoreProgressFromSnapshot = (snapshot) => {
  if(!snapshot || !snapshot.history) return
  const p = { history: snapshot.history }
  localStorage.setItem('progress', JSON.stringify(p))
  try { window.dispatchEvent(new Event('progress-updated')) } catch {}
}
