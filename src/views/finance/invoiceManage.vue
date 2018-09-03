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
		
		<Card>
			
			<div slot="title" style="display: flex;align-items: center;">
				<h1>发票列表</h1>
				<div style="margin-left: auto;">
					<label style="font-size: 12px;">查看公司发票</label>
		        	<Select v-model="companyId" filterable placeholder="选择公司" @on-change="companyChange" style="width: 250px;margin-left: 6px;">
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
			
			<div>
				<Page :total="pageInfo.total" show-total show-elevator @on-change="pageChange" />
			</div>
			
		</Card>
		
	</div>
	
</template>

<script>

import accountant from '@/components/invoice/accountant.vue';

import company from '@/components/invoice/company.vue';

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

let template = () => {//模板列表（会计接口）

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

let templateShow = () => {//公司发票模板表单显示（用户接口）

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

let companyInvoiceList = (companyID) => {//根据公司ID获取发票列表

	return new Promise(resolve => {

		axios.post('Service/Order/get_by_company', {
			cid: companyID,
		})
		.then(response => {
			resolve(response.data || []);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let AllcompanyInvoiceList = (pageNum = 1) => {//所有公司发票列表（公共接口）

	return new Promise(resolve => {

		axios.post('Service/Order/index', {
			user_id: localStorage.getItem('userId'),
			page: pageNum,
		})
		.then(response => {
			console.log(response);
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
        		total: 0,
        		currentPage: 1,
        		pageSize: 10,
        	},
        	
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
    	
    	pageChange(pageNum){//页码改变
    		
    		(async() => {
    			
    			let listData = null;
    			
    			listData = await AllcompanyInvoiceList(pageNum);//所有公司发票列表
    			
				this.tableData = listData.data;
    			
    		})();
    		
    	},
    	
    	companyChange(val){//表格筛选公司改变时
    		
    		(async() => {
    			
    			if(this.userType == 1){//会计
					
					let listData = null;
					
					if(val == 0){
	    			
		    			listData = await AllcompanyInvoiceList(1);//所有公司发票列表
		    			
		    		}else{
		    			
		    			listData = await companyInvoiceList(val);//单个公司发票列表
		    			
		    		}
					
					let tableArr = [];
					
					listData.data.forEach(item => {
						
						if(item.company_id != 0){
							tableArr.push(item);
						}
						
					})
					
					this.tableData = tableArr;
					
				}else if(this.userType == 2){//用户
					
					let listData = null;
					
					if(val == 0){
	    				
	    				listData = await AllcompanyInvoiceList(1);//所有公司发票列表
	    				
		    			this.tableData = listData.data;
		    			
		    		}else{
		    			
		    			listData = await companyInvoiceList(val);//单个公司发票列表
		    			
		    			this.tableData = listData.data;
		    			
		    		}
					
				}
    			
    		})();
    		
    		
    	},
    	submitSucceed(companyId){//提交发票成功时触发
    		
    		this.invoiceAllData = {};//发票所有数据
    		
			(async() => {
				
				this.companyId = 0;
				
				this.tableData = await AllcompanyInvoiceList(1);
				
			})();
    		
    	},
    	updateData(){//更新表格数据
    		
			(async() => { //es7异步函数
				
				if(this.userType == 1){//会计
					
					let listData = null;
					
					if(this.companyId == 0){
	    				
	    				listData = await AllcompanyInvoiceList(1);//所有公司发票列表
	    				
		    		}else{
		    			
		    			listData = await companyInvoiceList(this.companyId);//单个公司发票列表
		    			
		    		}
					
					let tableArr = [];
					
					listData.data.forEach(item => {
						
						if(item.company_id != 0){
							tableArr.push(item);
						}
						
					})
					
					this.tableData = tableArr;
					
				}else if(this.userType == 2){//用户
					
					
					let listData = null;
					
					if(this.companyId == 0){
	    				
	    				listData = await AllcompanyInvoiceList(1);//所有公司发票列表
	    				
		    			this.tableData = listData.data;
		    			
		    		}else{
		    			
		    			listData = await companyInvoiceList(this.companyId);//单个公司发票列表
		    			
		    			this.tableData = listData.data;
		    			
		    		}
					
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
		
		let listData = null;//发票列表
		
		(async() => { //es7异步函数
			
			//-------------公用--------------------------------------------------
			listData = await AllcompanyInvoiceList(1);//所有公司发票列表
			
			companyDataList = await companyList();//公司列表
			
			//--------------------------会计-----------------------------------
			if(localStorage.getItem('userType') == 1){
				
				templateList = await template();//模板列表
				
				next(vm => {//回调
					
					vm.pageInfo = {//页码信息
						total: Number(listData.page_info.record_count),
		        		currentPage: Number(listData.page_info.page_absolute),
		        		pageSize: Number(listData.page_info.page_size),
					}
					
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
					
					if(companyDataList){//公司列表
						let arr = [];
						companyDataList.forEach(item => {
							arr.push({
								label: item.title,
								value: item.id,
							});
						})
						vm.companyDataList = arr;
						console.log(vm.companyDataList);
					}
					
					//列出用户已编辑的发票列表数据
					let tableArr = [];
					
					listData.data.forEach(item => {
						
						if(item.company_id != 0){
							tableArr.push(item);
						}
						
					})
					
					vm.tableData = tableArr;
					
				})
				
			}
			
			//--------------------------用户-----------------------------------
			else if(localStorage.getItem('userType') == 2){
				
				if(sessionStorage.getItem('params')){
					
					templateForms = await templateShow();//发票模板表单数据
					
					sessionStorage.removeItem('params');
					
				}
				
				next(vm => {
					
					vm.pageInfo = {//页码信息
						total: Number(listData.page_info.record_count),
		        		currentPage: Number(listData.page_info.page_absolute),
		        		pageSize: Number(listData.page_info.page_size),
					}
					
					if(templateForms){
						
						if(templateForms.status != 1){
								
							if(templateForms.company_id == 0){
							
								vm.invoiceAllData = templateForms;//发票模板表单数据
								
								vm.$refs.companyInstance.modal = true;
								
								vm.$Message.success('获取成功');
								
							}else{
								
								this.$Message.warning('链接已失效！');//用户编辑后，再使用此链接
								
							}
							
						}else{
							
							this.$Message.warning('链接已失效！');//完成开票后，再使用此链接
							
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
					
					vm.tableData = listData.data;
					
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