<template>
	
	<div class="box">
		
		<login v-if="!show"></login>
		
		<register v-if="show"></register>
		
	</div>
	
</template>

<script>
	
import login from '@/views/login/login_t.vue';

import register from '@/views/login/register.vue';

export default {
	components:{//模板
		login,
		register
	},
	props:{
		
//		name: {
//			type: Array | Number | String | Object,//类型
//			required: true,//必传
//			default: '',//默认值
//		}
		
	},
    data () {//数据
    	
        return {
        	
        	show: false,
        	
        }
    },
    methods: {//方法
		    	
    },
    computed:{//计算属性
        	
    },
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
    watch:{//监测数据变化
		
	},
	
}
</script>

<style scoped>
	.box{
		position: relative;
		background:url(../../../static/public/images/kj01.png) center / cover no-repeat;
		width:100%;
		height:100%;
		z-index:1;
	}
	/*背景模糊*/
	.box:after{
	    content: "";
	    width:100%;
	    height:100%;
	    position: absolute;
	    left:0;
	    top:0;
	    background: inherit;
	    filter: blur(4px);
	    z-index: 2;
	}
</style>