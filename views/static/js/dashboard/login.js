
define(["jquery","cookie","form"],function($){
    $(function(){
    //1-设置表单提交事件，将表单进行序列化收集到表单信息，但注意一定要有input，而且对应一定要有name，name 的值要根据api接口去设置，不能随便写

     //2-这里因为存在跨域问题，所以采用了反向代理的方法，所以ajax中URL的地址需要变化一下

     //3-在跳转页面之前，注意一定要保存成功的回调传回来的数据，因为其要用到侧边栏中，将其存储到cookie中，其它页面就也能使用了,但是注意cookie中只能存储字符串，所以需要转化一下，stringify

     //4-在成功的回调中，根据返回的数据，判断是否登录成功，若成功，就跳转页面到首页即可

     //5-注意：一定要记得在表单提交事件中要阻止表单默认提交，否则ajax请求就没有任何意义了

         $("form").submit(function(){
            // var data = $(this).serialize(); //用了插件就不需要了

            if($("input[name='tc_name']").val().trim()==""){
                alert("请输入用户名");
                return false;
            }

            if($("input[name='tc_pass']").val().trim()==""){
                alert("请输入密码");
                return false;
            }

            $(this).ajaxSubmit({
                url:"/api/login",
                type:"post",
                // data:data,  用了插件就不需要了
                success:function(data){
                    console.log(data); 
                    if(data.code == 200){
                        //登陆成功
                        //保存数据到cookie中，键是userinfo，值是data.result
                        var a = JSON.stringify(data.result);
                        // console.log(a);
                        $.cookie("userinfo",a,{path:"/",expires:365}); 

                        //跳转页面
                        location.href = "/";
                    }
                }
            })

            return false;
         })

    })

})