import Vue from 'vue'
import store from '@/store.js'
import Router from 'vue-router'

import baseRoutes from './base'
import pesertaRoutes from './peserta'
import ujianRoutes from './ujian'
import bankRoutes from './bank'
import playerRoutes from './player'

Vue.use(Router)

let routes = []

routes = routes.concat(baseRoutes)
routes = routes.concat(pesertaRoutes)
routes = routes.concat(ujianRoutes)
routes = routes.concat(bankRoutes)
routes = routes.concat(playerRoutes)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  /**
   * Middleware for guest
   */
  if (to.matched.some(record => record.meta.isGuest)) {
    if (await store.getters.isLoggedIn && await store.getters.isPeserta) {
      next('/home')
      return
    }
    else if (await store.getters.isLoggedIn && await store.getters.isAdmin) {
      next('/dashboard')
      return
    }
    else {
      next()      
    }
  }
  /**
   * Route middleware for Admin
   */
  else if (to.matched.some(record => record.meta.isAdmin)) {
    if (await store.getters.isLoggedIn && await store.getters.isAdmin) {
      next()
      return
    }
    else {
      next('/err')
    }
  }
  /**
   * Route middleware for peserta
   */
  else if (to.matched.some(record => record.meta.isPeserta)) {
    if (await store.getters.isLoggedIn && await store.getters.isPeserta) {
      next()
      return
    }
    else {
      next('/err')
    }
  }
  else {
    next()
  }
})

export default router