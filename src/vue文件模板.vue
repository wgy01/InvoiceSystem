<template>

	<div>
		
		<Card>
			
		</Card>
			
	</div>
	
</template>

<script>
	
//import 自定义名称 from '路径';
	
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
    	
    },
    computed: {//计算属性
        	
    },
    watch: {//监测数据变化
		
	},
    
    //===================组件钩子===========================
    
    beforeCreate(){
    	//在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
    },
    created () {//实例被创建完毕之后执行
    	
    	//实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，
    	//属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

		//这是一个常用的生命周期，因为你可以调用methods中的方法、改变data中的数据，
		//并且修改可以通过vue的响应式绑定体现在页面上、获取computed中的计算属性等等。
		
	},
	beforeMonut(){//在挂载开始之前被调用：相关的 render 函数首次被调用。
		
	},
    mounted () {//模板被渲染完毕之后执行
    	
	},
	beforeUpdate(){
		//由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，
		//所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，
		//因为这可能会导致更新无限循环。
	},
	beforeDestroy(){//实例销毁之前调用。在这一步，实例仍然完全可用。
		
	},
	destroyed(){
		//Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
		//所有的事件监听器会被移除，所有的子实例也会被销毁。
	},
	
	//=================组件路由勾子==============================
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用
		//console.log(this)  //undefined，不能用this来获取vue实例
	    //console.log('组件路由勾子：beforeRouteEnter')
	    //next(vm => {
	    //  console.log(vm)  //vm为vue的实例
	    //  console.log('组件路由勾子beforeRouteEnter的next')
	    //})
	},
	beforeRouteUpdate (to, from, next) {// 在当前路由改变，但是该组件被复用时调用
		// 在当前路由改变，但是该组件被复用时调用
		// 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
		// 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
		// 可以访问组件实例 `this`
	},
	beforeRouteLeave (to, from, next) {//在离开路由时调用
		//在离开路由时调用。可以用this来访问组件实例。但是next中不能传回调。
		//console.log(this)    //可以访问vue实例
		//console.log('组件路由勾子：beforeRouteLeave')
		//next()
	},
	
}
</script>

<style scoped lang="less">
</style>