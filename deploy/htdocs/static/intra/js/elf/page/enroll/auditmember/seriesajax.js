
var  currentList;              //ѡ��liλ��
var  currentList = -1 ; 
var  topic_value ;  
var  listLength;
var  indexflag;
var  downupflag=0;
var  offerflag = 0;
function viewtxt(flag){
 
	if(downupflag==1){
		downupflag =0;
		return;
	}
	var topicval = jQuery("#seriesName").val();

	var _url = jQuery('#domain_enrollModule').val() + '/topicListJson.do'
	indexflag = flag;
	if(offerflag==0 && flag==1){
		topicval = "";
		offerflag++;
	}
	topic_value = topicval;
	var height = jQuery("#seriesName").height();//�����ĸ߶�
    var top = jQuery("#seriesName").offset().top+7;//������λ�ø߶�
    var left = jQuery("#seriesName").offset().left;//������λ����߾���
	var list_li ="";

	 jQuery.ajax({
		url : _url+"?_input_charset=UTF-8",
		type: "post",
		async: false,
		data: "name="+topicval,
		error: function(jqXHR, textStatus, errorThrown) {
			return;
		},
		success: function(_data){

			if(flag==0){
				list_li =  '<li class="ui-menu-item" ><span class="suggest-key">����ר��</span><input type="hidden" name="hidId" id="hidId" value="0" /></li>';
			}
			var json = jQuery.parseJSON(_data) ;
			jQuery("#listbox").html("");
			for(var p in json){
				list_li = list_li + '<li class="ui-menu-item" >  <span class="suggest-key">'+ json[p]+'</span><input type="hidden" name="hidId" id="hidId" value="'+p+'" /></li>';
			}
			jQuery("#listbox").html(list_li);
			listLength =  jQuery("#listbox li").size() //li����
			if(listLength > 0){//�ж��Ƿ��з�������
				jQuery("#search-keywords").css("left",left+"px");
				jQuery("#search-keywords").css("top",height+top+"px");
				jQuery('#search-keywords').css('display',"block");
			}else{
				jQuery('#search-keywords').css('display',"none");
				jQuery("#listbox").html("");
			}
		}
	});	
}
     
jQuery(document).keydown(function(event){  //������Ӧ����
	event = event || window.event;  //���ݶ������
                   
	if(event.keyCode==38){         //�����Ϸ����
		if(currentList < 1 ){  
			currentList=listLength - 1;  
							  
			jQuery("#listbox li").removeClass();//�������ʽ �����ͻ                             
			jQuery("#listbox li").eq(currentList).addClass("selected");
			var vals =jQuery("#listbox li").eq(currentList).find(".suggest-key").text();    
			var hidId =   jQuery("#listbox li").eq(currentList).find("#hidId").val();   
			jQuery("#seriesId").val(hidId);    
			jQuery("#seriesName").val(vals); 
			downupflag=1;
  
		} else{
		   currentList--;                           
		   jQuery("#listbox li").removeClass();//�������ʽ �����ͻ                                
		   jQuery("#listbox li").eq(currentList).addClass("selected");
		   var vals =jQuery("#listbox li").eq(currentList).find(".suggest-key").text();     
		   var hidId =   jQuery("#listbox li").eq(currentList).find("#hidId").val();   
		   jQuery("#seriesId").val(hidId);       
		   jQuery("#seriesName").val(vals); 
		   downupflag=1 ;
		}                 
	}
	if(event.keyCode==40){                    //�����·����                       
							  
		if(currentList <  (listLength - 1) ){                            
			currentList++;       
			jQuery("#listbox li").removeClass();//�������ʽ �����ͻ                            
			jQuery("#listbox li").eq(currentList).addClass("selected");     
			var vals =jQuery("#listbox li").eq(currentList).find(".suggest-key").text();   
			var hidId =   jQuery("#listbox li").eq(currentList).find("#hidId").val();   
			jQuery("#seriesId").val(hidId);    
			jQuery("#seriesName").val(vals);   
			downupflag=1 ;
		}else{                         
			currentList=0;                   
			jQuery("#listbox li").removeClass();//�������ʽ �����ͻ                   
			jQuery("#listbox li").eq(currentList).addClass("selected");
			var vals =jQuery("#listbox li").eq(currentList).find(".suggest-key").text();     
			var hidId =   jQuery("#listbox li").eq(currentList).find("#hidId").val();   
			jQuery("#seriesId").val(hidId);   
			jQuery("#seriesName").val(vals);
			downupflag=1 ;
		}
	}
	if(event.keyCode==13){               //�����س���    
		if(jQuery("#listbox li").length >0){     
			var keywords= jQuery("#listbox li").eq(currentList).find(".suggest-key").text();    
			var hidId = jQuery("#listbox li").eq(currentList).find("#hidId").val();   
			jQuery("#seriesName").val(keywords);        
			jQuery("#seriesId").val(hidId);      
			jQuery('#search-keywords').css('display','none');
			jQuery("#listbox").html("");
			downupflag=1;
		}              
	}
});      //������Ӧ��������    
 	
jQuery("#listbox").delegate("li", "hover", function(){//����¼�
	jQuery("#listbox li").removeClass();//�������ʽ �����ͻ           
	jQuery(this).addClass("selected");
});

jQuery("#listbox").delegate("li", "click", function(){//����¼�
	var vals = jQuery(this).children(".suggest-key").text();
	var hidId =jQuery(this).children("#hidId").val();
	jQuery("#seriesName").val();
	jQuery("#seriesName").val(vals);
	jQuery("#seriesId").val(hidId);
	if(indexflag==1){
		seriesItemChange();
	}
});
 
 	 	  
jQuery(document).click(function(event){  
	if(event.target.name=='seriesName'){
		return;
	}
	if(event.target.className=='search-keywords'){
		return;
	}

	if(jQuery.trim(jQuery("#seriesName").val())==''){
		var vals =jQuery("#listbox li").eq(0).find(".suggest-key").text();
		var hidId =   jQuery("#listbox li").eq(0).find("#hidId").val();   
		jQuery("#seriesName").val(vals);  
		jQuery("#seriesId").val(hidId);   
		if(indexflag==1){
			seriesItemChange();
		}
	}
	jQuery('#search-keywords').css('display','none');
	jQuery("#listbox").html("");
});
 