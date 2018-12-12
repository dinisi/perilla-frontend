import katex from 'katex'
import zmark, { Renderer } from 'zmark'
import highlightjs from 'highlight.js'
import { client } from '../http'
import store from '../store'
import 'katex/dist/katex.css'
import '../assets/github.css'
import '../assets/github-markdown.css'

const renderer = new Renderer()

const resolveUrl = (base, href) => {
  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href
  } else {
    return base + href
  }
}

renderer.code = (code, language) => {
  const validLang = !!(language && highlightjs.getLanguage(language))
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

renderer.image = (href, title, text) => {
  if (href.startsWith('$')) {
    let id = href.substr(1)
    href = resolveUrl(client.defaults.baseURL, `/api/file/raw?id=${id}&entry=${store.state.entry}&access_token=${store.state.token}`)
  }
  let commands = (title || '').split(' ')
  title = []
  let iframe, width, height
  for (let command of commands) {
    if (command.startsWith('$')) {
      iframe |= command === '$iframe'
      if (command.startsWith('$width=')) width = command.substr(7)
      if (command.startsWith('$height=')) height = command.substr(8)
    } else {
      title.push(command)
    }
  }
  let out = iframe ? '<iframe' : '<img'
  out += ` src="${href}" alt="${text}"`
  if (width) out += ` width="${width}"`
  if (height) out += ` height="${height}"`
  if (title) out += ` title="${title.join(' ')}"`
  out += '/>'
  return out
}

zmark.setOptions({
  renderer: renderer,
  math: (text, display) => katex.renderToString(text, { displayMode: display })
})

export default function render (markdown) {
  try {
    let result = zmark(markdown || '# Nothing to shown')
    return result
  } catch (e) {
    return `<pre><code>${e.message}\nSource:\n${markdown}</code></pre>`
  }
}
