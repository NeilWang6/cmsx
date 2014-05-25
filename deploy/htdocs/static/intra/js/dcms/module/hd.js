/**
 * @package FD.app.cms.header
 
 * @date: 2011-03-06
 */
(function($, D){
    var readyFun = [
        /**
         * @author: yanlong.liuyl
         */
        function(){
            var t;
            $('#js-dcmsaccount').hover(
                function(){
                    var _self = $(this);
                    t = window.setTimeout(function(){
                        _self.addClass('dcms-over');
                    }, 0);
                },
                function(){
                    if(t){
                        window.clearTimeout(t);
                    }
                    $(this).removeClass('dcms-over');
                }
            );
        },
          function(){
    $('#dcms-hdsearch-keywords').bind('keyup', function(event){
   if (event.keyCode=="13"){
   			 var form = $('#dcms-hdsearch-form'), btn = $('#dcms-hdsearch-btn'), action = $('#dcms-hdsearch-action'), isSearch = $('#dcms-hdsearch-hidden');
	         var key = $('#dcms-hdsearch-keywords'), keywords = key.val(), choose = $('#dcms-hdsearch-choose').val();
	   		switch (choose) {
				case 'page':
					form.attr('action', D.domain + '/page/box/search_box_page.html');
					action.attr('name', 'action');
					action.val('PageManager');
					isSearch.attr('name', 'event_submit_do_searchPageNew');
					isSearch.val('true');
					key.attr('name', 'specialUrl');
					form.submit();
					break;
				case 'position':
					form.attr('action', D.domain + '/position/manage_position.html');
					key.attr('name', 'keyword');
					form.submit();
					break;
				case 'rule':
					form.attr('action', D.domain + '/position/manage_rule.html');
					key.attr('name', 'keywords');
					form.submit();
					break;
				case 'template':
					form.attr('action', D.domain + '/page/search_template.html');
					action.attr('name', 'action');
					action.val('TemplateManagerAction');
					isSearch.attr('name', 'event_submit_do_searchTemplate');
					isSearch.val('true');
					key.attr('name', 'templateCode');
					form.submit();
					break;
			}
   }
});
},
        /**
         * @author: hongss
         * ¶¥²¿ ¿ì½ÝËÑË÷
         */
        function(){
            var form = $('#dcms-hdsearch-form'),
            btn = $('#dcms-hdsearch-btn'),
            action = $('#dcms-hdsearch-action'),
            isSearch = $('#dcms-hdsearch-hidden');
            btn.click(function(){
                var key = $('#dcms-hdsearch-keywords'),
                keywords = key.val(),
                choose = $('#dcms-hdsearch-choose').val();
                switch (choose) {
                    case 'page':
                        form.attr('action', D.domain+'/page/box/search_box_page.html');
                        action.attr('name', 'action');
                        action.val('PageManager');
                        isSearch.attr('name', 'event_submit_do_searchPageNew');
                        isSearch.val('true');
                        key.attr('name', 'specialUrl');
                        form.submit();
                        break;
                    case 'position':
                        form.attr('action', D.domain+'/position/manage_position.html');
                        key.attr('name', 'keyword');
                        form.submit();
                        break;
                    case 'rule':
                        form.attr('action', D.domain+'/position/manage_rule.html');
                        key.attr('name', 'keywords');
                        form.submit();
                        break;
                    case 'template':
                        form.attr('action', D.domain+'/page/search_template.html');
                        action.attr('name', 'action');
                        action.val('TemplateManagerAction');
                        isSearch.attr('name', 'event_submit_do_searchTemplate');
                        isSearch.val('true');
                        key.attr('name', 'templateCode');
                        form.submit();
                        break;
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
})(dcms, FE.dcms);