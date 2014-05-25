/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

(function($, D) {
	readyFun_preview = [

	/**
	 * ‘§¿¿
	 */
	function() {
		$('.dl-preview').click(
				function(e) {
					e.preventDefault();
					var _this = $(this), pageId = _this
							.data('id');
					window.open(D.domain
							+ '/page/box/view.htm?id='
							+ pageId + '&type='+_this.data('type') ) 
				});
	} ];
	$(function() {
		$.each(readyFun_preview,
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
