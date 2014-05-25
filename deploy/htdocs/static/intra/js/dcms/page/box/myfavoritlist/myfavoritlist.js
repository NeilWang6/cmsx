/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */

;(function($, D) {
	var form = $('#js-search-page');
	readyFun = [
	/**
	 * 分页处理
	 */
	function() {
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	},
	/**
	 * 删除
	 */
	function() {
		$('.delete').click(function(e) {
			e.preventDefault();
			if(confirm('确认取消?')) {
				var _this = $(this), favoritId = _this.data('favorit-id');
				$("#event_submit_do_searchFavorit").attr("name", "event_submit_do_deleteFavorit");
				$("#event_submit_do_searchFavorit").val("true");
				//console.log(favoritId)
				$("#favoritId").val(favoritId);
				form.submit();
			}

		});
	},
	/**
	 * 排序
	 */
	function() {
		$('.list-filter .item').click(function(e) {
			e.preventDefault();
			$("#orderKey").val($(this).data('sortkey'));
			form.submit();
		});
	},
	/**
	 * 颜色
	 */
	function() {
		$('.list-color .item').click(function(e) {
			e.preventDefault();
			$('.list-color .item').removeClass('current');
			$(this).addClass('current');
			console.log($(this).find("a").text());
			$("#color").val($(this).find("a").text());
		});
	},
	/**
	 * 搜索
	 */
	function() {
		$(".search-btn").click(function() {
			form.submit();
		});
	}];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
