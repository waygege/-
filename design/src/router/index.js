import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/account-table'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/account-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/system/account/AccountTable.vue'),
                    meta: { title: '用户表格' }
                },
                {
                    path: '/banner-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/content/banner/BannerTable.vue'),
                    meta: { title: 'banner表格' }
                },
                {
                    path: '/article-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/content/acticle/ArticleTable.vue'),
                    meta: { title: '文章表格' }
                },
                {
                    path: '/activity-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/activity/activity.vue'),
                    meta: { title: '活动表格' }
                },
                {
                    path: '/coupons-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/activity/Coupons.vue'),
                    meta: { title: '优惠券表格' }
                },

                {
                    path: '/category-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/dish/Category.vue'),
                    meta: { title: '分类表格' }
                },

                {
                    path: '/dish-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/dish/Dish.vue'),
                    meta: { title: '菜品表格' }
                },

                {
                    path: '/transationAmount-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/Transation/TransationAmount.vue'),
                    meta: { title: '交易记录表格' }
                },

                {
                    path: '/evaluate-table',
                    component: () => import(/* webpackChunkName: "account-table" */ '../components/Evaluate/Evaluate.vue'),
                    meta: { title: '评价记录表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
