/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy 
 * @Date: 2012-11-10
 */

 ;(function($, D){
	var form = $('#js-search-page');
    // 获取类目树
    function getCatalogTree(){
    	var treeJson = $('#catalog-trees').val()
    	return treeJson ? $.parseJSON(treeJson) : null;
    }


    var readyFunCommon = [
        /**
         * 分页处理
         */
        function(){
        	//$('#js-search-page').submit();
        	FE.dcms.doPage();
        },
        /**
         * 排序
         */
        function(){
        	$('.list-filter .item').click(function(e){
        		 e.preventDefault();
                 $("#orderKey").val($(this).data('sortkey'));
                 form.submit();   
        	});
        },
        /**
         * 颜色
         */
        function(){
        	$('.list-color .item').click(function(e){
        		 e.preventDefault();
        		 var hasColor = $(this).hasClass('current');
        		 $('.list-color .item').removeClass('current');
        		 if(hasColor){
        			 $("#color").val('');
        			 $(this).removeClass('current');
        		 } else {
        			 $("#color").val($(this).find("a").text());
        			 $(this).addClass('current');
        		 }
                 
        	});
        },
        /**
         * 搜索
         */
        function(){
        	$(".search-btn").click(function(){
        		 form.submit();  
        	});
        },
   
        /**
         * 设置左侧高度
         */
        function(){
        	var winHeight = $(window).height(),
            headHeight = ($('.page-header').outerHeight() || 0) + ($('.page-content').outerHeight() || 0) + 20;
        	if (winHeight - headHeight >  ($('.left-menu').height() || 0)){
        		$('.left-menu').css({'height': winHeight - headHeight});    
        	}
        } 
    ];
     
    $(function(){
    	$.each(readyFunCommon, function(i, fn){
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
