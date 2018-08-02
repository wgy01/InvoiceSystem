<template>
	
	<div>
		
		<div class="drag">
			
			<Card class="card">
				
				<h1 class="title" slot="title">
					<Icon type="log-in"></Icon>
					<span>登录</span>
				</h1>
				
				<div style="padding:16px;">
					
					<Form ref="formInline" :model="formInline" :rules="ruleInline">
						<FormItem prop="user">
							<Input type="text" @on-enter="handleSubmit('formInline')" v-model="formInline.user" placeholder="账号">
								<Icon type="ios-person-outline" slot="prepend"></Icon>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" @on-enter="handleSubmit('formInline')" v-model="formInline.password" placeholder="密码">
								<Icon type="ios-locked-outline" slot="prepend"></Icon>
							</Input>
						</FormItem>
						<div class="but">
							<Button type="primary" long size="large" @click="handleSubmit('formInline')">登陆</Button>
						</div>
					</Form>
					
					<p class="register">
						<a @click="Aclick">没有账号立即注册</a>
					</p>
					
				</div>
				
			</Card>
			
		</div>
		
	</div>
	
</template>

<script>
	
export default {
	data() {
		return {
			formInline: {
				user: sessionStorage.getItem('loginUserName') ? sessionStorage.getItem('loginUserName') : '123213@qq.com',
				password:''
			},
			ruleInline: {
				user: [{
					required: true,
					message: '账号不能为空',
					trigger: 'blur'
				}],
				password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					},
					{
						type: 'string',
						min: 6,
						message: '密码最少六位',
						trigger: 'blur'
					}
				]
			}
		}
	},
	methods: {
		
		handleSubmit(name) {
			this.$refs[name].validate((valid) => {
				if(valid) {
					this.$axios.post('Service/User/login', {
					    username: this.formInline.user,
					    password: this.formInline.password
					})
					.then(function (response) {
					    if(response.status == 200){//登陆成功
					    	
							sessionStorage.setItem('userName',response.data.username);//把用户名存起来
							
							sessionStorage.setItem('userId',response.data.id);//把用户ID存起来
							
							sessionStorage.setItem('userType',response.data.user_type);//把用户类型存起来
							
							sessionStorage.setItem('access','['+response.data.user_type+']');//把用户权限存起来
							
							//sessionStorage.setItem('isadmin',response.data.user_type);//管理员权限
							
							if(sessionStorage.getItem('path') && response.data.user_type == 2){
								
								this.$router.replace({
									path: sessionStorage.getItem('path')
								});
								
							}else{
								
								if(response.data.user_type == 1){
									
									this.$router.replace({
										name: 'invoicePages'
									});
									
								}else if(response.data.user_type == 2){
									
									this.$router.replace({
										name: 'addCompany'
									});
									
								}
								
							}
							
							
							this.$Message.success(response.message);
							
					    }
					}.bind(this))
					.catch(function (error) {
						console.log(error);
					});
				}
			});
		},
		Aclick(){
			
			this.$parent.show = true;
			
		}
		
	},
	directives:{
		drag:{//拖动指令
			inserted(el){
				el.onmousedown = function(ev){
					var l = ev.pageX - el.offsetLeft;
					var t = ev.pageY - el.offsetTop;
					document.onmousemove = function(ev){
						let WW = document.documentElement.clientWidth;
						let WH = document.documentElement.clientHeight;
						var [x,y] = [ev.pageX-l,ev.pageY-t];
						el.style.left = x+'px';
						el.style.top = y+'px';
						if(el.offsetLeft <= 0){
							el.style.left = 0;
						}else if(el.offsetLeft+el.offsetWidth >= WW){
							el.style.left = (WW-el.offsetWidth)+'px';
						}
						if(el.offsetTop <= 0){
							el.style.top = 0;
						}else if(el.offsetTop+el.offsetHeight >= WH){
							el.style.top = (WH-el.offsetHeight)+'px';
						}
						ev.preventDefault();//阻止默认事件
					}
					document.onmouseup = function(){document.onmousemove = null;}
				}
			}
		}
	},
	mounted(){//模板被渲染完毕之后执行
		
	},
	
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
	.card {
		height:100%;
	}
	.title{
	}
	.but{
		text-align:center;
	}
	.register{
		margin-top:16px;
		text-align: center;
		color:blue;
	}
</style>