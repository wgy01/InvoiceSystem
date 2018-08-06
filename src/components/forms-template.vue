<template>

	<div ref="instance">
		
		<!--标题-->
		<Row v-if="showType == 'edit'" type="flex" style="border-bottom:1px solid #e9eaec;margin-bottom:6px;">
			
			<Col span="4">名称 </Col>
			
			<Col span="8">内容 </Col>
			
			<Col span="12">字段描述</Col>

	    </Row>
	    
	    <!--表单-->
	    <Form ref="formsList" :model="formsList" :label-width="showType == 'edit2' ? 200 : 0">
	    
			<Row type="flex" :gutter="6" v-for="(item,index) in formsList.data" :key="index"  style="margin-top:10px;">
				
				<!----------------------字段名---------------------------->
				<!--编辑显示-->
				<Col span="4" v-if="showType == 'edit'">
					<FormItem :prop="'data.' + index + '.name'" :rules="labelValidate">
						<Input placeholder="输入名称" clearable v-model="item.name"></Input>
					</FormItem>
				</Col>
				
				<!--详情显示-->
				<Col span="4" v-if="showType == 'show'" style="font-size: 12px;line-height: 20px;text-align: right;padding: 6px 0;">
					{{item.name}}：
				</Col>
				
				<!-----------------------字段值------------------------>
				<!--编辑显示-->
				<Col v-if="showType == 'edit'" span="8">
					<Input :disabled="NoHandle" :placeholder="placeholder(item.remark)" clearable  v-model="item.value"></Input>
				</Col>
				
				<!--只编辑字段值时显示-->
				<Col v-if="showType == 'edit2'" span="24">
					<FormItem :label="item.name" :prop="'data.' + index + '.value'" :rules="NoHandle ? [] : labelValidate2">
						<Input :disabled="NoHandle" :placeholder="placeholder(item.remark)" :clearable="!NoHandle"  v-model="item.value" style="max-width: 400px;"></Input>
					</FormItem>
				</Col>
				
				<!--详情显示-->
				<Col v-if="showType == 'show'" span="20" style="padding: 6px 0;">
					{{item.value}}
					<span v-if="item.value == ''" style="color: #bbbec4;">无内容</span>
				</Col>
				
				<!-------------------------------描述------------------------------>
				<!--编辑时显示-->
				<Col span="12" v-if="showType == 'edit'">
					<div style="display: flex;align-items: center;">
						<Input placeholder="请输入描述" clearable  v-model="item.remark"></Input>
						<Button style="margin-left: 4px;color: #ed3f14;" type="text" icon="minus-circled" size="small" @click="formsList.data.splice(index,1)">删除</Button>
					</div>
				</Col>
	
		    </Row>
		    
		</Form>
		
		<div v-if="showType == 'edit'" style="margin-top:16px; text-align: center;">
			<Button type="dashed" icon="plus-round" size="small" @click="add">增加字段</Button>
		</div>
		
	</div>
	
</template>

<script>
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
        	
        }
    },
    methods: {//方法
    	
    	add(){//添加
    		
    		this.formsList.data.push({
    			name: '',
    			value: '',
				user_type: this.userType,
				remark: '',
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