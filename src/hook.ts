import store from './store'
import { updateCookie, getCookie } from './cookie'
import { setStorage, getStorage } from './storage'

let entry = getCookie('entry_inheritance')
if (entry && !getStorage(sessionStorage, 'entry')) setStorage(sessionStorage, 'entry', entry)

window.onmousedown = function (e: any) {
  if (e.button === 1 || e.button === 2) {
    let node = e.target
    while (node) {
      if (node.tagName === 'A') break
      node = node.parentElement
    }
    if (node && node.href) {
      updateCookie('entry_inheritance', store.state.entry, 5 * 1000) // 5s
    }
  }
}
