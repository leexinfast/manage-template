import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
const _import = require('./router/_import.js')
import Layout from './views/layout/Layout'
import {getRouters} from '@/api/login'
import {Message} from 'element-ui'

NProgress.configure({showSpinner: false})// NProgress Configuration

const whiteList = ['/redirect', '/login']//定义不需要登录的路由白名单
var getRouter
//路由统一拦截
router.beforeEach((to, from, next) => {
    NProgress.start()
    // localStorage.setItem('token', '20190902103932917954970258871788');
    const token = localStorage.getItem('token');
    if (token) {//是否有token
        if (whiteList.indexOf(to.path) !== -1) {//有token且白名单
            next({path: '/'})
            NProgress.done()
        } else {
            if (!getRouter) {
                if (!getObjArr('router')) {
                    //后台请求getrouters
                    getRouters().then(res => {
                        //默认动态添加404
                        let addArry = [
                            {
                                component:'Layout',
                                path: '*',
                                hidden:true,
                                children:[
                                    {
                                        path: '*',
                                        component: 'errorPage/404',
                                        name: '404',
                                        meta: { title: '404' }
                                    }
                                ]
                            }
                        ]
                        if(res && res.menu){
                            getRouter = res.menu;//后台拿到路由
                            getRouter = getRouter.concat(addArry)
                            routerGo(to, next, getRouter) //渲染菜单
                        }else{
                            getRouter = [];
                            getRouter = getRouter.concat(addArry);
                            routerGo(to, next, getRouter) //渲染菜单
                        }
                    }).catch(err => {
                        console.log(err)
                        next(`/login`)
                    })

                    // let addArry = [
                    //     {
                    //         component: 'Layout',
                    //         path: '/agent',
                    //         redirect: '/agent/agent-list',
                    //         children: [
                    //             {
                    //                 path: 'agent-list',
                    //                 component: 'agent/agent-list',
                    //                 name: 'agent-list',
                    //                 meta: {title: '经销商管理', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/capital',
                    //         redirect: '/capital/capital-list',
                    //         children: [
                    //             {
                    //                 path: 'capital-list',
                    //                 component: 'capital/capital-list',
                    //                 name: 'capital-list',
                    //                 meta: {title: '资方管理', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/brand',
                    //         redirect: '/brand/brand-list',
                    //         children: [
                    //             {
                    //                 path: 'brand-list',
                    //                 component: 'brand/brand-list',
                    //                 name: 'brand-list',
                    //                 meta: {title: '品牌管理', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/area',
                    //         redirect: '/area/area-list',
                    //         children: [
                    //             {
                    //                 path: 'area-list',
                    //                 component: 'area/area-list',
                    //                 name: 'area-list',
                    //                 meta: {title: '区域管理', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/banner',
                    //         redirect: '/banner/banner-list',
                    //         meta:{title:'广告管理',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'banner-list',
                    //                 component: 'banner/banner-list',
                    //                 name: 'banner-list',
                    //                 meta: {title: '广告管理'}
                    //             },
                    //             {
                    //                 path: 'banner-detail',
                    //                 component: 'banner/banner-detail',
                    //                 name: 'banner-detail',
                    //                 hidden:true,
                    //                 meta: {title: '广告管理详情'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/recommend',
                    //         redirect: '/recommend/recommend-list',
                    //         children: [
                    //             {
                    //                 path: 'recommend-list',
                    //                 component: 'recommend/recommend-list',
                    //                 name: 'recommend-list',
                    //                 meta: {title: '经销商推荐', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/loan',
                    //         redirect: '/loan/firstInstance-list',
                    //         meta: {title: '业务审核',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'firstInstance-list',
                    //                 component: 'loan/firstInstance-list',
                    //                 name: 'firstInstance-list',
                    //                 meta: {title: '一审列表'}
                    //             },
                    //             {
                    //                 path: 'firstInstance-detail',
                    //                 component: 'loan/firstInstance-detail',
                    //                 name: 'firstInstance-detail',
                    //                 meta: {title: '一审详情'},
                    //                 hidden:true
                    //             },
                    //             {
                    //                 path: 'secondInstance-list',
                    //                 component: 'loan/secondInstance-list',
                    //                 name: 'secondInstance-list',
                    //                 meta: {title: '二审列表'}
                    //             },
                    //             {
                    //                 path: 'secondInstance-detail',
                    //                 component: 'loan/secondInstance-detail',
                    //                 name: 'secondInstance-detail',
                    //                 meta: {title: '二审详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/car',
                    //         redirect: '/car/car-list',
                    //         meta: {title: '车辆信息',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'car-list',
                    //                 component: 'car/car-list',
                    //                 name: 'car-list',
                    //                 meta: {title: '车辆信息'}
                    //             },
                    //             {
                    //                 path: 'car-detail',
                    //                 component: 'car/car-detail',
                    //                 name: 'car-detail',
                    //                 meta: {title: '车辆信息详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/cert',
                    //         redirect: '/cert/cert-list',
                    //         meta: {title: '牌证信息',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'cert-list',
                    //                 component: 'cert/cert-list',
                    //                 name: 'cert-list',
                    //                 meta: {title: '牌证信息'}
                    //             },
                    //             {
                    //                 path: 'cert-detail',
                    //                 component: 'cert/cert-detail',
                    //                 name: 'cert-detail',
                    //                 meta: {title: '牌证信息详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/mortgage',
                    //         redirect: '/mortgage/mortgage-list',
                    //         meta: {title: '抵押信息',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'mortgage-list',
                    //                 component: 'mortgage/mortgage-list',
                    //                 name: 'mortgage-list',
                    //                 meta: {title: '抵押信息'}
                    //             },
                    //             {
                    //                 path: 'mortgage-detail',
                    //                 component: 'mortgage/mortgage-detail',
                    //                 name: 'mortgage-detail',
                    //                 meta: {title: '抵押信息详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/insurance',
                    //         redirect: '/insurance/insurance-list',
                    //         meta: {title: '保险信息',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'insurance-list',
                    //                 component: 'insurance/insurance-list',
                    //                 name: 'insurance-list',
                    //                 meta: {title: '保险信息'}
                    //             },
                    //             {
                    //                 path: 'insurance-detail',
                    //                 component: 'insurance/insurance-detail',
                    //                 name: 'insurance-detail',
                    //                 meta: {title: '保险信息详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/material',
                    //         redirect: '/material/material-list',
                    //         meta: {title: '资料审批',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'material-list',
                    //                 component: 'material/material-list',
                    //                 name: 'material-list',
                    //                 meta: {title: '资料审批'}
                    //             },
                    //             {
                    //                 path: 'material-detail',
                    //                 component: 'material/material-detail',
                    //                 name: 'material-detail',
                    //                 meta: {title: '资料审批详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/archives',
                    //         redirect: '/archives/archives-list',
                    //         meta: {title: '归档审核',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'archives-list',
                    //                 component: 'archives/archives-list',
                    //                 name: 'archives-list',
                    //                 meta: {title: '归档审核'}
                    //             },
                    //             {
                    //                 path: 'archives-detail',
                    //                 component: 'archives/archives-detail',
                    //                 name: 'archives-detail',
                    //                 meta: {title: '归档审核详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/financial',
                    //         redirect: '/financial/financial-list',
                    //         meta: {title: '财务审批',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'financial-list',
                    //                 component: 'financial/financial-list',
                    //                 name: 'financial-list',
                    //                 meta: {title: '财务审批'}
                    //             },
                    //             {
                    //                 path: 'financial-detail',
                    //                 component: 'financial/financial-detail',
                    //                 name: 'financial-detail',
                    //                 meta: {title: '财务审批详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/payment',
                    //         redirect: '/payment/payment-list',
                    //         meta: {title: '财务付款',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'payment-list',
                    //                 component: 'payment/payment-list',
                    //                 name: 'payment-list',
                    //                 meta: {title: '财务付款'}
                    //             },
                    //             {
                    //                 path: 'payment-detail',
                    //                 component: 'payment/payment-detail',
                    //                 name: 'payment-detail',
                    //                 meta: {title: '财务付款详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/after',
                    //         redirect: '/after/after-list',
                    //         meta: {title: '放款信息',icon:'example'},
                    //         children: [
                    //             {
                    //                 path: 'after-list',
                    //                 component: 'after/after-list',
                    //                 name: 'after-list',
                    //                 meta: {title: '放款信息'}
                    //             },
                    //             {
                    //                 path: 'after-detail',
                    //                 component: 'after/after-detail',
                    //                 name: 'after-detail',
                    //                 meta: {title: '放款信息详情'},
                    //                 hidden:true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '/system',
                    //         redirect: '/system/system-config',
                    //         children: [
                    //             {
                    //                 path: 'system-config',
                    //                 component: 'system/system-config',
                    //                 name: 'system-config',
                    //                 meta: {title: '系统配置', icon: 'example'}
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         component: 'Layout',
                    //         path: '*',
                    //         hidden: true,
                    //         children: [
                    //             {
                    //                 path: '*',
                    //                 component: 'errorPage/404',
                    //                 name: '404',
                    //                 meta: {title: '404'}
                    //             }
                    //         ]
                    //     }
                    // ]
                    // getRouter = getRouter.concat(addArry)
                    // routerGo(to, next, addArry) //渲染菜单
                } else {
                    getRouter = getObjArr('router')//拿到路由 直接渲染
                    routerGo(to, next, getRouter)
                }
            } else {
                next()
            }
        }
    } else {//没有token
        if (whiteList.indexOf(to.path) !== -1) {//不需要登录白名单直接next
            next()
        } else {//需要登录的统一重定向login
            next(`/login`)
        }
    }
})

function getObjArr(name) {  //localStorage 获取数组对象的方法
    // return JSON.parse(window.localStorage.getItem(name))
    let routers = store.getters.addRouters;
    if (routers.length <= 0) {
        return false
    }
    return store.getters.addRouters
}

function routerGo(to, next, name) {
    name = filterAsyncRouter(name)//过滤路由
    store.dispatch('GenerateRoutes', name).then(() => {
        router.addRoutes(store.getters.addRouters) // 动态添加路由表
        next({...to, replace: true})
    })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
    localStorage.setItem(name, JSON.stringify(data))

}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === 'Layout') {//Layout组件特殊处理
                route.component = Layout
            } else {
                route.component = _import(route.component)
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
