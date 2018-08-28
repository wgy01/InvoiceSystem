<template>

	<div style="overflow: hidden;">
		
		<div class="drag">
			
			<Card>
			
				<h1 slot="title">
					<Icon type="person-add"></Icon>
					注册
				</h1>
				
				<div>
					
					<div style="text-align: center;margin-bottom:24px;">
						<RadioGroup v-model="accountType">
					        <Radio :label="2">
					            <span>申请开票</span>
					        </Radio>
					        <Radio :label="1">
					            <span>开票</span>
					        </Radio>
				        </RadioGroup>
					</div>
					
					<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
						
				        <FormItem label="手机号码" prop="mobileNumber">
				        	
				        	<!--<AutoComplete
						        v-model="formInline.mobileNumber"
						        @on-search="handleSearch"
						        placeholder="手机号码"
						    >
						        <Option v-for="item in hintList" :value="item" :key="item">{{ item }}</Option>
						    </AutoComplete>-->
						    
						    <Input v-model="formInline.mobileNumber" placeholder="手机号码"></Input>
				        	
				        </FormItem>
				        
				        <FormItem label="密码" prop="password">
				            <Input type="password" v-model="formInline.password" placeholder="密码"></Input>
				        </FormItem>
				        
				        <FormItem label="确认密码" prop="passwdCheck">
				            <Input type="password" v-model="formInline.passwdCheck" placeholder="确认密码"></Input>
				        </FormItem>
				        
				    </Form>
				    
				    <div style="text-align: center;">
			            <Button long type="primary" @click="handleSubmit('formInline')">立即注册</Button>
			        </div>
			        
			        <div style="margin-top: 16px;text-align: center;">
			        	<a @click="Aclick">已有账户立即登录</a>
			        </div>
					
				</div>
			
			</Card>
		
		</div>
			
	</div>
	
</template>

<script>
export default {
	components:{//模板
		
	},
	props:{
		
//		name: {
//			type: Array | Number | String | Object,//类型
//			required: true,//必传
//			default: '',//默认值
//		}
		
	},
    data () {//数据
    	
    	const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.formInline.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formInline.validateField('passwdCheck');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请确认密码'));
            } else if (value !== this.formInline.password) {
                callback(new Error('密码不一致!'));
            } else {
                callback();
            }
        };
    	
        return {
        	
        	accountType: 2,
        	
        	hintList: [],
        	
        	formInline: {
        		mobileNumber: '',
                password: '',
                passwdCheck: '',
            },
            ruleInline: {
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
                mobileNumber: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
//                  { type: 'string', min: 11, max: 11, message: '手机号码格式错误', trigger: 'blur' }
                ],
            },
        	
        }
    },
    methods: {//方法
    	
    	handleSubmit(name) {
    		
            this.$refs[name].validate((valid) => {
            	
                if (valid) {
                	
                    this.$axios.post('Service/User/register', {
                    	username: this.formInline.mobileNumber,
                    	password: this.formInline.password,
                    	user_type: this.accountType,
					})
					.then(response => {
						
						if(response.status == 200){
							
							sessionStorage.setItem('loginUserName',this.formInline.mobileNumber);
							
							this.formInline = {
				        		mobileNumber: '',
				                password: '',
				                passwdCheck: '',
				           	};
							
							this.$parent.show = false;
							
							this.$Message.success(response.message);
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
                    
                }
            })
            
        },
        handleSearch (value) {//自动完成
            this.hintList = !value || value.indexOf('@') >= 0 ? [] : [
                value + '@qq.com',
                value + '@sina.com',
                value + '@163.com'
            ];
        },
        Aclick(){
        	this.$parent.show = false;
        },
    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
    watch:{//监测数据变化
		
	}
}
</script>

<style scoped>
	.drag{
		position: absolute;
		width: 320px;
		height: 280px;
		right:300px;
		bottom:300px;
	}
</style>