/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

(function($, D) {
    readyFun2 = [

    /**
     * ‘§¿¿
     */
    function() {

        $('#btn-pre').click(function(e) {
            var content = $('#com-content').val();
            $('#module-width').val($('#module-submit-form .width-input').val());
            $('#pre-content').val(content);
            $('#previewForm').submit();
            
        });
    }];

    $(function() {
        $.each(readyFun2, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });
})(dcms, FE.dcms);
