
//1-页面跳转至teacher页面时，要先发送ajax请求，获取到后台的数据，生成模板，渲染至页面
define(["jquery","template","bootstrap"],function($,template){
	
	//2-因为后台数据中没有age，所以需要我们自己手动设置
	template.defaults.imports.getage = function(tc){
		return new Date().getFullYear()-new Date(tc).getFullYear();
	}


	$.ajax({
		url:"/api/teacher",
		success:function(data){
			if(data.code == 200){
				// console.log(data);
				$("#teacher-list").html(template("teacher-list-tpl",data));
			}
		}
	})



	//3-点击查看按钮(显示弹出框，并在显示前需要将当前的内容渲染在页面，也要从后台获取到数据)
	//注册委托时间，因为是模板动态生成的
	//需要用到bootstrap
	$("#teacher-list").on("click",".btn-checkinfo",function(){
		var id = $(this).parent().data("id");
		$.ajax({
			url:"/api/teacher/view",
			data:{
				tc_id:id
			},
			success:function(data){
				if(data.code == 200){
					// console.log(data);
					$("#teacher-checkinfo").html(template("teacher-checkinfo-tpl",data.result));

					//4-使模态框显示出来
					$("#teacherModal").modal("show");
				}
			}
		})
	});


	//实现点击注销与启用互换，要发送ajax请求，获取后台数据
	//启用：tc_status:0   注销：tc_status:1
	$("#teacher-list").on("click",".btn-status",function(){
		var id = $(this).parent().data("id");
		var status = $(this).data("status");

		var that = this;

		$.ajax({
			url:"/api/teacher/handle",
			type:"post",
			data:{
				tc_id:id,
				tc_status:status
			},
			success:function(data){
				if(data.code == 200){
					console.log(data);
					var enable = data.result.tc_status == 0;
					//这是链式写法，注意在每行结束千万不能加;分号，否则会报错
					$(that)
						.text(enable?"注 销":"启 用")
						.removeClass(enable? "btn-success" : "btn-warning")
						.addClass(enable?"btn-warning":"btn-success")
						.data("status",data.result.tc_status);

				}
			}
		})
	})

})