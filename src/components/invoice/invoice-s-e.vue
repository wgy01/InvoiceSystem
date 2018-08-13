<template>

	<div>
		
		<!--用户部分-->
		<Card style="margin-bottom: 16px;">
			
    		<h2 slot="title">{{Info.ticketName}}（用户）</h2>
    		
			<Form v-if="userType == 2 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
				
				<FormItem label="需要开票的公司" prop="companyId">
		        	<Select v-model="formInline.companyId" filterable placeholder="选择公司" style="max-width: 200px;">
		                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		            </Select>
		        </FormItem>
		        
	            <FormItem label="开票金额(元)" prop="money">
		            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
		        </FormItem>
		        
		    </Form>
		    
		    <Row v-if="userType == 1 || type == 'show'" style="padding: 6px 0;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">开票金额(元)：</label>
    			</Col>
    			
    			<Col span="20">
    				{{formInline.money}}
    			</Col>
    			
    		</Row>
		    
		    <forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :user-type="2"
            :out-forms-data="companyFormsData"
            :show-type="type == 'edit' && userType == 2 ? 'edit2' : 'show'"
            >
            </forms-template>
		    
		    <Form :label-width="120">
		        <FormItem v-if="userType == 2 && type == 'edit'" label="上传图片文件">
		        	<upload
			    	show-type="edit"
		    		:img-list="companyImgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
		        </FormItem>
		    </Form>
		    
	        <Row v-if="userType == 1 || type == 'show'" style="padding: 6px 0;margin-top: 26px;border-top: 1px solid #e9eaec;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">图片文件：</label>
    			</Col>
    			
    			<Col span="20">
    				<upload
			    	show-type="show"
		    		:img-list="companyImgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
    			</Col>
    			
    		</Row>
		    
		</Card>
		
    	<!--会计部分-->
    	<Card v-show="userType == 1 || (userType == 2 && type == 'show' && status == 1)">
    		
    		<h2 slot="title">{{Info.accountName}}（会计）</h2>
    		
    		<Form v-if="userType == 1 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
    			
				<FormItem label="发票编号" prop="invoiceNum">
		            <Input v-model="formInline.invoiceNum" clearable placeholder="输入发票编号" style="max-width: 200px;"></Input>
		        </FormItem>
		        
		    </Form>
    		
    		<Row v-if="userType == 2 || type == 'show'" style="padding: 6px 0;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">发票编号：</label>
    			</Col>
    			
    			<Col span="20">
    				{{formInline.invoiceNum}}
    			</Col>
    			
    		</Row>
    		
    		<forms-template
            ref="formsInstance2"
            @on-change="formsChange"
            :user-type="1"
            :out-forms-data="accountantFormsData"
            :show-type="type == 'edit' && userType == 1 ? 'edit2' : 'show'"
            >
            </forms-template>
    		
    		<Form v-if="userType == 1 && type == 'edit'" :label-width="120">
    			
	    		<FormItem v-if="type == 'edit'" label="上传图片文件">
		        	<upload
			    	show-type="edit"
		    		:img-list="accountantImgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
		        </FormItem>
    			
    		</Form>
    		
    		<Row v-if="userType == 2 || type == 'show'" style="padding: 6px 0;margin-top: 20px;border-top: 1px solid #e9eaec;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;">图片文件：</label>
    			</Col>
    			
    			<Col span="20">
    				<upload
			    	show-type="show"
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
        		invoiceNum: null,//发票编号
        	},
        	ruleInline: {
        		money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                companyId: [
                    { type: 'number', required: true, message: '请选择公司', trigger: 'change' }
                ],
                invoiceNum: [
                    { required: true, message: '请输入发票编号', trigger: 'blur' }
                ],
        	},
        	
        	Info: {//信息
        		accountName: '',
        		ticketName: '',
        	},
        	
        	userType: localStorage.getItem('userType'),//用户类型
        	
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
		    					
		    					invoice_number: this.formInline.invoiceNum,
		    					
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
						
						if(item.user.user_type == 1){//会计图片
							
							accountantImgList.push({
								name: '',
								url: item.url
							});
							
						}else if(item.user.user_type == 2){//公司图片
							
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
					
					this.companyFormsData = companyArr;//公司数据
        	
        			this.accountantFormsData = accountantArr;//会计数据
					
					this.formInline.money = response.data.money.toString();//开票金额
					
					this.formInline.invoiceNum = response.data.invoice_number;//发票编号
					
					this.formInline.companyId = response.data.company_id;//公司id
					
					this.Info.accountName = response.data.mixture.data.account.title;//获取会计公司名称
					
					this.Info.ticketName = response.data.mixture.data.ticket.title;//获取用户公司名称
					
					this.$parent.$parent.status = response.data.status;//发票状态
					
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
    	this.imgShow(this.dataID);//图片显示
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped>
</style>