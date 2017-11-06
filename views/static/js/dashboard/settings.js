define(["jquery","ckeditor","template","uploadify","datepicker","zh-CN","region","form"],function($,CKEDITOR,template){
	$(function(){
        //1-发送ajax请求获取到用户信息，展示在页面
        $.ajax({
            url:"/api/teacher/profile",
            success:function(data){
                if(data.code == 200){
                    console.log(data);
                    $(".settings").html(template("settings-tpl",data.result));
                    showContent();
                }
            }
        })



        function showContent(){
            //1-利用插件完成图片上传功能
            $("#upfile").uploadify({
                swf:"/views/assets/uploadify/uploadify.swf",
                uploader:"/api/uploader/avatar",
                fileObjName: "tc_avatar",
                method: 'post',
                width:120,
                height:120,
                buttonText:"",
                onUploadSuccess:function(file,data){
                    //一定要注意这里是字符串，所以一定要转化成对象形式
                    data = JSON.parse(data);
                    if(data.code == 200){
                        $(".preview>img").attr("src",data.result.path);
                    }
                }
            })

            //2-引入日期插件(其中有两个input框)
            $("input[name='tc_birthday'],input[name='tc_join_date']").datepicker({
                format:"yyyy-mm-dd",
                autoclose: true,
                language:"zh-CN"
            })

            //3-利用插件完成三级联动(region ,在对应的input框中，加入id：p,c,d;然后发送请求，到json文件即可)
            //注意：要加一个自定义属性：data-id用来保存当前所选择的城市的id值
            $("#region").region({
                url:"/views/assets/jquery-region/region.json"
            })


            //4-利用插件完成富文本编辑功能
            CKEDITOR.replace("content", {
                toolbarGroups: [
                    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                    // { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                    { name: 'links' },
                    { name: 'insert' },
                    // { name: 'forms' },
                    // { name: 'tools' },
                    { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
                    // { name: 'others' },
                   
                    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                    // { name: 'styles' },
                    // { name: 'colors' },
                    // { name: 'about' }
                ]
            })

            //5-利用form插件，完成表单提交功能
            $(".settings").on("submit","form",function(){
                $(this).ajaxSubmit({
                    url:"/api/teacher/modify",
                    type:"post",
                    data:{
                        tc_hometown:$("#p>option:selected").text()+"|"+$("#c>option:selected").text()+"|"+$("#d>option:selected").text()
                    },
                    success:function(data){
                        if(data.code == 200){
                            console.log(data);
                            alert("更新成功");
                        }
                    }
                })
                return false;
            })


        }


		
	})
})