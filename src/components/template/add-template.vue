<template>

	<div>
		
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
			
	        <FormItem label="模板名称" prop="name">
	            <Input v-model="formInline.name" clearable placeholder="输入名称" style="width: 200px;"></Input>
	        </FormItem>
	        
	        <FormItem label="模板说明">
	            <Input v-model="formInline.remark" type="textarea" :rows="1" placeholder="输入说明"></Input>
	        </FormItem>
	        
	    </Form>
	    
	    <Card dis-hover style="margin-bottom: 16px;">
	    	
	    	<h2 slot="title">公司字段</h2>
	    	
            <forms-template
            ref="formsInstance1"
            @on-change="formsChange"
            :NoHandle="true"
            :user-type="2"
            show-type="edit"
            >
            </forms-template>
	    	
	    </Card>
	    
	    <Card dis-hover>
	    	
	    	<h2 slot="title">会计字段</h2>
	    	
            <forms-template
        	ref="formsInstance2"
        	@on-change="formsChange"
        	:NoHandle="true"
        	:user-type="1"
        	show-type="edit"
        	>
        	</forms-template>
	    	
	    </Card>
	    
	    <div style="text-align: center;padding-top: 16px;">
	    	<Button type="primary" @click="handleSubmit('formInline')">创建模板</Button>
	    </div>
		
	</div>
	
</template>

<script>

import formsTemplate from '@/components/forms-template.vue';

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
	},
    data () {//数据
        return {
        	
        	formInline: {
        		name: '',
        		remark: '',
        	},
        	
        	ruleInline: {
        		name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
        	},
        	
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
    	handleSubmit(name) {//创建模板
    		
            this.$refs[name].validate((valid) => {
    			
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
    			
    			if(valid){
    				if(A1 || A2){
    					if(B1 && B2) {
    						this.ajax();
    					}
    				}else{
    					this.$Message.info('请增加字段！');
    				}
    			}
    			
			});
			
       },
       ajax(){
    		
    		this.$axios.post('Service/Template/add', {
    			title: this.formInline.name,
    			remark: this.formInline.remark,
    			setting: JSON.stringify(this.formsList),
    			user_id: localStorage.getItem('userId')
			})
			.then(response => {
				if(response.status == 200){
					this.$parent.$parent.updateData();
					this.formInline = {
		        		name: '',
		        		remark: '',
		        	};
					this.$Message.success('创建成功');
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
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
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