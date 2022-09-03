import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/home/index'),
        meta: { title: '数据报表', icon: 'el-icon-data-analysis' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/case/index',
    name: 'CaseIndex',
    meta: { title: '数据工厂', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'case/index',
        name: 'CaseIndex',
        component: () => import('@/views/cases/index'),
        meta: { title: '场景列表', icon: 'el-icon-s-order', affix: true }
      },
      {
        path: 'case/log',
        name: 'CaseLog',
        component: () => import('@/views/log/index'),
        meta: { title: '运行日志', icon: 'el-icon-reading' }
      },
      {
        path: 'case/detail/:id',
        name: 'CaseDetail',
        component: () => import('@/views/cases/detail'),
        hidden: true,
        // 动态设置页面标题, 设置title为函数
        meta: { title: query => { return query.title }, icon: '' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '管理中心', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'project',
        name: 'project',
        component: () => import('@/views/project/index'),
        meta: { title: '项目管理', icon: 'el-icon-folder' }
      },
      {
        path: 'project/:id',
        name: 'projectDetail',
        component: () => import('@/views/project/detail'),
        hidden: true,
        // 想要刷新，meta 配置 noCache: true
        meta: { title: '项目详情', icon: 'el-icon-folder' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
