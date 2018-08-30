<template>
	
	<div style="width:100%;height:100%;position: relative;">
		
		<h1 v-show="!tf">页面不存在-404</h1>
		
		<Spin v-if="tf" fix>
            <Icon type="load-c" size=26 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
		
	</div>
		
</template>

<script>

import axios from 'axios';

import plant from '@/plant/index.js';//调用工厂

let templateShow = () => {//公司发票模板表单显示

	return new Promise(resolve => {

		axios.post('Service/Order/detail', {
			id: sessionStorage.getItem('params')
		})
		.then(response => {
			resolve(response.status);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

export default {
	components:{//组件模板
		
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
	},
    data () {//数据
        return {
        	
        	tf: false,
        	
        }
    },
    methods: {//方法
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
	//=================组件路由勾子==============================
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用
		
		let status = '';
		
		if(localStorage.getItem('userName') && sessionStorage.getItem('params') && localStorage.getItem('userType') == 2){//已登录并且是用户登录
			
			(async() => {
			
				status = await templateShow();
				
				next(vm => {
					
					vm.tf = true;
					
					if(status == 200){
						
						next({
							name: 'invoicePages'
						});
						
					}else{
						
						vm.tf = false;
						
						plant.title(to.meta.title);
						
						if(sessionStorage.getItem('params')){
							sessionStorage.removeItem('params');
						}
						
					}
					
				});
				
			})();
			
		}else{
			
			if(sessionStorage.getItem('params')){
				sessionStorage.removeItem('params');
			}
			
			next();
			
		}
		
	},
	beforeRouteUpdate (to, from, next) {// 在当前路由改变，但是该组件被复用时调用
		
		let status = '';
		
		if(localStorage.getItem('userName') && sessionStorage.getItem('params') && localStorage.getItem('userType') == 2){//已登录并且是用户登录

			this.tf = true;
			
			(async() => {
			
				status = await templateShow();
				
				if(status == 200){
					
					next({
						name: 'invoicePages'
					});
					
				}else{
					
					this.tf = false;
					
					plant.title(to.meta.title);
					
					if(sessionStorage.getItem('params')){
						sessionStorage.removeItem('params');
					}
					
				}
				
			})();
			
		}
		
		if(sessionStorage.getItem('params')){
			sessionStorage.removeItem('params');
		}
		
		next();
		
	},
	
}
</script>

<style scoped lang="less">
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>