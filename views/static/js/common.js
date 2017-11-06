
define(["jquery","template","nprogress","cookie"],function($,template,NProgress){
	NProgress.start();
	$(function(){
		//7-点击加载页面时，出现进度条，利用插件去实现，开始start放在入口函数之前，done放在入口函数中，表示加载完成
		//但是考虑到ajax请求属于异步的，所以页面加载与数据加载不一致，所以利用jQuery的ajax全局事件去完成，但是全局事件要注册给document
		NProgress.done();
		$(document).ajaxStart (function(){
			NProgress.start();
			$("#onload").show();
		})
		
		$(document).ajaxStop (function(){
			NProgress.done();
			$("#onload").hide();
		})

		//1-如果不是在登录页面，才需要从cookie中获取用户数据展示在页面中，如果在login页面中就不需要
		if(location.pathname != "/dashboard/login"){

			//4-让第一次studyit.com直接跳转至登录页面，如果没有登录，会有phpsessID
			if(!$.cookie("PHPSESSID")){
				location.href = "/dashboard/login";
			}

			//2-接收来自登陆页面的数据，并转换成对象的格式，以方便其它地方使用
			var userinfo = $.cookie("userinfo");
			userinfo = JSON.parse(userinfo);

			
			//3-创建模板引擎，显示在页面
			var html = template("profile-tpl",userinfo);
			$("#user-info").html(html);
		}


		//5-点击退出，发送ajax请求，然后页面跳转至登录页
		$("#login-out").click(function(){
			$.ajax({
				url:"/api/logout",
				type:"post",
				success:function(data){
					if(data.code == 200){
						//退出
						location.href = "/dashboard/login";
					}
				}
			})
		})


		//6-侧边栏模块
		//(1)点击课程管理，显示下拉框
		$(".navs>ul>li>ul").parent().click(function(){
			$(this).children("ul").slideToggle();
		})

		//(2)点击侧边栏选项，页面刷新时让当前的Li高亮，即加入一个类active
		var loc = location.pathname;
		// console.log(loc);
		var activeA = $(".navs a[href='"+loc+"']")
		activeA.addClass("active");

		//(3)点击课程下拉选项跳转页面时，也要让下拉框一直属于展示状态
		if(activeA.parent().parent().siblings("a").length>0){
			activeA.parent().parent().show();
		}


	})
})


	