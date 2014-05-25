/**
 * @author wangxiaojun
 * @usefor 普通专场list活动页面
 * @date   2013.1.22
 */
 
jQuery.namespace('FE.topic');
;(function($, T){
	var objList = [];
	var readyFun = [
					//页面点击事件
			    function(){
			    	 var url = $('#hidUrl').val(),
			    	     filter = $('#hidFilter').val(),
			    	     pinlei = $('#hidPinlei').val(),
			    	     sortType  = $('#hidSortType').val(),
			    	     sameTopic = $('#hidSameTopic').val(), 
							   tag = $('#hidTag').val(),
			    	 	 checkFlag = $('#hidCheckFlag').val();
							   
					    	//更多，隐藏操作事件
								$('.mod-sn-showmorebtn').bind('click',function(event){
										event.preventDefault();
										if($(this).text()==='更多'){
											$(this).closest('.sn-list').addClass('list-more');
											$(this).addClass('mod-sn-morelist');
											$(this).text('隐藏');
											return;
										}
										if($(this).text()==='隐藏'){
											$(this).closest('.sn-list').removeClass('list-more');
											$(this).removeClass('mod-sn-morelist');
											$(this).text('更多');
											return;
										}					 
								});
								//点击行业，活动类型事件
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
								//点击已选择删除操作
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
								//点击时间排序操作
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
								//点击同行参加的活动操作
								$('.topic').bind('click',function(event){
									 event.preventDefault();
									 var sameTopic = $('#hidSameTopic').val();
											 if(sameTopic===''){
											 		window.location.href = url.replace('same_topic=','same_topic=true');
											 }else{
											 	  window.location.href = url;
											 }
								});
								//鼠标移到列表下的行业品类更多
								$('.category-morebtn').bind('click',function(event){
										event.preventDefault();
								});
								$('.category-morebtn').bind('mouseover',function(event){
										event.preventDefault();
											$(this).closest('.shadow').addClass('dhover');
											$(this).addClass('category-morelist');
											$(this).text('隐藏');
								});
								//鼠标移出列表下的行业品类隐藏
								$('.category-morebtn').bind('mouseout',function(event){
										event.preventDefault();
											$(this).closest('.shadow').removeClass('dhover');
											$(this).removeClass('category-morelist');
											$(this).text('更多');
								});
								//分页按钮
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
					//页面打点方法
					function(){
						    //点击行业事件打点
								$('.sn-list li').bind('mousedown',function(){
									if($(this).data('type') === 'market'){
								    aliclick(null,'?tracelog=pagepromo_activitylist_filter_'+$(this).data('id'));
								  }
								});
					},
			
					function(){
							/**
							*缓存当前要倒计时的对象
							**/
							$('.leave-time').each(function(){
								objList.push($(this));
			    	   	  	})
			    	   	  	/**每个1秒钟改变数字**/
			    	   	  	setInterval(timeCount, 1000);
					}	
    ];
  
    /**
      *每个1秒钟遍历当前缓存对象
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
										/**通过秒，分，时当前数字来倒计时显示**/
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
    *去0方法
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
    *添加0方法
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
    *页面打点
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
