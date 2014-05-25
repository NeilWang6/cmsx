/**
 * @author shanshan.hongss
 * @usefor ���ߺ�̨��ʽͳһ ���� �Ҹ���
 * @date   2012.09.12
 */

;(function($, T){
    T.fixedRight = function(elem, opts){
        var defConfig = {
            relElem: null,   //����Ԫ�أ�Ĭ��Ϊelem�ĸ���Ԫ��
            top: 0,    //����ڶ����ĸ߶�
            offset: 0   //������Ԫ��֮���ƫ��λ��(��λpx)
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