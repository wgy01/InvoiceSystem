<template>

	<div>
		
		<Form v-if="type == 'edit'" :label-width="60">
	        <FormItem label="模板说明">
	            <Input v-model="remark" placeholder="输入说明"></Input>
	        </FormItem>
	    </Form>
	    
	    <Card v-if="type == 'show'" :bordered="false" dis-hover style="margin-bottom: 16px;">
	    	
	    	<h2 slot="title">模板说明：</h2>
	    	
	    	<p style="padding-left: 26px;">
	    		{{remark}}
	    	</p>
	    	
	    </Card>
	    
	    <Card :bordered="false" dis-hover style="margin-bottom: 16px;">
	    	
	    	<h2 slot="title">公司字段</h2>
	    	
            <forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :NoHandle="true"
            :user-type="2"
            :out-forms-data="companyData"
            :show-type="type"
            >
            </forms-template>
	    	
	    </Card>
	    
	    <Card :bordered="false" dis-hover>
	    	
	    	<h2 slot="title">会计字段</h2>
	    	
            <forms-template
            ref="formsInstance2"
            @on-change="formsChange"
            :NoHandle="true"
            :user-type="1"
            :out-forms-data="accountantData"
            :show-type="type"
            >
            </forms-template>
	    	
	    </Card>
	    
	    <div v-if="type == 'edit'" style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit">保存模板</Button>
	    </div>
		
	</div>
	
</template>

<script>

import formsTemplate from '@/components/forms-template.vue';//模板列表

export default {
	components:{//组件模板
		formsTemplate
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		type: {
			type: String,
			required: true
		},
		
		dataID: {
			type: Number,
		},
		
	},
    data () {//数据
        return {
        	
        	remark: '',
        	
        	accountantData: [],
        	
        	companyData: [],
        	
        	formsList: [],
        	
        }
    },
    methods: {//方法
    	
    	formsChange(){
    		
    		let A = this.$refs.formsInstance1.formsList.data;
    		
    		let B = this.$refs.formsInstance2.formsList.data;
    		
    		let arr = [];
    		
    		arr.push(...A,...B);
    		
    		this.formsList = arr;
    		
    	},
    	handleSubmit() {//保存模板
    		
			let [A1,B1,A2,B2] = [true,true,true,true];
			
			this.$refs.formsInstance1.verification((valid) => {
				A1 = valid;
    		},(valid) => {
    			B1 = valid;
    		});
    		
			this.$refs.formsInstance2.verification((valid) => {
				A2 = valid;
    		},(valid) => {
    			B2 = valid;
    		});
			
			if(A1 || A2){
				if(B1 && B2) {
					this.edit();//编辑
				}
			}else{
				this.$Message.info('请增加字段！');
			}
    			
       	},
       	show(){//详情
       		
       		this.$axios.post('Service/Template/detail', {
       			id: this.dataID
			})
			.then(response => {
				
				let accountantArr = [];
				
				let companyArr = [];
				
				this.remark = response.data.remark;
				
				response.data.setting.forEach(item => {
				
					if(item.user_type == 1){//会计
						
						accountantArr.push(item);
						
					}else if(item.user_type == 2){//公司
						
						companyArr.push(item);
						
					}
				
				});
				
				this.accountantData = accountantArr;
				
				this.companyData = companyArr;
					
			})
			.catch(function (error) {
				console.log(error);
			});
       		
       	},
    	edit(){//编辑
    		
    		this.$axios.post('Service/Template/edit', {
    			id: this.dataID,
    			remark: this.remark,
    			setting: JSON.stringify(this.formsList),
			})
			.then(response => {
				if(response.status == 200){
					this.$parent.$parent.$parent.$parent.updateData();
					this.$parent.$parent.modalShow = false;
					this.$Message.success('保存成功');
				}
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
		dataID(v){
			this.dataID = v;
			this.show();
		}
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	if(this.dataID){
    		this.show();
    	}
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
	//=================组件路由勾子==============================
	
//	beforeRouteEnter (to, from, next) {//在组件创建之前调用
//		
//	},
	
}
</script>

<style scoped>
</style>