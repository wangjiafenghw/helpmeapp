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
                
                
            }
        );
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
    $("#black").on("click", function(){
        user.ready = 0;
        $(this).removeClass("on")
    })
    $("#ready").on("click", function(){
        user.ready = 1;
        $("#black").addClass("on")
    })
    
})


function helpme(){
    var position = getLocation();
    var position_str = ''
    if(position){
        position_str = `东经:${position.longitude}，北纬:${position.latitude}`
    }else{
        position_str = '暂无';
    }
    
    $.ajax({
        type: "get",
        url: config.helpme,
        data: "position="+position_str,
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

//地理位置信息
function getLocation(){
    navigator.geolocation.getCurrentPosition(function(position) {
        return position.coords
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
    }, 20)
    setTimeout(function() {
        $("#"+rand).removeClass("on");
    }, time)
}