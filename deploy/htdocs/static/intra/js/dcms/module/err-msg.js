/**
 * @userfor 后端错误信息提醒
 * @author hongss
 * @date 2013.09.18
 */

;(function($, D, undefined){
    var errMessage = function(){
        if (location.pathname==='/page/view_page.html'){   //页面审核预览
            var iframeEl = document.getElementById('dcms-view-page');
            $(iframeEl).load(function(){
                var iframeDoc = iframeEl.contentDocument.document || iframeEl.contentWindow.document,
                    errorEls = handleErr($(iframeDoc));
                if (errorEls[0]){
                    D.Message['confirm']($('#dcms-message-confirm'), {
                        title: '错误信息提醒',
                        msg: '页面渲染错误，请返回可视化编辑检查有错误提示区块！'
                        
                    });
                }
            });
        } else if (location.pathname==='/page/preview_template.htm'){   //区块审核预览
            var iframeEl = document.getElementById('dcms-view-page');
            $(iframeEl).load(function(){
                var iframeDoc = iframeEl.contentDocument.document || iframeEl.contentWindow.document;
                handleErr($(iframeDoc));
            });
        } else {  //可视化编辑页面
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