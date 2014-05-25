/**
 * @author jiankai.xujk
 * @usefor ר����Ϣ����ҳ��
 * @date   2012.09.16
 */
;(function($, T) {
    var readyFun = [
		
		//���ڿؼ�
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
		
		//�������ʦ����
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
		//ȷ�Ϸ���
		function(){
			$('.js-submit').bind('click', function(e) {
				var designer = $('.js-designer').val();
				var suggestDate = $('.js-leader-suggest').val();
				if(!designer&&!suggestDate){
					$('.js-dialog-error').text('��������ʦ���������鳤�������ʱ��');
					return;
				 }
				 if(!designer){
					$('.js-dialog-error').text('��������ʦ');
					return;
				 }
				 if(!suggestDate){
					$('.js-dialog-error').text('�������鳤�������ʱ��');
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
						var msg = '����ʧ��';
						if(jqXHR.status === 0) {
							msg = '��ûȨ�޷��䣡'
						}
						alert(msg);
						return;
					},
					success : function(rs, textStatus, jqXHR) {
						if(!rs.success) {
							var msg = '����ʧ��';
							if(rs.data) {
								msg = rs.data;
							}
							$('.js-dialog-error').text(msg);
							return;
						}
						$('.js-dialog-error').text('����ɹ�');
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
