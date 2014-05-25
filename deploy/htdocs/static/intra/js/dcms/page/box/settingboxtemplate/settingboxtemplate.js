/**
 * @package FD.app.cms.box.color-system
 * @author qiheng.zhuqh
 * @date: 2012-01-14
 */
(function($, D) {
	var colors = [ "all", "orange", "red", "blue", "green", "white", "other" ], selClrBtn = $('#hidden-color'), colorStr = [
			"", "橙色", "红色", "蓝色", "绿色", "白色", "其它" ];

	var readyFunSetting = [

	function() {
	},, ];

	$(function() {
		$.each(readyFunSetting,
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
