/**
 * @userfor �����ȥ��ͷ��β��������Ӫ���ߵ�workƽ̨
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