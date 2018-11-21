<template>

	<div>
		
	    <accountant
    	v-if="userType == 1"
    	:templateList="templateList"
    	:companyDataList="companyDataList"
    	style="margin-bottom: 4px;"
    	>
	    </accountant>
		
		<company
		ref="companyInstance"
		v-else-if="userType == 2"
		:invoiceAllData="invoiceAllData"
		:companyDataList="companyDataList"
		@on-submit="submitSucceed"
		style="margin-bottom: 4px;"
		>
		</company>
		
		<Card :shadow="true">
			
			<h1 slot="title">发票列表</h1>
			
			<list-component
			ref="tabelInstance"
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="invoiceSE"
			:companyDataList="companyDataList"
			:pageInfo="pageInfo"
			:controlShow="true"
			
			@on-route-change="routeChange">
			</list-component>
			
		</Card>
		
	</div>
	
</template>

<script>

import accountant from '@/components/invoice/accountant.vue';

import company from '@/components/invoice/company.vue';

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

let getUrlParams = (url,nameArr) => {//获取url属性值
	
	let startIndex = url.indexOf('?');
	
	let parameter = url.substr(startIndex);
	
	let price_obj = {};
	
	nameArr.forEach(item => {
		
		let reg = new RegExp("(^|&)" + item + "=([^&]*)(&|$)", "i"); //定义正则表达式 
    
    	let r = parameter.substr(1).match(reg);
		
		if (r != null){
			price_obj[item] = unescape(r[2]);
		}
		
	});
	
	let i = 0;
	
	for(let item in price_obj){
		i++;
	}
	
  	return price_obj;
  	
};

