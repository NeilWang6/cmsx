;(function($, D) {
    var readyFun = [
        /**
         * ��ά�����
         */
        function() {
            //���ɶ�ά��
            $('#tips-qcode').qrcode({
                text:$('#online-url').attr('href'),
                width:120,
                height:120
            });
            //��ʾ�����ض�ά��
            $('.trigger-qrcode .btn-gray').click(function(e){
                e.preventDefault();
                $(this).parent().toggleClass('show');
            });
            //���ض�ά��
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