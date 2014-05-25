/**
 * @author jiankai.xujk
 * @usefor 专场信息详情页面
 * @date   2012.09.16
 */
;(function($, T) {
    var readyFun = [
		
		//日期控件
		function() {
			$.use('ui-datepicker-time, util-date', function() {
				$('.js-select-date').datepicker({
					zIndex:3000,
					showTime : true,
					closable : true,
					select : function(e, ui) {
						var date = ui.date.format('yyyy-MM-dd');
						$(this).val(date);
					}
				});
			});
		},
		
		//分配设计师浮层
		function(){
			$('.js-assign-ued').bind('click', function(e) {
				$.use('ui-dialog', function() {
					var dialog = $('.dialog-basic').dialog({
						center: true,
						fixed:true
					});
					$('.dialog-basic .btn-cancel, .dialog-basic .close').click(function(){
						dialog.dialog('close');
					});
				});
			});	
		},
		//确认分配
		function(){
			$('.js-submit').bind('click', function(e) {
				var designer = $('.js-designer').val();
				var suggestDate = $('.js-leader-suggest').val();
				if(!designer&&!suggestDate){
					$('.js-dialog-error').text('请分配设计师，并设置组长安排完成时间');
					return;
				 }
				 if(!designer){
					$('.js-dialog-error').text('请分配设计师');
					return;
				 }
				 if(!suggestDate){
					$('.js-dialog-error').text('请设置组长安排完成时间');
					return;
				 }
				$('.js-dialog-error').text('');
				var csrfToken = $('form').find('input[name=_csrf_token]').val();
				var topicId = $('.dialog-basic').data('topicid');
				$.ajax({
					url : T.domain + '/enroll/v2012/ued_assign_topic.json',
					type : 'post',
					data : {
						'_input_charset' : 'UTF-8',
						'topicId' : topicId,
						'_csrf_token' : csrfToken,
						'assigner' : designer,
						'workFlowState' : 'design',
						'finishDate' : suggestDate
					},
					error : function(jqXHR, textStatus, errorThrown) {
						var msg = '分配失败';
						if(jqXHR.status === 0) {
							msg = '您没权限分配！'
						}
						alert(msg);
						return;
					},
					success : function(rs, textStatus, jqXHR) {
						if(!rs.success) {
							var msg = '分配失败';
							if(rs.data) {
								msg = rs.data;
							}
							$('.js-dialog-error').text(msg);
							return;
						}
						$('.js-dialog-error').text('分配成功');
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
