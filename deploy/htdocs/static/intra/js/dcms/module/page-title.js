/**
 * @author wb_hongss.ciic
 * @date 2011.05.23
 * @usefor change page title
 */

(function($, D){
    $(function(){
        if ($('#dcms-page-title')){
            $('title', 'head').html($('#dcms-page-title').val());
        }
    });
})(dcms, FE.dcms);
