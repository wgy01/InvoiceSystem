<template>

	<div>
		
		<Card shadow>
			<Button type="primary" @click="modal = true">获取发票</Button>
		</Card>
		
		<Modal v-model="modal" width="70%">
			
	        <p slot="header">获取发票</p>
	        
	        <div>
	        	
	        	<div style="margin-bottom: 36px;">
	        		
		        	<Form ref="formInline2" :model="formInline2" :rules="ruleInline2" :label-width="80">
		        		
				        <FormItem label="发票链接" prop="invoiceURL">
				        	
				        	<div style="display: flex;align-items: center;">
				        		
				        		<Input v-model="formInline2.invoiceURL" clearable placeholder="输入链接"></Input>
				        		
				        		<Button type="primary" @click="handleSubmit2('formInline2')" style="margin-left: 10px;flex-shrink: 0;">获取发票</Button>
				        		
				        	</div>
				        	
				        </FormItem>
				        
				    </Form>
				    
	        	</div>
			    
			    <!--显示操作发票模块-->
				<Card :bordered="false" dis-hover v-if="invoiceAllData.id">
					
					<h1 slot="title">{{invoiceAllData.mixture.account.title}}（--创建发票链接的公司--）</h1>
					
					<div>
						
		    			<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="120">
				
							<FormItem label="需要开票的单位" prop="companyId">
					        	<Select v-model="formInline.companyId" @on-change="companyChange" filterable placeholder="选择公司" style="max-width: 200px;">
					                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					            </Select>
					        </FormItem>
							
					        <FormItem label="开票金额(元)" prop="money">
					            <Input v-model="formInline.money" clearable placeholder="输入金额" style="max-width: 200px;"></Input>
					        </FormItem>
					        
					        <FormItem label="地区选择" prop="areaData">
					        	<al-selector class="my-class-al-selector" v-model="formInline.areaData" :searchable="true" data-type="code" />
					        </FormItem>
					        
					    </Form>
					    
					    <forms-template
			            ref="formsInstance1"
			            @on-change="formsChange"
			            :NoHandle="false"
			            :user-type="2"
			            :out-forms-data="companyFormsData"
			            show-type="edit2"
			            >
			            </forms-template>
					    
					    <Form :label-width="120">
					        <FormItem label="上传图片文件">
					        	<upload
					        	ref="uploadInstance"
					    		:img-list="companyImgList"
					    		@on-success="uploadSuccess"
					    		@on-del="del">
						    	</upload>
					        </FormItem>
					    </Form>
			    			
					    <div style="text-align: center;">
					    	<Button type="primary" @click="handleSubmit('formInline')">提交发票</Button>
					    </div>
					    
					</div>
					
				</Card>
			    
	        </div>
	        
	        <div slot="footer">
	        	<Button @click="modal = false">关闭</Button>
	        </div>
	        
	    </Modal>
	    
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
		
		invoiceAllData: Object,//所有表单数据
		
    	companyDataList: Array,//公司列表
    	
	},
    data () {//数据
        return {
        	
        	accountantFormsData: [],//会计表单数据
    	
    		companyFormsData: [],//公司表单数据
    		
    		companyBasicforms: [],//公司基本表单数据
        	
        	modal: false,
        	
        	formInline: {
        		money: '',
        		companyId: null,
        		areaData: [],
        	},
        	ruleInline: {
        		money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                companyId: [
                    { type: 'number', required: true, message: '请选择公司', trigger: 'change' }
                ],
                areaData: [
                    { type: 'array', required: true, message: '请选择地区', trigger: 'change' }
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
        	
        	formsList: [],//表单发生改变后的表单数据
        	
        	userType: localStorage.getItem('userType'),//用户类型
        	
        	imgData: {//上传的图片数据
        		
        		imgShowData: [],//需要显示的图片
        		
        		imgSubmitData: [],//需要提交的图片数据
        		
        	},
        	
        	companyImgList: [],//公司图片列表
        	
        }
    },
    methods: {//方法
    	
    	uploadSuccess(data){//上传成功后触发
    		
    		this.imgData = data;
    		
    	},
    	del(data){//删除图片时触发
    		
    		this.imgData = data;
    		
    	},
    	companyChange(companyId){//选择公司时触发
    		
    		let companyArr = [];
    		
    		this.invoiceAllData.conf.forEach(item => {
				
				if(item.user_type == 2){//公司
					
					companyArr.push(item);
					
				}
				
			});
    		
    		this.companyFormsData = companyArr;
    		
    		this.getCompanyBasicforms(companyId,this.companyFormsData)//获取公司基本表单数据
    		
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
				
			})
			.catch(function (error) {
				console.log(error);
			});
    		
    	},
    	handleSubmit(name) {//提交发票
    		
    		let allArrData = [...this.formsList,...this.companyBasicforms];
    		
    		let sortArr = [];
    		
    		function sortNumber(a,b) {//排序函数
				return b.sort - a.sort;
			}
    		
    		sortArr = allArrData.sort(sortNumber);
    		
            this.$refs[name].validate((valid) => {
            	
            	let [A1,B1] = [true,true];
					
				this.$refs.formsInstance1.verification((valid2) => {
					A1 = valid2;
	    		},(valid3) => {
	    			B1 = valid3;
	    		});
	    		
                if (valid && A1 && B1) {
                	
					this.$axios.post('Service/Order/edit', {
						
    					id: this.invoiceAllData.id,
    					
    					conf: JSON.stringify(sortArr),
    					
    					url: this.imgData.imgSubmitData.join('|'),
    					
    					company_id: this.formInline.companyId,
    					
    					user_id: localStorage.getItem('userId'),
    					
    					money: this.formInline.money,
    					
    					invoice_number: '',
    					
    					ticket_code: '',
    					
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
				        	
				        	this.formInline2.invoiceURL = '';
				        	
				        	this.companyImgList = [];//公司图片列表
							
							this.$emit('on-submit',this.formInline.companyId);
							
							this.modal = false;
							
							this.$Message.success('提交成功');
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
							
                }
                
            })
            
       	},
       	imgShow(id){//图片显示
       		
			if(this.$refs.uploadInstance){
				
				this.$refs.uploadInstance.imgData = {//上传的图片数据
        		
	        		imgShowData: [],//需要显示的图片
	        		
	        		imgSubmitData: [],//需要提交的图片数据
	        		
	        	};
	        	
			}
       		
       		this.companyImgList = [],//图片列表
       		
       		this.$axios.post('Service/Uploadfile/index', {
    			order_id: id,
			})
			.then(response => {
				
				if(response.status == 200){
					
					let companyImgList = [];
					
					response.data.forEach(item => {
						
						if(item.user.user_type == 2){//公司
							
							companyImgList.push({
								name: '',
								url: item.url
							});
							
						}
						
					});
					
					this.companyImgList = companyImgList;
					
				}
				
			})
			.catch(function (error) {
				console.log(error);
			});
       		
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
							
							if(response.data.status != 1){
								
								if(response.data.company_id == 0){
								
									this.$parent.invoiceAllData = response.data;//所有表单数据
									
									this.$Message.success('获取成功');
									
								}else{
									
									this.$Message.warning('链接已失效！');
									
								}
								
							}else{
								
								this.$Message.warning('链接已失效！');
								
							}
							
						}
						
					})
					.catch(function(error) {
						console.log(error);
					});
                  	
                	
                }
                
            })
            
       	},
       	formsChange(){//模板表单发生改变时
    		
    		let A = this.$refs.formsInstance1.formsList.data;//公司
    		
    		let B = this.accountantFormsData;//会计
    		
    		let arr = [];
    		
    		arr.push(...A,...B);
    		
    		this.formsList = arr;
    		
    	},
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
		invoiceAllData(v){
			
			let vLength = 0;
			
			for(let item in v){
				vLength++;
			}
			
			if(vLength <= 0) return false;
			
			let accountantArr = [];
			
			let companyArr = [];
			
			v.conf.forEach(item => {
				
				if(item.user_type == 1){//会计
					
					accountantArr.push(item);
					
				}else if(item.user_type == 2){//公司
					
					companyArr.push(item);
					
				}
				
			});
			
			this.formsList = v.conf;//全部表单数据
			
			this.accountantFormsData = accountantArr;//会计表单数据
    	
    		this.companyFormsData = companyArr;//公司表单数据
    		
    		if(v.company_id != 0){
				this.getCompanyBasicforms(v.company_id,this.companyFormsData)//获取公司基本表单数据
			}
    		
    		this.formInline.companyId = v.company_id != 0 ? v.company_id : null;//公司ID
    		
    		this.formInline.money = v.money.toString() != 0 ? v.money.toString() : '';//金额
			
			this.imgShow(v.id);//图片显示
    		
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

<style>
	.my-class-al-selector .ivu-row{
		margin-left: 0 !important;
		margin-right: 0 !important;
	}
</style>