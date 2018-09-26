<template>

	<div>
		
		<Card v-if="type == 'show' && status == 1" :bordered="false" dis-hover style="margin-bottom: 16px;">
			
			<h2 slot="title">物流信息</h2>
			
			<div>
				
				<Row>
					
					<Col span="10">
						
						<Row style="padding: 6px 0;">
    			
			    			<Col span="8" style="text-align: right;">
			    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">快递公司：</label>
			    			</Col>
			    			
			    			<Col span="16">
			    				{{expressInfo.company}}
			    			</Col>
			    			
			    		</Row>
						
					</Col>
					
					<Col span="10">
						
						<Row style="padding: 6px 0;">
    			
			    			<Col span="8" style="text-align: right;">
			    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">快递单号：</label>
			    			</Col>
			    			
			    			<Col span="16">
			    				{{expressInfo.odd}}
			    			</Col>
			    			
			    		</Row>
						
					</Col>
					
					<Col span="4">
						<Button type="primary" @click="expressQuery">快递查询</Button>
					</Col>
					
				</Row>
	    		
			</div>
			
		</Card>
		
		<!--用户部分-->
		<Card :bordered="false" dis-hover style="margin-bottom: 16px;">
			
    		<h2 slot="title">{{Info.ticketName}}（用户）</h2>
    		
			<Form v-if="userType == 2 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
				
				<FormItem label="需要开票的单位" prop="companyId">
		        	<Select v-model="formInline.companyId" @on-change="companyChange" filterable placeholder="选择公司" style="max-width: 200px;">
		                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		            </Select>
		        </FormItem>
		        
	            <FormItem label="开票金额(元)" prop="money">
		            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
		        </FormItem>
		        
		        <FormItem label="地区选择" prop="areaData">
		        	<al-cascader v-if="formInline.areaData.length > 0" level="1" v-model="formInline.areaData" placeholder="请选择地区" data-type="code" style="max-width: 400px;" />
		        </FormItem>
		        
		    </Form>
		    
		    <Row v-if="userType == 1 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">开票金额(元)：</label>
    			</Col>
    			
    			<Col span="20">
    				{{formInline.money}}
    			</Col>
    			
    		</Row>
    		
		    <Row v-if="userType == 1 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">地区：</label>
    			</Col>
    			
    			<Col span="20">
    				<al-cascader v-if="formInline.areaData.length > 0" @on-change="alCascader" level="1" v-model="formInline.areaData" :disabled="true" placeholder="请选择地区" data-type="all" style="max-width: 400px;display: none;" />
    				<span v-for="(itemArea,index) in allAreaData">
    					{{itemArea.name}}
    					{{index == (allAreaData.length-1) ? '' : ' —> '}}
    				</span>
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
		    
	        <Row v-if="userType == 1 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">图片文件：</label>
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
    	<Card :bordered="false" dis-hover v-show="userType == 1 || (userType == 2 && type == 'show' && status == 1)">
    		
    		<h2 slot="title">{{Info.accountName}}（会计）</h2>
    		
    		<Form v-if="userType == 1 && type == 'edit'" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
    			
				<FormItem label="发票代码" prop="invoiceCode">
		            <Input v-model="formInline.invoiceCode" clearable placeholder="输入发票代码" style="max-width: 200px;"></Input>
		        </FormItem>
		        
				<FormItem label="发票编号" prop="invoiceNum">
		            <Input v-model="formInline.invoiceNum" clearable placeholder="输入发票编号" style="max-width: 200px;"></Input>
		        </FormItem>
		        
		    </Form>
    		
    		<Row v-if="userType == 2 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">发票代码：</label>
    			</Col>
    			
    			<Col span="20" :style="{color: formInline.invoiceCode ? '' : '#bbbec4'}">
    				{{formInline.invoiceCode || '- -无内容- -'}}
    			</Col>
    			
    		</Row>
    		
    		<Row v-if="userType == 2 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">发票编号：</label>
    			</Col>
    			
    			<Col span="20" :style="{color: formInline.invoiceNum ? '' : '#bbbec4'}">
    				{{formInline.invoiceNum || '- -无内容- -'}}
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
    		
    		<Row v-if="userType == 2 || type == 'show'" style="padding: 16px 0 6px;">
    			
    			<Col span="4" style="text-align: right;">
    				<label style="width: 182px;text-align: right;font-size: 12px;font-weight:bold;">图片文件：</label>
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
        	
        	allAreaData: [],//显示名称的地区数据
        	
        	formInline: {
        		money: '',//金额
        		companyId: '',//公司id
        		invoiceNum: '',//发票编号
        		invoiceCode: '',//发票代码
        		areaData: [],//地区
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
                invoiceCode: [
                    { required: true, message: '请输入发票代码', trigger: 'blur' }
                ],
                areaData: [
                    { type: 'array', required: true, message: '请选择地区', trigger: 'change' },
                ],
        	},
        	
        	Info: {//信息
        		accountName: '',
        		ticketName: '',
        	},
        	
        	userType: localStorage.getItem('userType'),//用户类型
        	
        	companyBasicforms: [],//公司基本表单数据
        	
        	invoiceAllData: [],//所有字段数据
        	
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
        	
        	expressInfo: {//快递信息
        		company: '',
        		coding: '',
        		odd: '',
        	},
        	
        }
    },
    methods: {//方法
    	
    	alCascader(arrData){//详情,地区控件发生改变时
    		
    		this.allAreaData = arrData;
    		
    	},
    	
    	uploadSuccess(data){//上传成功后触发
    		
    		this.imgData = data;
    		
    	},
    	del(data){//删除时触发
    		
    		this.imgData = data;
    		
    	},
    	expressQuery(){//快递查询
    		
    		if(this.expressInfo.coding && this.expressInfo.odd){
    			
    			window.open("https://www.kuaidi100.com/chaxun?com="+ this.expressInfo.coding +"&nu="+ this.expressInfo.odd);
    			
    		}else{
    			
    			this.$Message.error('信息不全，查询失败！');
    			
    		}
    		
    		
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
    	companyChange(companyId){//选择公司时触发
    		
    		if(this.userType == 2 && this.type == 'edit'){
    			
	    		let companyArr = [];
	    		
	    		this.invoiceAllData.forEach(item => {
					
					if(item.user_type == 2){//公司
						
						companyArr.push(item);
						
					}
					
				});
	    		
	    		this.companyFormsData = companyArr;
	    		
	    		this.getCompanyBasicforms(companyId,this.companyFormsData)//获取公司基本表单数据
	    		
    		}
    		
    	},
    	getCompanyBasicforms(id,companyArr){//获取公司基本表单数据
    		
    		this.$axios.post('Service/CompanyField/get_by_id', {
				company_id: id,		
			})
			.then(response => {
				
				let arr = [];
				
				let arr2 = [];
				
				if(response.status == 200){
					
					arr = response.data.setting;
					
					response.data.setting.forEach(item => {
						
						if(item.value != ''){//替换已存在并且value有值的数据
							
							this.formsList.forEach(item2 => {
								
								if(item2.field == item.field){
									
									item2.value = item.value;
									
								}
								
							});
							
						}else{//删除已存在的空数据
							
							for(let i=0;i<companyArr.length;i++){
								
								if(companyArr[i].field == item.field){
									
									companyArr.splice(i,1);
									
									i = 0;
									
								}
								
							}
							
						}
						
					});
					
					//数组去重
					for (let i=0;i<arr.length;i++){
						
						let j = 0;
						
						while(j<companyArr.length){
							
							if(arr[i].field == companyArr[j].field){
								
								arr.splice(i,1);
								
								i = -1;
								
								break;
								
							}
							
							j++;
							
						}
						
					}
					
					//筛选value值不为空的数据
					arr.forEach(item => {
						
						if(item.value != ''){
							
							arr2.push(item);
							
						}
						
					})
					
				}
				
				this.companyBasicforms = arr2;
				
				this.companyBasicforms.forEach(item => {
					console.log(item.name);
				})
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	handleSubmit() {//保存发票
    		
    		let allArrData = [...this.formsList,...this.companyBasicforms];
    		
    		let sortArr = [];
    		
    		function sortNumber(a,b) {//排序函数
				return b.sort - a.sort;
			}
    		
    		sortArr = allArrData.sort(sortNumber);
    		
			this.$refs['formInline'].validate((valid) => {
				
            	let [A1,B1,A2,B2] = [true,true,true,true];
				
				this.$refs.formsInstance1.verification((valid2) => {
					A1 = valid2;
	    		},(valid3) => {
	    			B1 = valid3;
	    		});
	    		
				this.$refs.formsInstance2.verification((valid4) => {
					A2 = valid4;
	    		},(valid5) => {
	    			B2 = valid5;
	    		});
	    		
                if (valid) {
                	
                	if(A1 || A2){
                		
						if(B1 && B2) {
							
							this.$axios.post('Service/Order/edit', {
								
		    					id: this.dataID,
		    					
		    					conf: JSON.stringify(sortArr),
		    					
		    					url: this.imgData.imgSubmitData.join('|'),
		    					
		    					company_id: this.formInline.companyId,
		    					
		    					user_id: localStorage.getItem('userId'),
		    					
		    					money: this.formInline.money,
		    					
		    					invoice_number: this.formInline.invoiceNum,
		    					
		    					ticket_code: this.formInline.invoiceCode,
		    					
		    					province: this.formInline.areaData[0] || '',
    					
		    					city: this.formInline.areaData[1] || '',
		    					
		    					area: this.formInline.areaData[2] || '',
		    					
		    					street: this.formInline.areaData[3] || '',
		    					
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
					
					if(this.type == 'edit' && response.data.status == 1){//开票完成的发票不能进行编辑
						
						this.$parent.$parent.modalShow = false;
						
						this.$parent.$parent.$parent.$parent.updateData();
						
		                this.$Notice.error({
		                    title: '开票已经完成，您不能再进行编辑此发票！',
		                    desc: '',
		                    duration: 6,
		                });
						
						return false;
						
					}
					
					let accountantArr = [];
							
					let companyArr = [];
					
					response.data.conf.forEach(item => {
						
						if(item.user_type == 1){//会计
							accountantArr.push(item);
						}
						
						if(item.user_type == 2){//公司
							companyArr.push(item);
						}
						
						if(this.type == 'show' && response.data.status == 1){
							
							if(item.field == "express_company"){
							
								this.expressInfo.company = item.value;//快递公司名称
							
								this.expressInfo.coding = item.coding;//快递公司代码
							
							}
						
							if(item.field == "express_number"){
							
								this.expressInfo.odd = item.value;//快递单号
							
							}
							
						}
						
						
					});
					
					this.invoiceAllData = response.data.conf;//所有字段数据
					
					this.companyFormsData = companyArr;//公司数据
        	
        			this.accountantFormsData = accountantArr;//会计数据
					
					if(this.userType == 2 && this.type == 'edit'){
						this.getCompanyBasicforms(response.data.company_id,this.companyFormsData)//获取公司基本表单数据
					}
					
					this.formInline.money = response.data.money.toString();//开票金额
					
					this.formInline.invoiceNum = response.data.invoice_number;//发票编号
					
					this.formInline.invoiceCode = response.data.ticket_code;//发票代码
					
					this.formInline.areaData[0] = response.data.province;
		      		this.formInline.areaData[1] = response.data.city;
		    		this.formInline.areaData[2] = response.data.area;
		    		this.formInline.areaData[3] = response.data.street;
					
					this.formInline.companyId = response.data.company_id;//公司id
					
					this.Info.accountName = response.data.mixture.account.title;//获取会计公司名称
					
					this.Info.ticketName = response.data.mixture.ticket.title;//获取用户公司名称
					
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