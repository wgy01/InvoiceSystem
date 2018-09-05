//vue框架
import Vue from 'vue'

//路由
import {router} from './router/index.js';

//状态管理
import store from './store/index.js'

//iviewUI组件
import iView from 'iview';

//iview主题样式

import 'iview/dist/styles/iview.css';//这是默认主题

import './main.less';//修改菜单色

//import '../static/my-theme/r.css';//这是主题工具生成的自定义主题

//import '../static/my-theme/index.less';//这是less的自定义主题（两者只能存在一个）

Vue.use(iView);//注册iviewUI组件

//打印插件
import Print from '../static/public/js/print.js'
Vue.use(Print);//注册打印插件

//ajax组件
import ajax from './ajax/ajax.js'
Vue.prototype.$axios = ajax;//挂载到Vue

//复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import iviewArea from 'iview-area';//地区四级联动插件
Vue.use(iviewArea);

//主组件
import App from './App'

//=============================================

//创建vue实例
new Vue({
  el: '#app',
  router,//路由
  store,//状态管理
 	render: h => h(App),//导入主组件App到根目录index.html
});

//=============================================

//全局自定义指令(按钮级的权限使用)
Vue.directive('globalDirective', {
  inserted: function (el,obj) {
  	
  	/*
  	 * 用法
  	 * <button v-globalDirective="[7,9,5,3]"></button>
  	*/
  	
  	let userPermissionsArr = JSON.parse(sessionStorage.getItem('access'));//获取用户权限
  	
  	let boole = userPermissionsArr.some((val,i,arr) => {//判断是否有对应的权限
  		
  		//obj传按钮的权限过来
			return obj.value.indexOf(arr[i]) >= 0;
			
		});
  	
  	if(!boole){//没有匹配的权限就执行
  		el.parentNode.removeChild(el);//模拟v-if不渲染出来
  	}
  	
  },
})

