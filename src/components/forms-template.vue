<template>

	<div ref="instance">
		
		<!--标题-->
		<Row v-if="showType == 'edit'" type="flex" style="text-align: center;margin-bottom:6px;background: #e8eaec;">
			
			<Col span="4" style="border-right: 1px solid #fff;padding: 6px 0;">名称 </Col>
			
			<Col span="8" style="border-right: 1px solid #fff;padding: 6px 0;">内容 </Col>
			
			<Col span="12" style="padding: 6px 0;">字段描述</Col>

	    </Row>
	    
	    <!--表单-->
	    
	    <Form ref="formsList" :model="formsList" :label-width="showType == 'edit2' ? 120 : 0">
	    	
	    	<!------------------------------------模板编辑显示-------------------------------------->
	    	
			<Row type="flex" :gutter="16" v-for="(item,index) in formsList.data" :key="index" v-if="showType == 'edit'" :style="{marginTop: showType == 'edit' ? '10px' : 0}">
				
				<!--字段名-->
				<!--添加表单时显示-->
				<Col span="4" v-if="showType == 'edit' && item.is_add != 0">
					<FormItem :prop="'data.' + index + '.name'" :rules="labelValidate">
						<Input placeholder="输入名称" clearable v-model="item.name"></Input>
					</FormItem>
				</Col>
				<!--模板默认字段显示-->
				<Col span="4" v-if="item.is_add == 0 && showType != 'edit2'" style="font-size: 12px;font-weight:bold;line-height: 20px;text-align: right;padding: 6px 0;">
					{{item.name}}：
				</Col>
				
				<!--字段值-->
				<Col span="8" v-if="showType == 'edit'">
					<!--模板默认字段显示-->
					<div v-if="item.is_add == 0" style="height:100%;display: flex;align-items: center;font-size: 12px;color: #c5c8ce;">
						<span>基础字段不可操作</span>
					</div>
					<!--添加表单时显示-->
					<Input v-if="item.is_add != 0" :disabled="NoHandle" :placeholder="placeholder(item.remark)" clearable  v-model="item.value"></Input>
				</Col>
				
				<!--描述-->
				<Col span="12" v-if="showType == 'edit'">
					<!--模板默认字段-->
					<div v-if="item.is_add == 0" style="height:100%;display: flex;align-items: center;font-size: 12px;color: #c5c8ce;">
						<span>基础字段不可操作</span>
					</div>
					<!--添加表单时显示-->
					<div v-if="item.is_add != 0" style="display: flex;align-items: center;">
						<Input placeholder="请输入描述" clearable  v-model="item.remark"></Input>
						<Button style="margin-left: 4px;color: #ed3f14;" type="text" icon="minus-circled" size="small" @click="formsList.data.splice(index,1)">删除</Button>
					</div>
				</Col>
	
		    </Row>
		    
		    <!-------------------------用户/会计编辑显示---------------------------------------->
		    
		    <Row v-if="showType == 'edit2'">
		    	<Col span="12" v-for="(item,index) in formsList.data" :key="index">
		    		<!--文本框-->
		    		<FormItem v-if="item.field.indexOf('_time') < 0 && item.field.indexOf('express_company') < 0" :label="item.name" :prop="'data.' + index + '.value'" :rules="NoHandle ? [] : labelValidate2">
						<Input :disabled="NoHandle || noEdit(item.field)" :placeholder="placeholder(item.remark)" :clearable="!NoHandle && !noEdit(item.field)"  v-model="item.value"></Input>
					</FormItem>
					<!--日期控件-->
					<FormItem v-if="item.field.indexOf('_time') >= 0" :label="item.name" :prop="'data.' + index + '.value'" :rules="NoHandle ? [] : labelValidate3">
						<DatePicker :disabled="NoHandle" type="date" :value="item.value" @on-change="dateChange(index,$event)" placeholder="选择日期" style="width: 100%;"></DatePicker>
					</FormItem>
					<!--下拉控件-->
					<FormItem v-if="item.field.indexOf('express_company') >= 0" :label="item.name" :prop="'data.' + index + '.coding'" :rules="NoHandle ? [] : labelValidate4">
						<Select :label-in-value="true" filterable :value="item.coding" @on-change="selectExpressC(index,$event)" style="width: 100%">
					        <Option v-for="item2 in expressCompanyList" :value="item2.value" :key="item2.value">{{ item2.label }}</Option>
					    </Select>
					</FormItem>
		    	</Col>
		    </Row>
		    
		</Form>
		
	    <!-----------------------------模板/用户/会计详情显示------------------------------------>
	    
    	<Row v-if="showType == 'show'">
    		<Col span="12" v-for="(item,index) in formsList.data" :key="index" style="padding: 6px 0;">
    			<Row>
    				<Col span="8" style="font-size: 12px;font-weight:bold;line-height: 20px;text-align: right;">
						{{item.name}}：
					</Col>
					<Col span="16">
						<span :style="{color: item.value ? '' : '#bbbec4'}">{{item.value || '- -'}}</span>
					</Col>
    			</Row>
    		</Col>
    	</Row>
		
		<div v-if="showType == 'edit'" style="margin-top:16px; text-align: center;">
			<Button type="dashed" icon="plus-round" size="small" @click="add">增加字段</Button>
		</div>
		
	</div>
	
