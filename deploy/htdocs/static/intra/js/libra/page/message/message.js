/**
 * @author: wangxiaojun
 * @Date: 2012-10-17
 */

;(function($, T) {
	 var readyFun = [
	  //日期控件
		function() {
			jQuery.use('ui-datepicker-time, util-date', function() {
				$('.js-select-date').datepicker({
					showTime : true,
					closable : true,
					select : function(e, ui) {
						var date = ui.date.format('yyyy-MM-dd');
						$(this).val(date);
					}
				});
			});
		},
		
   //查找
		function(){
			$(".js-search").bind("click", function() {
				$('#topic_message').submit();
			});
		},
		
		//分页
		function(){
			$("#paging a").bind("click", function(e) {
				e.preventDefault();
				var page = $(this).data('page');
				$("input[name = 'pageIndex']").val(page);
				$('#topic_message').submit();
			});
			
			$("#jump-page").bind("click", function() {
				var page = $(".pnum").val();
				$("input[name = 'pageIndex']").val(page);
  		  $('#topic_message').submit();
			});
		}
		
		];
		$(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.tools);
