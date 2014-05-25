/**
 * @author zhaoyang.maozy
 * @usefor
 * 1.期刊管理帖子
 * @date   2013.03.05
 */

;(function($, T) {
	var form = $('.js-search-page');
	
    //日期控件
    $.use('ui-datepicker-time, util-date', function() {
        $('.js-select-date').datepicker({
            zIndex: 3000,
            showTime: true,
            closable: true,
            select: function(e, ui) {
                var date = ui.date.format('yyyy-MM-dd');
                $(this).val(date);
            }
        });
    });
    
    
    // 导入帖子
    $(".import-post").click(function(e){
    	 e.preventDefault();
    	 var tid=$(this).data('id'), postString = $('#content' + tid).val(), magazineId = $('#magazineId').val();
    	 if(!postString) {
    		 alert('导入的帖子内容为空！');
    		 return;
    	 }
         $.ajax({
             url: T.domain + "/tools/import_aliway_post.json?_input_charset=UTF8",
             type: "POST",
             data: {"magazineId":magazineId, "postString":postString}
         }).done(function(o){
        	 if(o.success) {
        		 $.use('ui-dialog', function(){
                     //如有多个浮出层，请另加ID或class
                     var dialog = $('.dialog-basic').dialog({
                         center: true,
                         fixed:true
                     });
                     $('body').one('click', function(){
                         dialog.dialog('close');
                         form[0].submit();
                     });
                 });
        	 }
         }).fail(function(){
             alert('系统错误，请联系管理员');
         });    	 
    });
    
    // 取消帖子
    $(".cancel-post").click(function(e){
   	 e.preventDefault();
	 var postId=$(this).data('id');
	 if(!postId) {
		 alert('操作错误，请与管理员联系！');
		 return;
	 }
     $.ajax({
         url: T.domain + "/tools/cancel_aliway_post.json?_input_charset=UTF8",
         type: "POST",
         data: {"postId":postId}
     }).done(function(o){
    	 if(o.success) {
    		 $.use('ui-dialog', function(){
                 //如有多个浮出层，请另加ID或class
                 var dialog = $('.dialog-basic').dialog({
                     center: true,
                     fixed:true
                 });
                 $('body').one('click', function(){
                     dialog.dialog('close');
                     form[0].submit();
                 });
             });
    	 }
     }).fail(function(){
         alert('系统错误，请联系管理员');
     });    	    	 
   });
    
  function updatePostInfo(data, callback) {
	     $.ajax({
	         url: T.domain + "/tools/updatePostInfo.json?_input_charset=UTF8",
	         type: "POST",
	         data: data
	     }).done(function(o){
	    	 callback(o);
	     }).fail(function(){
	         alert('系统错误，请联系管理员');
	     });  		  
  }
    
   // 设置模块
   $('.edit-module').bind('change', function(){
		 var postId=$(this).data('id'), module = $(this).val();
		 if(!postId) {
			 alert('操作错误，请与管理员联系！');
			 return;
		 }
		 // 更新帖子模块
		 updatePostInfo({"postId":postId, "module":module}, function(o){
	    	 if(o.success) {
	    		 $.use('ui-dialog', function(){
	                 //如有多个浮出层，请另加ID或class
	                 var dialog = $('.dialog-basic').dialog({
	                     center: true,
	                     fixed:true
	                 });
	                 $('body').one('click', function(){
	                     dialog.dialog('close');
	                     form[0].submit();
	                 });
	             });
	    	 }
		 });
	   
   });
   
   // 设置次序
   $('.set-order').bind('click', function(e){
	   e.preventDefault();
	   var aId=$(this).data('before'), bId=$(this).data('after');
	   if(aId && bId) {
		   $('#idA').val(aId);
		   $('#idB').val(bId);
		   $('#event_action').attr('name', 'event_submit_do_orderPost');
		   form[0].submit();
	   }
   })
    
})(jQuery, FE.tools);
