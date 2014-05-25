/**
 * @author wangxiaojun
 * @usefor ��ͨר��list�ҳ��
 * @date   2013.1.22
 */
 
jQuery.namespace('FE.topic');
;(function($, T){
	var objList = [];
	var readyFun = [
					//ҳ�����¼�
			    function(){
			    	 var url = $('#hidUrl').val(),
			    	     filter = $('#hidFilter').val(),
			    	     pinlei = $('#hidPinlei').val(),
			    	     sortType  = $('#hidSortType').val(),
			    	     sameTopic = $('#hidSameTopic').val(), 
							   tag = $('#hidTag').val(),
			    	 	 checkFlag = $('#hidCheckFlag').val();
							   
					    	//���࣬���ز����¼�
								$('.mod-sn-showmorebtn').bind('click',function(event){
										event.preventDefault();
										if($(this).text()==='����'){
											$(this).closest('.sn-list').addClass('list-more');
											$(this).addClass('mod-sn-morelist');
											$(this).text('����');
											return;
										}
										if($(this).text()==='����'){
											$(this).closest('.sn-list').removeClass('list-more');
											$(this).removeClass('mod-sn-morelist');
											$(this).text('����');
											return;
										}					 
								});
								//�����ҵ��������¼�
								$('.sn-list li').bind('click',function(){
									  var type = $(this).data('type'),
									      id = $(this).data('id');
									      
									      if(type === 'market'){
									      	 window.location.href= url.replace('filter=','filter='+id).replace('tags=','tags='+tag).replace('sort_type=','sort_type='+sortType); 
									      }
									      if(type === 'pinlei'){
										     window.location.href= url.replace('pinlei=','pinlei='+id).replace('filter=','filter='+filter).replace('tags=','tags='+tag).replace('sort_type=','sort_type='+sortType); 
										  }
									      if(type === 'tag'){
									      	 window.location.href= url.replace('tags=','tags='+id).replace('filter=','filter='+filter).replace('pinlei=','pinlei='+pinlei).replace('sort_type=','sort_type='+sortType); 
									      }
								});
								//�����ѡ��ɾ������
								$('.remove-select').delegate('.remove','click',function(event){
									 event.preventDefault();
									 var type = $(this).data('type');
									  if(type === 'market'){
									      	 window.location.href= url.replace('tags=','tags='+tag).replace('check_flag=','check_flag='+checkFlag); 
									  }
									  if(type === 'pinlei'){
									      	 window.location.href= url.replace('tags=','tags='+tag).replace('check_flag=','check_flag='+checkFlag); 
									  }
									  if(type === 'tag'){
									      	 window.location.href= url.replace('filter=','filter='+filter).replace('pinlei=','pinlei='+pinlei).replace('check_flag=','check_flag='+checkFlag); 
									  }    
								});
								//���ʱ���������
								$('.sort').bind('click',function(event){
									 event.preventDefault();
									 var type = $(this).data('type'),
									 		 content = $(this).data('content');
									 		 url = url.replace('filter=','filter='+filter).replace('tags=','tags='+tag).replace('pinlei=','pinlei='+pinlei).replace('check_flag=','check_flag='+checkFlag);
										 	 if(sortType === ''){
					 					 			   window.location.href= url.replace('sort_type=','sort_type='+content);
										 	 }else{
										 				if(type === 'desc' && sortType === 'start_date'){
										 					window.location.href= url;
										 				}else if(type === 'asc' && sortType === 'end_date'){
										 					window.location.href= url;
										 				}else{
										 					window.location.href= url.replace('sort_type=','sort_type='+content);
										 				}
										 	 }
								});
								//���ͬ�вμӵĻ����
								$('.topic').bind('click',function(event){
									 event.preventDefault();
									 var sameTopic = $('#hidSameTopic').val();
											 if(sameTopic===''){
											 		window.location.href = url.replace('same_topic=','same_topic=true');
											 }else{
											 	  window.location.href = url;
											 }
								});
								//����Ƶ��б��µ���ҵƷ�����
								$('.category-morebtn').bind('click',function(event){
										event.preventDefault();
								});
								$('.category-morebtn').bind('mouseover',function(event){
										event.preventDefault();
											$(this).closest('.shadow').addClass('dhover');
											$(this).addClass('category-morelist');
											$(this).text('����');
								});
								//����Ƴ��б��µ���ҵƷ������
								$('.category-morebtn').bind('mouseout',function(event){
										event.preventDefault();
											$(this).closest('.shadow').removeClass('dhover');
											$(this).removeClass('category-morelist');
											$(this).text('����');
								});
								//��ҳ��ť
								$('#submit_btn').bind('click',function(){
									   var pageNo = $('#pageNo').val(),
									       re = /^[1-9]+[0-9]*]*$/ ;
									   url = url.replace('filter=','filter='+filter).replace('pinlei=','pinlei='+pinlei).replace('tags=','tags='+tag).replace('sort_type=','sort_type='+sortType);
									   if (!re.test(pageNo)) 
								     {
								        $('#pageNo').val('');
								        return;
								     }
									   window.location.href = url+'&page='+pageNo;
								});
								 
								
								
					}	,
					//ҳ���㷽��
					function(){
						    //�����ҵ�¼����
								$('.sn-list li').bind('mousedown',function(){
									if($(this).data('type') === 'market'){
								    aliclick(null,'?tracelog=pagepromo_activitylist_filter_'+$(this).data('id'));
								  }
								});
					},
			
					function(){
							/**
							*���浱ǰҪ����ʱ�Ķ���
							**/
							$('.leave-time').each(function(){
								objList.push($(this));
			    	   	  	})
			    	   	  	/**ÿ��1���Ӹı�����**/
			    	   	  	setInterval(timeCount, 1000);
					}	
    ];
  
    /**
      *ÿ��1���ӱ�����ǰ�������
    **/
    function timeCount(){
    	 	 $.each(objList,function(){ 
					   	  var seconds = $(this).find('.seconds'),
					   	      minutes = $(this).find('.minutes'),
					   	      hours = $(this).find('.hours'),
					   	      second,
					   	      minute,
					   	      hour;
					   	      if($(this).hasClass('fd-hide')){
					   	      	return ;
					   	      }
							   	  second = deleZero(seconds.text());
							   	  minute = deleZero(minutes.text());
							   	  hour =deleZero(hours.text()); 
										/**ͨ���룬�֣�ʱ��ǰ����������ʱ��ʾ**/
							   	  if(second > 0 ){
							   	  	 	 seconds.text(addZero(second -1));
							   	  }else{
							   	  	  if(minute > 0 ){
							   	  	  	 minutes.text(addZero(minute -1));
							   	  	  	 seconds.text(59);
							   	  	  }else{
							   	  	  	  if(hour > 0 ){
							   	  	  	  	 seconds.text(59);
							   	  	  	  	 minutes.text(59);
							   	  	  	  	 hours.text(addZero(hour -1));
							   	  	  	  }else{
							   	  	  	  	$(this).addClass('fd-hide');
							   	  	  	  	$(this).siblings('p').removeClass('fd-hide');
							   	  	  	  }
							   	  	  }			
							   	  }
					   	  
 				});
    }
    
    /**
    *ȥ0����
    **/
    function deleZero(str){
    	 if(!str){
    	 	 return '00';
    	 }
    	 if(str.indexOf('0') == 0){
					 return str.substring(1,2);
			 }else{
					 return  str;
			 }
    }
    /**
    *���0����
    **/
    function addZero(str){
    	 if(!str){
    	 	   return '00';
    	 }
    	 if(str<10){
    		   return  '0'+str;
    	 }else{
    	 	   return  str;
    	 }
    }
    
    /**
    *ҳ����
    **/
	function mouseDown(traceLog){
		aliclick(null,'?tracelog='+traceLog);
	}
	
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.topic);
