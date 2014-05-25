/**
 * @package FD.app.cms.box.favoritelist
 * @author: zhaoyang.maozy 
 * @Date: 2012-01-10
 */

 ;(function($, D){
	var confirmEl = $('#dcms-message-confirm'),
	awakeEl = $('#dcms-message-awake');
        readyFun = [
        /**
         * ����û�������ǩ��������
         */
        function(){
           $('.page-body .search-key').click(function(e){
               e.preventDefault();
               var kw=$.trim($(this).text());
               $('#keyword').val(kw);
               $('#search-lib').submit();
           });
        },
        /**
         * �޸�ҳ��
         */
        function(){
            $('.page-body .modification').click(function(e){
        	 e.preventDefault();
                 var _this = $(this),
                 pageId = _this.data('page-id');
        	 $.getJSON(D.domain + '/page/box/can_edit_page.htm', {'pageId' : pageId}, D.EditPage.edit, 'text');   
            });
        },
        /**
         * ����ҳ��
         */
        function(){
            $('.page-body .import').click(function(e){
                 e.preventDefault();
                 var _this = $(this),
                 templateId = $('#templateId').val(),
                 pageId = $('#pageId').val(),
                 fromPage = _this.data('page-id');
                 D.EditPage.importPage(templateId, pageId, fromPage);
            });
        },
        /**
         * ����û�������ǩ��������
         */
        function(){
           $('.page-body .search-key').click(function(e){
               e.preventDefault();
               var kw=$.trim($(this).text());
               $('#keyword').val(kw);
               $('#search-page-lib').submit();
           });
        },
    ];
    
 
    $(function(){
    	$.each(readyFun, function(i, fn){
            try {
            	fn();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }   		
    	})
    });    

 })(dcms, FE.dcms);
