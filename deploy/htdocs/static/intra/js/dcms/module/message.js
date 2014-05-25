/**
 * @userfor Message - ��Ϣ��ʾ��ȷ�϶Ի���
 * @author hongss
 * @date 2011.08.23
 */
(function($, D){
	D.Message = {};
    /**
     * ��ʾ��Ϣ��
     * @param {Object} el
     * @param {Object} msg
     */
    D.Message['awake'] = function(el, config){
        var defConfig = {
            msg: '',
            relatedEl: $(document.body),
            closeEl: $('close', el),
            contentEl: $('content', el)
        },
        isShowing = false;
        config = $.extend(defConfig, config);
        //��������
        config.contentEl.html(config.msg);
        
        //����ELλ��
        var rel = config.relatedEl,
        elWidth = el.outerWidth(),
        elHeight = el.outerHeight(),
        relWidth = rel.outerWidth(),
        relHeight = rel.outerHeight(),
        relOffset = rel.offset(),
        relTop = relOffset.top,
        relLeft = relOffset.left,
        elTop = relTop + (relHeight-elHeight)/2,
        elLeft = relLeft + (relWidth-elWidth)/2;
        
        el.css({'position':'absolute', 'top':elTop+'px', 'left':elLeft+'px'});
        
        //��ʾ������
        el.slideDown(600);
        window.setTimeout(function(){
            el.mouseleave(function(e){
                elSlideUp();
            });
            if (isShowing===false){
                elSlideUp();
            }
            
        }, 5000);
        el.mouseenter(function(e){
            el.show();
            isShowing = true;
        });
        el.mouseleave(function(e){
            isShowing = false;
        });
        config.closeEl.click(function(e){
            elSlideUp();
        });
        
        function elSlideUp(){
            el.slideUp(600, function(){
                el.unbind('mouseenter mouseleave');
            });
        }
    };
    /**
     * ��Ϣȷ����
     * @param {Object} el
     * @param {Object} msg
     */
    D.Message['confirm'] = function(el, config){
        var msgObj,
        defConfig = {
            msg: '',
            title: '',
            contentEl: $('content', el),
            titleEl: $('header h4', el),
            closeEl: $('header close', el),
            enterEl: $('.js-enter-btn', el),
            cancelEl: $('.js-cancel-btn', el),
            enter: null,
            cancel: null
        },
        self = this;
        config = $.extend(defConfig, config);
        var enterEl = config.enterEl,
        cancelEl = config.cancelEl,
        closeEl = config.closeEl;
        //��������
        config.contentEl.html(config.msg);
        config.titleEl.html(config.title);
        
        //ʵ����dialog
        msgObj = el.dialog({
            fixed:true,
            center:true
        });
        enterEl.click(function(e){
            e.preventDefault();
            handler('enter');
        });
        closeEl.add(cancelEl).click(function(e){
            e.preventDefault();
            handler('cancel');
        });
        
        
        function handler(handler){
            msgObj.dialog('close');
            if (config[handler]){
                config[handler].call(self);
            }
            enterEl.unbind('click');
            cancelEl.unbind('click');
        }
    };
})(dcms, FE.dcms);
