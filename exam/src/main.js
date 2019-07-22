import Vue from 'vue'
import App from '@/App.vue'
import router from '@/routes'
import store from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLodash from 'vue-lodash'
import VueCountdown from '@chenfengyuan/vue-countdown'
import '@/plugins/moment'
import '@/plugins/buefy'
import '@/plugins/wysiwyg'

import Dashboard from '@/views/layouts/Dashboard.vue'
import Landing from '@/views/layouts/Landing.vue'
import Player from '@/views/layouts/Player.vue'
import Focus from '@/views/layouts/Focus.vue'

Vue.component('dashboard-layout', Dashboard)
Vue.component('landing-layout', Landing)
Vue.component('player-layout', Player)
Vue.component('focus-layout', Focus)

Vue.component(VueCountdown.name, VueCountdown)

Vue.config.productionTip = false

Vue.use(VueLodash)

Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://192.168.2.151:8000'

const token = store.state.token

if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
