<template>

	<div style="overflow: hidden;">
		
		<div class="drag">
			
			<Card class="card" :bordered="false" dis-hover>
				
				<h1 style="text-align: center;color: #A4A68C;margin-bottom: 20px;">
					<Icon type="person-add"></Icon>
					<span>注册</span>
				</h1>
				
				<div>
					
					<div style="text-align: left;margin-bottom:24px;">
						<label class="my-label">账户类型</label>
						<RadioGroup v-model="accountType">
					        <Radio :label="2">
					            <span style="color: #A4A68C;">申请开票</span>
					        </Radio>
					        <Radio :label="1">
					            <span style="color: #A4A68C;">开票</span>
					        </Radio>
				        </RadioGroup>
					</div>
					
					<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
						
				        <FormItem class="zc-input-bg-transparency" label="手机号码" prop="mobileNumber">
				        	
						    <Input v-model="formInline.mobileNumber" placeholder="输入手机号码"></Input>
				        	
				        </FormItem>
				        
				        <FormItem class="zc-input-bg-transparency" label="密码" prop="password">
				            <Input type="password" v-model="formInline.password" placeholder="输入密码"></Input>
				        </FormItem>
				        
				        <FormItem class="zc-input-bg-transparency" label="确认密码" prop="passwdCheck">
				            <Input type="password" v-model="formInline.passwdCheck" placeholder="请确认密码"></Input>
				        </FormItem>
				        
				    </Form>
				    
				    <div style="text-align: center;">
			            <Button long type="primary" @click="handleSubmit('formInline')">立即注册</Button>
			        </div>
			        
			        <div style="margin-top: 16px;text-align: center;">
			        	<a @click="Aclick" style="color: #5cadff;">已有账户立即登录</a>
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
                    { required: true, validator: validatePass, trigger: 'change' }
                ],
                passwdCheck: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
                mobileNumber: [
                    { required: true, message: '请输入手机号码', trigger: 'change' },
                    { type: 'string', min: 11, max: 11, message: '手机号码格式错误', trigger: 'blur' }
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
		width: 360px;
		height: 372px;
		margin: auto;
		right:0;
		bottom:0;
		left: 0;
		top: 0;
		z-index: 10;
	}
	.card {
		height:100%;
		background: rgba(0,0,0,.2) !important;
	}
	.my-label{
		display: inline-block;
		width: 100px;
		text-align: right;
		padding: 10px 12px 10px 0;
		font-size: 12px;
		color: #A4A68C;
		line-height: 1;
	}
	.my-label:before{
		content: '*';
	    display: inline-block;
	    margin-right: 4px;
	    line-height: 1;
	    font-family: SimSun;
	    font-size: 12px;
	    color: #ed3f14;
	}
</style>
<style lang="less">
	.zc-input-bg-transparency{
		.ivu-input-wrapper{
			border-bottom: 1px solid #A4A68C;
		}
		input{
			border: none !important;
			color: #A4A68C;
			background-color: rgba(0,0,0,0) !important;
			&::-webkit-input-placeholder{
				color: #999;
			}
		}
		.ivu-form-item-label{
			color: #A4A68C;
		}
	}
</style>