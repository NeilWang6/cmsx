(function($){
    var checking=false;
    var checkTime=0;
	
    $(".enroll-submit").live("click",function(e){
        e.preventDefault();
        if(checking){
            return;
        }
        if($("#enroll-state").val()=='new'){
            if(window.confirm("提示！您已成功提交报名申请，再次提交将覆盖上一次的申请，确认要覆盖吗？")){
                submitTopic();
            }
        }else{
            submitTopic();
        }
    });
    function submitTopic(){
        checking=true;
        $(".enroll-submit-text").text("正在进行，请稍候...");
        var applyUrl=$("#apply-gms").val();
        $.ajax({
           timeout: 15000,
           cache:false,
           url: applyUrl,
           success: function(data) {
             if(!data.error){
                 ajaxCheckGms($("#check-gms").val());
             }else{
                 alert("很抱歉，系统出现异常。请稍候报名");
                 reset();
             }
          },
          error:function(){
              alert("页面超时，请刷新重试");
              reset();
          }
        });
    }
    function ajaxCheckGms(url){
        checkTime=checkTime+1;
        if(checkTime>3){
            //查询的次数
            alert("页面超时，请刷新重试");
            reset();
            return;
        }
        $.ajax({
           timeout: 15000,
           cache:false,
           url: url,
           success: function(data) {
             if(data.error === 'gms_staus_no_ready'){
                 window.setTimeout(function(){ajaxCheckGms(url)}, 3000);
             }else{
                 window.location.href=$(".enroll-submit").attr("href");
             }
          },
          error:function(){
              alert("页面超时，请刷新重试");
              reset();
          }
        });
    }
    function reset(){
        checking=false;
        checkTime=0;
        $(".enroll-submit-text").text("立即报名");
    }
})(jQuery);
