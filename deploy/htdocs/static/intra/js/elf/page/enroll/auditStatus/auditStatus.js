/**
 * @author zhuliqi
 * @usefor ��������ҳ��
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
		//��ҳ
		function() {
            var data = {
                curPage: $('input#curpage').val(),
                page: $('input#page').val(),//��ҳ
                titlelist: $('input#titlelist').val(),//������
                leftContent: '',
                rightContent: '',
                limit: 3,
                width: $('.data-table table').width() + 'px',
                left: $('.data-table table').offset().left + 'px',
                curPageInput: $('input#curpage'),
                form: $('#pagefrmbottom'),
                param: $('#pagefrmbottom input[name=page_num]')
            }
            var pagelistall = new T.pagelistall(data);
            pagelistall.init(data);
		},
        //memberIdת��
        function(){
            T.searchId('#searchId');
        }
		
    ];
    function alertInfo(data,callback){
        jQuery.use('web-sweet',function(){
        //��ƴ��HTML
        var template = '<% switch($data.type) {\
                            case "success":%>\
                                <i class="tui-icon-36 icon-success"></i>\
                                <div class="msg"><%= $data.content %></div>\
                                <%break;\
                            case "info":%>\
                                <i class="tui-icon-36 icon-message"></i>\
                                <div class="msg"><%= $data.content%></div>\
                                <%break;\
                            case "error":%>\
                                <i class="tui-icon-36 icon-fail"></i>\
                                <div class="msg"><%= $data.content%></div>\
                                <%break;\
                        } %>';
        var html = FE.util.sweet(template).applyData(data);
        jQuery('#small').find('section').html(html);
    })
    jQuery.use('ui-dialog',function(){
        jQuery('#small').dialog({
            fadeIn: 500,
            fadeOut: 500,
            timeout: 1000,
            center: true,
            close: function(){
                callback();
            }
        })
    })
}
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
})(jQuery, FE.tools);
