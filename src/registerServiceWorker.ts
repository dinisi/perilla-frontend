import { register } from 'register-service-worker'
import { showToast } from './swal'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      showToast('info', 'sw', 'App is being served from cache by a service worker.')
    },
    cached () {
      showToast('info', 'sw', 'Content has been cached for offline use.')
    },
    updated () {
      showToast('info', 'sw', 'New content is available; please refresh.')
    },
    offline () {
      showToast('info', 'sw', 'No internet connection found. App is running in offline mode.')
    },
    error (error) {
      // eslint-disable-next-line
      console.error('Error during service worker registration:', error)
    }
  })
}
