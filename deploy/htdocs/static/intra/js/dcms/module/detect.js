/**
 * ���browser �Ƿ� IE9���� ��������ʾ
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
            html = '<span title="�ر�" class="detectClose">X</span> Ϊ����Ա���Ŀ��ͨ��ϵͳ���� <span class="dcms-detect-bold">17��14:00~18��9:00</span> �������ݱ��ݼ��������ڴ��ڼ��뾡�� <span class="dcms-detect-bold">��Ҫ�޸�ҳ��</span>���Ա������ݶ�ʧ���н�����������ϵ������: dcms����';
            tip.html(html);
            tip.show();
        }
        
        $(".detectClose").bind("click",function(){
            $("#detect_tip").hide();
        });
 		
});