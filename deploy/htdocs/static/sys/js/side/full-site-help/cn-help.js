/**
 * @author dive.liuj
 * @date 2013-08-09
 * @desc 阿里巴巴中文站，全站帮助组件
 */
jQuery.namespace('FSH');
(function($, NS){
	var options = {  //default config
		pageUrl: 0, //需要为部署页面配置id，初始化时根据页面，可以用于请求帮助数据，以及设置搜索参数相关
		autoShow: 0, //是否自动显示，0为不，大于0则为自动显示x秒后消失，-1则自动显示不消失
		position: {  //位置
			right: 3,
			top: 100
		},
		searchUrl: 0,
		contentUrl: "",
		sceneId: 1  // the parameter of the scene
	};
	var hasHelpInited = false;
	var helpId = "cn-help-aniu";
	var dialogId = "full-site-help";
	var logParams = ["tracelog=helpanywhere_aniu_", 'open', "close", "read", "search", "show"];
	var autoShowCallBack = null;
	var dialogInst = null;
	var autocompleteInst = null;
	/**
	 * 初始化帮助组件
	 */
	var initHelp = function(){
		//获取css，放到回调后，主要是为了获取组件位置准备，否则在初始化时位置计算错误
		$.loadCSS("http://style.c.aliimg.com/sys/css/side/full-site-help/cn-help-min.css", function(){
			render();
			bindEvt();
			if(options.autoShow){
				callback = null;
				if(options.autoShow > 0){
					callback = function(){
						autoShowCallBack = setTimeout(function(){
							closeHelp();
						},options.autoShow*1000);
					}
				}
				showHelp(callback);
			}
		});
	};
	
	/**
	 * 渲染初始的小牛形象，并将dialog的框架注入页面中
	 */
	var render = function(){	
		//渲染小牛形象
		$("body").append('<a id="' + helpId + '" class="cn-help-aniu" href="javascript:;"></a>');
		//调整小牛的位置
		if(options.position){
			$("#" + helpId).css(options.position);
		}
		//并将dialog的框架注入页面中
		var dialogHtmlStr = '<div class="full-site-help" id="full-site-help">' +
	        '<div class="FSH-header">您可能关心的疑问：<a href="javascript:;" id="FSH-close" class="FSH-close" title="关闭">X</a></div>' +
	        '<div class="FSH-body fd-clr" id="FSH-body">' +
	        	'<div class="scrollbar"><div class="track"><div class="thumb"><div class="prev-end"></div><div class="next-end"></div></div></div></div>' +
	        	'<div class="viewport"><div class="overview FSH-content" id="FSH-content"></div></div>' +
	        '</div>' +	        
	        '<div class="FSH-footer"><dl class="FSH-ask-aniu">' +
	        '<dt>我还想问</dt><dd class="fd-clr">' + 
	        '<input id="FSH-aniu-input" value="请输入您的疑问" class="FSH-aniu-input default-tip fd-left"/>' +
			'<a href="javascript:;" class="go-search fd-left" id="go-ask-search"></a>' + 						
	        '</dd></dl></div></div>';
		$("body").append(dialogHtmlStr);		
	};
	/**
	 * 绑定帮助组件的相关事件
	 */
	var bindEvt = function(){
		//click
		$("#" + helpId).click(function(){
			if(!hasHelpInited || dialogInst.css("display") == "none"){
				log(1);
			}
			showHelp();
			return false; //防止跳转
		});
		$("#FSH-close").click(function(){
			log(2);	
			closeHelp();
			return false;
		});
		//resize
		$(window).resize(function() {
			resizeHelp();
		});
		//scroll
		if($.util.ua.ie6){
			$(window).scroll(function(){
				var newTop = options.position.top + getScrollTop();
				$("#" + helpId).css("top", newTop);
			});
		}
		$("#full-site-help").click(function(){
			if(autoShowCallBack){
				clearTimeout(autoShowCallBack);
			}
		});
	};
	/**
	 * 打开帮助组件
	 */
	var showHelp = function(callback){
		if(hasHelpInited){
			if(dialogInst.css("display") == "none"){
				//$("#" + dialogId).dialog( "open" );
				dialogInst.show();
			}			
		}else{
			buildDialog(callback);
			//构筑检索框组件
    		buildSearchBar();	
			//设置标志位
			//hasHelpInited = true;
		}
		log(5);
	};
	
	/**
	 * 关闭帮助组件
	 */
	var closeHelp = function(){
		if(hasHelpInited){
			//$('.ui-dialog').hide();
			dialogInst.hide();
		}
	};
	var resizeHelp = function(){
		if(hasHelpInited){			
			var pos = $("#" + helpId).position();				
			if($.util.ua.ie6){
				var left4ie6 = document.body.clientWidth - 304 - options.position.right;// 304 = 255 + 9 + 40
				dialogInst.css("left", left4ie6);
				$(window).scroll(function(){
					dialogInst.css("left", left4ie6);
				});
			}else{
				//$('.ui-dialog').css("left", pos.left - 264);
				dialogInst.css("left", pos.left - 264);
			}
		}
	};

	/**
	 * get the scrolltop
	 */
	var getScrollTop = function(){
		return document.documentElement.scrollTop || document.body.scrollTop;
	};
	/**
	 * 构建对话框组件
	 */
	var buildDialog = function(callback){
		var pos = $("#" + helpId).position();
		$.use('ui-draggable, ui-dialog', function(){
		    $('#' + dialogId).dialog({
		    	modal: false,
		    	fixed: true,
		    	css:{
		    		width: 255,
		    		left: pos.left - 264,
		    		top: options.position.top
		    	},
		    	draggable: {
		    		handle:"div.FSH-header"
		    	},
		    	show:{
		    		effect: "blind",
		            duration: 1000
		    	},
		    	open:function(){
		    		//打开后获取帮助数据	    		
		    		loadData(options.contentUrl, "help", processHelpData);		    				    			    				   
		    		if(callback){
		    			callback();
		    		}
		    	}
		    });
		    dialogInst = $('#' + dialogId).parent(".ui-dialog");
		});		
	};
	/**
	 * 构建搜索组件
	 */
	var buildSearchBar = function(){
		var searchId = "FSH-aniu-input";
		$.use('ui-autocomplete', function(){
	        $('#' + searchId).autocomplete({
	        	position: {
	        		my: "left bottom", 
	        		at: "left top"
	        	},
	        	focus: function( event, ui ) {
	                $('#' + searchId).val( ui.item.value );
	                return false;
	            },
	        	source: function( request, response ){
	        		$.ajax({
	        	          url: "http://baike.1688.com/user/service/kefuSuggest.html",
	        	          dataType: "script",
	        	          scriptCharset: "gbk",
	        	          data: $.paramSpecial({
	        	        	type:"saleoffe",
	        	            q: request.term
	        	          }),	        	          
	        	          success: function() {
	        	        	  var result = window["_suggest_result_"].result || [];
	        	        	  var reg = new RegExp($.ui.autocomplete.escapeRegex( request.term ), "gi");
	        	        	  var transRes = $.map( result, function(item, index) {
	        	        		  if(index > 4) return;
	        	        		  if(index == 4){
									return {
		        	                    label: "",
		        	                    value: "",
		        	                    index: index
		        	                  }
	        	        		  }else{
	        	        		  	return {
		        	                    label: item[0].replace(reg, function(word){return "<em>" + word + "</em>";}),
		        	                    value: item[0],
		        	                    index: index
		        	                  }
	        	        		  }
	        	                  
	        	                });
	        	        	  response(transRes );
	        	          }
	        	        });
	        	},
	        	select: function(event, ui){
	        		var index = ui.item.index;
	        		if(index === 4){
	        			goAskSearch('');
	        			return false;
	        		}else{
	        			goAskSearch(ui.item.value);
	        		}
	        	}
	        })
	        .data( "autocomplete" )._renderItem = function( ul, item ) {
//	        	var val = $('#cn-help-query').val();
//	        	console.log(val);
//	        	var newValue = item.value.replace(val, '<em>' + val + '</em>');
	        	if(item.index < 4){
	        		return $( "<li></li>" )
	                .data( "item.autocomplete", item )
	                .append( "<a href='javascript:;'>" + item.label + "</a>" )
	                .appendTo( ul );	 
	        	}else{
	        		return $( "<li></li>" )
	                .data( "item.autocomplete", item )
	                .append( "<a class='more' href='javascript:;'>更多相关问题 ></a>" )
	                .appendTo( ul );	 
	        	}
	                       
	        };
	        autocompleteInst = $('#' + searchId).parent(".ui-autocomplete");
	    });
		//绑定检索组件的事件
		$('#' + searchId).focus(function(){
			if($(this).hasClass("default-tip")){
				$(this).val("");
				$(this).removeClass("default-tip");
			}
		}).blur(function(){
			if($(this).val() === ""){
				$(this).val("请输入您的疑问");
				$(this).addClass("default-tip");
			}			
        }).keydown(function(event){
        	if (event.which == 13) {
        		var val = $.trim($(this).val());        		
        		return goAskSearch(val);	        		      		
        	}
        });
		$("#go-ask-search").click(function(e){
			e.preventDefault()
			var val = ($('#' + searchId).hasClass("default-tip")) ? '' : $.trim($('#' + searchId).val());
    		goAskSearch(val);	    		
		});	
	};
	
	/**
	 * 检索功能，跳转到新的页面
	 */
	var goAskSearch = function(val){
		var searchUrl = options.searchUrl;
		if(val != ""){
			searchUrl = searchUrl + encodeURIComponent('&question=' + encodeURIComponent(val)); 
		}
		var url = "http://exodus.1688.com/member/sso/sso.do?to_url=" + searchUrl + "&unlogin_url=" + searchUrl;
		//console.log(url);
		window.open(url, "newwindow");
		//http://exodus.1688.com/member/sso/sso.do?to_url=http%3A%2F%2Fportal.manjushri.alibaba.com%2Fportal%2Fportal%2Finit.jspa%3FinstanceCode%3DALIR00000161%26scenceCode%3DSCEN00005068%26digest%3D01e842c6763415469dc270af5ab8fb60%26question%3D%E8%AF%9A%E4%BF%A1&unlogin_url=http%3A%2F%2Fportal.manjushri.alibaba.com%2Fportal%2Fportal%2Finit.jspa%3FinstanceCode%3DALIR00000161%26scenceCode%3DSCEN00005068%26digest%3D01e842c6763415469dc270af5ab8fb60%26question%3D%E8%AF%9A%E4%BF%A1
		log(4);	
		return false;
	};	
	
	/**
	 * 加载数据
	 */
	var loadData = function(url, type, callback){
		$.ajax({
	          url: url,
	          dataType: "script",
	          scriptCharset: "gbk",       
	          success: function() {	  	        	  
	        	  var result = (type == "config") ? window["_fsh_config_result_"] : window["_fsh_help_data_result_"];
	        	 try{
	        	 	callback(result);
	        	 } catch(e){
	        	 	destroyHelp();
	        	 }
	        	 
	          }
	        });
	};
	
	/**
	 * 构造帮助文档的前端模板
	 * @param: data
	 */
	var processHelpData = function(data){
//		data=[{
//			question: '有吗',
//			answer: '<p><span style="color:red">没</span>有</p>'
//		},{
//			question: '还有吗',
//			answer: '仍没有'
//		}];

		$.ajax({
	          url: "http://style.c.aliimg.com/sys/js/side/full-site-help/jquery.tinyscrollbar.min.js",
	          dataType: "script",
	          success: function(){
	        	  $.use('web-sweet', function(){
					var helpTpl = '<% for ( var i = 0; i < $data.length; i++ ) { %>' +
					'<dl><dt class="FSH-question<% if(i == 0){ %> FSH-question-first<% } %> FSH-accordion-head fd-clr" qid="<%= $data[i].questionId %>"><span class="arrow arrow-right"></span><a href="javascript:;"><%= $data[i].question %></a></dt>' +
					'<dd class="FSH-answer FSH-accordion-body"><div class="FSH-answer-triangle"></div><div class="FSH-answer-content"><%= $data[i].answer %></div></dd>' + 
		            '</dl>' +
					'<% } %>';
					 //var template = '<div><%= $data.content.count %></div>';
					 var html = FE.util.sweet(helpTpl).applyData(data);
					 $('#FSH-content').html(html);
					 initInfoAcordionList();
					 	//设置标志位
						hasHelpInited = true;
				});
	          }
          });
		
	};
	
	/**
	 * 获取配置文件
	 */
	var loadConfig = function(){
		var configUrl = "http://view.1688.com/cms/services/fullsitehelp/config.html";
		loadData(configUrl,"config", processConfig);
	};
	
	/**
	 * 处理配置文件
	 */
	var processConfig = function(data){
		//to find the config by the location.href
		var i = 0, l = data.length;
		var url = location.href, config = null;
		for(; i<l; i++){
			if(url.indexOf(data[i].pageUrl) != -1){
				config = data[i];
				break;
			}
		}
		//for test, just delete the line when released
		//config = data[0];
		if(config){
			$.extend(options, config);
			initHelp();
		}
	};
	/**
	 * 渲染帮助的内容
	 */
    var initInfoAcordionList = function(){
    	var scroll=$('#FSH-body').tinyscrollbar();
        var scrollUpdate=function(){
            scroll.tinyscrollbar_update();
        };
        var accordingHeader=$(".FSH-accordion-head");
        accordingHeader.click(function(e){
            //accordion
            e.preventDefault();
            if (!$(this).hasClass("active") ){
            	var me = $(this);
            	var qid = $(this).attr("qid"); //问题的id
            	log(3, qid);
                $(".FSH-accordion-body").slideUp('normal');                
                accordingHeader.removeClass('active');
                accordingHeader.find(".arrow").removeClass("arrow-down").addClass("arrow-right");
                $(this).addClass('active');
                $(this).find(".arrow").removeClass("arrow-right").addClass("arrow-down");
                $(this).next().stop(true,true).slideToggle('normal', scrollUpdate);
            }else{
                $(this).next().slideToggle('normal', scrollUpdate);
                $(this).removeClass('active');
                $(this).find(".arrow").removeClass("arrow-down").addClass("arrow-right");
            }
        }); 

        //question hover
        $(".FSH-question").on('mouseenter', function(){
    		$(this).addClass("FSH-question-hover");
    	}).on('mouseleave', function(){
    		$(this).removeClass("FSH-question-hover");
    	});
    };
   
    var log = function(logType, ext){
    	var par = logParams[0] + logParams[logType] + "_" + options.sceneId;
    	if(ext){
    		par += "_" + ext;
    	}
    	if(typeof dmtrack != 'undefined'){
    		dmtrack && dmtrack.clickstat("http://stat.1688.com/tracelog/click.html",par);    		
    	}	  
    };

    var destroyHelp = function(){
    	$("#" + helpId) && $("#" + helpId).remove();
    	dialogInst && dialogInst.remove();
    	autocompleteInst && autocompleteInst.remove();
    };
	/**
	 * 组件的初始化
	 */
    NS.init = function(userOptions){			
		loadConfig();	//获取配置		
	};		
    try{
    	NS.init();	
    }catch(e){
		destroyHelp();
    }		
    
})(jQuery, FSH);