<template>

	<div>
		
	    <accountant v-if="userType == 1" :templateList="templateList" style="margin-bottom: 16px;"></accountant>
		
		<company
		style="margin-bottom: 16px;"
		v-else-if="userType == 2"
		:invoiceID="invoiceID"
		:allFormsData="allFormsData"
		:companyName="companyName"
		:accountantFormsData="accountantFormsData"
		:companyFormsData="companyFormsData"
		:companyDataList="companyDataList"
		@on-submit="submitSucceed"
		>
		</company>
		
		<Card>
			
			<div slot="title" style="display: flex;align-items: center;">
				<h1>发票列表</h1>
	        	<Select v-if="userType == 2" v-model="companyId" filterable placeholder="选择公司" @on-change="companyChange" style="width: 200px;margin-left: 16px;">
	                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	            </Select>
			</div>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="invoiceSE"
			>
			</list-component>
			
		</Card>
		
	</div>
	
</template>

<script>

import accountant from '@/components/invoice/accountant.vue';

import company from '@/components/invoice/company.vue';

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

let template = () => {//模板列表

	return new Promise(resolve => {

		axios.post('Service/Template/index', {
			user_id: sessionStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let templateShow = () => {//模板表单显示

	return new Promise(resolve => {

		axios.post('Service/Order/detail', {
			id: sessionStorage.getItem('params')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyList = () => {//公司列表

	return new Promise(resolve => {

		axios.post('Service/Company/index', {
			user_id: sessionStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let accountantInvoiceList = () => {//会计发票列表

	return new Promise(resolve => {

		axios.post('Service/Order/account_list', {
			account_id: sessionStorage.getItem('userId'),
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyInvoiceList = (companyID) => {//公司发票列表

	return new Promise(resolve => {

		axios.post('Service/Order/ticket_list', {
			company_id: companyID,
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

export default {
	components:{//组件模板
		accountant,
		company,
		listComponent,
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
	},
    data () {//数据
        return {
        	
        	companyId: '',
        	
        	templateList: [],
        	
        	userType: sessionStorage.getItem('userType'),
        	
        	invoiceID: null,//发票id
        	
        	allFormsData: [],//所有表单数据
        	
        	companyName: '',//会计公司名称
        	
        	accountantFormsData: [],//会计数据
        	
        	companyFormsData: [],//公司数据
        	
        	companyDataList: [],//公司列表
        	
        	tableColumns: [
                {
                	align: 'center',
                	width: 80,
                    title: 'ID',
                    key: 'id'
                },
                {
                    renderHeader: (h, params) => {
                    	
                    	let title = '';
                    	
                    	if(this.userType == 1){
                    		
                    		title = '用户公司';
                    		
                    	}else if(this.userType == 2){
                    		
                    		title = '会计公司';
                    		
                    	}
                    	
                    	return h('span',title)
                    	
                    },
                    render: (h, params) => {
                    	
                    	let txt = '';
                    	
                    	if(this.userType == 1){
                    		
                    		txt = params.row.mixture.data.ticket.title;
                    		
                    	}else if(this.userType == 2){
                    		
                    		txt = params.row.mixture.data.account.title;
                    		
                    	}
                    	
                    	return h('span',txt)
                    	
                    }
                },
                {
                	width: 100,
                    title: '金额',
                    key: 'money'
                },
                {
                	width: 160,
                    title: '创建时间',
                    key: 'create_time'
                },
                {
                	width: 160,
                    title: '更新时间',
                    key: 'update_time'
                },
                {
                    title: '链接',
                    render: (h, params) => {
                    	
                    	let invoiceUrl = '';
    		
			    		let getUrlParams = (url,name) => {
			    			let startIndex = url.indexOf('?');
				    		let parameter = url.substr(startIndex);
						    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
						    let r = parameter.substr(1).match(reg);  
						    if (r != null) return unescape(r[2]);
						  	return null;
			    		}
			    		
			    		invoiceUrl = 'http://'+ window.location.host +'/#/'+ getUrlParams(params.row.link,'orderID');
                    	
                    	return h('span',invoiceUrl)
                    	
                    }
                },
                {
                	align: 'center',
                	width: 130,
                    title: '操作',
                    handle: ['edit','show'],
                },
            ],
            
            tableData: [],
        	
        	tf: false,
        	
        }
    },
    methods: {//方法
    	
    	companyChange(val){//表格选择公司改变时
    		
    		(async() => {
    			if(this.tf){
    				this.tableData = await companyInvoiceList(val);
    			}
    		})();
    		
    		this.tf = true;
    		
    	},
    	submitSucceed(companyId){//提交发票成功时触发
    		
    		if(this.companyId == companyId){
    			
    			(async() => {
    				this.tableData = await companyInvoiceList(companyId);
    			})();
    			
    		}else{
    			
    			this.companyId = companyId;
    			
    		}
    		
    	},
    	updateData(){//更新表格数据
    		
			(async() => { //es7异步函数
				
				if(this.userType == 1){
					this.tableData = await accountantInvoiceList();
				}else if(this.userType == 2){
					this.tableData = await companyInvoiceList(this.companyId);
				}
				
			})();
			
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
	
	//=================组件路由勾子==============================
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用
		
		let templateList = null;//模板列表
		
		let templateForms = null;//模板表单
		
		let companyDataList = [];//公司列表数据
		
		let tableData = [];//发票列表
		
		(async() => { //es7异步函数
			
			if(sessionStorage.getItem('userType') == 1){//会计
				
				templateList = await template();//模板列表
				
				tableData = await accountantInvoiceList();//发票列表
				
				next(vm => {//回调
					
					if(templateList){
						let arr = [];
						templateList.forEach(item => {//模板数据
							arr.push({
								label: item.title,
								value: item.id,
								setting: item.setting,
								remark: item.remark,
							});
						});
						vm.templateList = arr;
					}
					
					let tableArr = [];
					
					tableData.forEach(item => {
						
						if(item.company_id != 0){
							tableArr.push(item);
						}
						
					})
					
					vm.tableData = tableArr;
					
				})
				
			}else if(sessionStorage.getItem('userType') == 2){//用户
				
				companyDataList = await companyList();//公司列表
				
				if(companyDataList && companyDataList.length > 0){
					
					tableData = await companyInvoiceList(companyDataList[0].id);//发票列表
					
				}
				
				
				if(sessionStorage.getItem('params')){
					templateForms = await templateShow();//模板表单
				}
				
				next(vm => {//回调
					
					if(templateForms){
						let accountantArr = [];
    					let companyArr = [];
						templateForms.conf.forEach(item => {
							if(item.user_type == 1){//会计
								accountantArr.push(item);
							}
							if(item.user_type == 2){//公司
								companyArr.push(item);
							}
						});
						vm.allFormsData = templateForms.conf;//所有表单数据
						vm.accountantFormsData = accountantArr;//会计表单数据
						vm.companyFormsData = companyArr;//公司表单数据
						vm.invoiceID = templateForms.id;//发票ID
						vm.companyName = templateForms.mixture.data.account.title;//公司名称
					}
					
					if(companyDataList){
						let arr = [];
						companyDataList.forEach(item => {
							arr.push({
								label: item.title,
								value: item.id,
							});
						})
						vm.companyDataList = arr;
					}
					
					if(companyDataList && companyDataList.length > 0){
						vm.companyId = companyDataList[0].id;//默认公司ID
					}
					
					vm.tableData = tableData;
					
				})
				
			}else{
				
				next();
				
			}
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>