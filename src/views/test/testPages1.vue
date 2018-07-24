<template>

	<div>
		
		<Table border :columns="columns1" :data="data1"></Table>
		
		<div class="abc">
			<h2>less语法</h2>
		</div>
		
	</div>
	
</template>

<script>

import axios from 'axios';

let ajax = () => {//Ajax方法（异步）

	return new Promise(resolve => {

		axios.post('system/formTable_list', {
			page: 1,
			pagesize: 3,
			list_type: 1,
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

export default {
	components:{//模板
	},
	props:{
		
	},
    data () {//数据
        return {
        	
        	columns1: [
                {
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '时间',
                    key: 'create_time'
                }
            ],
            data1: [],
        	
        }
    },
    methods: {//方法
    	
    },
    computed:{//计算属性
        	
    },
    watch:{//监测数据变化
		
	},
    created(){//实例被创建完毕之后执行
    	
	},
    mounted(){//模板被渲染完毕之后执行
    	
	},
	beforeRouteEnter (to, from, next) {//进入路由之前（在渲染该组件的对应路由被确认前调用）
		
		//在进入路由之前请求Ajax，初始化页面数据
		let data = [];
		
		(async() => { //es7异步函数
			
			data = await ajax();
			
			next(vm => {//回调
				vm.data1 = data;
			})
			
		})();
	    
	},
}
</script>

<style scoped lang="less">

.border-color (@color: blue, @abc:1px + 1) {
	border:@abc solid @color;
}

.abc{
	.border-color;
}

</style>