/*
 * 路由仓库
 * 放所有路由的地方
 */

import Frame from '@/views/frame/frame.vue';//主组件，用于加载侧边栏和右侧面包屑、标签栏、工具条、子页面路由视图等（框架）

//-----------第一种类型：该页面在整个浏览器区域展现，代表性的有登录页、404页等// 不作为Frame组件的子页面展示的页面单独写，如下：

export const loginRouter ={
	path: '/login',
    name: 'login',
    meta: {
        title: '系统-登录'//选填，index.html文件title标签显示的内容
    },
    component: resolve => { require(['@/views/login/login.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    name: 'error-403',
    meta: {
        title: '403-权限不足'
    },
    component: resolve => { require(['@/views/errorPage/error403.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/errorPage/error404.vue'], resolve); }
};

//--------第二种类型：该页面在Frame组件的子页面区域展示，但不在左侧菜单栏显示，代表性的有首页、消息中心等------

export const otherRouter = {
    path: '/',
    redirect: '/home', 
    name: 'otherRouter',
    component: Frame,
    children: [
        {
            path: 'home',
            title: '首页',
            name: 'home_index',//放在这里的路由要加上后缀名：_index
            component: resolve => { require(['@/views/home/home.vue'], resolve); }
        },
        {
            path: 'myCenter',
            title: '个人中心',
            name: 'myCenter_index',//放在这里的路由要加上后缀名：_index
            component: resolve => { require(['@/views/userPages/myCenter.vue'], resolve); }
        },
        {
            path: 'set',
            title: '设置',
            name: 'set_index',//放在这里的路由要加上后缀名：_index
            component: resolve => { require(['@/views/userPages/set.vue'], resolve); }
        },
    ]
};


//--------------第三种类型：该页面在Frame组件的子页面区域展示，且在左侧菜单栏显示，对应有两种情况-----------

//================书写范例==========================
//  {
//  	path:'/orderformAdmin', //必填
//      icon:'android-list', //图标 选填
//      name:'orderformAdmin', //必填
//		access: 0, //权限写入方式：单个： 1  或 [1] ， 多个：[1,2,3]
//      title:'订单管理', //必填，面包屑用到，左侧导航栏用到
//      component: Frame, //必填，主框架
//      children: [ //children里面只有一个对象就为一级菜单，否则为二级菜单
//	        {
//	            path:'addOrderform',
//	            name:'addOrderform',
//				access: 0, //权限写入方式：单个： 1  或 [1] ， 多个：[1,2,3]
//	            title:'新增订单',
//	            component: resolve => { require(['@/views/orderformAdmin/addOrderform.vue'], resolve); } //懒加载（按需加载）
//	        },
//          {
//              path:'orderformList',
//              name:'orderformList',
//				access: 0, //权限写入方式：单个： 1  或 [1] ， 多个：[1,2,3]
//              title:'订单列表',
//              component: resolve => { require(['@/views/orderformAdmin/orderformList.vue'], resolve); }
//          },
//      ]
//  },

//--------------------------------------------------------------------------------

export const appRouter = [
	{
    	path:'/pages',
        icon:'android-list',
        name:'pages',
        title:'页面管理',
        component: Frame,
        children: [
	        {
	            path:'page1',
	            name:'page1',
	            title:'页面一',
	            component: resolve => { require(['@/views/pages/page1.vue'], resolve); }
	        },
	        {
	            path:'page2',
	            name:'page2',
	            title:'页面一',
	            component: resolve => { require(['@/views/pages/page2.vue'], resolve); }
	        },
        ]
    },
	{
    	path:'/elsePages',
        icon:'android-list',
        name:'elsePages',
        title:'其他页面',
        component: Frame,
        children: [
	        {
	            path:'page',
	            name:'page',
	            title:'其他页面',
	            component: resolve => { require(['@/views/elsePages/page.vue'], resolve); }
	        },
        ]
    },
	{
    	path:'/test',
        icon:'android-list',
        name:'test',
        title:'测试',
        component: Frame,
        children: [
	        {
	            path:'testPages1',
	            name:'testPages1',
	            title:'测试页一',
	            component: resolve => { require(['@/views/test/testPages1.vue'], resolve); }
	        },
	        {
	            path:'testPages2',
	            name:'testPages2',
	            title:'测试页二',
	            component: resolve => { require(['@/views/test/testPages2.vue'], resolve); }
	        },
        ]
    },
];

// ---------------所有上面定义的路由都要写在下面的routers里---------

export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page403,
    page404//这个路由一定要在最后面（在他后面的路由都不会执行）
];