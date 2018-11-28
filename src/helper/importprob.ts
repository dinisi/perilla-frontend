export const convertBZOJ = (text: string) => {
  let tokens = text.split('\n')
  while (tokens.length && !tokens[0].startsWith('Notice')) tokens.shift()
  tokens.length && tokens.shift()
  let suffix = null
  let header = tokens[0].trim()
  let id = parseInt(header.substring(0, header.indexOf(':')))
  let title = header.substr(5).trim()
  let content = ''
  for (let i = 4; i < tokens.length; i++) {
    let line = tokens[i]
    if (!line.trim().length) continue
    if (line === '[Submit][Status][Discuss]') break
    if (['DESCRIPTION', 'INPUT', 'OUTPUT', 'SAMPLE INPUT', 'SAMPLE OUTPUT', 'HINT', 'SOURCE'].includes(line.trim().toUpperCase())) {
      if (suffix) content += suffix
      content += '### ' + line + '\n'
      if (line === 'Sample Input' || line === 'Sample Output') {
        content += '```\n'
        suffix = '```\n'
      } else {
        suffix = null
      }
    } else {
      content += line + '\n'
    }
  }
  if (suffix) content += suffix
  content += '> ' + tokens[1] + '\n'
  return { id, title, content }
}

export const convertPOJ = (text: string) => {
  let tokens = text.split('\n')
  while (tokens.length && tokens[0] !== 'Language:') tokens.shift()
  tokens.length && tokens.shift()
  let suffix = null
  let title = tokens[0].trim()
  let content = ''
  for (let i = 3; i < tokens.length; i++) {
    let line = tokens[i]
    if (!line.trim().length) continue
    if (line === '[Submit]   [Go Back]   [Status]   [Discuss]') break
    if (['DESCRIPTION', 'INPUT', 'OUTPUT', 'SAMPLE INPUT', 'SAMPLE OUTPUT', 'HINT', 'SOURCE'].includes(line.trim().toUpperCase())) {
      if (suffix) content += suffix
      content += '### ' + line + '\n'
      if (line === 'Sample Input' || line === 'Sample Output') {
        content += '```\n'
        suffix = '```\n'
      } else {
        suffix = null
      }
    } else {
      content += line + '\n'
    }
  }
  if (suffix) content += suffix
  content += '> ' + tokens[1] + '\n'
  return { title, content }
}
