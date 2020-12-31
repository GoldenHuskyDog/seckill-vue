import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        redirect: {name: "Login"}
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            roles: ['admin', 'manager', 'user']
        }
    },
    {
        path: '/common',
        name: 'Common',
        component: () => import('../views/Common.vue'),
        meta: {
            requireAuth: true,
            roles: ['user']
        },
        children: [
            {
                path: '/seckill',
                name: 'Seckill',
                component: () => import ('../components/seckill/Seckill.vue'),
                meta: {
                    requireAuth: true,
                    roles: ['user']
                }
            },
            {
                path: '/seckillDetails',
                name: 'SeckillDetails',
                component: () => import ('../components/seckill/SeckillGood.vue'),
                meta: {
                    requireAuth: true,
                    roles: ['user']
                }
            }]
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            requireAuth: true,
            roles: ['admin', 'manager']
        },
        children: [
            {
                path: '/users',
                component: () =>
                    import ('../components/users/Users'),
                meta: {
                    requireAuth: true,
                    roles: ['admin']
                },
            },
            {
                path: '/roles',
                component: () =>
                    import ('../components/power/Roles'),
                meta: {
                    requireAuth: true,
                    roles: ['admin']
                }
            },
            {
                path: '/goods',
                component: () =>
                    import ('../components/goods/List.vue'),
                meta: {
                    requireAuth: true,
                    roles: ['admin', 'manager']
                }
            },
            {
                path: '/orders',
                component: () =>
                    import ('../components/order/Orders.vue'),
                meta: {
                    requireAuth: true,
                    roles: ['admin', 'manager']
                }
            }
        ],
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404'),
    },
    {
        path: "*",
        redirect: "/404"
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
