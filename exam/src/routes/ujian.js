export default [
  {
    path: '/ujian',
    name: 'ujian',
    meta: {
      layout: "dashboard",
      requiresAuth: true
    },
    component: () => import('@/views/dashboard/ujian/Ujian.vue')
  },
  {
    path: '/ujian/:id',
    meta: {
      layout: "dashboard",
      requiresAuth: true
    },
    component: () => import('@/views/dashboard/ujian/UjianById.vue')
  }
]