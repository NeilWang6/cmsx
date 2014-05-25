jQuery.namespace('FE.dcms');
//window.dcms = jQuery.noConflict(true);
window.dcms = jQuery.sub();
(function($, D) {
	D.domain = location.protocol + '//' + location.host;
	D.tools = {
		truncateStr : function(s, max, isEllipsis) {
			var n = 0;
			for (var i = 0, l = s.length; i < l; i++) {
				if (s.charCodeAt(i) > 255) {
					n += 2;
				} else {
					n++;
				}
				if (n === max) {
					return s.substring(0, i + 1).concat( isEllipsis ? "..." : "");
				} else if (n > max) {
					return s.substring(0, i).concat( isEllipsis ? "..." : "");
				}
			}
			return s;
		}
	};
	/**
	 * RGB颜色转16制颜色
	 */
	D.rgbTo16 = function(args, prefix) {
		if (args) {
			return args.colorHex();
		}

	};
	/**
	 * @methed isNumber 判断是否会正数，如果是返回true，否则返回false
	 * @param num {int} 需要判断的数字
	 * @author hongss on 2011.08.15
	 */
	D.isNumber = function(num) {
		return !!(num - 0 > 0);
	};
	D.closeWin = function() {
		if (navigator.userAgent.indexOf("Firefox") > 0) {
			window.location.href = 'about:blank ';
		} else {
			window.opener = null;
			window.open('', '_self', '');
			window.close();
		}

	};
	/**
	 *检测是否支持template标签
	 */
	var supportsTemplate = function() {
		return 'content' in document.createElement('template');
	};
	var readyFun = [
	function() {
		if (!supportsTemplate()) {
			$('template').hide();
		}
	}];
	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
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
})(dcms, FE.dcms);
