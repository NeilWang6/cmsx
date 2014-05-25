/**
 * author lusheng.linls
 * date 2013-2-21
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