<template>

	<div>
		
		<!--发票链接模块-->
		<Card style="margin-bottom: 16px;">
			
			<h1 slot="title">发票链接</h1>
			
			<div>
				
				<Form ref="formInline2" :model="formInline2" :rules="ruleInline2" :label-width="70">
					
			        <FormItem label="发票链接" prop="invoiceURL">
			            <Input v-model="formInline2.invoiceURL" clearable placeholder="输入链接" style="max-width: 340px;"></Input>
			            <Button type="primary" @click="handleSubmit2('formInline2')">获取发票</Button>
			        </FormItem>
			        
			    </Form>
				
			</div>
			
		</Card>
		
		<!--发票-->
		<Card>
			
			<h1 slot="title">{{companyName}}</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
					<FormItem label="选择公司" prop="companyId">
			        	<Select v-model="formInline.companyId" placeholder="选择公司" style="width: 200px;">
			                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			            </Select>
			        </FormItem>
					
			        <FormItem label="金额" prop="money">
			            <Input v-model="formInline.money" clearable placeholder="输入金额" style="width: 200px;"></Input>
			        </FormItem>
			        
			    </Form>
			    
		    	<!--<Card style="margin-bottom: 16px;">
		    	
			    	<h2 slot="title">模板说明</h2>
			    	
			    	<div>{{remark}}</div>
			    	
			    </Card>-->
		    	
		    	<Card style="margin-bottom: 16px;">
		    		
		    		<h2 slot="title">公司填写</h2>
		    		
		    		<forms-template
		            ref="formsInstance1"
		            @on-change="formsChange"
		            :NoHandle="false"
		            :user-type="2"
		            :out-forms-data="companyFormsData"
		            show-type="show"
		            >
		            </forms-template>
		    		
		    	</Card>
		    	
		    	<Card>
		    		
		    		<h2 slot="title">会计填写</h2>
		    		
		    		<forms-template
		            ref="formsInstance2"
		            @on-change="formsChange"
		            :NoHandle="true"
		            :user-type="1"
		            :out-forms-data="accountantFormsData"
		            show-type="show"
		            >
		            </forms-template>
		    		
		    	</Card>
			    	
			    <div style="text-align: center;padding-top: 16px;">
			    	<Button type="primary" @click="handleSubmit('formInline')">提交发票</Button>
			    </div>
				
			</div>
			
		</Card>
		
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
		
		invoiceID: Number,//发票ID
		
		companyName: String,//会计公司名称
        	
    	accountantFormsData: Array,//会计数据
    	
    	companyFormsData: Array,//公司数据
    	
    	companyDataList: Array,//公司列表
    	
	},
    data () {//数据
        return {
        	
        	formInline: {
        		money: '',
        		companyId: '',
        	},
        	ruleInline: {
        		money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                companyId: [
                    { type: 'number', required: true, message: '请选择公司', trigger: 'change' }
                ],
        	},
        	
        	formInline2: {
        		invoiceURL: '',
        	},
        	ruleInline2: {
        		invoiceURL: [
                    { required: true, message: '请输入链接', trigger: 'blur' }
                ],
        	},
        	
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
    	handleSubmit(name) {//提交发票
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('Service/Order/edit', {
    					id: this.invoiceID,
    					conf: JSON.stringify(this.formsList),
    					url: '',
    					company_id: this.formInline.companyId,
    					user_id: sessionStorage.getItem('userId'),
    					money: this.formInline.money,
					})
					.then(response => {
						
						if(response.status == 200){
							
							this.$Message.success('创建成功');
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            })
            
       },
       handleSubmit2(name) {//获取发票
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	let params = '';
                	
                	if(this.formInline2.invoiceURL.indexOf('/#/') >= 0){
                		
                		params = this.formInline2.invoiceURL.substr(this.formInline2.invoiceURL.indexOf('/#/')+3);
                		
                	}else{
                		
                		params = this.formInline2.invoiceURL;
                		
                	}
                	
                  	this.$axios.post('Service/Order/detail', {
						id: params
					})
					.then(response => {
						
						if(response.status == 200){
							
							sessionStorage.setItem('params',params);
							
							this.$Message.success('获取成功');
							
						}
						
					})
					.catch(function(error) {
						console.log(error);
					});
                  	
                	
                }else{
                	
                }
                
            })
            
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
		
		companyDataList(){//默认模板
			if(this.companyDataList && this.companyDataList.length > 0){
	    		this.formInline.companyId = this.companyDataList[0].value;
	    	}
		},
		
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