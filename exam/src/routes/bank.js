export default [
  {
    path: '/bank',
    name: 'bank',
    meta: {
      layout: "dashboard",
      isAdmin: true
    },
    component: () => import('@/views/dashboard/bank/Bank.vue')
  }
]