<template>

	<div>
		
		<Card style="margin-bottom: 16px;">
			
			<h1 slot="title">创建公司</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
			        <FormItem label="公司名称" prop="name">
			            <Input v-model="formInline.name" clearable placeholder="输入公司名称" style="width: 200px;"></Input>
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
        	},
        	ruleInline: {
        		name: [
                    { required: true, message: '请输公司名称', trigger: 'blur' }
                ],
        	},
        	
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
            		title: '公司123',
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
    	handleSubmit(name) {//创建公司
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                    this.$Message.success('创建成功');
                    
                }
                
            })
            
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
	
}
</script>

<style scoped>
</style>