/**
 *ר�������-רҵ�г�(����)�����ύҳ��
 *@author wb_xiaojun.wangxj
 *@version 2012-10-8
 */

jQuery(function($){
	   //ҳ���������¼�
	    $(document).click(function(e){  
	    	if($(e.target).closest("#build").html() != null){
	    		return;
	    	}
	    	var searchWords =  $(e.target).closest("#search-keywords").html();
	    	if(searchWords == null){
	    	 	$("#search-keywords").css('display','none') ; 
	    	}
  	 	 });
		 
		//���ڵ�����ý��㴥���¼�
	 	$("#cert-form").delegate("#building", "focus", function(){
			if($("#building").data("marketname") == "") {
				var height = $("#building").height();     //�����ĸ߶�
				var top = $("#building").offset().top+4;  //������λ�ø߶�
				var left = $("#building").offset().left;  //������λ����߾���
				$("#search-keywords").css("left",left+"px");
				$("#search-keywords").css("top",height+top+"px");
				$('#search-keywords').css('display',"block");
			}
		});
		 
		 //�������������¼�
		  $("#listbox").delegate("li", "click", function(e){ 
		  	e.preventDefault();
    		  var mark = $(this).data('mark');
      		  if(mark!=='' && mark==='inside'){ 
     		     $('#floor').css("display","block");
     		     $('#doorNum').closest('.item-area').css("display","block");
    			   $('#region').css("display","none");
    			   $('#area').css("display","none");
    			   $('#floorNum').val('');
				     $('#building').val($(this).children("a").text());
					 $('#buildingHidden').val($(this).children("a").data('id'));						 
				     $('#search-keywords').css('display','none');
				     $('#build').removeClass('error');
				     $('#floor').addClass('error');
				     $('#round').val('n');
    		   }
    		   
	     });
	     //���������ܱߵ��������¼�
	     $("#listbox").delegate("#span-side", "click", function(e){ 
	     	e.preventDefault();
	     	     $('#floor').css("display","none");
    			   $('#region').css("display","block");
    			   $('#doorNum').closest('.item-area').css("display","none");
    			   $('#biz-addr-region').get(0).selectedIndex=0;
    			   $('#area').css("display","block");
    			   $('#address').val('');
    			   $('#doorNum').val('');
				     $('#building').val($(this).text());
					 $('#buildingHidden').val($(this).text());
				     $('#search-keywords').css('display','none');
				     $('#build').removeClass('error');
				     $('#region').addClass('error');
				     $('#round').val('y');
	    });
	     
		 
});
