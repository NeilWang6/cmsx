/**
 * @author springyu
 * @userfor 设置模版
 * @date 2012-10-4
 */

;(function($, D) {
	var daftForm=$('#daftForm');
    /**
     * 显示信息框
     * option.title:标题
     * option.body:提示内容
     * option.complete: 完成函数
     */ 
    function showMsgBox(option){
    	option = option || {};
    	$footer = $('footer', '.js-dialog');
			$footer.show();
    	$('.js-dialog section').html(option.body || '');
    	if(option.onlymsg){
    		$('.js-dialog .btn-cancel').css({"display":'none'});
    		$('.js-dialog .btn-submit').unbind('click');
    	}
		$.use('ui-dialog', function(){
            //如有多个浮出层，请另加ID或class
            var dialog = $('.js-dialog').dialog({
                center: true,
                fixed:true
            });
            $('.js-dialog .btn-cancel, .js-dialog .close').bind('click', function(){
                dialog.dialog('close');
            });
        	option.success && $('.js-dialog .btn-submit').bind('click', {'confirm':true}, option.success);
        	option.complete && $('.js-dialog .btn-submit').bind('click', {'confirm':true}, option.complete);
            option.onlymsg && $('.js-dialog .btn-submit').bind('click', function(){
            	dialog.dialog('close');
    		});            
        });     	
    }	
    var readyFun = [
    function() {
        //var obj = $.unparam(location.href, '&');
       // var pageId = obj.pageId||$('#pageId').val();
        
        //if(pageId) {
           // $('#panel_tab').attr('data-pageid', pageId);

            //showTemplate({
              //  'page' : 1,
              //  'pageId' : pageId
            //});
       // }
//
    },
    function() {
        //分页事件
        $('#panel_tab').delegate('.template-page a.elem', 'click', function(e) {
            e.preventDefault();
            var _self = $(this), _selfParent = _self.parent();
            var pageId = $('#panel_tab').data('pageid')||$('#pageId').val();
            var keyword = $('#keyword').val();
            if(!_selfParent.hasClass('disabled')) {
                showTemplate({
                    'page' : _self.data('val'),
                    'pageId' : pageId,
                    'keyword' : keyword
                });
                return;
            }
        });
    },
    function() {
        $('#search-template').bind('click', function(event) {
            var pageId = $('#panel_tab').data('pageid')||$('#pageId').val();
            var keyword = $('#keyword').val();
            showTemplate({
                'page' : 1,
                'pageId' : pageId,
                'keyword' : keyword
            });
        });
    },
    function() {

        $('#panel_tab').delegate('a.dcms-box-btn-import', 'click', function(event) {
            event.preventDefault();
            
            var self = $(this), params = self.data('params') || {}, templateId = params.templateId;
            showMsgBox({'title':'提示', 'body':'<div class="header-dialog-content">模板更换后，新模板将覆盖原先模板数据，请确认是否执行该操作？</div>' , success:function(){
	            if(templateId) {             
		            var docIframe = $('iframe#dcms_box_main');
		            var _self = docIframe.contents().find('#design-container');
		            $('#textarea-content').val(_self.html());
		            daftForm[0].action.value = 'BoxDraftAction';
		        	daftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_swithTemplate');	
		        	var templatElm  = daftForm.find('input[name="templateId"]');
		        	if(templatElm[0]) {
		        		templatElm.val(params.templateId);
		        	} else {
		        		daftForm.append('<input name="templateId" type="hidden" value="'+params.templateId+'"/>');
		        	}
		        	daftForm.submit();
	            } else {
	             	alert("请选择模板!");
	        	}
			}});            
        });
    }];
    function showTemplate(params) {
        var templateList = $('#template_tag_list'), templateBody = $('.template-body', templateList), 
        //
        templatePage = $('.template-page', templateList);
        templateBody.empty();
        templatePage.empty();
        $.post(D.domain + '/page/box/recommend_templates.html?_input_charset=UTF8', params, function(json) {
            if(json && json.status === 'success') {
                var data = json;
                 //console.log(data);
                if(data) {
                    var datalist = data.templateList || {};
                    datalist.pageId = data.pageId || 0;
                    var template = '<ul class="fd-clr">';
                    var temp = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
                    temp += ' <li class="<% if ( i != 0){ %>add-head<% } %>">';
                    temp += ' <dl id="template-box">';
                    temp += '   <dt  data-id="<%=$data[i].templateId%>"  data-type="template">';
                    temp += '       <a href="#"><img class="box-img" src="<%if ($data[i].thumbnail) {%><%=$data[i].thumbnail%><% }else {%>http://img.china.alibaba.com/cms/upload/2012/549/882/288945_417709751.png<% } %>"/></a>';
                    temp += '   </dt>';
                    temp += '   <dd class="name" title="<%=$data[i].userId%>"><%=$data[i].name%></dd>';
                    temp += '   <dd class="meta"><div><a href="/page/box/view.html?type=template&no_operation=true&id=<%=$data[i].id%>" target="_blank" title="">预览</a><a class="import dcms-box-btn-import" data-params=\'{"templateId":<%=$data[i].id%>,"pageId":<%=$data.pageId%>,"newPageDesign":"new"}\' href="import_page.html?fromTemplate=<%=$data[i].id%>&pageId=<%=$data.pageId%>&newPageDesign=new">引用</a></div></dd>';
                    temp += '  </dl>';
                    //temp += '  <div class="operation">';
                    //temp += '         ';
                    //temp += '  </div>';
                    temp += '  </li>';
                    temp += '   <% } %>';
                    var html = FE.util.sweet(temp).applyData(datalist);
                    template += html;
                    template += '</ul>';
                    templateBody.append(template);
                    var current = parseInt(data.currentPage), sumPage = parseInt(data.pages);
                    if(data && sumPage && sumPage > 1) {
                        var pageHtml = '<div class="footer"><ul class="fd-clr">';
                        if(current !== 1) {
                          //  pageHtml += '<li><a class="elem desc" data-val="1">首页</a></li>';
                            pageHtml += '<li><a class="elem desc" data-val="' + (current - 1) + '">上一页</a></li>';
                        } else {
                           // pageHtml += '<li class="disabled"><a class="elem desc" data-val="' + current + '">首页</a></li>';
                            pageHtml += '<li class="disabled"><a class="elem desc" data-val="' + current + '">上一页</a></li>';
                        }
                  
                            pageHtml += '<li class="page"><a class="desc">'+current+'/';
                            
                            pageHtml +=sumPage+'</a></li>';
                        
                        if(current !== sumPage) {
                            pageHtml += '<li><a class="elem desc" data-val="' + (current + 1) + '">下一页</a></li>';
                            //pageHtml += '<li><a class="elem" data-val="' + sumPage + '">尾页</a></li>';
                        } else {
                            pageHtml += '<li class="disabled"><a class="elem desc" data-val="' + current + '">下一页</a></li>';
                           // pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">尾页</a></li>';
                        }

                        //pageHtml += '<li><a class="desc">第' + data.currentPage + '页/共' + data.pageSize + '页</a></li>';
                        pageHtml += '</ul></div>';
                        templatePage.append(pageHtml);
                    }
                    D.bottomAttr.resizeWindow();
                }
            }

        }, 'json');
    };
    D.showTemplate = showTemplate;
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });

})(dcms, FE.dcms);
