export default [
  {
    path: '/peserta',
    name: 'peserta',
    meta: {
      layout: "dashboard"
    },
    component: () => import('@/views/dashboard/Peserta.vue')
  }
]