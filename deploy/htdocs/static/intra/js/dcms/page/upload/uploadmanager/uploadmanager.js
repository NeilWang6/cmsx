/**
 * @package FD.app.cms.upload.uploadmanager
 * @author: arcthur.cheny
 * @Date: 2011-10-10
 */


;(function($, D){
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var form  = document.getElementById("uploadManager"),
                    page = $(this).data('page');
                    
                document.getElementById("actionEvt").name='event_submit_do_uploadManage';
                form.page.value = page;
                form.submit();
            });
        }
    ];
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
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