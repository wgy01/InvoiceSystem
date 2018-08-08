<template>

	<div>
		
		<Form v-if="userType == 2 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="90">
					
			<FormItem label="选择公司" prop="companyId">
	        	<Select v-model="formInline.companyId" filterable placeholder="选择公司" style="width: 200px;">
	                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	        </FormItem>
			
	        <FormItem label="申请金额(元)" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="width: 200px;"></Input>
	        </FormItem>
	        
	    </Form>
		
		
		<Card style="margin-bottom: 16px;">
		    		
    		<h2 slot="title">{{type == 'show' ? '公司字段' : '公司填写'}}</h2>
    		
    		<Row style="padding: 6px 0;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">申请金额：</label>
    			</Col>
    			
    			<Col span="20">
    				<span>{{formInline.money}}元</span>
    			</Col>
    			
    		</Row>
    		
    		<forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :NoHandle="handle2"
            :user-type="2"
            :out-forms-data="companyFormsData"
            :show-type="showType"
            >
            </forms-template>
    		
    	</Card>
    	
    	<Card v-show="userType == 1 || (userType == 2 && type == 'show' && status == 1)" style="margin-bottom: 16px;">
    		
    		<h2 slot="title">{{type == 'show' ? '会计字段' : '会计填写'}}</h2>
    		
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
    	
    	<Card>
			    	
	    	<h2 slot="title">图片上传</h2>
	    	
	    	<upload
	    	:showType="type"
    		:img-list="imgList"
    		@on-success="uploadSuccess"
    		@on-del="del">
	    	</upload>
	    	
	    </Card>
    	
    	<div v-if="type == 'edit'" style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit">保存发票</Button>
	    </div>
		
	</div>
	
</template>

<script>

import formsTemplate from '@/components/forms-template.vue';

import upload from '@/components/upload.vue';

export default {
	components:{//组件模板
		formsTemplate,
		upload,
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
		
		status: Number,
		
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
        	
        	imgData: {//上传的图片数据
        		
        		imgShowData: [],//需要显示的图片
        		
        		imgSubmitData: [],//需要提交的图片数据
        		
        	},
        	
        	imgList: [],//图片列表
        	
        }
    },
    methods: {//方法
    	
    	uploadSuccess(data){//上传成功后触发
    		
    		this.imgData = data;
    		
    	},
    	del(data){//删除时触发
    		
    		this.imgData = data;
    		
    	},
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
		    		},(valid3) => {
		    			B2 = valid;
		    		});
		    		
	                if (valid) {
	                	if(A1 || A2){
	                		
							if(B1 && B2) {
								
								this.$axios.post('Service/Order/edit', {
			    					id: this.dataID,
			    					conf: JSON.stringify(this.formsList),
			    					url: this.imgData.imgSubmitData.join('|'),
			    					company_id: this.formInline.companyId,
			    					user_id: sessionStorage.getItem('userId'),
			    					money: this.formInline.money,
								})
								.then(response => {
									
									if(response.status == 200){
										this.imgData = {//上传的图片数据
        		
							        		imgShowData: [],//需要显示的图片
	        		
	        								imgSubmitData: [],//需要提交的图片数据
							        		
							        	};
										this.$parent.$parent.$parent.$parent.updateData();
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
	    					url: this.imgData.imgSubmitData.join('|'),
	    					company_id: this.formInline.companyId,
	    					user_id: sessionStorage.getItem('userId'),
	    					money: this.formInline.money,
						})
						.then(response => {
							
							if(response.status == 200){
								this.imgData = {//上传的图片数据
        		
					        		imgShowData: [],//需要显示的图片
    		
    								imgSubmitData: [],//需要提交的图片数据
					        		
					        	};
								this.$parent.$parent.$parent.$parent.updateData();
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
       	imgShow(id){//图片显示
       		
       		this.$axios.post('Service/Uploadfile/index', {
    			order_id: id,
			})
			.then(response => {
				
				if(response.status == 200){
					
					let arr = [];
					
					response.data.forEach(item => {
						
						arr.push({
							name: '',
							url: item.url
						});
						
					});
					
					this.imgList = arr;
					
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
       		
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
					
					this.$parent.$parent.status = response.data.status;//发票状态
					
					this.formInline.money = response.data.money.toString();//公司金额
					
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
        
        showType(){
        	
        	let txt = '';
        	
        	if(this.userType == 1){
        		
        		txt = 'show';
        		
        	}else if(this.userType == 2 && this.type == 'edit'){
        		
        		txt = 'edit2';
        		
        	}else{
        		
        		txt = 'show';
        		
        	}
        	
        	return txt;
        	
        },
        
    },
    watch: {//监测数据变化
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	this.companyList();//公司列表
    	this.show();//详情
    	this.imgShow(this.dataID);//图片显示
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped>
</style>