/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 7/19/12
 * Time: 11:06 AM
 *
 */

(function($) {
    jQuery.fn.PositionFixed = function(options) {
        var defaults = {
            css:'',
            x:0,
            y:0
        };
        var o = jQuery.extend(defaults, options);

        var isIe6=false; //is ie ? yes:ie no: not ie

        if($.browser.msie && parseInt($.browser.version)==6) {
            isIe6=true;
        }

        var html= $('html');
        if (isIe6 && html.css('backgroundAttachment') !== 'fixed') {
            html.css('backgroundAttachment','fixed')
        };

        return this.each(function() {
            var domThis=$(this)[0];
            var objThis=$(this);
            if(isIe6)
            {

                var left = parseInt(o.x) - html.scrollLeft(),
                    top = parseInt(o.y) - html.scrollTop();
                objThis.css('position' , 'absolute');

                domThis.style.setExpression('left', 'eval((document.documentElement).scrollLeft + ' + o.x + ') + "px"');
                domThis.style.setExpression('top', 'eval((document.documentElement).scrollTop + ' + o.y + ') + "px"');

            }
            else
            {
                objThis.css('position' , 'fixed').css('top',o.y).css('left',o.x);
            }
        });

    };
})(jQuery)