var user = {
    ready: 0
}
$(function(){
    $("#login").on("click",function(){
        var username = $("#username").val();
        var password = $("#password").val();
        user.username = username;
        $.post(config.login, { username: username, password: password },
            function (data) {
                console.log("loginData=>"+data)
                login_fun.estimate_main(data)
            }
        );
    })
    //注册
    $("#sign_up").on("click", function(){
    	var username = $("#username").val();
        var password = $("#password").val();
        user.username = username;
        $.post(config.sign_up, { username: username, password: password },
            function (data) {
                throw_msg("注册成功")
                
            }
        );
    })
    // 退出登陆
    $("#logout").on("click", function(){
        $.cookie('token', null);
        $.cookie('username', null);
        $("#form").css("display", "block")
        $("#Logined").css("display", "none")
        throw_msg("已退出登陆")
    })

    $("#upload").on("click",function(){
        var telphone = $("#telphone").val();
        var message = $("#message").val();
        $.post(config.setting, { tel: telphone, msg: message },
            function (data) {
                console.log(data)
                confirm("设置完成")
                $(location).attr('href', "/")
            }
        );
    })
    $("#black").dblclick(function(){
        user.ready = 0;
        $(this).removeClass("on")
    })
    $("#ready").on("click", function(){
        user.ready = 1;
        $("#black").addClass("on")
        startLuYin()//开始录音
    })
    
})

function upload(blob){
    var formData = new FormData();
    formData.append("data", blob);
    $.ajax({
        url: config.upload,
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'json',
        success: function (data) {
            var url = data.data
            // helpme(url)
            throw_msg('录音路径：'+url)
        }
    });
}

function helpme(url){
  
    var data = "position="+window.posMsg+"url"+url
    $.ajax({
        type: "get",
        url: config.helpme,
        data: data,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (response) {
            console.log(response)
        }
    });
}


var login_fun = {
    data: {},
    estimate_code: function(){
        if(this.data.code===0){
            throw_msg(this.data.msg)
            return true;
        }else if(this.data.code===1){
            throw_msg(this.data.msg)
            return false
        }else{
            throw_msg(this.data.msg)
            return false
        }
    },
    estimate_main: function(data){
        this.data = data;
        console.log(this.data)
        if(this.estimate_code()){
            $.cookie('token', this.data.data.token, { expires: 7 });
            $.cookie('username', user.username, { expires: 7 });
            //跳转
            confirm("登陆成功")
            $(location).attr('href', '/');
        }
    }

}
//生成弹出框
function throw_msg(str, msg_style, time) {
    var time = (typeof time==='undefined')?1000:time;
    var msg_style = (typeof msg_style==='undefined')?"default":msg_style;
    var elHtmlArr = [
        '<div id="@{id}" class="top-msg-box msg-box-@{msg_style}">',
        '<p class="top-bg"></p>',
        '<p>@{msg}</p>',
        '</div>'
    ];
    var rand = Math.floor(Math.random()*1000).toString();
    var elHtml = elHtmlArr.join('').replace("@{msg_style}", msg_style)
                                    .replace("@{msg}", str)
                                    .replace("@{id}", rand)
    $("body").append(elHtml)
    
    setTimeout(function() {
        $("#"+rand).addClass("on");
        console.log('show')
    }, 20)
    setTimeout(function() {
        $("#"+rand).removeClass("on");
        console.log('hide')
    }, time)
}