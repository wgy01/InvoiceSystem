<template>

	<div>
		
	    <accountant
    	v-if="userType == 1"
    	:templateList="templateList"
    	style="margin-bottom: 16px;"
    	>
	    </accountant>
		
		<company
		ref="companyInstance"
		v-else-if="userType == 2"
		:invoiceAllData="invoiceAllData"
		:companyDataList="companyDataList"
		@on-submit="submitSucceed"
		style="margin-bottom: 16px;"
		>
		</company>
		
		<Card>
			
			<div slot="title" style="display: flex;align-items: center;">
				<h1>发票列表</h1>
				<div v-if="userType == 2" style="margin-left: auto;">
					<label style="font-size: 12px;">查看公司发票</label>
		        	<Select v-model="companyId" filterable placeholder="选择公司" @on-change="companyChange" style="width: 200px;margin-left: 6px;">
		                <Option :value="0">所有公司发票</Option>
		                <Option v-for="item in companyDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		            </Select>
				</div>
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
			user_id: localStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let templateShow = () => {//公司发票模板表单显示

	return new Promise(resolve => {

		axios.post('Service/Order/detail', {
			id: sessionStorage.getItem('params')
		})
		.then(response => {
			resolve(response.data || {});
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyList = () => {//公司列表

	return new Promise(resolve => {

		axios.post('Service/Company/index', {
			user_id: localStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data || []);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let accountantInvoiceList = () => {//会计发票列表

	return new Promise(resolve => {

		axios.post('Service/Order/account_list', {
			account_id: localStorage.getItem('userId'),
		})
		.then(response => {
			resolve(response.data || []);
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

let AllcompanyInvoiceList = (userID) => {//所有公司发票列表

	return new Promise(resolve => {

		axios.post('Service/Order/index', {
			user_id: userID,
		})
		.then(response => {
			resolve(response.data || []);
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
        	
        	companyId: 0,
        	
        	templateList: [],
        	
        	userType: localStorage.getItem('userType'),
        	
        	invoiceAllData: {},//发票所有数据
        	
        	companyDataList: [],//公司列表
        	
        	tableColumns: [
                {
                	fixed: 'left',
                	align: 'center',
                	width: 70,
                    title: 'ID',
                    key: 'id'
                },
                {
                	ellipsis: true,
                	fixed: 'left',
                	minWidth: 150,
                    renderHeader: (h, params) => {
                    	
                    	let title = '';
                    	
                    	if(this.userType == 1){
                    		
                    		title = '需要开票公司 (用户)';
                    		
                    	}else if(this.userType == 2){
                    		
                    		title = '开票公司 (会计)';
                    		
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
                	width: 120,
                	title: '开票状态',
                    render: (h, params) => {
                    	
                    	let txt = '';
                    	
                    	if(params.row.status == 0){
                    		
                    		txt = '进行中';
                    		
                    	}else{
                    		
                    		txt = '已完成';
                    		
                    	}
                    	
                    	return h('span',{
                    		style: {
                    			color: params.row.status == 0 ? '#2d8cf0' : '#19be6b',
                    		}
                    	},txt)
                    	
                    }
                },
                {
                	width: 110,
                    title: '开票金额 (元)',
                    key: 'money'
                },
                {
                	width: 160,
                    title: '发票创建时间',
                    key: 'create_time'
                },
                {
                	width: 160,
                    title: '开票完成时间',
                    render: (h, params) => {
                    	
                    	return h('span',params.row.invoice_time || '- -')
                    	
                    }
                },
//              {
//                  title: '链接',
//                  render: (h, params) => {
//                  	
//                  	let invoiceUrl = '';
//  		
//			    		let getUrlParams = (url,name) => {
//			    			let startIndex = url.indexOf('?');
//				    		let parameter = url.substr(startIndex);
//						    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
//						    let r = parameter.substr(1).match(reg);  
//						    if (r != null) return unescape(r[2]);
//						  	return null;
//			    		}
//			    		
//			    		invoiceUrl = 'http://'+ window.location.host +'/#/'+ getUrlParams(params.row.link,'orderID');
//                  	
//                  	return h('span',invoiceUrl)
//                  	
//                  }
//              },
                {
                	fixed: 'right',
                	align: 'center',
                	width: 130,
                    title: '操作',
                    handle: ['edit','show'],
                },
            ],
            
            tableData: [],
        	
        }
    },
    methods: {//方法
    	
    	companyChange(val){//表格筛选公司改变时
    		
    		(async() => {
    			
	    		if(val == 0){
	    			
	    			this.tableData = await AllcompanyInvoiceList(localStorage.getItem('userId'));//所有公司发票列表
	    			
	    		}else{
	    			
	    			this.tableData = await companyInvoiceList(val);
	    			
	    		}
	    			
    		})();
    		
    		
    	},
    	submitSucceed(companyId){//提交发票成功时触发
    		
    		this.invoiceAllData = {};//发票所有数据
    		
			(async() => {
				
				this.companyId = 0;
				
				this.tableData = await AllcompanyInvoiceList(localStorage.getItem('userId'));
				
			})();
    		
    	},
    	updateData(){//更新表格数据
    		
			(async() => { //es7异步函数
				
				if(this.userType == 1){
					
					let tableData = await accountantInvoiceList();
					
					let tableArr = [];
					
					tableData.forEach(item => {
						
						if(item.company_id != 0){
							tableArr.push(item);
						}
						
					})
					
					this.tableData = tableArr;
					
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
			
			if(localStorage.getItem('userType') == 1){//会计
				
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
				
			}else if(localStorage.getItem('userType') == 2){//用户
				
				companyDataList = await companyList();//公司列表
				
				tableData = await AllcompanyInvoiceList(localStorage.getItem('userId'));//所有公司发票列表
				
				if(sessionStorage.getItem('params')){
					
					templateForms = await templateShow();//发票模板表单数据
					
					sessionStorage.removeItem('params');
					
				}
				
				next(vm => {
					
					if(templateForms){
						
						if(templateForms.status != 1){
								
							if(templateForms.company_id == 0){
							
								vm.invoiceAllData = templateForms;//发票模板表单数据
								
								vm.$Message.success('获取成功');
								
							}else{
								
								vm.$Message.error('编辑后的链接已失效，请从发票列表进行编辑!');
								
							}
							
						}else{
							
							vm.$Message.error('已开票的链接不能再编辑!');
							
						}
						
					}
					
					if(companyDataList){//公司列表
						let arr = [];
						companyDataList.forEach(item => {
							arr.push({
								label: item.title,
								value: item.id,
							});
						})
						vm.companyDataList = arr;
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