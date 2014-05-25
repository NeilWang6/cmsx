/**
 * 检测browser 是否 IE9以下 并给出提示
 * @author springyu
 * @date 2011-12-29
 */

jQuery(function($){
       	if ($.browser.msie){
    		//alert("this is IE,ad"+$.browser.version);
    		$("#detect_tip").show();
    	}
        
        var lastDate = Date.parse('Sep 18, 2013 09:00'),
            nowDate = Date.parse( new Date() );
        
        if (nowDate < lastDate){
            var tip = $("#detect_tip"),
            html = '<span title="关闭" class="detectClose">X</span> 为配合淘宝类目打通，系统将在 <span class="dcms-detect-bold">17号14:00~18号9:00</span> 进行数据备份及订正，在此期间请尽量 <span class="dcms-detect-bold">不要修改页面</span>，以避免数据丢失，有紧急需求请联系旺旺号: dcms答疑';
            tip.html(html);
            tip.show();
        }
        
        $(".detectClose").bind("click",function(){
            $("#detect_tip").hide();
        });
 		
});