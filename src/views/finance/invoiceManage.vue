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
			
			<h1 slot="title">发票列表</h1>
			
			<list-component
			ref="tabelInstance"
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="invoiceSE"
			:total="total"
			:companyDataList="companyDataList"
			:screenInfo="screenInfo"
			:controlShow="true"
			
			@on-company-change="companyChange"
			@on-page-change="pageChange"
			@on-area-change="areaChange"
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

let getUrlParams = (url,name) => {//获取url属性值
	let startIndex = url.indexOf('?');
	let parameter = url.substr(startIndex);
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
    let r = parameter.substr(1).match(reg);  
    if (r != null) return unescape(r[2]);
  	return null;
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

let companyInvoiceList = (companyID,currentPage) => {//根据公司ID获取发票列表
	
	let urlPageNum = getUrlParams(window.location.href,'currentPage');
	
	let urlCompanyId = getUrlParams(window.location.href,'currentCompanyId') || 0;
	
	if(!urlPageNum || urlPageNum == 0){
		urlPageNum = 1;
	}
	
	return new Promise(resolve => {

		axios.post('Service/Order/get_by_company', {
			cid: companyID || urlCompanyId,
			page: currentPage || urlPageNum,
		})
		.then(response => {
			resolve(response);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let AllcompanyInvoiceList = (currentPage) => {//所有公司发票列表（公共接口）
	
	let urlPageNum = getUrlParams(window.location.href,'currentPage');
	
	if(!urlPageNum || urlPageNum == 0){
		urlPageNum = 1;
	}
	
	return new Promise(resolve => {

		axios.post('Service/Order/index', {
			user_id: localStorage.getItem('userId'),
			page: currentPage || urlPageNum,
		})
		.then(response => {
			resolve(response);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let getAreaScreenList = (areaArr,currentPage) => {//地区筛选后的发票列表数据
	
	return new Promise(resolve => {

		axios.post('Service/Order/get_by_area', {
			user_id: localStorage.getItem('userId'),
			page: currentPage || 1,
			province: areaArr[0] || '',
			city: areaArr[1] || '',
			area: areaArr[2] || '',
			street: areaArr[3] || '',
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
        	
        	total: 0,
        	
        	screenInfo: {
        		currentPage: 1,
        		companyId: 0,
        		areaData: [],
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
    	
    	areaChange(dataArr){//地区选择器改变时
    		
    		this.screenInfo.areaData = dataArr;
    		
    		this.screenInfo.currentPage = 1;
    		
    		this.screenInfo.companyId = 0;
    		
    		let listData = null;
    		
    		(async() => {
    			
	    		if(dataArr.length > 0){
	    			
	    			listData = await getAreaScreenList(dataArr,1);//地区筛选后的发票列表数据
	    			
	    		}else{
	    			
	  				listData = await AllcompanyInvoiceList();//所有公司发票列表
					
	    		}
	    		
				this.total = listData.page_info ? listData.page_info.record_count : 0;
				
				this.tableData = listData.data;
    			
    		})();
    		
    		
    	},
    	
//  	routeChange(){//路由改变时
//  		
//  		(async() => {
//  			
//  			let listData = null;
//				
//				if(this.$route.query.currentCompanyId){
//					
//					if(this.$route.query.currentCompanyId == 0){
//  			
//		    			listData = await AllcompanyInvoiceList();//所有公司发票列表
//		    			
//		    		}else{
//		    			
//		    			listData = await companyInvoiceList();//单个公司发票列表
//		    			
//		    		}
//					
//				}else{
//					
//					listData = await AllcompanyInvoiceList();//所有公司发票列表
//					
//				}
//				
//				this.tableData = listData.data;
//  			
//  		})();
//  		
//  	},
    	
    	pageChange(pageNum){//页码改变
    		
    		this.screenInfo.currentPage = pageNum;
    		
    		(async() => {
    			
    			let listData = null;
    			
    			if(this.screenInfo.areaData.length > 0){
    				
    				listData = await getAreaScreenList(this.screenInfo.areaData,pageNum);//地区筛选后的发票列表数据
    				
    			}else{
    				
    				if(this.screenInfo.companyId == 0){
    				
    					listData = await AllcompanyInvoiceList(pageNum);//所有公司发票列表
    				
    				}else{
    				
    					listData = await companyInvoiceList(this.screenInfo.companyId,pageNum);//单个公司发票列表
    				
    				}
    				
    			}
    			
    			
    			this.total = listData.page_info ? listData.page_info.record_count : 0;
    			
				this.tableData = listData.data;
    			
    		})();
    		
    	},
    	
    	companyChange(companyId){//公司下拉选择改变时
    		
    		this.screenInfo.companyId = companyId;
    		
    		this.screenInfo.currentPage = 1;
    		
    		this.screenInfo.areaData = [];
    		
    		(async() => {
    			
				let listData = null;
				
				if(companyId == 0){
    			
	    			listData = await AllcompanyInvoiceList();//所有公司发票列表
	    			
	    		}else{
	    			
	    			listData = await companyInvoiceList(companyId,1);//单个公司发票列表
	    			
	    		}
	    		
	    		this.total = listData.page_info ? listData.page_info.record_count : 0;
				
				this.tableData = listData.data;
    			
    		})();
    		
    	},
    	submitSucceed(){//提交发票成功时触发
    		
    		this.invoiceAllData = {};//发票所有数据
    		
			(async() => {
				
				let listData = null;
				
//				if(this.$route.query.currentCompanyId){
					
					if(this.screenInfo.companyId == 0){
    			
		    			listData = await AllcompanyInvoiceList(this.screenInfo.currentPage);//所有公司发票列表
		    			
		    		}else{
		    			
		    			listData = await companyInvoiceList(this.screenInfo.companyId,this.screenInfo.currentPage);//单个公司发票列表
		    			
		    		}
					
//				}else{
//					
//					listData = await AllcompanyInvoiceList();//所有公司发票列表
//					
//				}
				
				this.total = listData.page_info ? listData.page_info.record_count : 0;
				
				this.tableData = listData.data;
				
			})();
    		
    	},
    	updateData(){//更新表格数据
    		
			(async() => { //es7异步函数
				
				let listData = null;
				
//				if(this.$route.query.currentCompanyId){
					
					if(this.screenInfo.companyId == 0){
    			
		    			listData = await AllcompanyInvoiceList(this.screenInfo.currentPage);//所有公司发票列表
		    			
		    		}else{
		    			
		    			listData = await companyInvoiceList(this.screenInfo.companyId,this.screenInfo.currentPage);//单个公司发票列表
		    			
		    		}
					
//				}else{
//					
//					listData = await AllcompanyInvoiceList();//所有公司发票列表
//					
//				}
				
				this.total = listData.page_info ? listData.page_info.record_count : 0;
				
				this.tableData = listData.data;
				
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
		
		let templateForms = null;//模板表单
		
		let companyDataList = [];//公司列表数据
		
		let listData = null;//列表数据
		
		//let urlCompanyId = getUrlParams(window.location.href,'currentCompanyId');
		
		(async() => { //es7异步函数
			
			//-------------公用--------------------------------------------------
			
//			if(urlCompanyId){
//				
//				if(urlCompanyId == 0){
//				
//					listData = await AllcompanyInvoiceList();//所有公司发票列表
//				
//				}else{
//				
//					listData = await companyInvoiceList();//单个公司发票列表
//				
//				}
//				
//			}else{
				
				listData = await AllcompanyInvoiceList();//所有公司发票列表
				
//			}
			
			companyDataList = await companyList();//公司列表
			
			if(localStorage.getItem('userType') == 1){//会计
				
				templateList = await template();//模板列表
				
			}else if(localStorage.getItem('userType') == 2){//用户
				
				if(sessionStorage.getItem('params')){
					
					templateForms = await templateShow();//发票模板表单数据
					
					sessionStorage.removeItem('params');
					
				}
				
			}
			
			next(vm => {
				
				vm.total = listData.page_info ? Number(listData.page_info.record_count) : 0;
				
				let arr = [];
				
				companyDataList.forEach(item => {
					arr.push({
						label: item.title,
						value: item.id,
					});
				})
				
				vm.companyDataList = arr;//公司列表
				
				vm.tableData = listData.data || [];//表格数据
				
				if(localStorage.getItem('userType') == 1){//会计
					
					let arr = [];
					
					templateList.forEach(item => {
						arr.push({
							label: item.title,
							value: item.id,
							setting: item.setting,
							remark: item.remark,
						});
					});
					
					vm.templateList = arr;//模板列表
					
				}else if(localStorage.getItem('userType') == 2){//用户
					
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