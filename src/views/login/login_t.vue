<template>
	
	<div>
		
		<div class="drag">
			
			<Card class="card" :bordered="false" dis-hover>
				
				<h1 class="title" slot="title">
					<Icon type="log-in"></Icon>
					<span>登录</span>
				</h1>
				
				<div style="padding:16px;">
					
					<Form ref="formInline" :model="formInline" :rules="ruleInline">
						<FormItem prop="user">
							<Input class="input-bg-transparency" type="text" @on-enter="handleSubmit('formInline')" v-model="formInline.user" placeholder="手机号码">
								<Icon type="ios-person-outline" slot="prepend" size="18" color="#1c2438"></Icon>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input class="input-bg-transparency" type="password" @on-enter="handleSubmit('formInline')" v-model="formInline.password" placeholder="密码">
								<Icon type="ios-locked-outline" slot="prepend" size="18" color="#1c2438"></Icon>
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
				user: sessionStorage.getItem('loginUserName') ? sessionStorage.getItem('loginUserName') : '',
				password:''
			},
			ruleInline: {
				user: [{
					required: true,
					message: '手机号不能为空',
					trigger: 'change'
				}],
				password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'change'
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
					    	
					    	let expires = 172800;//过期时间默认为2天
					    	
					    	let currentimeStr = String(new Date().getTime());
					    	
					    	let currentimeNum = Number(currentimeStr.substring(0,currentimeStr.length-3));
					    	
					    	localStorage.setItem('token',currentimeNum+expires);//登录令牌
					    	
							localStorage.setItem('userName',response.data.username);//把用户名存起来
							
							localStorage.setItem('userId',response.data.id);//把用户ID存起来
							
							localStorage.setItem('userType',response.data.user_type);//把用户类型存起来
							
							localStorage.setItem('access','['+response.data.user_type+']');//把用户权限存起来
							
							//localStorage.setItem('isadmin',response.data.user_type);//管理员权限
							
							if(sessionStorage.getItem('params') && response.data.user_type == 2){//用户
								
								this.$router.replace({
									name: 'invoicePages'
								});
								
							}else{
								
								if(response.data.user_type == 1){//会计
									
									if(sessionStorage.getItem('params')){
										sessionStorage.removeItem('params')
									}
									
									this.$router.replace({
										name: 'invoicePages'
									});
									
								}else if(response.data.user_type == 2){//用户
									
									this.$router.replace({
										name: 'addCompany'
									});
									
								}
								
							}
							
							if(sessionStorage.getItem('loginUserName')){
								sessionStorage.removeItem('loginUserName');
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

<style scoped lang="less">
	.drag{
		position: absolute;
		width: 320px;
		height: 280px;
		margin: auto;
		/*right:300px;
		bottom:300px;*/
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
	}
	.card {
		height:100%;
		background: rgba(110,128,83,0) !important;
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

<style lang="less">
	.input-bg-transparency{
		input{
			border: none !important;
			color: #1c2438;
			background-color: rgba(255,255,255,.3) !important;
			&::-webkit-input-placeholder{
				color: #495060;
			}
		}
		.ivu-input-group-prepend{
			background-color: rgba(255,255,255,.3) !important;
			border: none !important;
			border-right: 1px solid rgba(255,255,255,.3) !important;
		}
	}
</style>