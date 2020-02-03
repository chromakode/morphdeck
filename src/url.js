export function parseHash() {
  const parts = location.hash.substr(1).split('/')

  let mode
  if (parts.length === 2 || parts[0] === 'speaker') {
    mode = parts.shift()
  }

  let idx
  if (parts.length) {
    idx = Number(parts[0])
  }

  if (idx === 0 || idx === undefined || Number.isNaN(idx)) {
    idx = 1
  }

  return {idx, mode}
}

export function serializeHash({idx, mode}) {
  const parts = []

  if (mode) {
    parts.push(mode)
  }

  parts.push(idx)
  
  return parts.join('/')
}
