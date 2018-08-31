<template>

	<div>
		
		<Card shadow>
			<Button type="primary" @click="modal = true;">创建发票链接</Button>
		</Card>
		
		<Modal v-model="modal" width="80%">
			
	        <p slot="header">创建发票链接</p>
	        
	        <div>
	        	
	        	<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
						
					<FormItem label="开票公司" prop="companyId">
			        	<Select v-model="formInline.companyId" filterable placeholder="选择公司" style="max-width: 250px;">
			                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			            </Select>
			        </FormItem>
					
			        <FormItem label="选择模板" prop="templateID">
			        	<Select v-model="formInline.templateID" filterable placeholder="选择模板" @on-change="selectChange" style="width: 250px;">
			                <Option v-for="item in templateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			            </Select>
			        </FormItem>
			        
			        <Button type="primary" @click="onClickUrl('formInline')">点击生成链接</Button>
			        
			    </Form>
				
				
				<div style="padding: 26px 0 16px;">
					<Alert type="warning" :show-icon="true">
						注意：生成的链接会计用户没有权限访问，只有公司用户才有权限访问。
					</Alert>
					<div style="display: flex;">
						
						<label style="flex-shrink: 0;font-weight: bold;color: #ff9900;">
							<Icon type="link"></Icon>
							<span>点击链接进行复制：</span>
						</label>
						
						<div class="Masked-box">
							
							<div class="Masked" v-show="masked">
								<Icon type="information-circled"></Icon>
								<span>链接已更新，请重新生成</span>
							</div>
							
							<Tooltip content="点击链接进行复制" placement="top">
								<a v-clipboard:copy="invoiceUrl" v-clipboard:success="onCopy">{{invoiceUrl}}</a>
					        </Tooltip>
					        
						</div>
						
				    </div>
				</div>
			    
			    <Card style="margin-top: 16px">
					
					<h1 slot="title">模板预览</h1>
					
					<template-s-e
		        	type="show"
		        	:dataID="Number(formInline.templateID)"
		        	>
		        	</template-s-e>
					
				</Card>
	        	
	        </div>
	        
	        <div slot="footer">
	        	<Button @click="modal = false;">关闭</Button>
	        </div>
	        
	    </Modal>
		
	</div>
	
</template>

<script>

import templateSE from '@/components/template/template-s-e.vue';

export default {
	components:{//组件模板
		templateSE,
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		templateList: {//模板数据
			type: Array,
			default: () => {return []}
		},
		
		companyDataList: Array,
		
	},
    data () {//数据
        return {
        	
        	modal: false,
        	
        	formInline: {
        		templateID: '',
        		companyId: '',
        	},
        	
        	ruleInline: {
                templateID: [
                    { type: 'number', required: true, message: '请选择模板', trigger: 'change' }
                ],
                companyId: [
                    { type: 'number', required: true, message: '请选择公司', trigger: 'change' }
                ],
        	},
        	
        	invoiceUrl: '',
        	
        	masked: false,
        	
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
    	selectChange(val){//选择模板改变时
    		
    		if(this.invoiceUrl){
    			this.masked = true;
    		}
    		
    	},
    	onCopy(){//复制
    		
        	this.$Message.success('复制成功');
        	
    	},
    	setInvoiceUrl(URL){//发票链接
    		
    		let invoiceUrl = '';
    		
    		let getUrlParams = (url,name) => {
    			let startIndex = url.indexOf('?');
	    		let parameter = url.substr(startIndex);
			    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
			    let r = parameter.substr(1).match(reg);  
			    if (r != null) return unescape(r[2]);
			  	return null;
    		}
    		
    		invoiceUrl = 'http://'+ window.location.host +'/#/'+ getUrlParams(URL,'orderID');
    		
    		return invoiceUrl;
    		
    	},
    	onClickUrl(name) {//点击生成链接
            
             this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                	this.$axios.post('Service/Company/index', {
		    			user_id: localStorage.getItem('userId'),
					})
					.then(response => {
						
						if(response.status == 200){
							
							this.$axios.post('Service/Order/add', {
				    			company_account: this.formInline.companyId,
				    			template_id: this.formInline.templateID,
							})
							.then(response => {
								
								if(response.status == 200){
									this.invoiceUrl = this.setInvoiceUrl(response.data.link);
									this.masked = false;
								}
								
							})
							.catch(function (error) {
								console.log(error);
							});
							
						}else{
							
							this.$Message.warning('请创建公司！');
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            });
            
    	},
    	
    },
    computed: {//计算属性
        
    },
    watch: {//监测数据变化
		
		templateList(){//默认模板
			if(this.templateList && this.templateList.length > 0){
	    		this.formInline.templateID = this.templateList[0].value;
	    	}
		},
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

<style scoped lang="less">
	
	.Masked-box{
		width: 100%;
		position: relative;
		display: inline-block;
		.Masked{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(255,255,255,0.8);
			color: #ed3f14;
		}
	}
	
</style>