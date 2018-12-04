import Vue from 'vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './registerServiceWorker'
import './http'
import Vuetify from 'vuetify'
import './styles/vuetify.styl'
import './styles/main.styl'
import App from './App.vue'
import './hook'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    t: (key: any, ...params: any) => i18n.t(key, params)
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
