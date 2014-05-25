(function($,PostCom){

var readyFun = [
	function() {
		
	}
];

$(function() {
	for(var i = 0, l = readyFun.length; i < l; i++) {
		try {
			readyFun[i]();
		} catch(e) {
			if($.log) {
				$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
			}
		} finally {
			continue;
		}
	}
});
   	
})(jQuery);
