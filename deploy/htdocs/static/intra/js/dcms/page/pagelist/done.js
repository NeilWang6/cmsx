/**
 * @package FD.app.cms.pagelist
 * @author: arcthur.cheny
 * @Date: 2011-09-26
 */

;(function($, D){
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var page = $(this).data('page');
                
                document.search_page.page.value = page;
                document.search_page.submit();
            });
        }
    ];
    
    $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
 })(dcms, FE.dcms);