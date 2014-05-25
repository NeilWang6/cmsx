/**
 * @author: huangxt
 * @Date: 2012-10-15
 */

;(function($, T) {
	var readyFun = [
		//顶部搜索栏
		function() {
			$('div.condition button.js-search').on("click", function() {
				var begin = $('#beginDate').val();
				var end = $('#endDate').val();
				var url = $('#beginDate').data('url');
				url = url + "?begin=" + begin + "&end=" + end;
				window.location.href = url;
			});
		},
		
		//成员列表
		function() {
			$('div.memberlist td').on("click", function() {
				if( $(this).data('url') ) {
					window.location.href = $(this).data('url');
				}
			});
		},
		
		//底部分页
		function() {
			$('div.reqlist-pagebar button.js-topage').on("click", function() {
				var maxPage = parseInt( $('div.reqlist-pagebar input.js-topage').data('max') );
				var toPage = parseInt( $('div.reqlist-pagebar input.js-topage').val() );
				
				if(toPage && toPage>0) {
					if( toPage > maxPage ) {
						toPage = maxPage;
					}
					
					var url = $('div.reqlist-pagebar button.js-topage').data('url') + toPage;
					window.location.href = url;
				}
			});
		},
		
		//日期控件
		function() {
			$.use('ui-datepicker-time, util-date', function() {
				$('.js-select-date').datepicker({
					showTime : true,
					closable : true,
					select : function(e, ui) {
						var date = ui.date.format('yyyy-MM-dd');
						$(this).val(date);
					}
				});
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
