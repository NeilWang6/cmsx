/**
 * @package FD.app.cms.viewpostion
 * @author: hongss
 * @Date: 2011-03-011
 */

 ;(function($, D){
     var readyFun = [
        /**
         * 规则下拉框跳转
         */
        function(){
            $('#choose-rule').change(function(){
				$('#action').val(0);
                $('#choose-rule-form').submit();
            });
        },
		//add by xutao 2011-06-28
		function(){
            $('#fault-preview').click(function(){
				$('#action').val(1);
				$('#choose-rule-form').submit();
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
