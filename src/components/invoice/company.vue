<template>

	<div>
		
		<!--发票获取-->
		<Collapse style="margin-bottom: 16px;">
			
	        <Panel>
	        	<h1 style="display: inline-block;">获取其他链接发票</h1>
	        	<div slot="content">
	        	
					<!--<Card style="margin-bottom: 16px;">-->
						
						<!--<div>-->
							
							<Form ref="formInline2" :model="formInline2" :rules="ruleInline2" :label-width="70">
								
						        <FormItem label="发票链接" prop="invoiceURL">
						            <Input v-model="formInline2.invoiceURL" clearable placeholder="输入链接" style="max-width: 500px;"></Input>
						            <Button type="primary" @click="handleSubmit2('formInline2')">获取发票</Button>
						        </FormItem>
						        
						    </Form>
							
						<!--</div>-->
						
					<!--</Card>-->
					
	        	</div>
	        	
	        </Panel>
	        
	    </Collapse>
		
		<!--操作发票-->
		<Card v-if="invoiceID">
			
			<h1 slot="title">{{companyName}}</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="90">
					
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
		    		
		    		<h2 slot="title">公司填写</h2>
		    		
		    		<forms-template
		            ref="formsInstance1"
		            @on-change="formsChange"
		            :NoHandle="false"
		            :user-type="2"
		            :out-forms-data="companyFormsData"
		            show-type="edit2"
		            >
		            </forms-template>
		    		
		    	</Card>
		    	
		    	<Card v-show="userType != 2">
		    		
		    		<h2 slot="title">会计填写</h2>
		    		
		    		<forms-template
		            ref="formsInstance2"
		            @on-change="formsChange"
		            :NoHandle="true"
		            :user-type="1"
		            :out-forms-data="accountantFormsData"
		            show-type="edit2"
		            >
		            </forms-template>
		    		
		    	</Card>
			    
			    <Card>
			    	
			    	<h2 slot="title">图片上传</h2>
			    	
			    	<upload
		    		:img-list="imgList"
		    		@on-success="uploadSuccess"
		    		@on-del="del">
			    	</upload>
			    	
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
		
		invoiceID: Number,//发票ID
		
		allFormsData: Array,//所有表单数据
		
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
        		//invoiceURL: sessionStorage.getItem('params') ? 'http://'+ window.location.host +'/#/'+ sessionStorage.getItem('params') : '',
        		invoiceURL: '',
        	},
        	ruleInline2: {
        		invoiceURL: [
                    { required: true, message: '请输入链接', trigger: 'blur' }
                ],
        	},
        	
        	formsList: [],//发生改变后的表单数据
        	
        	userType: sessionStorage.getItem('userType'),//用户类型
        	
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
    	handleSubmit(name) {//提交发票
    		
            this.$refs[name].validate((valid) => {
            	
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
		    					id: this.invoiceID,
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
									
									this.$emit('on-submit',this.formInline.companyId);
									
									this.$Message.success('提交成功');
									
								}
								
							})
							.catch(function (error) {
								console.log(error);
							});
							
						}
						
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
						
						if(response.status == 200 && response.data.status != 1){
							
							console.log();
							
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
							
							this.imgShow(response.data.id);//图片显示
							
							this.$parent.invoiceID = response.data.id;//发票ID
							
							this.formInline.money = response.data.money.toString();//金额
							
							this.$parent.allFormsData = response.data.conf;//所有表单数据
							
							this.$parent.companyName = response.data.mixture.data.account.title;//会计公司名称
							
							this.$parent.accountantFormsData = accountantArr;//会计数据
							
							this.$parent.companyFormsData = companyArr;//公司数据
							
							//sessionStorage.setItem('params',params);//存到本地存储里
							
							this.formInline2.invoiceURL = '';
							
							this.$Message.success('获取成功');
							
						}else{
							
							this.$Message.error('已完成的发票不能再编辑!');
							
						}
						
					})
					.catch(function(error) {
						console.log(error);
					});
                  	
                	
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
			if(this.companyDataList.length > 0){
	    		this.formInline.companyId = this.companyDataList[0].value;
	    	}
		},
		allFormsData(v){
			this.formsList = v;
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