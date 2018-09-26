<template>

	<div>
		{{initStateInfo.companyId}}
		<div v-if="controlShow" style="margin-bottom: 14px;display: flex;align-items: center;">
			
			<Select v-model="initStateInfo.currentCompanyId" filterable placeholder="选择公司" @on-change="companyChange" style="max-width: 260px;">
                <Option :value="0">所有公司发票</Option>
                <Option v-for="item in companyDataList" :value="Number(item.value)" :key="item.value">{{ item.label }}</Option>
            </Select>
            
            <div style="width: 400px;height: 32px;margin-left: 16px;position: relative;">
            	<div style="position: absolute;left: 0;top: 0;z-index: 5;">
	            	<Tooltip content="选择筛选级别" placement="top">
		            	<Select v-model="initStateInfo.levelNum" placeholder="选择级别" @on-change="levelChange" style="width: 60px;">
			                <Option :value="0">省份</Option>
			                <Option :value="1">城市</Option>
			                <!--<Option :value="2">地区</Option>
			                <Option :value="3">街道</Option>-->
			            </Select>
			        </Tooltip>
            	</div>
			    <al-cascader class="al-cascader-class" v-if="alShow" v-model="areaData" :level="initStateInfo.levelNum" placeholder="请选择地区" data-type="code" @on-change="alCascader" style="width: 100%;" />
            </div>
            
		</div>
		
		<Table border :columns="tableColumns" :data="tableData"></Table>
		
		<div v-if="controlShow" style="margin-top: 14px;display: flex;align-items: center;">
			
			<Page ref="pageInstance" :total="pageInfo.total || 0" :current="initStateInfo.currentPage" show-total show-elevator @on-change="pageChange" style="margin-left: auto;" />
			
		</div>
		
		<!--弹窗控件-->
		<Modal v-model="modalShow" width="80%">
			<!--标题-->
	        <p slot="header">{{title}}</p>
	        
	        <!--内容-->
	        <div v-if="modalShow">
	        	
	        	<!--模板-->
	        	<template-s-e
	        	v-if="componentType == 'templateSE'"
	        	:type="btnType"
	        	:dataID="dataID"
	        	>
	        	</template-s-e>
	        	
	        	<!--发票-->
	        	<invoice-s-e
	        	v-if="componentType == 'invoiceSE'"
	        	:type="btnType"
	        	:dataID="dataID"
	        	:invoiceLink="invoiceLink"
	        	:status="status"
	        	>
	        	</invoice-s-e>
	        	
	        	<!--公司-->
	        	<company-s-e
	        	v-if="componentType == 'companySE'"
	        	:type="btnType"
	        	:dataID="dataID"
	        	:companyName="companyName"
	        	:companyRemark="companyRemark"
	        	>
	        	</company-s-e>
	        	
	        </div>
	        
	        <!--页脚-->
	        <div slot="footer">
	        	<Button @click="modalShow = false">关闭</Button>
	        </div>
	        
		</Modal>
		
	</div>
	
</template>

<script>

import templateSE from '@/components/template/template-s-e.vue';

import invoiceSE from '@/components/invoice/invoice-s-e.vue';

import companySE from '@/components/company/company-s-e.vue';