let template = () => {//模板列表（会计接口）

	return new Promise(resolve => {

		axios.post('Service/Template/index', {
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

let templateShow = () => {//公司发票模板表单显示（用户接口）

	return new Promise(resolve => {

		axios.post('Service/Order/detail', {
			id: sessionStorage.getItem('params')
		})
		.then(response => {
			resolve(response.data || null);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyList = () => {//公司列表（公共接口）

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

let invoiceList = (currentPage) => {//发票列表
	
	let urlProperty = getUrlParams(window.location.href,['currentPage','currentCompanyId','areaString']);
	
	let area_arr = urlProperty.areaString ? urlProperty.areaString.split(',') : [];
	
	return new Promise(resolve => {

		axios.post('Service/Order/index', {
			user_id: localStorage.getItem('userId'),
			page: currentPage || urlProperty.currentPage || 1,
			cid: urlProperty.currentCompanyId && urlProperty.currentCompanyId != 0 ? urlProperty.currentCompanyId : '',
			province: area_arr[0] || '',
			city: area_arr[1] || '',
			area: area_arr[2] || '',
			street: area_arr[3] || '',
		})
		.then(response => {
			resolve(response);
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
        	
        	pageInfo: {//页码信息
        		currentPage: 1,
        		total: 0,
        	},
        	
        	templateList: [],//模板表单列表
        	
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
                	fixed: 'left',
                	minWidth: 150,
                    title: '发票代码',
                    render: (h, params) => {
                   	
                   		return h('span',params.row.ticket_code || '- -')
                   	
                   	}
                },
                {
                	fixed: 'left',
                	minWidth: 150,
                    title: '发票编号',
                    render: (h, params) => {
                   	
                   		return h('span',params.row.invoice_number || '- -')
                   	
                   	}
                },
                {
                	ellipsis: true,
                	minWidth: 150,
                	title: '开票公司 (会计)',
                    render: (h, params) => {
                    	
                    	return h('span',params.row.mixture.account.title)
                    	
                    }
                },
                {
                	ellipsis: true,
                	minWidth: 150,
                	title: '需要开票公司 (用户)',
                    render: (h, params) => {
                    	
                    	return h('span',params.row.mixture.ticket.title)
                    	
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
                    title: '开票时间',
                    render: (h, params) => {
                    	
                    	return h('span',params.row.invoice_time || '- -')
                    	
                    }
                },
                {
                	fixed: 'right',
                	align: 'center',
                	width: 130,
                    title: '操作',
                    handle: ['show', 'edit'],
                },
            ],
            
            tableData: [],
        	
        }
    },
    methods: {//方法
    	
    	routeChange(){//路由改变时
    		
    		let invoice_list_data = null;
    		
    		(async() => {
    			
    			invoice_list_data = await invoiceList();//发票列表数据
    			
    			this.pageInfo = {//页码信息
	        		currentPage: invoice_list_data.page_info ? Number(invoice_list_data.page_info.page_absolute) : 1,
	        		total: invoice_list_data.page_info ? Number(invoice_list_data.page_info.record_count) : 0,
	        	};
	        	
	        	this.tableData = invoice_list_data.data || [];//表格数据
    			
    		})();
    		
    	},
    	
    	submitSucceed(){//提交发票成功时触发
    		
    		this.invoiceAllData = {};//发票所有数据
    		
			let invoice_list_data = null;
    		
    		(async() => {
    			
    			invoice_list_data = await invoiceList(1);//发票列表数据
    			
    			this.pageInfo = {//页码信息
	        		currentPage: invoice_list_data.page_info ? Number(invoice_list_data.page_info.page_absolute) : 1,
	        		total: invoice_list_data.page_info ? Number(invoice_list_data.page_info.record_count) : 0,
	        	};
	        	
	        	this.tableData = invoice_list_data.data || [];//表格数据
    			
    		})();
    		
    	},
    	
    	updateData(){//更新表格数据
    		
			let invoice_list_data = null;
    		
    		(async() => {
    			
    			invoice_list_data = await invoiceList();//发票列表数据
    			
    			this.pageInfo = {//页码信息
	        		currentPage: invoice_list_data.page_info ? Number(invoice_list_data.page_info.page_absolute) : 1,
	        		total: invoice_list_data.page_info ? Number(invoice_list_data.page_info.record_count) : 0,
	        	};
	        	
	        	this.tableData = invoice_list_data.data || [];//表格数据
    			
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
		
		let templateList = [];//模板列表
		
		let templateForms = null;//模板表单数据
		
		let company_list_data = [];//公司列表数据
		
		let invoice_list_data = null;//发票列表数据
		
		let invoice_url = '';//发票链接
		
		(async() => {
			
			//-------------公共代码-------------
			
			invoice_list_data = await invoiceList();//发票列表数据
			
			company_list_data = await companyList();//公司列表
			
			//-------------公共代码--------------
			
			if(localStorage.getItem('userType') == 1){//会计
				
				templateList = await template();//模板列表
				
			}
			else if(localStorage.getItem('userType') == 2){//用户
				
				if(sessionStorage.getItem('params')){
					
					invoice_url = sessionStorage.getItem('params');//发票链接
					
					templateForms = await templateShow();//发票模板表单数据
					
					sessionStorage.removeItem('params');
					
				}
				
			}
			
			next(vm => {
				
				vm.pageInfo = {//页码信息
	        		currentPage: invoice_list_data.page_info ? Number(invoice_list_data.page_info.page_absolute) : 1,
	        		total: invoice_list_data.page_info ? Number(invoice_list_data.page_info.record_count) : 0,
	        	};
				
				let companyArr = [];
				
				company_list_data.forEach(item => {
					companyArr.push({
						label: item.title,
						value: item.id,
					});
				})
				
				vm.companyDataList = companyArr;//公司列表
				
				vm.tableData = invoice_list_data.data || [];//表格数据
				
				if(localStorage.getItem('userType') == 1){//会计
					
					let templateArr = [];
					
					templateList.forEach(item => {
						templateArr.push({
							label: item.title,
							value: item.id,
							setting: item.setting,
							remark: item.remark,
						});
					});
					
					vm.templateList = templateArr;//模板列表
					
				}
				else if(localStorage.getItem('userType') == 2){//用户
					
					if(invoice_url){//发票链接
						vm.$refs.companyInstance.formInline2.invoiceURL = invoice_url;
					}
					
					
					if(templateForms){//模板表单
						
						if(templateForms.status != 1){
								
							if(templateForms.company_id == 0){
							
								vm.invoiceAllData = templateForms;//发票模板表单数据
								
								vm.$refs.companyInstance.modal = true;
								
								vm.$Message.success('获取成功');
								
							}else{
								
								vm.$Message.info('链接已失效！');//用户编辑后，再使用此链接
								
							}
							
						}else{
							
							vm.$Message.info('链接已失效！');//完成开票后，再使用此链接
							
						}
						
					}
					
				}
				
			});
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>