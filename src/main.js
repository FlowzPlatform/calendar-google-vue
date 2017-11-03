// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './style/style.css'

import { store } from './vuex'

Vue.config.productionTip = false
Vue.use(require('vue-full-calendar'))
window.jQuery = window.$ = require('jquery')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
