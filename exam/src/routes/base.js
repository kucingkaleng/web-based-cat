export default [
  {
    path: '/',
    name: 'welcome',
    meta: {
      isGuest: true
    },
    component: () => import('@/views/Welcome.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    meta: {
      isGuest: true
    },
    component: () => import('@/views/Welcome.vue')
  },
  {
    path: '/err',
    name: 'err',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      layout: "dashboard",
      isAdmin: true
    },
    component: () => import('@/views/dashboard/Home.vue')
  }
]