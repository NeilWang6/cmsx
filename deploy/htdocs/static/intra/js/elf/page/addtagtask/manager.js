/**
 * @package FE.app.elf.tag.taskManager
 * @author: xiaotong.huangxt
 * @Date: 2013-01-24
 */

;(function($, E,T){
	var dialogSetTag,
		readyFun = [
			//分页
			function() {
				var data = {
	                curPage: $('input#curpage').val(),
	                page: $('input#page_num').val(),//几页
	                titlelist: $('input#titlelist').val(),//多少条
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
					alert("请输入正确类型的标签ID");
				} else if( $('#error-msg').val() == "input_error" ) {
					alert("请输入正确的标签ID");
				}
			},
			function() {
			
				//分页跳转按钮的事件绑定
				$('#jumpPageButton').click(function(){
					var page  =  $('#jumpPageInput').val();
					if(!(/(^[1-9]\d*$)/.test(page))) {
						alert('请输入合法数字');
						return;
					}
					document.tagTaskManager.page.value = page;
					document.tagTaskManager.submit();
				});
				
				//查询按钮的事件绑定
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
				
				//具体页码a标签的事件绑定
				$('.js-jump-page-num').click(function(){
					$('#taskName').val($('#name').val());
					$('#taskTagType').val($('#type').val());
					$('#taskOperator').val($('#operator').val());
					document.tagTaskManager.page.value = $(this).data('page');
					document.tagTaskManager.submit();
				});
				
				//启动、停止任务链接的事件绑定
				$('.js-change-state').click(function(){
					if( $(this).data('taskstate') === "y" && !$(this).data('scene') ) {
						alert("请先设置场景之后再启动任务！");
					} else {
						document.tagTaskManager.taskId.value = $(this).data('taskid');
						document.tagTaskManager.state.value = $(this).data('taskstate');
						document.tagTaskManager.action.value = "AddTagTaskAction";
						$('#event_submit_').attr('name', 'event_submit_do_change_state');
						document.tagTaskManager.submit();
					}
				});
				
				//启动、停止清理链接的事件绑定
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
								alert("待清理标签关联其他任务暂不支持清理！");
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
				
				
 				//行业标签浮层事件绑定
				$('.js-set-task-tag').click(function(){
					$('.dialog-set-tag .js-task-id').val( $(this).data('taskid') );
					
					$('.dialog-set-tag .js-task-type').val( $(this).data('tasktype') );
				 
					var type = $(this).data('tagtype'),
					     msgErr = $('.message-error');
					     msgErr.addClass('fd-hide');
					if(type == "userService") {
						$('.dialog-set-tag .js-tag-type').html("会员标签名称：");
					} else if(type == "itemFeature") {
						$('.dialog-set-tag .js-tag-type').html("商品标签名称：");
					} else {
						$('.dialog-set-tag .js-tag-type').html("标签名称：");
					}
					
					var tasktype = $(this).data('tasktype');
					if(tasktype == "member") {
						$('.dialog-set-tag .js-task-type-show').html("会员分层名称：");
						$('.dialog-set-tag .js-tag-id-show').html("会员标签ID：");
						$('.dialog-set-tag .js-member-layer').html("运营CRM发送消息：");
						 
						if($(this).data('tagid')==='msgCenter'){
							$('.dialog-set-tag .js-memberlayer-select').html("<input type='checkbox' name='msgCenter' id='msgCenter' checked value='msgCenter'/>");
					  }else{
					  	$('.dialog-set-tag .js-memberlayer-select').html("<input type='checkbox' name='msgCenter' id='msgCenter'  value='msgCenter'/>");
					  	$('.dialog-set-tag .js-tag-id').val( $(this).data('tagid') );
					  }
					} else if(tasktype == "offer") {
						$('.dialog-set-tag .js-tag-id').val( $(this).data('tagid') );
						$('.dialog-set-tag .js-task-type-show').html("商品分层名称：");
						$('.dialog-set-tag .js-tag-id-show').html("商品标签ID：");
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
				
				//设置标签的浮层的确定事件
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
								errorVal.text('必须要填写数字！');
								msgErr.removeClass('fd-hide');
								return;
							}
				  }else if(taskType==='member'){
				  	  var isSelect = msgCenter.prop('checked');
				  	  if(!isSelect && (tagId.val()).length===0){
				  	  	  errorVal.text('必须要选择一种场景！');
				  	  	  msgErr.removeClass('fd-hide');
								  return;
				  	  }
				  	  if(!isSelect && !(/(^[1-9]\d*$)/.test(tagId.val()))){
				  	  	  errorVal.text('必须要填写数字！');
				  	  	  msgErr.removeClass('fd-hide');
								  return;
				  	  }
				  	  if(isSelect && (tagId.val()).length>0){
				  	  	  errorVal.text('不能两种场景都选择！');
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
				
				//设置标签的浮层的关闭事件
				$('.dialog-set-tag .btn-cancel, .dialog-set-tag .close').click(function(){
					dialogSetTag.dialog('close');
				});
				
				
				//设置标签的浮层的输入框事件
				$('.dialog-set-tag .js-tag-id').keyup(function(){
					if(!(/(^[1-9]\d*$)/.test($('.dialog-set-tag .js-tag-id').val()))) {
						$('.dialog-set-tag .js-tag-type').html("标签名称：");
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
									$('.dialog-set-tag .js-tag-type').html("会员标签名称：");
								} else if(dataR['type'] == "itemFeature") {
									$('.dialog-set-tag .js-tag-type').html("商品标签名称：");
								}
								$('.dialog-set-tag .js-tag-name').html(dataR['name']);
							} else if(dataR['success'] == 'false') {
								$('.dialog-set-tag .js-tag-type').html("标签名称：");
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