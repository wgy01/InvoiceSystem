<template>

	<div>
		
		<Card shadow style="margin-bottom:4px;">
			<Button type="primary" @click="modal = true;">创建模板</Button>
		</Card>
		
		<Modal v-model="modal" width="80%">
			
	        <p slot="header">创建模板</p>
	        
	        <div>
	        	
	        	<add-template
				:companyDefault="companyDefault"
				:accountantDefault="accountantDefault"
				>
				</add-template>
	        	
	        </div>
	        
	        <div slot="footer">
	        	<Button @click="modal = false;">关闭</Button>
	        </div>
	        
	    </Modal>
		
		<Card>
			
			<h1 slot="title">模板列表</h1>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="templateSE"
			>
			</list-component>
			
		</Card>
			
	</div>
	
</template>

<script>

import addTemplate from '@/components/template/add-template.vue';//创建模板

import listComponent from '@/components/list-component.vue';//模板列表

import axios from 'axios';

let ajax = () => {

	return new Promise(resolve => {

		axios.post('Service/Template/index', {
			user_id: localStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let getDefaultForms = () => {

	return new Promise(resolve => {

		axios.post('Service/ModelField/index', {
			
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
		addTemplate,
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
        	
        	modal: false,
        	
        	companyDefault: [],//默认表单数据
        	
        	accountantDefault: [],//默认表单数据
        	
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
                    title: '模板说明',
                    key: 'remark'
                },
                {
                	align: 'center',
                	width: 130,
                    title: '操作',
                    handle: ['edit','show'],
                },
            ],
            
            tableData: [],
        	
        }
    },
    methods: {//方法
    	
    	updateData(){//更新表格数据
    		
    		let formsData = [];
		
			let company = [];
			
			let accountant = [];
    		
			(async() => { //es7异步函数
			
				this.tableData = await ajax();
				
				formsData = await getDefaultForms();
				
				formsData.forEach(item => {
					
					if(item.is_base == 0){
						
						if(item.user_type == 1){
							
							accountant.push(item);
							
						}else if(item.user_type == 2){
							
							company.push(item);
							
						}
						
					}
					
				});
				
				this.companyDefault = company;
        	
        		this.accountantDefault = accountant;
				
			})();
			
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
		
		let tableData = [];//模板列表
		
		let formsData = [];
		
		let company = [];
		
		let accountant = [];
		
		(async() => { //es7异步函数
			
			tableData = await ajax();
			
			formsData = await getDefaultForms();
			
			next(vm => {//回调
				
				formsData.forEach(item => {
					
					if(item.is_base == 0){
						
						if(item.user_type == 1){
							
							accountant.push(item);
							
						}else if(item.user_type == 2){
							
							company.push(item);
							
						}
						
					}
					
				});
				
				vm.companyDefault = company;
        	
        		vm.accountantDefault = accountant;
				
				vm.tableData = tableData;
				
			})
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>