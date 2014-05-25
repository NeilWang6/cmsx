/**
 * @package FE.app.elf.tag.taskManager
 * @author: xiaotong.huangxt
 * @Date: 2013-01-24
 */

;(function($, E,T){
	var readyFun = [
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
	                form: $('form[name=msgTaskList]'),
	                param: $($('form[name=msgTaskList]')[0].page)
	            }
	            var pagelistall = new T.pagelistall(data);
	            pagelistall.init(data);   

			},
			function() {
				//��ѯ��ť���¼���
				$('#search').click(function(){
					document.msgTaskList.msgTaskName.value = $('#search-name').val();
					document.msgTaskList.page = 1;
					document.msgTaskList.submit();
				});
				
				//��ҳ��ת��ť���¼���
				$('#jumpPageButton').click(function(){
					var page  =  $('#jumpPageInput').val();
					if(!(/(^[1-9]\d*$)/.test(page)) || page < 1 ) {
						alert('������Ϸ��Ĵ���0������');
						return;
					}
					if( page > $('#totalPages').val() ) {
						page = $('#totalPages').val();
					}
					
					document.msgTaskList.page.value = page;
					document.msgTaskList.submit();
				});
				
				//����ҳ��a��ǩ���¼���
				$('.js-jump-page-num').click(function(){
					document.msgTaskList.page.value = $(this).data('page');
					document.msgTaskList.submit();
				});
				
				//������ֹͣ�������ӵ��¼���
				$('.js-change-state').click(function(){
					document.msgTaskList.msgTaskId.value = $(this).data('taskid');
					document.msgTaskList.state.value = $(this).data('taskstate');
					document.msgTaskList.action.value = "TaskViewAction";
					$('#event_submit_').attr('name', 'event_submit_do_change_state');
					document.msgTaskList.submit();
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
})(jQuery, FE.elf,FE.tools);