/**
 * @author zhaoyang.maozy
 * @usefor
 * 1.�ڿ���������
 * @date   2013.03.05
 */

;(function($, T) {
	var form = $('.js-search-page');
	
    //���ڿؼ�
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
    
    
    // ��������
    $(".import-post").click(function(e){
    	 e.preventDefault();
    	 var tid=$(this).data('id'), postString = $('#content' + tid).val(), magazineId = $('#magazineId').val();
    	 if(!postString) {
    		 alert('�������������Ϊ�գ�');
    		 return;
    	 }
         $.ajax({
             url: T.domain + "/tools/import_aliway_post.json?_input_charset=UTF8",
             type: "POST",
             data: {"magazineId":magazineId, "postString":postString}
         }).done(function(o){
        	 if(o.success) {
        		 $.use('ui-dialog', function(){
                     //���ж�������㣬�����ID��class
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
             alert('ϵͳ��������ϵ����Ա');
         });    	 
    });
    
    // ȡ������
    $(".cancel-post").click(function(e){
   	 e.preventDefault();
	 var postId=$(this).data('id');
	 if(!postId) {
		 alert('���������������Ա��ϵ��');
		 return;
	 }
     $.ajax({
         url: T.domain + "/tools/cancel_aliway_post.json?_input_charset=UTF8",
         type: "POST",
         data: {"postId":postId}
     }).done(function(o){
    	 if(o.success) {
    		 $.use('ui-dialog', function(){
                 //���ж�������㣬�����ID��class
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
         alert('ϵͳ��������ϵ����Ա');
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
	         alert('ϵͳ��������ϵ����Ա');
	     });  		  
  }
    
   // ����ģ��
   $('.edit-module').bind('change', function(){
		 var postId=$(this).data('id'), module = $(this).val();
		 if(!postId) {
			 alert('���������������Ա��ϵ��');
			 return;
		 }
		 // ��������ģ��
		 updatePostInfo({"postId":postId, "module":module}, function(o){
	    	 if(o.success) {
	    		 $.use('ui-dialog', function(){
	                 //���ж�������㣬�����ID��class
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
   
   // ���ô���
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
