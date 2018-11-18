import Vue from 'vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './registerServiceWorker'
import './http'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import Vuetify from 'vuetify'
import './styles/vuetify.styl'
import './styles/main.styl'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueI18n)
function loadLocaleMessages (): LocaleMessages {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}
const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
