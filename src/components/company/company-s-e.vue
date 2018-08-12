<template>

	<div>
		
	    <Form ref="formInline" :model="companyFormsList" :label-width="100">
					
	        <Row :gutter="16">
	        	
	        	<Col span="12">
			        <FormItem label="单位名称" prop="name" :rules="rulesCompanyName">
			            <Input v-model="companyFormsList.name" clearable placeholder="单位名称"></Input>
			        </FormItem>
	        	</Col>
	        	
		        <Col span="12" v-for="(item,index) in companyFormsList.data" :key="index">
			        <FormItem :label="item.name" :prop="'data.' + index + '.value'" :rules="rules(item)">
			            <Input v-model="item.value" clearable :placeholder="item.remark || item.name"></Input>
			        </FormItem>
		        </Col>
	        	
	        	<Col span="12">
	        		<FormItem label="公司描述">
			            <Input type="textarea" :rows="1" v-model="companyFormsList.remark" clearable placeholder="公司描述..."></Input>
			        </FormItem>
	        	</Col>
	        	
	        </Row>
	        	
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
        	
        	companyFormsList:{//公司表单字段数据
        		name: this.companyName,
        		remark: this.companyRemark,
				data: [],
			},
        	
    		rulesCompanyName: [
                { required: true, message: '请输入单位名称', trigger: 'blur' }
            ],
        	
        }
    },
    methods: {//方法
    	
    	rules(item){//验证
    		
    		if(item.field == 'organizer_code'){
    			
    			return [
                    { required: true, message: '请输入识别号', trigger: 'blur' }
                ];
    			
    		}else{
    			
    			return [];
    			
    		}
    		
    	},
    	getBasicForms(){//获取基本表单字段
    		
    		this.$axios.post('Service/CompanyField/get_by_id', {
				company_id: this.dataID,
			})
			.then(response => {
				
				if(response.status == 200){
					
					this.companyFormsList.data = response.data.setting;
					
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	handleSubmit(name) {//保存数据
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('Service/Company/edit', {
                		
    					id: this.dataID,
    					
    					title: this.companyFormsList.name,
    					
		    			remark: this.companyFormsList.remark,
		    			
		    			setting: JSON.stringify(this.companyFormsList.data),
		    			
					})
					.then(response => {
						
						if(response.status == 200){
							
							this.$parent.$parent.$parent.$parent.updateData();
							
							this.$parent.$parent.modalShow = false;
							
							this.$Message.success('保存成功');
							
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
    	
    	if(localStorage.getItem('userType') == 2){
    		
    		this.getBasicForms();//获取基本表单字段
    		
    	}
    	
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped>
</style>