</template>

<script>
	
const expressData = require('../../static/public/express_company.json')
	
export default {
	components:{//组件模板
		
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object | Boolean
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		outFormsData:Array,//外部传入的表单数据列表
		
		userType: Number,//用户类型
		
		NoHandle: {//不可操作input
			type: Boolean,
			default: false
		},
		
		showType: {//显示类型编辑或详情
			type: String,
			required: true
		},
		
	},
    data () {//数据
        return {
        	
        	formsList:{
				data:this.outFormsData || [],
			},
        	
        	labelValidate: [
                { required: true, message: '必须输入名称', trigger: 'blur' }
            ],
            
        	labelValidate2: [
                { required: true, message: '必须输入内容', trigger: 'blur' }
            ],
            
        	labelValidate3: [
                { required: true, message: '请选择日期', trigger: 'change' }
            ],
            
        	labelValidate4: [
                { required: true, message: '请选择快递公司', trigger: 'change' }
            ],
            
            expressCompanyList: expressData.express_company,//快递公司列表
            	
        }
    },
    methods: {//方法
    	
    	dateChange(index,date){//格式化时间
    		
    		this.formsList.data[index].value = date;
    		
    	},
    	selectExpressC(index,arr){//选择快递公司
    		
    		this.formsList.data[index].value = arr.label;
    		
    		this.formsList.data[index].coding = arr.value;
    		
    	},
    	add(){//添加
    		
    		this.formsList.data.push({
    			name: '',
    			value: '',
				user_type: this.userType,
				remark: '',
				sort: 1,
				coding: '',
    		});
    		
		},
		verification(fn,fn2){//验证表单
			
			if(this.$refs.formsList.$children.length > 0){
				
				this.$refs.formsList.validate((valid) => {
					fn2 && fn2(valid);
	    		});
	    		
			}else{
				fn && fn(false);
			}
    		
		},
		placeholder(remark){
        	let txt = '输入内容';
        	if(this.NoHandle && (this.showType != 'show')){
        		txt = '内容不可编辑';
        	}else{
        		if(remark) txt = remark;
        	}
        	return txt;
        },
        noEdit(field){
        	
        	let tf = false;
        	
        	if(field == 'organizer_code' || field == 'telphone' || field == 'address' || field == 'bank_name' || field == 'account'){
        		
        		tf = true;
        		
        	}
        	
        	return tf
        	
        },
		
    },
    computed: {//计算属性
        
    },
    watch: {//监测数据变化
		formsList:{//侦听对象内部数据
			handler(v1,v2){
				this.$emit('on-change');//侦听父级事件
			},
			deep:true// 深度 watcher
		},
		'outFormsData'(v){
			this.formsList.data = v;
		}
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped lang="less">
	.form-title{
		padding: 6px;
		font-weight: bolder;
	}
</style>