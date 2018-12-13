import { register } from 'register-service-worker'
import store from './store'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      store.commit('updateMessage', 'App is being served from cache by a service worker.')
    },
    cached () {
      store.commit('updateMessage', 'Content has been cached for offline use.')
    },
    updated () {
      store.commit('updateMessage', 'New content is available; please refresh.')
    },
    offline () {
      store.commit('updateMessage', 'No internet connection found. App is running in offline mode.')
    },
    error (error) {
      // eslint-disable-next-line
      console.error('Error during service worker registration:', error)
    }
  })
}
