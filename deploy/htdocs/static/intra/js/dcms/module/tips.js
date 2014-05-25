/**
 * @userfor Tips - 信息提示便签
 * @author hongss
 * @date 2011.08.23
 */
(function($, D){
	D.Tips = {};
    
    D.Tips['show'] = function(el, config){
        var defConfig = {
            msg: '',
            relatedEl: null,
            offset: 0,    //偏移量
            //direction: 'bottom',  //箭头所在位置
            content: '.dcms-grid-tips-content'
            //arrowEl: $('.dcms-grid-tips-arrow-down', el)
        },
        elClone;
        config = $.extend(defConfig, config);
        if (config.relatedEl){
            var rel = config.relatedEl;
            elClone = rel.find('.dcms-grid-tips-wrap');
            if (elClone.length<=0){
                elClone = el.clone();
                elClone.removeAttr('id');
                rel.append(elClone);
            }
            if (config.msg){
                elClone.find(config.content).html(config.msg);
            }
            var elHeight = elClone.outerHeight(),
            relOffset = rel.offset(),
            relTop = relOffset.top,
            relLeft = relOffset.left,
            elTop = relTop+8-elHeight,
            elLeft = relLeft+config.offset;
            elClone.css({'top':elTop+'px', 'left':elLeft+'px'});
            elClone.fadeIn();
        }
    }
    D.Tips['hide'] = function(relatedEl){
        var elClone = relatedEl.find('.dcms-grid-tips-wrap');
        elClone.fadeOut();
    }
    
})(dcms, FE.dcms);
