define(["jquery","utils","template","form","datepicker","zh-CN","validate"],function($,utils,template){
	//实现功能：在一个页面中实现两个效果，添加和编辑功能

	//1-区分是添加讲师页面还是编辑讲师页面
	//根据传入的url地址中是否包含id去区分，如果包含id，则是编辑，反之是添加
	var id = utils.getQuery("id");
	var data = {};
	if(id){
		//是编辑
		// alert("编辑");
		data.title = "讲师编辑";
		data.btnText = "保 存";
		data.url = "/api/teacher/update";
		$.ajax({
			url:"/api/teacher/edit",
			data:{tc_id:id},
			success:function(msg){
				if(msg.code == 200){
					// console.log(msg);
					data.teacher = msg.result;
					getData();  //展示在页面
				}
			}
		})
	}else{
		// alert("添加");
		data.title = "讲师添加";
		data.btnText = "添 加";
		data.url = "/api/teacher/add",
		data.teacher = {
			tc_gender:"0"
		};
		getData();
	}

	//2-需要将获取到的数据展示在页面，但是ajax是异步操作，所以需要将其放置在成功的回掉中
	function getData(){
		$(".body.teacher").html(template("teacher-manage-tpl",data));

		//4-实现在设置入职时间时，不用手动输入，通过插件来实现
		 $('input[name="tc_join_date"]').datepicker({  
	        format: 'yyyy-mm-dd',  //日期格式
	        language: 'zh-CN',   //语言
	        autoclose: true  //自动关闭
	      });  

		 //5-实现点击添加或者编辑讲师时，对表单进行一些校验，通过插件去实现
		 $("form").validate({
		 	onBlur:true,
		 	onChange:true,
		 	sendForm:false,
		 	conditional:{
		 		forbidden:function(value){
		 			return value != "前端学院";
		 		}
		 	},
		 	description:{
		 		msgname:{
		 			required:"必填项",
		 			conditional:"用户名静止使用前端学院"
		 		},
		 		msgpass:{
		 			required:"必填项",
		 			pattern:"必须由6-15位的字母或数字组成"
		 		},
		 		msgdate:{
		 			required:"必填项"
		 		}
		 	},
		 	valid:function(){
		 		//表单验证完全通过，然后执行函数，此时的this是jQuery对象，指向form
		 		this.ajaxSubmit({
					success:function(data){
						if(data.code == 200){
							location.href = "/teacher/list";
						}
					}
				})
		 	},
		 	eachInvalidField:function(){
		 		//遍历每个表单，如果验证不通过的话，执行该处代码，this指向该处的input
		 		this.parent().parent().addClass("has-error");
		 	}

		 })
	}


	//3-点击表单提交功能：通过插件：form，但注意表单中必须每个都有name属性，且属性值根据根据后台接口获得
	//注意：这里的表单都是动态生成的，所以必须用委托事件去注册
	// $(".body.teacher").on("submit","form",function(){
	// 	$(this).ajaxSubmit({
	// 		success:function(data){
	// 			if(data.code == 200){
	// 				location.href = "/teacher/list";
	// 			}
	// 		}
	// 	})
	// 	return false;  //阻止默认的表单提交
	// })
	
})