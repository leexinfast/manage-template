import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/redirect',
        component: () => import('@/views/redirect/index'),
        hidden: true,
        meta: {
            title: '重定向'
        }
    },
    {
        path: '/redirecter',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirecter/:path*',
                component: () => import('@/views/redirecter/index')
            }
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'dashboard',
                meta: {title: '首页', icon: 'example'}
            }
        ]
    }
]

let router = new Router({
    base: '/',
    //mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
});

//动态获取title
router.beforeEach((to, from, next) => {
    let routeName = to.meta.title || to.title;
    window.document.title = (routeName ? routeName + ' - ' : '') + '优品出行支付宝生活号客户端后台';
    next();
})

export default router
