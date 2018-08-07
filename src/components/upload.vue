<template>
	
	<div>
		
		<ul class="img-main-box">
			
			<li class="img-box" v-for="(item,i) in imgList">
				<div class="box bottom">
				</div>
				<div class="box img-bg" :style='{backgroundImage: "url("+item.url+")"}'></div>
				<div class="box mask">
					<Icon type="eye" size="26" @click.native="show(item.url,item.name)"></Icon>
					<Icon type="trash-a" size="24" @click.native="del(i,item.url)"></Icon>
				</div>
			</li>
			
			<li v-if="imgData.imgShowData.length < 5 && imgList.length < 5">
				
				<div class="upload-box">
					<input v-if="tf" ref="inputInstance" @change="inputChange" type="file" accept="image/*" />
					<Button style="width: 100%;height: 100%;" type="dashed" @click="upload">
						<Icon type="plus-round" size="30"></Icon>
					</Button>
				</div>
				
			</li>
			
		</ul>
		
		<Modal v-model="modal" width="70%">
	        <p slot="header">{{imgName}}</p>
	        <div>
	        	<img style="width: 100%;height: 100%;" :src="imgSrc" />
	        </div>
	        <div slot="footer">
	            <Button @click="modal = false">关闭</Button>
	        </div>
	    </Modal>
		
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
		imgList: {//图片列表
			type: Array,
			default: () => {return []}
		},
	},
    data () {//数据
        return {
        	
        	modal: false,
        	
        	tf: true,
        	
        	imgSrc: '',
        	
        	imgName: '',
        	
        	imgListData: [],
        	
        	submitData: [],
        	
        	imgData: {
        		
        		imgShowData: [],
        		
        		imgSubmitData: []
        		
        	},
        	
        }
    },
    methods: {//方法
    	
    	upload(){
    		
    		this.tf = true;
    		
    		setTimeout(() => {
    			
	    		let inputDom = this.$refs.inputInstance;
	    		
	    		let ie = navigator.appName=="Microsoft Internet Explorer" ? true : false;
	    		
	            if(ie){ 
	            	
	                inputDom.click();
	                
	            }else{
	            	
	                let a = document.createEvent("MouseEvents");//FF的处理 
	                
	                a.initEvent("click", true, true);  
	                
	                inputDom.dispatchEvent(a); 
	                
	            }
    			
    		},30);
    		
    			
    	},
    	inputChange(){
    		
    		let files = this.$refs.inputInstance.files[0];
    		
    		this.tf = false;
    		
    		if(files.type.indexOf('image/') >= 0){
    			
	    		this.$axios.post('Service/Uploadfile/simple_itf', {
	    			image: files,
				})
				.then(response => {
					
					if(response.status == 200){
						
						this.imgData.imgShowData.push({
							name: files.name,
							url: window.__var.imgUrl + response.data,
						});
						
						this.imgData.imgSubmitData.push(response.data);
						
						this.$emit('on-success',this.imgData);
						
					}
					
				})
				.catch(function (error) {
					console.log(error);
				});
				
    		}else{
    			
    			this.$emit('on-error');
    			
    			this.$Message.error('只能上传图片!');
    			
    		}
    		
    	},
    	show(imgUrl,imgName){//显示
    		
    		this.imgSrc = imgUrl || '';
    		
    		this.imgName = imgName || '图片详情';
    		
    		this.modal = true;
    		
    	},
    	del(index,url){//删除
    		
    		this.imgData.imgShowData.splice(index,1);
    		
    		this.imgData.imgSubmitData.splice(index,1);
    		
    		this.$emit('on-del',this.imgData);
    		
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
	
}
</script>

<style scoped lang="less">
	.upload-box{
		width: 100%;
		height: 100%;
		display: inline-block;
		input{
			display: none;
		}
	}
	.img-main-box{
		display: flex;
		flex-wrap: wrap;
		li{
			width: 100px;
			height: 100px;
			margin: 6px;
		}
		.img-box{
			position: relative;
			border: 1px solid #dddee1;
			border-radius: 4px;
			overflow: hhidden;
			background: #fff;
			&:hover .mask{
				display: flex;
			}
			.box{
				position: absolute;
				width: 95%;
				height: 95%;
				margin: auto;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				border-radius: 4px;
			}
			.bottom{
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.img-bg{
				background-position: center ;
				background-repeat: no-repeat;
				background-size: cover;
			}
			.mask{
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(0,0,0,0.6);
				i{
					color: #fff;
					margin: 10px;
					cursor: pointer;
				}
			}
		}
	}
</style>