import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
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
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard'),
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
        },
      },
    ],
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/application',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/application'),
        name: 'ApplicationList',
        meta: {
          title: 'Application',
          icon: 'component',
        },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/user'),
        name: 'UserList',
        meta: {
          title: 'User',
          icon: 'user',
          // roles: ['admin'], // or you can only set roles in sub nav
        },
      },
    ],
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/role'),
        name: 'RoleList',
        meta: {
          title: 'Role',
          icon: 'role',
          // roles: ['admin'], // or you can only set roles in sub nav
        },
      },
    ],
  },

  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/permission'),
        name: 'PermissionList',
        meta: {
          title: 'Permission',
          icon: 'permission',
          // roles: ['admin'], // or you can only set roles in sub nav
        },
      },
    ],
  },
  {
    path: '/resource',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/resource'),
        name: 'ResourceList',
        meta: {
          title: 'Resource',
          icon: 'resource',
          // roles: ['admin'], // or you can only set roles in sub nav
        },
      },
    ],
  },
  {
    path: '/log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/log'),
        name: 'Log',
        meta: {
          title: 'log',
          icon: 'log',
          // roles: ['admin'], // or you can only set roles in sub nav
        },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const routes = constantRoutes.concat(asyncRoutes)

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes,
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router