/**
 * @author: wangxiaojun
 * @Date: 2012-10-19
 */

;(function($) {
	 var messageAjax = function(){
	 var loginid = $('.libra-message').data('loginid');
	 var url = $('.libra-message').data('domain'); 
         $.ajax(url+'?memberId='+loginid, {
                dataType: 'jsonp',
                error : function(jqXHR, textStatus, errorThrown) {
                    //未读消息条数读不到时忽略
                    return;
                },
                success: function(data){
                 	if(data.hasError == false){
                 		var count = parseInt(data.content);
                 		 if(count>0){
                 		 		  if(count>99){
                 			   		$('#messageCount').html(data.content+"+");
                 				  }else{
                 				  	$('#messageCount').html(data.content);
                 				  }
                 			   $(".libra-message").css('display','block');
                 		 }else{
                 		   	 $('#messageCount').html('');
                 		   	  $(".libra-message").css('display','none');
                 		 }
                  }
                }
              });
	 }
	
	 var readyFun = [
   
		//定时取消息数据
		function(){
			 messageAjax();
 			 setInterval(function(){
 			 	    messageAjax();
          }, 10*1000);
		}
		];
		$(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery);
