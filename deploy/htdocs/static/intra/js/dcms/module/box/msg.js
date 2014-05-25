/**
 * @userfor Message - ��Ϣ��ʾ��ȷ�϶Ի���
 * @author zhaoyang.maozy
 * @date 2012.01.17
 */
(function($, D){
	D.Msg = D.Msg||{};
    /**
     * ��ʾ��Ϣ��
     * @param {Object} el
     * @param {Object} msg
     */
    D.Msg['awake'] = function(el, config){
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
    D.Msg['show'] = function(el, config){
        var msgObj,
        defConfig = {
            msg: '',
            title: '',       
            closeEl: $('header close', el),
            buttons: [{name:'enter', value: 'ȷ��'}, {name:'cancel', value: 'ȡ��'}],
            handle: null //ȫ�ִ�����
        },
        self = this;
        config = $.extend(defConfig, config);
       
        // ���ò�����ť
        var buttons = config.buttons, btnHTML='';
        $(buttons).each(function(i, btn){
        	btnHTML += '<button class="'+(btn.className ? btn.className : '')+'" type="button"'+(btn.name? (' name='+btn.name) : '')+'>' + btn.value +'</button>';
        });
        $('footer', el).html(btnHTML);
        
        var closeEl = config.closeEl,
             handle = config.handle;
        
        //��������
        $('content', el).html(config.msg);
        $('header h4', el).html(config.title);
        
        // ʵ����dialog
        msgObj = el.dialog({
            fixed:true,
            center:true
        });
        
        // �����¼�
    	var elms = $('footer button', el), closeFun = function(e){
            e.preventDefault();
            msgObj.dialog('close');
        };
        $(buttons).each(function(i, btn){
        	var fn=btn.handle, elm = elms.eq(i);
        	fn && elm.click(function(e){ 
        		$.proxy(fn ,this)(e, msgObj, this.name);
        	});
        	if(btn.close){
        		elm.click(closeFun);
        	}
        });  
        // ȫ���¼�
        handle && elms.click(function(e){
        	$.proxy(handle ,this)(e, msgObj, this.name);
        });
     
        // �ر��¼�
        closeEl.one('click', closeFun);

    };
})(dcms, FE.dcms);
