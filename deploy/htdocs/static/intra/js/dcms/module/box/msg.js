/**
 * @userfor Message - 信息提示框、确认对话框
 * @author zhaoyang.maozy
 * @date 2012.01.17
 */
(function($, D){
	D.Msg = D.Msg||{};
    /**
     * 提示信息框
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
        //设置内容
        config.contentEl.html(config.msg);
        
        //计算EL位置
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
        
        //显示与隐藏
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
     * 信息确定框
     * @param {Object} el
     * @param {Object} msg
     */
    D.Msg['show'] = function(el, config){
        var msgObj,
        defConfig = {
            msg: '',
            title: '',       
            closeEl: $('header close', el),
            buttons: [{name:'enter', value: '确定'}, {name:'cancel', value: '取消'}],
            handle: null //全局处理函数
        },
        self = this;
        config = $.extend(defConfig, config);
       
        // 设置操作按钮
        var buttons = config.buttons, btnHTML='';
        $(buttons).each(function(i, btn){
        	btnHTML += '<button class="'+(btn.className ? btn.className : '')+'" type="button"'+(btn.name? (' name='+btn.name) : '')+'>' + btn.value +'</button>';
        });
        $('footer', el).html(btnHTML);
        
        var closeEl = config.closeEl,
             handle = config.handle;
        
        //设置内容
        $('content', el).html(config.msg);
        $('header h4', el).html(config.title);
        
        // 实例化dialog
        msgObj = el.dialog({
            fixed:true,
            center:true
        });
        
        // 处理事件
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
        // 全局事件
        handle && elms.click(function(e){
        	$.proxy(handle ,this)(e, msgObj, this.name);
        });
     
        // 关闭事件
        closeEl.one('click', closeFun);

    };
})(dcms, FE.dcms);
