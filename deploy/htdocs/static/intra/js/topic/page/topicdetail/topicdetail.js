/**
 * @author lusheng.linls
 * @usefor 普通专场活动详情页面
 * @date   2013.1.10
 */
 

jQuery.namespace('FE.topic');
;(function($, T){
	var readyFun = [
		function(){
            var shuntAlitalk = new FD.widget.ShuntAlitalk("alitalk-shunt",{});
            FYE.on(FYS('a.callConsultation'),'click',function() {
                FD.widget.block(FYG('callmodalbd'));
            });
            FYE.on(FYS('area.callConsultation'),'click',function() {
                FD.widget.block(FYG('callmodalbd'));
            });
        },
        function(){
			$("#activitysharing").bind("click", function() {
				var jointopicStr = $("#jointopic").attr("href");
				if(!$(this).prop('checked')){
					$("#jointopic").attr("href",jointopicStr.substring(0,jointopicStr.length-1)+"n");		
				}else{
					$("#jointopic").attr("href",jointopicStr.substring(0,jointopicStr.length-1)+"y");
				}
			});
		}
    ];

	
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.topic);
