<template>

	<div>
		
		<Card style="margin-bottom: 16px;">
			
			<h1 slot="title">创建公司</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
			        <FormItem label="公司名称" prop="name">
			            <Input v-model="formInline.name" clearable placeholder="输入公司名称" style="width: 200px;"></Input>
			        </FormItem>
			        
			        <FormItem label="公司描述">
			            <Input type="textarea" :rows="1" v-model="formInline.remark" clearable placeholder="公司描述..."></Input>
			        </FormItem>
			        
			    </Form>
				
				<div style="text-align: center;">
			    	<Button type="primary" @click="handleSubmit('formInline')">创建公司</Button>
			    </div>
				
			</div>
			
		</Card>
		
		<Card>
			
			<h1 slot="title">公司列表</h1>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="companySE"
			>
			</list-component>
			
		</Card>
		
	</div>
	
</template>

<script>

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

let companyList = () => {

	return new Promise(resolve => {

		axios.post('Service/Company/index', {
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

export default {
	components:{//组件模板
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
        	
            formInline: {
        		name: '',
        		remark: '',
        	},
        	ruleInline: {
        		name: [
                    { required: true, message: '请输公司名称', trigger: 'blur' }
                ],
        	},
        	
        	tableColumns: [
                {
                	align: 'center',
                	width: 80,
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'title'
                },
                {
                    title: '公司描述',
                    key: 'remark'
                },
                {
                	align: 'center',
                	width: 80,
                    title: '操作',
                    handle: ['edit'],
                },
            ],
            
            tableData: [],
            
        }
    },
    methods: {//方法
    	
    	handleSubmit(name) {//创建公司
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('Service/Company/add', {
		    			user_id: localStorage.getItem('userId'),
		    			title: this.formInline.name,
		    			remark: this.formInline.remark,
					})
					.then(response => {
						
						if(response.status = 200){
							
							this.formInline = {
								name: '',
								remark: '',
							};
							
							(async() => {
								this.tableData = await companyList();
							})();
							
							this.$Message.success('创建成功');
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            })
            
       },
       updateData(){//更新表格数据
    		
			(async() => {
				
				this.tableData = await companyList();
				
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
		
		let companyDataList = [];//公司列表
		
		(async() => {
			
			companyDataList = await companyList();
			
			next(vm => {
				vm.tableData = companyDataList;
			});
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>