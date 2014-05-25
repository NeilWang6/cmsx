/**
 * @author zhaoyang.maozy
 * @userfor CrazyBox��ҳjs
 * @date 2012-1-12
 */

;(function($, D) {
    var pageElm = $('#js-page-num'), searchForm=$('.js-search-page'),
        initFun = [
        /**
         * �л�����Nҳ
         */
        function(pageFun){
            $('.page').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                pageFun(n);
            });
        },
        /**
         * ��һҳ����һҳ
         */
        function(pageFun){
            $('.box-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                pageFun(n);
            });
        },
        /**
         * �����ڼ�ҳ
         */
        function(pageFun){
            $('.go').click(function(e){
                var input = $(this).data("input") ? $($(this).data("input")) : $(this).siblings(".dcms-page-num"), n = input.val();
                pageFun(n);
            });
        }
    ];
 
    /**
     * ��ҳ����
     * form �ύ�ı���
     * pageFun �Զ����ҳ������
     */
    D.doPage = function(form, pageFun){
   	    $.each(initFun, function(i, fn){
            try {
		searchForm = form || searchForm;
            	fn(pageFun || setPageNum);
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }   		
    	})
    };

    /**
     * ��ҳ��ת
     */
    function setPageNum(n){
        pageElm.val(n);
        searchForm.submit();
    }
    
    /**
     * ��ʼ��
     */
    D.doPage();  
})(jQuery, FE.tools);
