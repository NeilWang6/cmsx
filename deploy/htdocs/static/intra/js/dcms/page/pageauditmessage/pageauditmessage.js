/**
 * @package FD.app.cms.pageAuditMessage
 * @author: hongss
 * @Date: 2011-04-20
 */

 ;(function($, D){
     var readyFun = [
        /**
         * 绑定 继续审核 按钮事件
         */
        function(){
            $('#dcms-continue-audit').click(function(){
                $('#ignoreCheck').val('true');
                $('#previewCheckPage').submit();
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
