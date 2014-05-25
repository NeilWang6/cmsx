/**
 * @author Administrator
 */
;(function($, D) {
	var readyFun = [
	function() {
		$('.dcms-box-list').delegate('.js-edit-module','click', function(event) {
			event.preventDefault();
			var that = this, $self = $(that), data = $self.data('module');
			$.getJSON(D.domain+'/page/box/can_edit_module.html',data,D.EditModule.edit);
		});
	}];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch(e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
