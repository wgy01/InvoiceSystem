<template>

	<div>
		
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
			
	        <FormItem label="发票名称" prop="name">
	            <Input v-model="formInline.name" clearable placeholder="输入名称" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="选择模板" prop="template">
	        	<Select v-model="formInline.template" placeholder="选择模板" style="width: 200px;">
	                <Option v-for="item in templateData" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	        </FormItem>
	        
	    </Form>
	    
	    <Card dis-hover>
	    	
	    	<h2 slot="title">模板预览</h2>
	    	
	    	<div>
	    		213213
	    	</div>
	    	
	    </Card>
	    
	    <div style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit('formInline')">创建发票</Button>
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
		
		templateData: {
			type: Array,
			default: []
		},
	},
    data () {//数据
        return {
        	
        	formInline: {
        		name: '',
        		template: '',
        	},
        	
        	ruleInline: {
        		name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                template: [
                    { type: 'number', required: true, message: '请选择模板', trigger: 'change' }
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
		
		templateData(){
			if(this.templateData && this.templateData.length > 0){
	    		this.formInline.template = this.templateData[0].value;
	    	}
		}
		
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