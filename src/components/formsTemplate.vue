<template>

	<div>
		
		<!--标题-->
		<Row type="flex" style="border-bottom:1px solid #e9eaec;margin-bottom:6px;">
			<Col span="12">
	        	<Row>
	        		<Col span="8" class="form-title">
	        			名称
	        		</Col>
	        		<Col span="16" class="form-title">
	        			内容
	        		</Col>
	        	</Row>
	        </Col>
			<Col span="12">
	        	<Row>
	        		<Col span="8" class="form-title">
	        			名称
	        		</Col>
	        		<Col span="16" class="form-title">
	        			内容
	        		</Col>
	        	</Row>
	        </Col>
	    </Row>
	    
	    <!--表单-->
		<Row type="flex" :gutter="6">
			
			<template v-for="item in formsList">
		        <Col span="12" style="margin-bottom:16px;">
		        	<Row>
		        		<Col span="8">
		        			<Input placeholder="名称" clearable></Input>
		        		</Col>
		        		<Col span="16" style="display: flex;align-items: center;">
		        			<Input placeholder="内容" clearable></Input>
		        			<Button style="margin-left: 4px;color: #ed3f14;" type="text" icon="minus-circled" size="small">删除</Button>
		        		</Col>
		        	</Row>
		        </Col>
	        </template>
	        
	    </Row>
		
		<div style="margin-top:16px; text-align: center;">
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
		 * 传递类型 type: Array | Number | String | Object
		 * 为必传 required: true
		 * 默认值 default: ''
		 * 
		 */
	},
    data () {//数据
        return {
        	
        	formsList: [],
        	
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
    	add(){
    		
    		this.formsList.push({
    			label: '',
    			value: ''
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

<style scoped lang="less">
	.form-title{
		padding: 6px;
		font-weight: bolder;
	}
</style>