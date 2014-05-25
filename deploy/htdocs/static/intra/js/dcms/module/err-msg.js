/**
 * @userfor ��˴�����Ϣ����
 * @author hongss
 * @date 2013.09.18
 */

;(function($, D, undefined){
    var errMessage = function(){
        if (location.pathname==='/page/view_page.html'){   //ҳ�����Ԥ��
            var iframeEl = document.getElementById('dcms-view-page');
            $(iframeEl).load(function(){
                var iframeDoc = iframeEl.contentDocument.document || iframeEl.contentWindow.document,
                    errorEls = handleErr($(iframeDoc));
                if (errorEls[0]){
                    D.Message['confirm']($('#dcms-message-confirm'), {
                        title: '������Ϣ����',
                        msg: 'ҳ����Ⱦ�����뷵�ؿ��ӻ��༭����д�����ʾ���飡'
                        
                    });
                }
            });
        } else if (location.pathname==='/page/preview_template.htm'){   //�������Ԥ��
            var iframeEl = document.getElementById('dcms-view-page');
            $(iframeEl).load(function(){
                var iframeDoc = iframeEl.contentDocument.document || iframeEl.contentWindow.document;
                handleErr($(iframeDoc));
            });
        } else {  //���ӻ��༭ҳ��
            errorEls = handleErr($('body'));
        }
    };
    
    function handleErr(doc){
        
        var errorEls = $('exception', doc);
        errorEls.each(function(){
            var errorEl = $(this);
            
            errorEl.parents(':hidden').show();
        });
        return errorEls;
    }
    $(function(){
        errMessage();
    });
})(jQuery, FE.dcms);