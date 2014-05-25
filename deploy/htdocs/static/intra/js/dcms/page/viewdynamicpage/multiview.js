 ;(function($, D){
	 var completeBrower = {}, browser=['IE6', 'IE7', 'IE8', 'IE9', 'CHROME', 'FIREFOX'];
	 function startScreenshot(){
		 var serviceUrl = 'http://picdiff.alibaba-inc.com/rpc/build/run.jsonp?browsers=' + browser.join("&browsers=");
		 var queryObj = $.unparam(location.href, '&');
		 if(queryObj && queryObj.surl){
	       $.ajax({
	            url: serviceUrl,
	            data: {urls: queryObj.surl},
	            dataType: 'jsonp',
	            success: function(o){
	            	 if(o.content){
	            		 getScreenshotResult(o.content);
	            		 // debug use
	            		 if(window.console){
	            		   console.log(queryObj.surl + ' buidId=' + o.content);
	            		 }
	            	 }
	            },
	            error: function(){
	                alert('����ʧ�ܣ��������Ա��ϵ')
	            }
	        });    
		 } else {
			 alert('input parmater error!');
		 }
	 }
	 function getScreenshotResult(buildId){
		 var url = 'http://picdiff.alibaba-inc.com/rpc/query/result.jsonp',
		 fn = function(){
			 $.ajax({
		            url: url,
		            data: {'buildId': buildId},
		            dataType: 'jsonp',
		            success: function(o){
		            	 if(o && o.content){
		            		 if(o.content.isCompleted){
		            			 clearInterval(queryTimer);
		            		 }
	             			 if(o.content.successUrlList && o.content.successUrlList.length){
	             				$('.msg_box').css('display', 'none');
	             				 var titleHtml = '', imageHtml = '';
		            			 for(var i = 0;  i < o.content.successUrlList.length; i++){
		            				 var picObj =  o.content.successUrlList[i];
		            				 if(!completeBrower[picObj.browser]){
		            					 // console.log(picObj.picUrl);
		            					 titleHtml += '<li><a href="#' + picObj.browser + '">';
		            					 titleHtml += '<span>'+picObj.browser+'</span>';
		            					 titleHtml += '</a>';
		            					 titleHtml += '</li>'; 
		            					 
		            					 imageHtml += '<li><a class="goto" id="' + picObj.browser + '"></a></li><li>';
		            					 imageHtml += '<div>'+picObj.browser+'���������'; 
		            					 imageHtml += '<span class="left">��������ʾ������, �볢�Ե��<a class="fresh" href="#'+ picObj.browser +'" data-browser="'+picObj.browser+'">����</a><input type="text" id="delay" value="10">������������ͼ</span>';
		            					 imageHtml += '</div>';
		            					 imageHtml += '<img src="'+picObj.picUrl+'" alt="'+picObj.browser+'" title="'+picObj.browser+'">';
		            					 imageHtml += '</li>';        
		            					 
		            					 completeBrower[picObj.browser] = picObj.picUrl;
		            				 }
		            			 }
		            			 titleHtml && $('.preview_list').append(titleHtml);
		            			 imageHtml && $('.full_preview_list').append(imageHtml);
	            			 }			            		 
		            	 }
		            },
		            error: function(o){
		            	clearInterval(queryTimer);
		                console && console.log(o)
		            }
		        });
		 }, queryTimer = setInterval(fn, 1000);
	 }
	 function reCapture(url, browsers, waitsec, callback){
		 var serviceUrl = 'http://picdiff.alibaba-inc.com/rpc/build/simpleRun.jsonp?sync=true&timeOut='+ waitsec +'&browsers=' + browsers.join("&browsers=");
		 // debug use
		 if(window.console){
		 	console.log(serviceUrl + "&urls="+url); 
		 }	  		 
	     $.ajax({
	            url: serviceUrl,
	            data: {urls: url},
	            dataType: 'jsonp',
	            timeout: waitsec * 1000 + 30000,
	            success: callback,
	            error: function(){
	                alert('����ʧ�ܣ��������Ա��ϵ')
	            }
	     });	 
	 }
	 // ҳ�������ִ��
     $(function(){
    	 // ȥ����ǰ�����
    	 if($.browser.mozilla){ //firefox
    		 browser.splice(browser.indexOf('FIREFOX'), 1);
    	 }else if($.browser.webkit){//chrome
    		 browser.splice(browser.indexOf('CHROME'), 1);
    	 }
    	 // ��������
    	 startScreenshot();
    	 // �����ʽ
    	 $('.preview_list').delegate("li span", "click", function(){
    		 	$(this).removeClass('load').addClass('see');//toggleClass
    	 }); 
    	 // ����
    	 $('.full_preview_list').delegate(".left a", "click", function(){
    		    var elm = $(this), browser = elm.data('browser'),
    		    waitsec = parseInt(elm.siblings('input').val()) || 10,
    		    tab = $(".preview_list a[href='#"+ browser +"'] span"),
   			    queryObj = $.unparam(location.href, '&');
    		    if (queryObj && queryObj.surl) {
	    		    tab.removeClass('load').addClass('loading');    
	   	    		reCapture(queryObj.surl, [browser], waitsec, function(o){
		   	    		if(o && !o.hasError){
		   	    			var img = elm.parents('div:first').siblings('img');
		   	    			if(img && o.content.successUrlMap) img.attr('src', o.content.successUrlMap[browser].picUrl);
		   	    			tab.attr('class', 'load');
		   	    			elm.siblings('input').val(waitsec + 5);
		   	    		}	    		    	
	    		    }); 
    			}    		 	
    	 }); 
     });
 })(dcms, FE.dcms);