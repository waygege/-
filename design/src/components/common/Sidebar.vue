<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统管理',
                    subs: [
                        {
                            index: 'account-table',
                            title: '账号管理'
                        },

                    ]
                },
                /*{
                    icon: 'el-icon-lx-cascades',
                    index: 'context',
                    title: '内容管理',
                    subs: [

                        {
                            index: 'article-table',
                            title: '文章管理'
                        },
                    ]
                },*/
               /* {
                    icon: 'el-icon-lx-copy',
                    index: 'communication',
                    title: '互动管理',
                    subs: [
                        {
                            index: 'avatar-up',
                            title: '自动回复管理'
                        },
                    ]
                },*/
                {
                    icon: 'el-icon-lx-calendar',
                    index: 'activity',
                    title: '活动管理',
                    subs: [

                        {
                            index: 'coupons-table',
                            title: '优惠券管理'
                        },
                        {
                            index: 'banner-table',
                            title: '广告管理'
                        },
                       /* {
                            index: 'coupons-give-manage',
                            title: '优惠券赠送'
                        },*/

                    ]
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: 'dish',
                    title: '菜品管理',
                    subs: [
                        {
                            index: 'category-table',
                            title: '菜品分类管理'
                        },
                        {
                            index: 'dish-table',
                            title: '菜品管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'transation',
                    title: '交易管理',
                    subs: [
                      /*  {
                            index: 'integral-transation-manage',
                            title: '积分交易管理'
                        },*/
                        {
                            index: 'transationAmount-table',
                            title: '消费记录管理'
                        },
                    ]

                },
                /*{
                    icon: 'el-icon-rank',
                    index: 'integral',
                    title: '积分管理',
                    subs: [

                        {
                            index: 'member-integral-manage',
                            title: '会员积分管理'
                        }
                    ]
                },*/

                {
                    icon: 'el-icon-lx-warn',
                    index: 'evaluate',
                    title: '评价管理',
                    subs: [
                        {
                            index: 'evaluate-table',
                            title: '评价管理'
                        },
                       /* {
                            index: 'evaluate-template-manage',
                            title: '评价模板管理'
                        }*/
                    ]
                },

            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
