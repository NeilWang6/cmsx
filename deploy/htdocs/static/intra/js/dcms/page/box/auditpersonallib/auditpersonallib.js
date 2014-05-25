/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy 
 * @Date: 2012-11-10
 */

 ;(function($, D){
	var form = $('#js-search-page'),  url=D.domain + '/page/box/json.html?_input_charset=UTF8';
   
    // 申请审核
    function check(personalType, personalId, memo, refuse, callback){
		if(personalId) {
	    	// 申请审核
	    	var data={"action": "PersonalLibAction", 'event_submit_do_check':true, "personalId":personalId, "memo":memo, "refuse":refuse, "type":personalType};
	        $.post(url, data, function(o){
	        	if (o){
	        		if(o.errorcode) {
    					if ('status' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'审核失败', 'body':'未提交审核或重复审核!'});
    					} else if('invalid' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'审核失败', 'body':'非法请求!'});
    					} else if('content' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'审核失败', 'body':'待审核内容为空!'});
    					}
    				}
	        		callback && callback(o);
	        	}
	        }, 'json');  
		}
    }
    // 删除
    function remove(personalType, personalId, callback){
		if(personalId) {
	    	// 个人库组件
			var data={"action": "PersonalLibAction", 'event_submit_do_deletePersonalLib':true, "personalId":personalId, "personalType": personalType};
	        $.post(url, data, callback, 'json');  
		}
    }
    // 预览
    function preview(data, callback){
    	$.get(D.domain + '/page/box/checkPersonal.html?' + $.param(data), callback, 'html');    	
    }
    // 高速iframe高度
    function setIframeHeight(){
    	var winHeight = $(window).height(),
        headHeight = ($('.page-header').outerHeight() || 0) + ($('.page-content').outerHeight() || 0) + ($('.check-panel').outerHeight() || 0) ;
        $('#dcms-view-container iframe').attr('height', winHeight-headHeight);    
    } 
    // 截图
    function capture(type, id, domId, domClass, fn){
    	if(type && id && (domId || domClass)){
    		var key = type + "-" +id, tasks = {},
    		url = 'http://' + location.host + '/open/box_view.html?id=' + id + '&type=' + type;
    		tasks[key] = {'size':'170x-1', 'url':url};
    		if (domClass) {
    			tasks[key]['class'] = domClass;
    		} else {
    			tasks[key]['id'] = domId;
    		}
	    	FE.dcms.Capture.start(tasks, fn);
    	} else {
    		fn();
    	}
    }

    var readyFun = [
        // 自动调整高度
        function(){
        	$(window).resize(function(){
        		setIframeHeight();
            });
        },

        /**
         * 操作
         */
        function(){
            //删除
        	$(".oper-bar .btn-delete").click(function(e){
        		e.preventDefault();
        		var elm = $(this), personalId = elm.data("id"), personalType = $(this).data("type") || '';
            	FE.dcms.Msg.confirm({
            		'title':'提示', 
            		'body':'<b>' + $(this).data("name") + '</b> 你是否需要删除？',
            		'noclose': true, 
            		success:function(evt){
                    	remove(personalType, personalId, function(o){
            	            if(o && o.success){
            	            	elm.parents("li").remove();
            	            	evt.data.dialog.dialog('close');
            	            }
                		});           		
            		}
            	});
        	});        	
        	
        	// tab页
    		var menuTab = new FE.dcms.MenuTab({
                handlerEls: 'li',
                boxEls: '.tab-b',
                handlerCon: '.list-tab-t',
                boxCon: '.tab-b-con',
                closeEls: '.icon-close'
            });
    		
        	// preview
            $('.oper-bar .btn-view').click(function(e){
            	e.preventDefault();
            	var elm = $(this), viewdata = elm.data("view");
            	preview(viewdata, function(html){
	               // html = '<div class="tab-b">'+html+'</div>';
	                
	                menuTab.createTab('preview', '<li><span class="block"><i class="icon-close"></i>预览审核</span></li>', '<div class="tab-b">'+html+'</div>', function(el1, boxElm){
	                	boxElm && boxElm.html(html);
	                	setIframeHeight();
	                });            		
            	});
            });  
            
            // 审核通过
            $(".tab-b-con").delegate(".view-tab .check",  "click", function(){
            	var personalId = $(this).data("personalid"), personalType=$(this).data("type"), nocapture=$(this).data("nocapture"), fnSuccess = function(){
            		FE.dcms.Msg.alert({'title':'提示', 'body':'审核通过!', success:function(){
						menuTab.removeTab($("#preview"));
						location.reload();
					}});
            	};
            	if (personalId) {
            		check(personalType, personalId, '', false, function(o){
            			if (o) {
            				if (o.success) {
            					if (o.nocapture || personalType == 'pl_layout') {
            						fnSuccess();
            						return;
            					}
            					var captureClass = '';
            					// cell截图希望不要截取到边界空白            					
            					if (personalType == 'pl_cell') {
            						if($(".crazy-box-cell", $('#dcms-view-page')[0].contentWindow.document)[0]) {
            							captureClass = 'crazy-box-cell';
            						}
            					}	
            					capture(o.resourceType, o.resourceId, 'content', captureClass, fnSuccess);  
            				}             				
            			}
               		});
            	} else {
            		FE.dcms.Msg.alert({'title':'审核失败', 'body':'操作非法!'});
            	}
            });
            
            // 审核拒绝
            $(".tab-b-con").delegate(".view-tab .refuse",  "click", function(){
            	var personalId = $(this).data("personalid"), personalType=$(this).data("type");
            	
            	FE.dcms.Msg.confirm({
            		'title':'不通过', 
            		'body':'<div class="refuse-container"><textarea id="refuseText" class="refuse-text" placeholder="请填写原因"></textarea></div>',
            		'noclose': true,
            		success:function(evt){
                    	var refuseText = $("#refuseText").val();
                    	if (refuseText){
                    		if (refuseText.length>256){
                    			alert('原因最多256个字符!');
                    			return;
                    		}
                    		check(personalType, personalId, refuseText, true, function(o){
                    			if (o) {
                    				evt.data.dialog.dialog('close');
                    				if(o.success) {
                    					FE.dcms.Msg.alert({'title':'提示', 'body':'操作成功!', success:function(){
                    						menuTab.removeTab($("#preview"));
                    						location.reload();
                    					}});
                    				}             				
                    			}
                       		});                    		
                    	} else {
                    		alert("请填写原因!");
                    		$("#refuseText").focus();
                    	}
            		}
            	});	
            });
        }
    ];
     
    $(function(){
    	$.each(readyFun, function(i, fn){
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
