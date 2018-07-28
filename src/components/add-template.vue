<template>

	<div>
		
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
			
	        <FormItem label="模板名称" prop="name">
	            <Input v-model="formInline.name" clearable placeholder="输入名称" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="模板说明">
	            <Input v-model="formInline.remark" type="textarea" :rows="1" placeholder="输入说明"></Input>
	        </FormItem>
	        
	    </Form>
	    
	    <Card dis-hover style="margin-bottom: 16px;">
	    	
	    	<h2 slot="title">公司字段</h2>
	    	
	    	<div>
	    		公司字段
	    		公司字段
	    		公司字段
	    		公司字段
	    		公司字段
	    	</div>
	    	
	    </Card>
	    
	    <Card dis-hover>
	    	
	    	<h2 slot="title">会计字段</h2>
	    	
	    	<div>
	    		会计字段
	    		会计字段
	    		会计字段
	    		会计字段
	    		会计字段
	    	</div>
	    	
	    </Card>
	    
	    <div style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit('formInline')">创建模板</Button>
	    </div>
		
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
        	
        	formInline: {
        		name: '',
        		remark: '',
        	},
        	
        	ruleInline: {
        		name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
        	},
        	
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
    	handleSubmit(name) {
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