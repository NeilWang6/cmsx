/**
 * @package FD.app.cms.resourcehistory
 * @author: arcthur.cheny
 * @Date: 2011-09-26
 */

;(function($, D){
    var resourceId = $('#resource-id').val(),
        resourceType = $('#resource-type').val();
    
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var page = $(this).data('page');
                
                window.location.href = D.domain + '/page/resource_history.html?resourceId=' + resourceId + '&resourceType=' + resourceType + '&page=' + page;
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