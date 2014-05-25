define('lofty-mobile/ui/scroller/1.0/iscroll', ['lofty-mobile/ui/scroller/1.0/iscroll-base'],
	function(iScrollBase){
		function IScroll(opts) {
			// 没有指定domId须直接返回
			if (!opts.container) {
				return;
			}
			return new iScrollBase(opts.container, opts);
		}
		return IScroll;
	});