/**
 * @author 
 * @usefor
 * 
 * @date   2013.03.05
 */

;(function($, T) {
  var _self = this;
  var width = 990;
      var maxLeft = 0;               
      $('.detail').find('div.sample').each(function(){
          if($(this).offset().left > maxLeft) {
              maxLeft = $(this).offset().left
          }
      })
      if(maxLeft <= 457){maxLeft = 457}
      width = maxLeft + 22;  
  var data = {
      curPage: $('input#curpage').val(),
      page: $('input#page').val(),//��ҳ
      titlelist: $('input#titlelist').val(),//������
      leftContent: '',
      rightContent: '',
      limit: 3,
      width: width + 'px',
      left: '210px',
      curPageInput: $('input#curpage'),
      form: $('.js-search-page'),
      param: $('.js-search-page input[name=page]'),
      maxWidth:981,
      minWidth:726
  }
  var pagelistall = new T.pagelistall(data);
  pagelistall.init(data);
  $('#libra-tools-panel').find('.libra-js-menu-ctrl').click(function(){
      if( !$(this).hasClass('toright') ) {
          var maxLeft = 0;               
          $('.detail').find('div.sample').each(function(){
              if($(this).offset().left > maxLeft) {
                  maxLeft = $(this).offset().left
              }
          })
          _self.saveLeft = $('#fixBottomPageList').width();
          if(maxLeft >= 711){maxLeft = 711}
          if(maxLeft <= 457){maxLeft = 457}
          $('#fixBottomPageList').width(maxLeft + 269)  
      }else{
          $('#fixBottomPageList').width(_self.saveLeft)
      }
  })
	var form = $('.js-search-page');
	var dialogSeriesDelConfirm;
	 // �����������
    $(".js-magazine-manage").click(function(e){
    	 var magazineid=$(this).data('id'); 	
    	 document.location.href = T.domain + '/tools/show_aliway_posts.htm?magazineId='+magazineid;   	    	
    });  
    //�ϴ����
    $(".js-magazine-upload-design").click(function(e){
   	 var magazineid=$(this).data('id'); 	
   	 document.location.href = T.domain + '/tools/edit_magazine.htm?status=0&id='+magazineid;   	    	
    });  
    //�޸��ڿ�
    $(".js-magazine-modify").click(function(e){
      	 var magazineid=$(this).data('id'); 	
      	document.location.href = T.domain + '/tools/edit_magazine.htm?status=1&id='+magazineid;   	   	
       });     
    
    //������ƣ�������ʾ
    $(".js-submit-design").click(function(e){
    	e.preventDefault();
    	//�޸���Ҫ����У��
    	var title=$('#addMagazineForm #magazine_name').val();
    	var theme=$('#addMagazineForm textarea[name=theme]').val();
    	if(!title || !theme){
    	   alert("�������������ǿ�!");
    	   return;
    	}   	
    	
    	 var url = T.domain + '/tools/ajax_manage_magazine.json?_input_charset=UTF-8';
    	 var magazineForm = $('#addMagazineForm');
    	 var formdata=magazineForm.serialize();
    	 $.ajax({
             url: url,
             type: "POST",
             data: formdata,
             timeout:5000
         }).done(function(o){
 
        	 if(o.success) {        		      		
        		 $('.js-magazine-tip').html('�����ɹ�'); 
        	 }else{
        		 $('.js-magazine-tip').html(o.msg);
        		 
        	 }
        	 $.use('ui-dialog', function(){
                 //���ж�������㣬�����ID��class//smallDialog//.dialog-basic
                 var dialog = $('#smallDialog').dialog({
                     center: true,
                     fixed:true
                 });
                 $('body').one('click', function(){
                     dialog.dialog('close');                    
                 });
             });       
         }).fail(function(){
             alert('ϵͳ��������ϵ����Ա');
         });  

    });
    //ȷ�Ϸ���,ȡ������
    $(".js-submit-publish").click(function(e){
    	e.preventDefault();
    	 var now_magazine_status=$('#magazine_status').val();
         var text="";
         if(now_magazine_status=='0'){
        	 text="�ڿ� - "+ $("#magazine_name").val()+" ������������,��ȷ�ϸò���!";
         }else{
        	 text="�ڿ� - "+ $("#magazine_name").val()+" ����ȡ������,��ȷ�ϸò���!";
         }
         
        $("#js-confirm-txt").html(text);
         
    	$.use('ui-dialog', function(){
    		var dialogConfirm = $('.dialog-series-confirm-publish').dialog({
				center: true,
				fixed:true
			});
    		$(".js-dialog-confirm-publish").bind("click",function(e){
    			 doAjaxPostMagazineForm();
    			 dialogConfirm.dialog('close');
    		});
    		$('.dialog-series-confirm-publish .btn-cancel, .dialog-series-confirm-publish .close').click(function(){
    			dialogConfirm.dialog('close');
    		});
    		
		});
    	
    	return;
    });
    
    function doAjaxPostMagazineForm(){
    	 
    	 var now_magazine_status=$('#magazine_status').val();
      	 var url = T.domain + '/tools/ajax_manage_magazine.json?_input_charset=UTF-8&tmpStatus=';
      	 if(now_magazine_status=='1'){
      		url=url+'0';
      	 }else{ 		 
      		url=url+'1';
      	 }
      	 
      	 var magazineForm = $('#addMagazineForm');
      	 var formdata=magazineForm.serialize();
      	 $.ajax({
               url: url,
               type: "POST",
               data: formdata,
               timeout:5000
           }).done(function(o){
           	 if(o.success) {        		      		
           		 $('.js-magazine-tip').html('�����ɹ�');
           		 $('#js-dialog-icon').addClass("icon-success");
               	 if(now_magazine_status=='1'){
               		 $('.js-submit-publish').val('ȷ�Ϸ���');
               		 $('#magazine_status').val('0')
                        
               	 }else{
               		 $('.js-submit-publish').val('ȡ������ ');
               		 $('#magazine_status').val('1')
               		 
               	 }       			 
           	 }else{
           		 $('.js-magazine-tip').html(o.msg);
           		 
           		 $('#js-dialog-icon').removeClass("icon-success");
           		 $('#js-dialog-icon').addClass("icon-fail");       		 
           	 }
           	 
          		$.use('ui-dialog', function(){
                       //���ж�������㣬�����ID��class
                       var dialog = $('#smallDialog').dialog({
                           center: true,
                           fixed:true
                       });
                       $('body').one('click', function(){
                           dialog.dialog('close');
                          
                       });
               });        		 
          	 
          	 
           }).fail(function(){
               alert('ϵͳ��������ϵ����Ա');
           });  
 	
    }
      
})(jQuery, FE.tools);
