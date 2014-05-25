/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-01-10
 */

;
(function($, D) {
	var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [

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
									if (confirm('确认取消?')) {
										var _this = $(this), favoritId = _this
												.data('favorit-id');
										$("#event_submit_do_searchFavorit")
												.attr("name",
														"event_submit_do_deleteFavorit");
										$("#event_submit_do_searchFavorit")
												.val("true");
										$("#favoritId").val(favoritId);
										searchForm.submit();
									}

								});
			},
			function() {
				$('.dl-preview').click(
						function(e) {
							e.preventDefault();
							var _this = $(this), pageId = _this.data('id');
							window.open(D.domain + '/page/box/view.htm?id='
									+ pageId + '&type=' + _this.data('type'))
						});
			}
	];

	$(function() {
		$.each(readyFun,
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
