import Vue from 'vue'
import App from '@/App.vue'
import router from '@/routes'
import store from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLodash from 'vue-lodash'
import '@/plugins/moment'
import '@/plugins/buefy'
import '@/plugins/wysiwyg'

import Dashboard from '@/views/layouts/Dashboard.vue'
import Landing from '@/views/layouts/Landing.vue'
import Player from '@/views/layouts/Player.vue'

Vue.component('dashboard-layout', Dashboard)
Vue.component('landing-layout', Landing)
Vue.component('player-layout', Player)

Vue.config.productionTip = false

Vue.use(VueLodash)

Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://localhost:8000'

const token = localStorage.getItem('token')

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
