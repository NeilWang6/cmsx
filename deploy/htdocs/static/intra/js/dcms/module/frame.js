/**
 * @userfor 框架中去除头和尾，用于运营工具的work平台
 * @author hongss
 * @date 2011.10.18
 */

jQuery(function($){
    try {
        if (parent===window){
            $('.dcms-header').show();
            $('#js-dcmsleftnav').show();
            $('#js-dcmstoggle').show();
        } else {
            $('.dcms-content').css('margin-left', '0');
        }
    } catch(err) {
        $('.dcms-content').css('margin-left', '0');
    }
});