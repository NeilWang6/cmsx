/**
 * @author zhaoyang.maozy
 * @userfor CrazyBox分页js
 * @date 2012-1-12
 */

;(function($, D) {
    var pageElm = $('#js-page-num'), searchForm=$('.js-search-page'),
        initFun = [
        /**
         * 切换到第N页
         */
        function(pageFun){
            $('.page').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                pageFun(n);
            });
        },
        /**
         * 上一页、下一页
         */
        function(pageFun){
            $('.box-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                pageFun(n);
            });
        },
        /**
         * 跳到第几页
         */
        function(pageFun){
            $('.go').click(function(e){
                var input = $(this).data("input") ? $($(this).data("input")) : $(this).siblings(".dcms-page-num"), n = input.val();
                pageFun(n);
            });
        }
    ];
 
    /**
     * 分页处理
     * form 提交的表单名
     * pageFun 自定义分页处理函数
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
     * 分页跳转
     */
    function setPageNum(n){
        pageElm.val(n);
        searchForm.submit();
    }
    
    /**
     * 初始化
     */
    D.doPage();  
})(jQuery, FE.tools);
