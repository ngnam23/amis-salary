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
          path: 'salary-composition',
          name: 'salary-composition',
          component: () => import('@/views/salary-composition/SalaryComposition.vue'),
        },
        {
          path: 'salary-composition/system-category',
          name: 'system-category',
          component: () => import('@/views/system-category/SystemCategory.vue'),
        },
      ],
    },
  ],
})

export default router
