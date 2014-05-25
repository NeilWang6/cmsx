/**
 * @package FE.app.elf.tag.taskManager
 * @author: xiaotong.huangxt
 * @Date: 2013-01-24
 */

;(function($, E,T){
	var dialogSetTag,
		readyFun = [
			//��ҳ
			function() {
				var data = {
	                curPage: $('input#curpage').val(),
	                page: $('input#page_num').val(),//��ҳ
	                titlelist: $('input#titlelist').val(),//������
	                leftContent: '',
	                rightContent: '',
	                limit: 3,
	                width: $('.data-table table').width() + 'px',
	                left: $('.data-table table').offset().left + 'px',
	                curPageInput: $('input#curpage'),
	                form: $('form[name=tagTaskManager]'),
	                param: $($('form[name=tagTaskManager]')[0].page)
	            }
	            var pagelistall = new T.pagelistall(data);
	            pagelistall.init(data);   

			},
			function() {
				if( $('#error-msg').val() == "tag_id_error" ) {
					alert("��������ȷ���͵ı�ǩID");
				} else if( $('#error-msg').val() == "input_error" ) {
					alert("��������ȷ�ı�ǩID");
				}
			},
			function() {
			
				//��ҳ��ת��ť���¼���
				$('#jumpPageButton').click(function(){
					var page  =  $('#jumpPageInput').val();
					if(!(/(^[1-9]\d*$)/.test(page))) {
						alert('������Ϸ�����');
						return;
					}
					document.tagTaskManager.page.value = page;
					document.tagTaskManager.submit();
				});
				
				//��ѯ��ť���¼���
				$('#search').click(function(){
					$('#taskName').val($('#name').val());
					$('#taskTagType').val($('#type').val());
					$('#taskOperator').val($('#operator').val());
					$("#searchId").val($("#id").val());
					$("#source").val($("#taskSource").val());
					$("#scene").val($("#tagId").val());
					document.tagTaskManager.page.value ="";
					document.tagTaskManager.submit();
				});
				
				//����ҳ��a��ǩ���¼���
				$('.js-jump-page-num').click(function(){
					$('#taskName').val($('#name').val());
					$('#taskTagType').val($('#type').val());
					$('#taskOperator').val($('#operator').val());
					document.tagTaskManager.page.value = $(this).data('page');
					document.tagTaskManager.submit();
				});
				
				//������ֹͣ�������ӵ��¼���
				$('.js-change-state').click(function(){
					if( $(this).data('taskstate') === "y" && !$(this).data('scene') ) {
						alert("�������ó���֮������������");
					} else {
						document.tagTaskManager.taskId.value = $(this).data('taskid');
						document.tagTaskManager.state.value = $(this).data('taskstate');
						document.tagTaskManager.action.value = "AddTagTaskAction";
						$('#event_submit_').attr('name', 'event_submit_do_change_state');
						document.tagTaskManager.submit();
					}
				});
				
				//������ֹͣ�������ӵ��¼���
				$('.js-change-clean-flag').click(function(){
					var taskid = $(this).data('taskid');
					var cleanflag = $(this).data('cleanflag');
					var data = 'taskId='+taskid+'&cleanflag='+cleanflag;
					var urlPost = $('#ajax-check-task-info').val();					
					$.ajax({
						url : urlPost,
						type: "GET",
						data : data,
						error: function(jqXHR, textStatus, errorThrown) {
							return;
						},
						success: function(_data){								
							if(_data['flag'] === 'n'){
								alert("�������ǩ�������������ݲ�֧������");
							}else{								
								document.tagTaskManager.taskId.value = taskid;
								document.tagTaskManager.cleanflag.value = cleanflag;
								document.tagTaskManager.action.value = "AddTagTaskAction";
								$('#event_submit_').attr('name', 'event_submit_do_change_clean_flag');
								document.tagTaskManager.submit();
							}							
						}
					});
				});
				
				
 				//��ҵ��ǩ�����¼���
				$('.js-set-task-tag').click(function(){
					$('.dialog-set-tag .js-task-id').val( $(this).data('taskid') );
					
					$('.dialog-set-tag .js-task-type').val( $(this).data('tasktype') );
				 
					var type = $(this).data('tagtype'),
					     msgErr = $('.message-error');
					     msgErr.addClass('fd-hide');
					if(type == "userService") {
						$('.dialog-set-tag .js-tag-type').html("��Ա��ǩ���ƣ�");
					} else if(type == "itemFeature") {
						$('.dialog-set-tag .js-tag-type').html("��Ʒ��ǩ���ƣ�");
					} else {
						$('.dialog-set-tag .js-tag-type').html("��ǩ���ƣ�");
					}
					
					var tasktype = $(this).data('tasktype');
					if(tasktype == "member") {
						$('.dialog-set-tag .js-task-type-show').html("��Ա�ֲ����ƣ�");
						$('.dialog-set-tag .js-tag-id-show').html("��Ա��ǩID��");
						$('.dialog-set-tag .js-member-layer').html("��ӪCRM������Ϣ��");
						 
						if($(this).data('tagid')==='msgCenter'){
							$('.dialog-set-tag .js-memberlayer-select').html("<input type='checkbox' name='msgCenter' id='msgCenter' checked value='msgCenter'/>");
					  }else{
					  	$('.dialog-set-tag .js-memberlayer-select').html("<input type='checkbox' name='msgCenter' id='msgCenter'  value='msgCenter'/>");
					  	$('.dialog-set-tag .js-tag-id').val( $(this).data('tagid') );
					  }
					} else if(tasktype == "offer") {
						$('.dialog-set-tag .js-tag-id').val( $(this).data('tagid') );
						$('.dialog-set-tag .js-task-type-show').html("��Ʒ�ֲ����ƣ�");
						$('.dialog-set-tag .js-tag-id-show').html("��Ʒ��ǩID��");
						$('.dialog-set-tag .js-member-layer').html('');
						$('.dialog-set-tag .js-memberlayer-select').html('');
					}
					
					$('.dialog-set-tag .js-task-name').html( $(this).data('taskname') );
					$('.dialog-set-tag .js-tag-name').html( $(this).data('tagname') );
					
					$.use('ui-dialog', function(){
						dialogSetTag = $('.dialog-set-tag').dialog({
							center: true,
							fixed:true
						});
					});
				});
				
				//���ñ�ǩ�ĸ����ȷ���¼�
				$('.dialog-set-tag .js-save').click(function(){
					var msgErr = $('.message-error'),
					    msgCenter = $('#msgCenter'),
					    errorVal= $('.error-class'),
					    msgCrm = $('#msgCrm'),
					    tagId = $('.js-tag-id');
					    taskType = $('.dialog-set-tag .js-task-type').val();
				 	    errorVal.text('');
				 		  msgCrm.val('false');
				 	if(taskType==='offer'){
							if(!(/(^[1-9]\d*$)/.test(tagId.val()))) {
								errorVal.text('����Ҫ��д���֣�');
								msgErr.removeClass('fd-hide');
								return;
							}
				  }else if(taskType==='member'){
				  	  var isSelect = msgCenter.prop('checked');
				  	  if(!isSelect && (tagId.val()).length===0){
				  	  	  errorVal.text('����Ҫѡ��һ�ֳ�����');
				  	  	  msgErr.removeClass('fd-hide');
								  return;
				  	  }
				  	  if(!isSelect && !(/(^[1-9]\d*$)/.test(tagId.val()))){
				  	  	  errorVal.text('����Ҫ��д���֣�');
				  	  	  msgErr.removeClass('fd-hide');
								  return;
				  	  }
				  	  if(isSelect && (tagId.val()).length>0){
				  	  	  errorVal.text('�������ֳ�����ѡ��');
				  	  	  msgErr.removeClass('fd-hide');
								  return;
				  	  } 
				  	  msgCrm.val(isSelect);
				  }
				
					document.tagTaskManager.taskId.value = $('.dialog-set-tag .js-task-id').val();
					document.tagTaskManager.taskType.value = $('.dialog-set-tag .js-task-type').val();
					document.tagTaskManager.tagId.value = $('.dialog-set-tag .js-tag-id').val();
					
					document.tagTaskManager.action.value = "AddTagTaskAction";
					$('#event_submit_').attr('name', 'event_submit_do_up_task_scene');
					document.tagTaskManager.submit();
				});
				
				//���ñ�ǩ�ĸ���Ĺر��¼�
				$('.dialog-set-tag .btn-cancel, .dialog-set-tag .close').click(function(){
					dialogSetTag.dialog('close');
				});
				
				
				//���ñ�ǩ�ĸ����������¼�
				$('.dialog-set-tag .js-tag-id').keyup(function(){
					if(!(/(^[1-9]\d*$)/.test($('.dialog-set-tag .js-tag-id').val()))) {
						$('.dialog-set-tag .js-tag-type').html("��ǩ���ƣ�");
						$('.dialog-set-tag .js-tag-name').html("");
						return;
					}
					$('#msgCenter').prop('checked',false);
					jQuery.ajax($('#ajax-get-tag-info').val(), {
						type: "GET",
						async: true,
						cache: false,
						data: {'tagid':$('.dialog-set-tag .js-tag-id').val()},
						dataType: 'jsonp',
						success: function(dataR, textStatus){
							if(dataR['success'] == 'true') {
								if(dataR['type'] == "userService") {
									$('.dialog-set-tag .js-tag-type').html("��Ա��ǩ���ƣ�");
								} else if(dataR['type'] == "itemFeature") {
									$('.dialog-set-tag .js-tag-type').html("��Ʒ��ǩ���ƣ�");
								}
								$('.dialog-set-tag .js-tag-name').html(dataR['name']);
							} else if(dataR['success'] == 'false') {
								$('.dialog-set-tag .js-tag-type').html("��ǩ���ƣ�");
								$('.dialog-set-tag .js-tag-name').html("");
							}
						}
					});
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
})(jQuery, FE.elf, FE.tools);