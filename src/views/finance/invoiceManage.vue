<template>

	<div>
		
		<accountant v-if="userType == 1" :templateList="templateList"></accountant>
		
		<company v-if="userType == 2" :remark="remark" :accountantFormsData="accountantFormsData" :companyFormsData="companyFormsData"></company>
		
	</div>
	
</template>

<script>

import accountant from '@/components/invoice/accountant.vue';

import company from '@/components/invoice/company.vue';

import axios from 'axios';

let template = () => {

	return new Promise(resolve => {

		axios.post('Service/Template/index', {
			user_id: sessionStorage.getItem('user_id')
		})
		.then(response => {
			if(response.status == 200){
				resolve(response.data);
			}
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let templateShow = (templateID) => {

	return new Promise(resolve => {

		axios.post('Service/Template/detail', {
			id: templateID
		})
		.then(response => {
			if(response.status == 200){
				resolve(response.data);
			}
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

export default {
	components:{//组件模板
		accountant,
		company,
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
        	
        	templateList: [],
        	
        	userType: sessionStorage.getItem('access'),
        	
        	accountantID: '',//会计ID
        	
        	templateID: '',//模板ID
        	
        	remark: '',//模板说明
        	
        	accountantFormsData: [],//会计数据
        	
        	companyFormsData: [],//公司数据
        	
        }
    },
    methods: {//方法
    	
    	ajax () {
    		
    		this.$axios.post('接口路径', {
    			
			})
			.then(response => {
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
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
		
		let templateList = [];
		
		let templateForms = [];
		
		if(sessionStorage.getItem('access') == 1){//会计
			
			(async() => { //es7异步函数
			
				templateList = await template();
				
				next(vm => {//回调
					
					templateList.forEach(item => {//模板数据
						vm.templateList.push({
							label: item.title,
							value: item.id,
							setting: item.setting,
							remark: item.remark,
						});
					});
					
				})
				
			})();
			
		}
		else if(sessionStorage.getItem('access') == 2){//用户
			
			(async() => { //es7异步函数
				
				templateForms = await templateShow(to.query.templateID);
				
				next(vm => {//回调
					
					vm.remark = templateForms.remark;
				
					templateForms.setting.forEach(item => {
					
						if(item.user_type == 1){//会计
							vm.accountantFormsData.push(item);
						}
					
						if(item.user_type == 2){//公司
							vm.companyFormsData.push(item);
						}
					
					});
					
					vm.accountantID = to.query.accountantID;
				
					vm.templateID = to.query.templateID;
					
				})
				
			})();
			
		}
		
	},
	
}
</script>

<style scoped>
</style>