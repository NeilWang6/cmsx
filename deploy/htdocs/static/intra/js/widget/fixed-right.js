/**
 * @author shanshan.hongss
 * @usefor 工具后台样式统一 —— 右浮窗
 * @date   2012.09.12
 */

;(function($, T){
    T.fixedRight = function(elem, opts){
        var defConfig = {
            relElem: null,   //对照元素，默认为elem的父级元素
            top: 0,    //相对于顶部的高度
            offset: 0   //跟对照元素之间的偏移位置(单位px)
        },
            elem = $(elem),
            config = $.extend({}, defConfig, opts),
            win = $(window),
            relElem = (config.relElem) ? $(config.relElem) : elem.parent(),
            totalLeft = relElem.offset()['left']+relElem.outerWidth()+elem.outerWidth()+config.offset
            right = getRightSize(win, totalLeft);
        
        elem.css({'right':right+'px', 'top':config.top+'px'});
        
        win.resize(function(e){
            var tempRight = getRightSize($(this), totalLeft);
            elem.css({'right':tempRight+'px', 'top':config.top+'px'});
        });
    };
    function getRightSize(win, totalLeft){
        var rightSpace = win.width()-totalLeft;
        return (rightSpace>0) ? rightSpace : 0;
    }
})(jQuery, FE.tools);