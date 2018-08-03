<template>

	<div>
		
		<accountant v-if="userType == 1" :templateList="templateList" style="margin-bottom: 16px;"></accountant>
		
		<company
		v-else-if="userType == 2"
		:invoiceID="invoiceID"
		:companyName="companyName"
		:accountantFormsData="accountantFormsData"
		:companyFormsData="companyFormsData"
		:companyDataList="companyDataList"
		style="margin-bottom: 16px;"
		>
		</company>
		
		<Card>
			
			<h1 slot="title">发票列表</h1>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="invoiceSE"
			>
			</list-component>
			
		</Card>
		
	</div>
	
</template>

<script>

import accountant from '@/components/invoice/accountant.vue';

import company from '@/components/invoice/company.vue';

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

let template = () => {//模板列表

	return new Promise(resolve => {

		axios.post('Service/Template/index', {
			user_id: sessionStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let templateShow = () => {//模板表单显示

	return new Promise(resolve => {

		axios.post('Service/Order/detail', {
			id: sessionStorage.getItem('params')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyList = () => {//公司列表

	return new Promise(resolve => {

		axios.post('Service/Company/index', {
			user_id: sessionStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
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
		listComponent,
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
        	
        	userType: sessionStorage.getItem('userType'),
        	
        	invoiceID: null,//发票id
        	
        	companyName: '',//会计公司名称
        	
        	accountantFormsData: [],//会计数据
        	
        	companyFormsData: [],//公司数据
        	
        	companyDataList: [],//公司列表
        	
        	tableColumns: [
                {
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'title'
                },
                {
                	align: 'center',
                	width: 130,
                    title: '操作',
                    handle: true,
                },
            ],
            
            tableData: [
            	{
            		id: 1,
            		title: '发票123',
            	}
            ],
        	
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
		
		let templateList = [];//模板列表
		
		let templateForms = [];//模板表单
		
		let companyDataList = [];//公司列表数据
		
		if(sessionStorage.getItem('userType') == 1){//会计
			
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
			
		}else if(sessionStorage.getItem('userType') == 2){//用户
			
			if(true){
				
				(async() => { //es7异步函数
				
					templateForms = await templateShow();
					
					companyDataList = await companyList();
				
					next(vm => {//回调
						
						if(templateForms){
							
							vm.invoiceID = templateForms.id;
							
							vm.companyName = templateForms.mixture.data.account.title;
						
							templateForms.conf.forEach(item => {
					
								if(item.user_type == 1){//会计
									vm.accountantFormsData.push(item);
								}
					
								if(item.user_type == 2){//公司
									vm.companyFormsData.push(item);
								}
					
							});
							
						}
						
						if(companyDataList){
							
							let arr = [];
							
							companyDataList.forEach(item => {
								
								arr.push({
									label: item.title,
									value: item.id,
								});
								
							})
							
							vm.companyDataList = arr;
							
						}
						
					})
				
				})();
				
			}else{
				
				next(vm => {
					
				});
				
			}
			
			
		}
		
	},
	
}
</script>

<style scoped>
</style>