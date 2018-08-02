<template>

	<div>
		
		<Card>
			
			<h1 slot="title">创建发票链接</h1>
			
			<div>
				
				<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="70">
			
			        <FormItem label="选择模板" prop="templateID">
			        	<Select v-model="formInline.templateID" placeholder="选择模板" style="width: 200px;">
			                <Option v-for="item in templateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
			            </Select>
			        </FormItem>
			        
			    </Form>
				
				<div>
					<label>点击复制链接：</label>
					<a @click="copy">{{URL + '?' + 'accountantID=' + formInline.accountantID + '&templateID=' + formInline.templateID}}</a>
			    </div>
				
			</div>
			
		</Card>
		
	</div>
	
</template>

<script>

export default {
	components:{//组件模板
		
	},
	props:{//组件道具（参数）
		/* ****属性用法*****
		 * 
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
		
		templateList: {//模板数据
			type: Array,
			default: () => {return []}
		},
		
	},
    data () {//数据
        return {
        	
        	formInline: {
        		templateID: '',
        		accountantID: sessionStorage.getItem('userId'),
        	},
        	
        	ruleInline: {
                templateID: [
                    { type: 'number', required: true, message: '请选择模板', trigger: 'change' }
                ],
        	},
        	
        	URL: window.location.href,
        	
        }
    },
    methods: {//方法
    	
    	ajax () {
    		
    		this.$axios.post('接口路径', {
    			
			})
			.then(response => {
				
			})
			.catch(function (error) {
				console.log(error);
			});
			
    	},
    	handleSubmit(name) {//创建发票
            
    	},
    	copy(){//复制
    		
    		let txt = this.URL + '?accountantID=' + this.formInline.accountantID + '&templateID=' + this.formInline.templateID;
    		
    		this.$refs['formInline'].validate((valid) => {
    			
                if (valid) {
                	
                	this.$copyText(txt).then((e) => {
                		
                		this.$Message.success('复制成功');
                		
			        },(e) => {
			        	console.log(e);
			        })
                	
                }else{
                	
                	this.$Message.error('复制失败!');
                	
                }
                
            })
    		
    	}
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
		templateList(){//默认模板
			if(this.templateList && this.templateList.length > 0){
	    		this.formInline.templateID = this.templateList[0].value;
	    	}
		},
		
	},
    
    //===================组件钩子===========================
    
    created () {//实例被创建完毕之后执行
    	
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	
}
</script>

<style scoped>
</style>