export default {
	components:{//组件模板
		templateSE,
		invoiceSE,
		companySE,
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		tableColumns: {
			type: Array,
			required: true
		},
		
		tableData: Array,
		
		componentType: String,
		
		companyDataList: {
			type: Array,
			default: () => {return []}
		},
		
		pageInfo: {//页码信息
			type: Object,
			default: () => {return {}}
		},
		
		controlShow: {//是否显示筛选控件
			type: Boolean,
			default: false
		},
		
	},
    data () {//数据
        return {
        	
        	status: null,//发票状态
        	
        	companyName: '',//公司名称
        	
        	companyRemark: '',//公司描述
        	
        	invoiceLink: '',
        	
        	dataID: null,
        	
        	btnType: '',
        	
        	title: '',
        	
        	modalShow: false,
        	
        	//---------------------------------------------------
        	
        	alShow: true,
        	
        	areaData: [],//地区
        	
        	initStateInfo: {//初始化状态信息
        		currentCompanyId: 0,//选中的公司id
        		currentPage: 1,//当前页
            	currentArea: '',//地区数据
            	levelNum: 1,//当前级别
        	},
        	
        }
    },
    methods: {//方法
    	
    	init(){//初始化表头
    		
    		this.tableColumns.forEach(item => {
    			
    			if(item.handle){//操作
    				
    				item.render = (h, params) => {
    					
    					let _this = this;
    					
    					let btnArr = [];
    				
    					let edit = h('Button',{
                			props: {
                				type: 'success',
                				size: 'small',
                			},
                			style: {
                				margin: '0 2px'
                			},
                    		on: {
                    			click () {
                    				
                    				_this.btnType = 'edit';
                    				
                    				_this.dataID = Number(params.row.id) || null;
                    				
                    				_this.companyName = params.row.title || '';//公司名称
        	
        							_this.companyRemark = params.row.remark || '';//公司描述
                    				
                    				if(params.row.link){
                    					
                        				let getUrlParams = (url,name) => {
							    			let startIndex = url.indexOf('?');
								    		let parameter = url.substr(startIndex);
										    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
										    let r = parameter.substr(1).match(reg);  
										    if (r != null) return unescape(r[2]);
										  	return null;
							    		}
							    		
							    		_this.invoiceLink = getUrlParams(params.row.link,'orderID');
							    		
                    				}
                    				
                    				_this.title = params.row.title ? params.row.title+'（编辑）' : '编辑';
                    				
                    				_this.modalShow = true;
                    				
                    			}
                    		}
                    	},'编辑');
    				
    					let show = h('Button',{
                			props: {
                				type: 'primary',
                				size: 'small',
                			},
                			style: {
                				margin: '0 2px'
                			},
                    		on: {
                    			click () {
                    				
                    				_this.btnType = 'show';
                    				
                    				_this.dataID = Number(params.row.id) || null;
                    				
						    		if(params.row.link){
                    					
                    					_this.status = Number(params.row.status);
                    					
                        				let getUrlParams = (url,name) => {
							    			let startIndex = url.indexOf('?');
								    		let parameter = url.substr(startIndex);
										    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
										    let r = parameter.substr(1).match(reg);  
										    if (r != null) return unescape(r[2]);
										  	return null;
							    		}
							    		
							    		_this.invoiceLink = getUrlParams(params.row.link,'orderID');
							    		
                    				}
                    				
                    				_this.title = params.row.title ? params.row.title+'（详情）' : '详情';
                    				
                    				_this.modalShow = true;
                    				
                    			}
                    		}
                    	},'详情');
    					
    					if(params.row.status && params.row.status == 1 && params.row.link){
    						
		    				btnArr.push(show);
		    					
    					}else{
    						
	    					item.handle.forEach(item => {
	    						
		    					if(item == 'edit'){//编辑按钮
		    						btnArr.push(edit);
		    					}
		    					
		    					if(item == 'show'){//详情按钮
		    						btnArr.push(show);
		    					}
		    					
		    				});
    						
    					}
                        
                    	return h('div',btnArr)
                    	
    				}
    				
    			}
    			
    		});
    		
    	},
    	
    	levelChange(val){//级别改变时
    		
      		this.alShow = false;
    		
    		if(this.areaData.length > val+1){
    			
    			this.areaData.splice(val+1,this.areaData.length-val-1);
    			
      			this.setRoutePara('areaString',this.areaData.join(','));
      			
    		}
    		
    		this.setRoutePara('levelNum',val);
    		
    		setTimeout(() => {
    			this.alShow = true;
    		},10);
    		
    	},
    	
    	alCascader(data_arr){//地区选择改变时
    		
      		let arrStr = data_arr.join(',');
    		
          	this.setRoutePara('areaString',arrStr);
          	
    	},
    	
    	companyChange(companyId){//公司下拉改变时
    		
        	this.setRoutePara('currentCompanyId',companyId);
    		
    	},
    	
    	pageChange(pageNum){//页码改变时
    		
      		this.setRoutePara('currentPage',pageNum);
    		
    	},
    	
    	setRoutePara(str,val){ //设置路由参数
    		
    		this.initStateInfo[str] = val;
    		
    		this.$router.push(
	    		{
	    			name: this.$route.name,
	    			query: this.initStateInfo,//状态信息
	    		}
    		);
    		
    	},
    	
    	maintainData(route_query){//保持筛选数据
    		
			this.initStateInfo.currentPage = route_query.currentPage ? Number(route_query.currentPage) : 1;
			
			this.initStateInfo.currentCompanyId = route_query.currentCompanyId ? Number(route_query.currentCompanyId) : 0;
			
			this.areaData = route_query.areaString ? route_query.areaString.split(',') : [];
			
    	},
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
		'$route' (to, from) {
			
			if(to.query.currentPage && Number(to.query.currentPage) <= 0){
				this.setRoutePara('currentPage',1);
			}
			
			this.maintainData(to.query);//保持筛选数据
			
			this.initStateInfo.levelNum = to.query.levelNum || Number(to.query.levelNum) === 0 ? Number(to.query.levelNum) : 1;
			
			this.$emit('on-route-change');
			
		},
		pageInfo(newVal){//后台页码数据更新后
			if(this.initStateInfo.currentPage > newVal.currentPage){//当前页码大于后台返回的页码
				this.setRoutePara('currentPage',1);
			}
		},
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
    	this.init();//初始化表头
    	
    	this.$nextTick(() => {
    		this.maintainData(this.$route.query);//保持筛选数据
    	});
    	
    	this.initStateInfo.levelNum = this.$route.query.levelNum || Number(this.$route.query.levelNum) === 0 ? Number(this.$route.query.levelNum) : 1;
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
		
}
</script>

<style scoped>
</style>
<style>
	.al-cascader-class input{
		padding-left: 70px;
	}
</style>