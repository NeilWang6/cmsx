/**
 * @author: huangxt
 * @Date: 2012-10-15
 */

;(function($, T) {
	var readyFun = [
		//����������
		function() {
			$('div.condition button.js-search').on("click", function() {
				var begin = $('#beginDate').val();
				var end = $('#endDate').val();
				var url = $('#beginDate').data('url');
				url = url + "?begin=" + begin + "&end=" + end;
				window.location.href = url;
			});
		},
		
		//��Ա�б�
		function() {
			$('div.memberlist td').on("click", function() {
				if( $(this).data('url') ) {
					window.location.href = $(this).data('url');
				}
			});
		},
		
		//�ײ���ҳ
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
		
		//���ڿؼ�
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
