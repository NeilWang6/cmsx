(function($){
    var checking=false;
    var checkTime=0;
	
    $(".enroll-submit").live("click",function(e){
        e.preventDefault();
        if(checking){
            return;
        }
        if($("#enroll-state").val()=='new'){
            if(window.confirm("��ʾ�����ѳɹ��ύ�������룬�ٴ��ύ��������һ�ε����룬ȷ��Ҫ������")){
                submitTopic();
            }
        }else{
            submitTopic();
        }
    });
    function submitTopic(){
        checking=true;
        $(".enroll-submit-text").text("���ڽ��У����Ժ�...");
        var applyUrl=$("#apply-gms").val();
        $.ajax({
           timeout: 15000,
           cache:false,
           url: applyUrl,
           success: function(data) {
             if(!data.error){
                 ajaxCheckGms($("#check-gms").val());
             }else{
                 alert("�ܱ�Ǹ��ϵͳ�����쳣�����Ժ���");
                 reset();
             }
          },
          error:function(){
              alert("ҳ�泬ʱ����ˢ������");
              reset();
          }
        });
    }
    function ajaxCheckGms(url){
        checkTime=checkTime+1;
        if(checkTime>3){
            //��ѯ�Ĵ���
            alert("ҳ�泬ʱ����ˢ������");
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
              alert("ҳ�泬ʱ����ˢ������");
              reset();
          }
        });
    }
    function reset(){
        checking=false;
        checkTime=0;
        $(".enroll-submit-text").text("��������");
    }
})(jQuery);
