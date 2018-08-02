<template>

	<div>
		
		<Table border :columns="tableColumns" :data="tableData"></Table>
		
		<!--弹窗控件-->
		<Modal v-model="modalShow" width="80%">
			<!--标题-->
	        <p slot="header">{{title}}</p>
	        
	        <!--内容-->
	        <div v-if="modalShow">
	        	
	        	<template-s-e
	        	v-if="componentType == 'templateSE'"
	        	:type="btnType"
	        	:dataID="dataID"
	        	>
	        	</template-s-e>
	        	
	        	<invoice-s-e
	        	v-if="componentType == 'invoiceSE'"
	        	:type="btnType"
	        	:dataID="dataID"
	        	>
	        	</invoice-s-e>
	        	
	        	<company-s-e
	        	v-if="componentType == 'companySE'"
	        	:type="btnType"
	        	:dataID="dataID"
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
		
	},
    data () {//数据
        return {
        	
        	dataID: null,
        	
        	btnType: '',
        	
        	title: '',
        	
        	modalShow: false,
        	
        }
    },
    methods: {//方法
    	
    	init(){//初始化表头
    		
    		this.tableColumns.forEach(item => {
    			
    			if(item.handle){//操作
    				
    				item.render = (h, params) => {
    					
    					let _this = this;
                        
                    	return h('div',[
                    		
                    		h('Button',{
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
                        				
                        				_this.dataID = Number(params.row.id);
                        				
                        				_this.title = params.row.title + '（编辑）';
                        				
                        				_this.modalShow = true;
                        				
                        			}
                        		}
                        	},'编辑'),
                        	
                    		h('Button',{
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
                        				
                        				_this.dataID = Number(params.row.id);
                        				
                        				_this.title = params.row.title + '（详情）';
                        				
                        				_this.modalShow = true;
                        				
                        			}
                        		}
                        	},'详情')
                    		
                    	])
    				}
    				
    			}
    			
    		});
    		
    	},
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
    	this.init();//初始化表头
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
	//=================组件路由勾子==============================
	
//	beforeRouteEnter (to, from, next) {//在组件创建之前调用
//	},
	
}
</script>

<style scoped>
</style>