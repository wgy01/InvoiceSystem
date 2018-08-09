<template>
	
	<div style="width:100%;height:100%;position: relative;">
		
		<h1 v-show="!tf">页面不存在-404</h1>
		
		<Spin fix v-if="tf">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
		
	</div>
		
</template>

<script>

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
		
		let tf = false;
		
		if(localStorage.getItem('userName') && sessionStorage.getItem('params') && localStorage.getItem('userType') == 2){//已登录并且是公司类型
			
			tf = true;
			
		}else{//未登录
			
		}
		
		next(vm => {
			
			vm.tf = tf;
			
			if(tf){
				
				next({
					name: 'invoicePages'
				});
				
			}
			
		});
		
	},
	
}
</script>

<style scoped lang="less">
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>