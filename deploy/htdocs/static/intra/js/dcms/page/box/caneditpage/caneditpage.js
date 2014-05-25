/**
 *
 */

;(function($, D) {
	var readyFun = [
	function() {
		$(".js-apply-permission").bind("click", function(event) {
			event.preventDefault();
			var $self = $(this), value = {
				type : "page",
				code : $self.data('id')
			};
			$.post(D.domain + '/admin/add_apply_permission.html?_input_charset=UTF8', value, function(json) {
				if(json) {
					if(json.status === 'success') {
						alert('提交申请成功,审核能过后，会有旺旺提示！');
						closeWin();
					} else {
						alert('提交申请失败！');
					}

				}
			}, 'json');
		});
		$('.js-btn-unlock').bind('click', function(event) {
			event.preventDefault();
			var $self = $(this), params = {
				type : 'page',
				resourceCode : $self.data('id')
			}, url = D.domain + '/page/box/unlock_resource.htm';
			$.ajax({
				url : url,
				data : params,
				dataType : 'jsonp',
				success : function(o) {
					if(o.success === true) {
						alert("解锁成功！");
						window.location.reload();
					} else {
						alert('解锁失败，请稍后再试！');
						return;
					}
				},
				error : function() {
					alert('解锁失败，请稍后再试！');
					return;
				}
			});
		});
		$(".js-btn-close").bind("click", function(event) {
			event.preventDefault();
			closeWin();
		});
	}];
	var closeWin = function() {
		if(navigator.userAgent.indexOf("Firefox") > 0) {
			window.location.href = 'about:blank ';
		} else {
			window.opener = null;
			window.open('', '_self', '');
			window.close();
		}

	};

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		});
	});
})(dcms, FE.dcms);
