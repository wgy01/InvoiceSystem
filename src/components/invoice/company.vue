<template>

	<div>
		
		<Card v-if="accountantID && templateID">
			
			<h1 slot="title">会计公司名称</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
					<FormItem label="选择公司" prop="company">
			        	<Select v-model="formInline.company" placeholder="选择公司" style="width: 200px;">
			                <Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			            </Select>
			        </FormItem>
					
			        <FormItem label="金额" prop="money">
			            <Input v-model="formInline.money" clearable placeholder="输入金额" style="width: 200px;"></Input>
			        </FormItem>
			        
			    </Form>
			    
		    	<Card style="margin-bottom: 16px;">
		    	
			    	<h2 slot="title">模板说明</h2>
			    	
			    	<div>{{remark}}</div>
			    	
			    </Card>
		    	
		    	<Card style="margin-bottom: 16px;">
		    		
		    		<h2 slot="title">公司字段</h2>
		    		
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
		    		
		    		<h2 slot="title">会计字段</h2>
		    		
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
		
		<!--发票链接模块-->
		
		<Card v-else>
			
			<h1 slot="title">发票链接</h1>
			
			<div>
				
				<Form ref="formInline2" :model="formInline2" :rules="ruleInline2" :label-width="70">
					
			        <FormItem label="发票链接" prop="invoiceURL">
			            <Input v-model="formInline2.invoiceURL" clearable placeholder="输入链接"></Input>
			        </FormItem>
			        
			    </Form>
				
			    <div style="text-align: center;">
			    	<Button type="primary" @click="handleSubmit2('formInline2')">获取发票</Button>
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
		
		remark: String,//模板说明
        	
    	accountantFormsData: Array,//会计数据
    	
    	companyFormsData: Array,//公司数据
    	
    	companyList: Array,//公司列表
    	
    	accountantID: Number,
    	
    	templateID: Number,
    	
	},
    data () {//数据
        return {
        	
        	formInline: {
        		money: '',
        	},
        	ruleInline: {
        		money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                company: [
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
    	handleSubmit(name) {//创建发票
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	console.log(this.formsList);
                	
                    this.$Message.success('创建成功');
                    
                }
                
            })
            
       },
       handleSubmit2(name) {
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	let getUrlParams = (url,name) => {
                		let startIndex = url.indexOf('?');
                		let parameter = url.substr(startIndex);
					    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
					    let r = parameter.substr(1).match(reg);  
					    if (r != null) return unescape(r[2]); 
					  	return null; 
					}
                	
                	this.$router.push(
			    		{
			    			name: this.$route.name,
			    			query: {
			    				accountantID: getUrlParams(this.formInline2.invoiceURL,'accountantID'),
    							templateID: getUrlParams(this.formInline2.invoiceURL,'templateID'),
			    			}
			    		}
		    		);
		    		
		    		if(this.$route.query.accountantID && this.$route.query.templateID){
		    			
		    			this.$Message.success('跳转成功');
		    			
		    		}else{
		    			
		    			this.$Message.error('链接错误');
		    			
		    		}
		    		
                    
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