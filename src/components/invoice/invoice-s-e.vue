<template>

	<div>
		
		<Form v-if="userType == 2 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
					
			<FormItem label="选择公司" prop="companyId">
	        	<Select v-model="formInline.companyId" filterable placeholder="选择公司" style="width: 200px;">
	                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	        </FormItem>
			
	        <FormItem label="金额" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="width: 200px;"></Input>
	        </FormItem>
	        
	    </Form>
		
		<Card style="margin-bottom: 16px;">
		    		
    		<h2 slot="title">公司填写</h2>
    		
    		<forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :NoHandle="handle2"
            :user-type="2"
            :out-forms-data="companyFormsData"
            :show-type="type == 'edit' ? 'edit2' : type"
            >
            </forms-template>
    		
    	</Card>
    	
    	<Card>
    		
    		<h2 slot="title">会计填写</h2>
    		
    		<forms-template
            ref="formsInstance2"
            @on-change="formsChange"
            :NoHandle="handle1"
            :user-type="1"
            :out-forms-data="accountantFormsData"
            :show-type="type == 'edit' ? 'edit2' : type"
            >
            </forms-template>
    		
    	</Card>
    	
    	<div v-if="type == 'edit'" style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit">保存发票</Button>
	    </div>
		
	</div>
	
</template>

<script>

import formsTemplate from '@/components/forms-template.vue';

export default {
	components:{//组件模板
		formsTemplate,
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
			required: true
		},
		
		invoiceLink: String,
		
	},
    data () {//数据
        return {
        	
        	formInline: {
        		money: '',//金额
        		companyId: '',//公司id
        	},
        	ruleInline: {
        		money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                companyId: [
                    { type: 'number', required: true, message: '请选择公司', trigger: 'change' }
                ],
        	},
        	
        	userType: sessionStorage.getItem('userType'),//用户类型
        	
        	handle1: sessionStorage.getItem('userType') != 1,//会计
        	
        	handle2: sessionStorage.getItem('userType') != 2,//用户
        	
        	companyFormsData: [],//公司数据
        	
        	accountantFormsData: [],//会计数据
        	
        	formsList: [],//发生改变后的表单数据
        	
        	companyDataList: [],//公司列表数据
        	
        }
    },
    methods: {//方法
    	
    	companyList(){//公司列表
    		
    		this.$axios.post('Service/Company/index', {
				user_id: sessionStorage.getItem('userId')
			})
			.then(response => {
				
				let arr = [];
				
				response.data.forEach(item => {
					arr.push({
						label: item.title,
						value: item.id,
					});
				})
				
				this.companyDataList = arr;
				
			})
			.catch(function(error) {
				console.log(error);
			});
    		
    	},
    	handleSubmit() {//保存发票
    		
    		if(this.userType == 2){//用户
    			
    			this.$refs['formInline'].validate((valid) => {
            	
	            	let [A1,B1,A2,B2] = [true,true,true,true];
				
					this.$refs.formsInstance1.verification((valid) => {
						A1 = valid;
		    		},(valid) => {
		    			B1 = valid;
		    		});
		    		
					this.$refs.formsInstance2.verification((valid) => {
						A2 = valid;
		    		},(valid) => {
		    			B2 = valid;
		    		});
					
	                if (valid) {
	                	
	                	if(A1 || A2){
	                		
							if(B1 && B2) {
								
								this.$axios.post('Service/Order/edit', {
			    					id: this.dataID,
			    					conf: JSON.stringify(this.formsList),
			    					url: '',
			    					company_id: this.formInline.companyId,
			    					user_id: sessionStorage.getItem('userId'),
			    					money: this.formInline.money,
								})
								.then(response => {
									
									if(response.status == 200){
										this.$parent.$parent.modalShow = false;
										this.$Message.success('保存成功');
									}
									
								})
								.catch(function (error) {
									console.log(error);
								});
								
							}
							
						}else{
							this.$Message.info('请增加字段！');
						}
	                	
	                }
	                
	            })
    			
    		}else if(this.userType == 1){//会计
    			
    			let [A1,B1,A2,B2] = [true,true,true,true];
				
				this.$refs.formsInstance1.verification((valid) => {
					A1 = valid;
	    		},(valid) => {
	    			B1 = valid;
	    		});
	    		
				this.$refs.formsInstance2.verification((valid) => {
					A2 = valid;
	    		},(valid) => {
	    			B2 = valid;
	    		});
				
            	if(A1 || A2){
            		
					if(B1 && B2) {
						
						this.$axios.post('Service/Order/edit', {
	    					id: this.dataID,
	    					conf: JSON.stringify(this.formsList),
	    					url: '',
	    					user_id: sessionStorage.getItem('userId'),
						})
						.then(response => {
							
							if(response.status == 200){
								this.$parent.$parent.modalShow = false;
								this.$Message.success('保存成功');
							}
							
						})
						.catch(function (error) {
							console.log(error);
						});
						
					}
					
				}else{
					this.$Message.info('请增加字段！');
				}
    			
    		}
            
       	},
    	show(){//详情
    		
    		this.$axios.post('Service/Order/detail', {
    			id: this.invoiceLink
			})
			.then(response => {
				
				if(response.status == 200){
					
					let accountantArr = [];
							
					let companyArr = [];
					
					response.data.conf.forEach(item => {
						if(item.user_type == 1){//会计
							accountantArr.push(item);
						}
						if(item.user_type == 2){//公司
							companyArr.push(item);
						}
					});
					
					this.formInline.companyId = response.data.company_id;//公司id
					
					this.companyFormsData = companyArr;//公司数据
        	
        			this.accountantFormsData = accountantArr;//会计数据
					
				}
				
			})
			.catch(function (error) {
				console.log(error);
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
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	this.companyList();//公司列表
    	this.show();//详情
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped>
</style>