import {
  HOME_URL,
  LOGIN_URL
} from '@/config/config'
import {
  createRouter,
  createWebHistory
} from 'vue-router'
// 登录功能暂时关闭，下面守卫一起注释了，恢复时把这两个 import 解注释
// import { ROUTER_WHITE_LIST } from '@/config/config'
// import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //刷新时保留当前位置
  scrollBehavior: () => ({
    left: 0,
    top: 0
  }),
  routes: [{
      path: LOGIN_URL,
      component: () => import('@/views/login.vue'),
      meta: {
        title: '登录'
      },
    },
    {
      path: '/',
      component: () => import('@/layouts/index.vue'),
      // 打开 / 直接进首页，不然只渲染出布局框架、main 区是空的
      redirect: HOME_URL,
      children: [{
          path: '/index',
          component: () => import('@/views/home.vue'),
          meta: {
            title: '首页'
          },
        },
        {
          path: '/apartmentManagent/apartmentManagement',
          component: () => import('@/views/apartmentManagement/apartmentManagement.vue'),
          meta: {
            title: '公寓管理'
          },

        },
        {
          path: '/apartmentManagement/attributeManagement',
          component: () => import('@/views/apartmentManagement/attributeManagement.vue'),
          meta: {
            title: '属性管理'
          }

        },
        {
          path: '/apartmentManagement/roomManagement',
          component: () => import('@/views/apartmentManagement/roomManagement.vue'),
          meta: {
            title: '房间管理'
          }
        },
        {
          path: '/leaseManagement/agreementManagement',
          component: () => import('@/views/leaseManagement/agreementManagement.vue'),
          meta: {
            title: '租约管理'
          }
        },
        {
          path: '/leaseManagement/appointManagement',
          component: () => import('@/views/leaseManagement/appointmentManagement.vue'),
          meta: {
            title: '看房预约管理'
          }
        },
        {
          path: '/system/postManagement',
          component: () => import('@/views/system/post.vue'),
          meta: {
            title: '岗位管理'
          }
        },
        {
          path: '/system/staffsManagement',
          component: () => import('@/views/system/staffs.vue'),
          meta: {
            title: '员工管理'
          }
        },
        {
          path: '/userManagement',
          component: () => import('@/views/userManagement.vue'),
          meta: {
            title: '用户管理'
          }
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*', // ⭐ Vue Router 4 的 404 写法
      component: () => import('@/views/404.vue'),
      meta: {
        title: '404'
      },
    },
  ],
})
// ===== 登录校验暂时关闭，等登录页做好了把下面整段解注释，并恢复上方两个 import =====
// vue-router 5 已废弃 next 回调，改为直接 return 值
// router.beforeEach((to) => {
//   const userStore = useUserStore()
//   // 已登录，还去登录页 → 回首页
//   if (to.path === LOGIN_URL && userStore.token) {
//     return HOME_URL
//   }
//   // 白名单放行
//   if (ROUTER_WHITE_LIST.includes(to.path)) {
//     return true
//   }
//   // 没登录 → 踢回登录页，记住原路径
//   if (!userStore.token) {
//     return {
//       path: LOGIN_URL,
//       query: {
//         redirect: to.fullPath
//       }
//     }
//   }
//   return true
// })
export default router
