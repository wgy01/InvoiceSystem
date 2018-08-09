<template>

	<div>
		
		<!--用户编辑显示-->
		<Form v-if="userType == 2 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
					
			<FormItem label="需要开票的公司" prop="companyId">
	        	<Select v-model="formInline.companyId" filterable placeholder="选择公司" style="width: 200px;">
	                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
	        </FormItem>
			
	        <FormItem label="开票金额(元)" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <!--<FormItem label="转款时间" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="联系人" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="手机号码" prop="money">
	            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
	        </FormItem>-->
	        
	        <!--这里是模板的字段-->
	        <div>
	        	<forms-template
	            ref="formsInstance1"
	            @on-change="formsChange"
	            :NoHandle="handle2"
	            :user-type="2"
	            :out-forms-data="companyFormsData"
	            :show-type="showType"
	            >
	            </forms-template>
	        </div>
	        
	        <FormItem label="上传图片文件">
	        	<upload
		    	:showType="type"
	    		:img-list="companyImgList"
	    		@on-success="uploadSuccess"
	    		@on-del="del">
		    	</upload>
	        </FormItem>
	        
	    </Form>
		
		<!--会计显示-->
		<Card v-if="userType == 1 || type == 'show'" style="margin-bottom: 16px;">
		    	
    		<h2 slot="title">{{Info.ticketName}}（用户）</h2>
    		
    		<Row style="padding: 6px 0;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">开票金额：</label>
    			</Col>
    			
    			<Col span="20">
    				<span>{{formInline.money}}元</span>
    			</Col>
    			
    		</Row>
    		
    		<!--这里是模板的字段-->
    		<forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :NoHandle="handle2"
            :user-type="2"
            :out-forms-data="companyFormsData"
            :show-type="showType"
            >
            </forms-template>
            
            <Row style="padding: 6px 0;margin-top: 26px;border-top: 1px solid #e9eaec;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">图片文件：</label>
    			</Col>
    			
    			<Col span="20">
    				<upload
			    	showType="show"
		    		:img-list="companyImgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
    			</Col>
    			
    		</Row>
            
    	</Card>
    	
    	<Card v-show="userType == 1 || (userType == 2 && type == 'show' && status == 1)">
    		
    		<h2 slot="title">{{Info.accountName}}（会计）</h2>
    		
    		<forms-template
            ref="formsInstance2"
            @on-change="formsChange"
            :NoHandle="handle1"
            :user-type="1"
            :out-forms-data="accountantFormsData"
            :show-type="type == 'edit' ? 'edit2' : type"
            >
            </forms-template>
    		
    		<Row style="padding: 6px 0;margin-top: 20px;border-top: 1px solid #e9eaec;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">图片文件：</label>
    			</Col>
    			
    			<Col span="20">
    				<upload
			    	:showType="type"
		    		:img-list="accountantImgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
    			</Col>
    			
    		</Row>
    		
    	</Card>
    	
    	<div v-if="type == 'edit'" style="text-align: center;margin-top: 16px;">
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
        	
        	Info: {//信息
        		accountName: '',
        		ticketName: '',
        	},
        	
        	userType: localStorage.getItem('userType'),//用户类型
        	
        	handle1: localStorage.getItem('userType') != 1,//会计
        	
        	handle2: localStorage.getItem('userType') != 2,//用户
        	
        	companyFormsData: [],//公司数据
        	
        	accountantFormsData: [],//会计数据
        	
        	formsList: [],//发生改变后的表单数据
        	
        	companyDataList: [],//公司列表数据
        	
        	imgData: {//上传的图片数据
        		
        		imgShowData: [],//需要显示的图片
        		
        		imgSubmitData: [],//需要提交的图片数据
        		
        	},
        	
        	companyImgList: [],//公司图片列表
        	
        	accountantImgList: [],//会计图片列表
        	
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
				user_id: localStorage.getItem('userId')
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
			    					user_id: localStorage.getItem('userId'),
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
	    					user_id: localStorage.getItem('userId'),
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
					
					let companyImgList = [];
					
					let accountantImgList = [];
					
					response.data.forEach(item => {
						
						if(item.user.user_type == 1){//会计
							
							accountantImgList.push({
								name: '',
								url: item.url
							});
							
						}else if(item.user.user_type == 2){//公司
							
							companyImgList.push({
								name: '',
								url: item.url
							});
							
						}
						
					});
					
					this.companyImgList = companyImgList;
					
					this.accountantImgList = accountantImgList;
					
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
					
					this.Info.accountName = response.data.mixture.data.account.title;
					
					this.Info.ticketName = response.data.mixture.data.ticket.title;
					
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