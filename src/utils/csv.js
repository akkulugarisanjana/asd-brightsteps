export const exportCSV = (rows, filename='progress.csv') => {
  const header = Object.keys(rows[0] || {timestamp:'',domain:'',question:'',correct:'',responseTime:''})
  const csv = [header.join(',')].concat(
    rows.map(r => header.map(h => JSON.stringify(r[h] ?? '')).join(','))
  ).join('\n')
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
