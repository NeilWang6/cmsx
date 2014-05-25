/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy 
 * @Date: 2012-11-10
 */

 ;(function($, D){
	var form = $('#js-search-page'),  url=D.domain + '/page/box/json.html?_input_charset=UTF8';
   
    // �������
    function check(personalType, personalId, memo, refuse, callback){
		if(personalId) {
	    	// �������
	    	var data={"action": "PersonalLibAction", 'event_submit_do_check':true, "personalId":personalId, "memo":memo, "refuse":refuse, "type":personalType};
	        $.post(url, data, function(o){
	        	if (o){
	        		if(o.errorcode) {
    					if ('status' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'���ʧ��', 'body':'δ�ύ��˻��ظ����!'});
    					} else if('invalid' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'���ʧ��', 'body':'�Ƿ�����!'});
    					} else if('content' == o.errorcode){
    						FE.dcms.Msg.alert({'title':'���ʧ��', 'body':'���������Ϊ��!'});
    					}
    				}
	        		callback && callback(o);
	        	}
	        }, 'json');  
		}
    }
    // ɾ��
    function remove(personalType, personalId, callback){
		if(personalId) {
	    	// ���˿����
			var data={"action": "PersonalLibAction", 'event_submit_do_deletePersonalLib':true, "personalId":personalId, "personalType": personalType};
	        $.post(url, data, callback, 'json');  
		}
    }
    // Ԥ��
    function preview(data, callback){
    	$.get(D.domain + '/page/box/checkPersonal.html?' + $.param(data), callback, 'html');    	
    }
    // ����iframe�߶�
    function setIframeHeight(){
    	var winHeight = $(window).height(),
        headHeight = ($('.page-header').outerHeight() || 0) + ($('.page-content').outerHeight() || 0) + ($('.check-panel').outerHeight() || 0) ;
        $('#dcms-view-container iframe').attr('height', winHeight-headHeight);    
    } 
    // ��ͼ
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
        // �Զ������߶�
        function(){
        	$(window).resize(function(){
        		setIframeHeight();
            });
        },

        /**
         * ����
         */
        function(){
            //ɾ��
        	$(".oper-bar .btn-delete").click(function(e){
        		e.preventDefault();
        		var elm = $(this), personalId = elm.data("id"), personalType = $(this).data("type") || '';
            	FE.dcms.Msg.confirm({
            		'title':'��ʾ', 
            		'body':'<b>' + $(this).data("name") + '</b> ���Ƿ���Ҫɾ����',
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
        	
        	// tabҳ
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
	                
	                menuTab.createTab('preview', '<li><span class="block"><i class="icon-close"></i>Ԥ�����</span></li>', '<div class="tab-b">'+html+'</div>', function(el1, boxElm){
	                	boxElm && boxElm.html(html);
	                	setIframeHeight();
	                });            		
            	});
            });  
            
            // ���ͨ��
            $(".tab-b-con").delegate(".view-tab .check",  "click", function(){
            	var personalId = $(this).data("personalid"), personalType=$(this).data("type"), nocapture=$(this).data("nocapture"), fnSuccess = function(){
            		FE.dcms.Msg.alert({'title':'��ʾ', 'body':'���ͨ��!', success:function(){
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
            					// cell��ͼϣ����Ҫ��ȡ���߽�հ�            					
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
            		FE.dcms.Msg.alert({'title':'���ʧ��', 'body':'�����Ƿ�!'});
            	}
            });
            
            // ��˾ܾ�
            $(".tab-b-con").delegate(".view-tab .refuse",  "click", function(){
            	var personalId = $(this).data("personalid"), personalType=$(this).data("type");
            	
            	FE.dcms.Msg.confirm({
            		'title':'��ͨ��', 
            		'body':'<div class="refuse-container"><textarea id="refuseText" class="refuse-text" placeholder="����дԭ��"></textarea></div>',
            		'noclose': true,
            		success:function(evt){
                    	var refuseText = $("#refuseText").val();
                    	if (refuseText){
                    		if (refuseText.length>256){
                    			alert('ԭ�����256���ַ�!');
                    			return;
                    		}
                    		check(personalType, personalId, refuseText, true, function(o){
                    			if (o) {
                    				evt.data.dialog.dialog('close');
                    				if(o.success) {
                    					FE.dcms.Msg.alert({'title':'��ʾ', 'body':'�����ɹ�!', success:function(){
                    						menuTab.removeTab($("#preview"));
                    						location.reload();
                    					}});
                    				}             				
                    			}
                       		});                    		
                    	} else {
                    		alert("����дԭ��!");
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
