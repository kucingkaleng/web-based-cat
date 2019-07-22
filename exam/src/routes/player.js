export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      layout: "player",
      isPeserta: true
    },
    component: () => import('@/views/player/Home.vue')
  },
  {
    path: '/play/:examId',
    name: 'play',
    meta: {
      layout: "focus",
      isPeserta: true
    },
    component: () => import('@/views/player/Player.vue')
  },
  {
    path: '/score/:userId/:examId',
    name: 'score',
    meta: {
      layout: "focus",
      isPeserta: true
    },
    component: () => import('@/views/player/End.vue')
  }
]