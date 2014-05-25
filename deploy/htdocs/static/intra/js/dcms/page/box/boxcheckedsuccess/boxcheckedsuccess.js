;(function($, D) {
    var readyFun = [
        /**
         * 二维码相关
         */
        function() {
            //生成二维码
            $('#tips-qcode').qrcode({
                text:$('#online-url').attr('href'),
                width:120,
                height:120
            });
            //显示、隐藏二维码
            $('.trigger-qrcode .btn-gray').click(function(e){
                e.preventDefault();
                $(this).parent().toggleClass('show');
            });
            //隐藏二维码
            $('.trigger-qrcode .tui-tips-white .close').click(function(e){
                e.preventDefault();
                $(this).closest('.trigger-qrcode').removeClass('show');
            });
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
})(dcms, FE.dcms);