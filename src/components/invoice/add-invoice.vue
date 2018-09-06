<template>

	<div>
		
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
			
	        <FormItem label="发票名称" prop="name">
	            <Input v-model="formInline.name" clearable placeholder="输入名称" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="选择模板" prop="template">
	        	<Select v-model="formInline.template" placeholder="选择模板" @on-change="selectChange" style="width: 200px;">
	                <Option v-for="item in templateData" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	        </FormItem>
	        
	        <FormItem label="公司ID" prop="companyID">
	        	<Input v-model="formInline.companyID" clearable placeholder="输入公司ID" style="width: 200px;"></Input>
	        </FormItem>
	        
	    </Form>
	    
	    <Card dis-hover>
	    	
	    	<h2 slot="title">模板预览</h2>
	    	
	    	<Card style="margin-bottom: 16px;">
	    	
		    	<h2 slot="title">模板说明</h2>
		    	
		    	<div>{{remark}}</div>
		    	
		    </Card>
	    	
	    	<Card style="margin-bottom: 16px;">
	    		
	    		<h2 slot="title">公司字段</h2>
	    		
	    		<forms-template
	            ref="formsInstance1"
	            @on-change="formsChange"
	            :NoHandle="true"
	            :user-type="2"
	            :out-forms-data="companyData"
	            show-type="show"
	            >
	            </forms-template>
	    		
	    	</Card>
	    	
	    	<Card>
	    		
	    		<h2 slot="title">会计字段</h2>
	    		
	    		<forms-template
	            ref="formsInstance2"
	            @on-change="formsChange"
	            :NoHandle="false"
	            :user-type="1"
	            :out-forms-data="accountantData"
	            show-type="show"
	            >
	            </forms-template>
	    		
	    	</Card>
	    	
	    </Card>
	    
	    <div style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit('formInline')">创建发票</Button>
	    </div>
		
	</div>
	
</template>

<script>

import formsTemplate from '@/components/forms-template.vue';

export default {
	components:{//组件模板
		formsTemplate
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		templateData: {//模板数据
			type: Array,
			default: []
		},
	},
    data () {//数据
        return {
        	
        	formInline: {
        		name: '',
        		template: '',
        		companyID: '',
        	},
        	
        	ruleInline: {
        		name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                template: [
                    { type: 'number', required: true, message: '请选择模板', trigger: 'change' }
                ],
                companyID: [
                    { required: true, message: '请输入公司ID', trigger: 'blur' }
                ],
        	},
        	
        	remark: '',//模板说明
        	
        	accountantData: [],//会计数据
        	
        	companyData: [],//公司数据
        	
        	formsList: [],//发生改变后的表单数据
        	
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
    	handleSubmit(name) {//创建发票
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('创建成功');
                }
            })
       },
       selectChange(val){//选择模板改变触发
       	
       		this.templateData.forEach(item => {
       			
       			if(item.value == val){
       				
       				this.remark = item.remark;
       				
       				//this.formsList = item.setting;
       				
       				item.setting.forEach(item2 => {
				
						if(item2.user_type == 1){//会计
							this.accountantData.push(item2);
						}
					
						if(item2.user_type == 2){//公司
							this.companyData.push(item2);
						}
					
					});
       				
       			}
       			
       		});
       		
       },
       formsChange(){//模板表单发生改变时
    		
    		let A = this.$refs.formsInstance1.formsList.data;
    		
    		let B = this.$refs.formsInstance2.formsList.data;
    		
    		let arr = [];
    		
    		arr.push(...A,...B);
    		
    		this.formsList = arr;
    		
    	},
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
		templateData(){//默认模板
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