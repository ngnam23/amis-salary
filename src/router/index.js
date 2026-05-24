import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layouts/TheLayout.vue'),
      children: [
        {
          path: 'salarycomposition',
          name: 'salarycomposition',
          component: () => import('@/views/salary-composition/Index.vue'),
        },
      ],
    },
  ],
})

export default router
