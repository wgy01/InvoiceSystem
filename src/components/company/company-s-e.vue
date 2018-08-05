<template>

	<div>
		
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
	        <FormItem label="公司名称" prop="name">
	            <Input v-model="formInline.name" clearable placeholder="输入名称" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="公司描述">
			    <Input type="textarea" :rows="1" v-model="formInline.remark" clearable placeholder="公司描述..."></Input>
	        </FormItem>
	        
	    </Form>
	    
	    <div style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit('formInline')">保存</Button>
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
		
		type: {
			type: String,
			required: true
		},
		
		dataID: {
			type: Number,
		},
		
		companyName: String,//公司名称
        	
        companyRemark: String,//公司描述
		
	},
    data () {//数据
        return {
        	
        	formInline: {
        		name: this.companyName,
        		remark: this.companyRemark,
        	},
        	ruleInline: {
        		name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
        	},
        	
        }
    },
    methods: {//方法
    	
    	handleSubmit(name) {//保存数据
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('Service/Company/edit', {
    					id: this.dataID,
    					title: this.formInline.name,
    					remark: this.formInline.remark,
					})
					.then(response => {
						if(response.status == 200){
							this.$parent.$parent.$parent.$parent.updateData();
							this.$parent.$parent.modalShow = false;
							this.$Message.success(response.message);
						}
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            });
    		
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
	
}
</script>

<style scoped>
</style>