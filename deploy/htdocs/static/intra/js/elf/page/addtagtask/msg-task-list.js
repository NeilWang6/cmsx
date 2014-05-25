/**
 * @package FE.app.elf.tag.taskManager
 * @author: xiaotong.huangxt
 * @Date: 2013-01-24
 */

;(function($, E,T){
	var readyFun = [
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
	                form: $('form[name=msgTaskList]'),
	                param: $($('form[name=msgTaskList]')[0].page)
	            }
	            var pagelistall = new T.pagelistall(data);
	            pagelistall.init(data);   

			},
			function() {
				//查询按钮的事件绑定
				$('#search').click(function(){
					document.msgTaskList.msgTaskName.value = $('#search-name').val();
					document.msgTaskList.page = 1;
					document.msgTaskList.submit();
				});
				
				//分页跳转按钮的事件绑定
				$('#jumpPageButton').click(function(){
					var page  =  $('#jumpPageInput').val();
					if(!(/(^[1-9]\d*$)/.test(page)) || page < 1 ) {
						alert('请输入合法的大于0的数字');
						return;
					}
					if( page > $('#totalPages').val() ) {
						page = $('#totalPages').val();
					}
					
					document.msgTaskList.page.value = page;
					document.msgTaskList.submit();
				});
				
				//具体页码a标签的事件绑定
				$('.js-jump-page-num').click(function(){
					document.msgTaskList.page.value = $(this).data('page');
					document.msgTaskList.submit();
				});
				
				//启动、停止任务链接的事件绑定
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