<template>

	<div>
		
		<Card style="margin-bottom:16px;">
			
			<h1 slot="title">创建模板</h1>
			
			<add-template></add-template>
			
		</Card>
		
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
    		
			(async() => { //es7异步函数
			
				this.tableData = await ajax();
				
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
		
		(async() => { //es7异步函数
			
			tableData = await ajax();
			
			next(vm => {//回调
				vm.tableData = tableData;
			})
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>