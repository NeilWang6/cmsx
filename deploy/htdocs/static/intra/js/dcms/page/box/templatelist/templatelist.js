/**
 * @author qiheng.zhuqh
 * @userfor CrazyBox js
 * @date 2012-1-12
 */

;
(function($, D) {
	var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'),keywordElm= $('#keyword'), readyFun_templatelist = [
			function() {
				// $('#js-search-page').submit();
				FE.dcms.doPage();
			},
			/**
			 * 删除
			 */
			function() {
				$('.delete')
						.click(
								function(e) {
									e.preventDefault();
									if (confirm("确定要删除?")) {
										var _this = $(this), templateId = _this
												.data('template-id');
 
										$
												.ajax({
													url : D.domain
															+ "/page/box/template_draft_exist_checker.html",
													data : {
														"resourceId" : templateId
													},
													dataType : 'jsonp',
													success : function(o) {
														
														var data = o, content = '';
														if (data.msg == "fail") {
															content = "系统错误，请联系管理员"
																	+ data.msg;
														} else {
 															if (data.count > 0) {
																alert("删除失败，因为存在与该模板相关联的草稿");
																return;
															}

															$("#event_submit_do_searchTemplate")
																	.remove();
															var content = '<input type="hidden" name="event_submit_do_deleteTemplate" id="event_submit_do_searchTemplate" value="true"/>'
															searchForm
																	.append(content);
															var content = '<input type="hidden" name="delete-templateId" id="delete-templateId" value="'+ templateId+ '">'
															searchForm
																	.append(content);

															searchForm.submit();

														}
													},
													error : function() {
													}

												});

									}

								});
			},
			/**
			 * 根据keyword查询
			 */
			function() {
				$('.tag')
						.click(
								function(e) {
									e.preventDefault();
									  {
										var _this = $(this), keyword = _this
												.data('keyword');
										keywordElm.val(keyword);

										searchForm.submit();
									}

								});
			},
			
			/**
			 * 根据keyword查询
			 */
			function() {
				$('.author')
						.click(
								function(e) {
									e.preventDefault();
									  {
										var _this = $(this), keyword = _this
												.data('keyword');
										keywordElm.val(keyword);
										searchForm.submit();
									}

								});
			},
			,
			function() {
				$('.dl-preview').click(
						function(e) {
							e.preventDefault();
							var _this = $(this), pageId = _this.data('id');
							window.open(D.domain + '/page/box/view.html?id='
									+ pageId + '&type=' + _this.data('type'))
						});
			},function(){
			    $('#template-orderby').bind('change',function(e){
			       searchForm.submit(); 
			    });
			    $('#template-type').bind('change',function(e){
                   searchForm.submit(); 
                });
                $('#template-catalog').bind('change',function(e){
                   searchForm.submit(); 
                });
			} ];
	$(function() {
		$.each(readyFun_templatelist,
				function(i, fn) {
					try {
						fn();
					} catch (e) {
						if ($.log) {
							$.log('Error at No.' + i + '; ' + e.name + ':'
									+ e.message);
						}
					}
				})
	});

})(dcms, FE.dcms);
