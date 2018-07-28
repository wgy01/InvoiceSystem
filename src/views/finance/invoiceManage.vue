<template>

	<div>
		
		<Card v-if="true" style="margin-bottom:16px;">
			
			<h1 slot="title">开发票</h1>
			
			<add-invoice></add-invoice>
			
		</Card>
		
		<Card>
			
			<h1 slot="title">发票列表</h1>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData">
			</list-component>
			
		</Card>
		
	</div>
	
</template>

<script>

import addInvoice from '@/components/addInvoice.vue';//创建发票

import listComponent from '@/components/list-component.vue';//发票列表

export default {
	components:{//组件模板
		addInvoice,
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
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
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
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                	id: 2,
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
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
    	handleSubmit(name) {//验证
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('创建成功');
                }
            })
        }
    	
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
	
//	beforeRouteEnter (to, from, next) {//在组件创建之前调用
//		
//	},
	
}
</script>

<style scoped>
</style>