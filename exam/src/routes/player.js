export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      layout: "player",
      isPeserta: true
    },
    component: () => import('@/views/player/Home.vue')
  }
]