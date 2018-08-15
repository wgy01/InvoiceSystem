<template>

	<div>
		
		<Card style="margin-bottom: 16px;">
			
			<h1 slot="title">创建公司</h1>
			
			<div>
				
				<Form ref="formInline" :model="companyFormsList" :label-width="100">
					
			        <Row :gutter="16">
			        	
			        	<Col span="12">
					        <FormItem label="单位名称" prop="companyName" :rules="companyName">
					            <Input v-model="companyFormsList.companyName" clearable placeholder="单位名称"></Input>
					        </FormItem>
			        	</Col>
			        	
				        <Col span="12" v-for="(item,index) in companyFormsList.data" :key="index">
					        <FormItem :label="item.name" :prop="'data.' + index + '.value'" :rules="rules(item)">
					            <Input v-model="item.value" clearable :placeholder="item.remark || item.name"></Input>
					        </FormItem>
				        </Col>
			        	
			        	<Col span="12">
			        		<FormItem label="公司描述">
					            <Input type="textarea" :rows="1" v-model="companyFormsList.remark" clearable placeholder="公司描述..."></Input>
					        </FormItem>
			        	</Col>
			        	
			        </Row>
			        	
			    </Form>
				
				<div style="text-align: center;">
			    	<Button type="primary" @click="handleSubmit('formInline')">创建公司</Button>
			    </div>
				
			</div>
			
		</Card>
		
		<Card>
			
			<h1 slot="title">公司列表</h1>
			
			<list-component
			:table-columns="tableColumns"
			:table-data="tableData"
			component-type="companySE"
			>
			</list-component>
			
		</Card>
		
		<input type="file" accept=".xlsx,.xls" @change="importf" />
		<div id="demo"></div>
		
	</div>
	
</template>

<script>

import listComponent from '@/components/list-component.vue';

import axios from 'axios';

import XLSX from 'xlsx';

let companyList = () => {

	return new Promise(resolve => {

		axios.post('Service/Company/index', {
			user_id: localStorage.getItem('userId')
		})
		.then(response => {
			resolve(response.data);
		})
		.catch(function(error) {
			console.log(error);
		});

	});

}

let companyField = () => {//公司固定字段

	return new Promise(resolve => {

		axios.post('Service/ModelField/index', {
			
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
	components:{//组件模板
		listComponent,
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
        	
        	companyFormsList:{//公司表单字段数据
        		companyName: '',
        		remark: '',
				data: [],
			},
        	
    		companyName: [
                { required: true, message: '请输入单位名称', trigger: 'blur' }
            ],
        	
        	tableColumns: [
                {
                	align: 'center',
                	width: 80,
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'title'
                },
                {
                    title: '公司描述',
                    key: 'remark'
                },
                {
                	align: 'center',
                	width: 80,
                    title: '操作',
                    handle: ['edit'],
                },
            ],
            
            tableData: [],
            
        }
    },
    methods: {//方法
    	
    	
    	importf(ev) {//导入
    			
    			let el = ev.target;
    			
    			var wb;//读取完成的数据
    			
            	var rABS = false; //是否将文件读取为二进制字符串
    			
                if(!el.files) {
                    return;
                }
                
                console.log(el.files);
                
                var f = el.files[0];
                
                var reader = new FileReader();
                
                reader.onload = function(e) {
                	
                	
                    var data = e.target.result;
                    
                    console.log(e.target);
                    
                    if(rABS) {
                    	
                        wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                            type: 'base64'
                        });
                        
                    } else {
                    	
                        wb = XLSX.read(data, {
                            type: 'binary'
                        });
                        
                    }
                    
                    //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //wb.Sheets[Sheet名]获取第一个Sheet的数据
                    
                    //console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
                    
                    document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
                };
                
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                	console.log(123123123);
                    reader.readAsBinaryString(f);
                }
                
            },

    	
    	rules(item){//验证
    		
    		if(item.field == 'organizer_code'){
    			
    			return [
                    { required: true, message: '请输入识别号', trigger: 'blur' }
                ];
    			
    		}else{
    			
    			return [];
    			
    		}
    		
    	},
    	handleSubmit(name) {//创建公司
    		
            this.$refs[name].validate((valid) => {
            	
            	console.log(this.companyFormsList.data);
            	
                if (valid) {
                	
                	this.$axios.post('Service/Company/add', {
		    			user_id: localStorage.getItem('userId'),
		    			title: this.companyFormsList.companyName,
		    			remark: this.companyFormsList.remark,
		    			setting: JSON.stringify(this.companyFormsList.data),
					})
					.then(response => {
						
						if(response.status = 200){
							
							(async() => {
								this.tableData = await companyList();
							})();
							
							this.companyFormsList.companyName = '';
							
							this.companyFormsList.remark = '';
							
							this.companyFormsList.data.forEach(item => {
								
								item.value = '';
								
							});
							
							this.$Message.success('创建成功');
							
						}
						
					})
					.catch(function (error) {
						console.log(error);
					});
                	
                }
                
            })
            
       },
       updateData(){//更新表格数据
    		
			(async() => {
				
				this.tableData = await companyList();
				
			})();
			
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
	
	beforeRouteEnter (to, from, next) {//在组件创建之前调用
		
		let companyDataList = [];//公司列表
		
		let field = [];
		
		let companyFieldList = [];//公司基本字段列表
		
		(async() => {
			
			companyDataList = await companyList();
			
			if(localStorage.getItem('userType') == 2){
				
				field = await companyField();
			
				field.forEach(item => {
				
					if(item.user_type == 2 && item.is_base == 1){
					
						companyFieldList.push(item);
						
					}
				
				});
				
			}
			
			
			next(vm => {
				
				vm.companyFormsList.data = companyFieldList;
				
				vm.tableData = companyDataList;
				
			});
			
		})();
		
	},
	
}
</script>

<style scoped>
</style>