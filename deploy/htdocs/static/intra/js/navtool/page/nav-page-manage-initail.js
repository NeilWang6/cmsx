function get_cms_url(){
	return jQuery("#cms_url").val();
}
function get_elf_url(){
	return jQuery("#elf_url").val();
}
//添加a
function alertInfo(data,callback){
    jQuery.use('web-sweet',function(){
        //先拼接HTML
        var template = '<% switch($data.type) {\
                            case "success":%>\
                                <i class="tui-icon-36 icon-success"></i>\
                                <div class="msg"><%= $data.content %></div>\
                                <%break;\
                            case "info":%>\
                                <i class="tui-icon-36 icon-message"></i>\
                                <div class="msg"><%= $data.content%></div>\
                                <%break;\
                            case "error":%>\
                                <i class="tui-icon-36 icon-fail"></i>\
                                <div class="msg"><%= $data.content%></div>\
                                <%break;\
                        } %>';
        var html = FE.util.sweet(template).applyData(data);
        jQuery('#small').find('section').html(html);
    })
    jQuery.use('ui-dialog',function(){
        jQuery('#small').dialog({
            fadeIn: 500,
            fadeOut: 500,
            timeout: 1000,
            center: true,
            close: function(){
                callback();
            }
        })
    })
}

var categoryJson=null;
jQuery(function($) {
                $(document).on('click','.close,#cw-form-button-check',function(){
                    $(this).parents('.dialog-basic').dialog('close');
                });
				var cw_dialog,pageid,pageName,global = {};
    			jQuery('.mp-config').live("click",function() {
    				pageid=jQuery(this).attr("pageid");
    				pageName=jQuery(this).parent("td").siblings (".mp-name").text();
                    jQuery.use('ui-dialog',function(){
                        $('#cw').dialog({
                            modal: true,
                            shim: true,
                            draggable: true,
                            center: true,
                            open: function(){                            
                                 var self=this;
                                 //self.moveToY(30);
                                 jQuery.ajax({
                                     type:"get",
                                     url:get_elf_url()+"/tools/get_preview_nav.do?pageId="+pageid,
                                     dataType:"jsonp",
                                     cache:false,  
                                     beforeSend:function(){},
                                     success:function(jsonp){
                                            
                                             categoryJson=jsonp.areas;
                                             $('#cw').find('h5').html("<b>"+pageName+"</b>-----导航页面配置管理")
                                             //self.setTitle("<b>"+pageName+"</b>-----导航页面配置管理");//t设置标题
                                             //设置导航区
                                             citem1=new Citem();
                                             citem1.Initial();
                                             jQuery("#pageId").val(pageid);
                                                
                                         },
                                     complete:function(){},
                                     error:function(){
                                        alertInfo({type:"info",content:"系统错误请重试"},function(){})
                                    }
                                 }); 
                            },
                            beforeClose: function(){
                                 var cid=jQuery(".cw-item-selected").attr("cid");
                                 citem1=new Citem(cid);
                                 citem1.findCitemById();
                                 global.ischanged = (global.ischanged === 1 ? false : citem1.isChanged());
                                 if(global.ischanged){
                                        jQuery('#enterButton').find('section').html('确认不保存修改内容么?');
                                        jQuery('#enterButton').dialog({
                                            modal: true,
                                            shim: true,
                                            draggable: true,
                                            center: true,
                                            open: function(){
                                                jQuery('.btn-cancel').click(function(){
                                                    jQuery('#enterButton').find('.close').click();
                                                    return false
                                                })

                                                jQuery('#makeSureOut').click(function(){
                                                    global.ischanged = 1;
                                                    jQuery('#enterButton').find('.close').click();
                                                    jQuery('#cw').find('.close').click();
                                                })
                                            },
                                            close: function(){
                                                jQuery('#enterButton').find('.btn-cancel').unbind('click');
                                                jQuery('#makeSureOut').unbind('click');
                                            }
                                        })
                                        return false;
                                 }  
                            },
                            close: function(){
                              jQuery(".boxy-wrapper").not(jQuery(".boxy-wrapper:has(.boxy-content)")).remove();
                              citem1=null;
                              categoryJson=null;
                              pageid=null;
                              pageName=null;
                            }
                        })

                    })
    		// 		if(cw_dialog){
    		// 			cw_dialog.show();
						// cw_dialog.moveToY(30);
    		// 		}
    		// 		else{
    		// 			cw_dialog= new Boxy("#cw", {
    		// 			modal: true, //模式对话框是不能拖动的。
    		// 			center:false,
						
    		// 			title:"导航页面配置管理",//最好加上标题就可以了
    		// 			afterShow:function(){
						// 	var self=this;
    		// 				self.moveToY(30);
    		// 				jQuery.ajax({
    		// 					type:"get",
    		// 					url:get_elf_url()+"/tools/get_preview_nav.do?pageId="+pageid,
    		// 					dataType:"jsonp",
    		// 					cache:false,  
    		// 					beforeSend:function(){},
    		// 					success:function(jsonp){
    		// 							categoryJson=jsonp.areas;
    		// 							self.setTitle("<b>"+pageName+"</b>-----导航页面配置管理");//设置标题
    		// 							//设置导航区
    		// 							citem1=new Citem();
    		// 							citem1.Initial();
    		// 							jQuery("#pageId").val(pageid);
    									
    		// 						},
    		// 					complete:function(){},
    		// 					error:function(){alert("系统错误请重试");}
    		// 				});	
    						
    		// 			},
    		// 		   afterHide:function(){
    		// 					 this.removeOtherNull();
						// 		 citem1=null;
						// 		 categoryJson=null;
						// 		 pageid=null;
						// 		 pageName=null;
						// 		// alert(citem1.InitialHtml())
    		// 			},
						// beforeHide:function(){
						// 	var cid=jQuery(".cw-item-selected").attr("cid");
						// 	citem1=new Citem(cid);
						// 	citem1.findCitemById();
						// 	var ischanged=citem1.isChanged();
						// 	if(ischanged)
						// 		return(confirm("确认不保存修改内容么？"));
						// },
    		// 			unloadOnHide: false
    		// 		  });
    				
    		// 		  return false;
    		// 		}
					
              });
            
			var citem1=new Citem();	
			citem1.InitialHtml(); //初始化html代码
			citem1.BindEvent();		//绑定配置界面的事件
			citem1=null;
			
			var keyword1=new Keyword();
			keyword1.InitailHtml(); //初始化html代码
			keyword1.BindEvent();	//绑定添加关键词的事件
			
		 	var add_category1=new Add_Category();
			add_category1.InitialHtml();	///初始化html代码
			add_category1.BindEvent();	//绑定选择类目的事件

			var choose_category1=new Choose_Category();
			choose_category1.InitialHtml();	//初始化html代码
			choose_category1.BindEvent();	//绑定修改导航页的事件
            
			var add_page1=new Add_Page();
			add_page1.InitialHtml();	//初始化html代码
			add_page1.BindEvent();	//绑定增加导航页的事件
            /*update zhuliqi*/
            var goPgeEvent = function() {
                var goToPageButton = $('a.js-jump-page-num,#jumpPageButton');
                goToPageButton.click(function(e){
                    if(this.id == "jumpPageButton"){
                        var int_page_number = $('#jumpPageInput').val()

                    }else{

                        var int_page_number = $(this).attr('data-page');
                    }
                     var page_num,sumPage = parseInt($('#sumPage').text()),reg = /^[1-9]\d*$/;
                     page_num = $.trim(int_page_number.toString());
                     
                     if(page_num.match(reg) === null || parseInt(page_num) > sumPage) {
                        alertInfo({type:"info",content:"请输入正整数：（1到"+ sumPage +"）"},function(){})
                        return
                     }
                     $('#pageNum').val(page_num);
                     $('#navPageForm').submit();
                })                            
            }

            goPgeEvent();
    //分页
    var data = {
        curPage: $('input#curpage').val(),
        page: $('input#page').val(),//几页
        titlelist: $('input#titlelist').val(),//多少条
        leftContent: '<input id="mp-form-button-add" class="btn-basic btn-blue" type="button" value="增加">',
        rightContent: '',
        limit: 3,
        width: '990px',
        left: '215px',
        curPageInput: $('input#curpage'),
        form: $('#pagefrmbottom'),
        param: $('#pagefrmbottom input[name=page_num]'),
        noneShow: true
    }
    
    var pagelistall = new FE.tools.pagelistall(data);
    pagelistall.init(data);
    /*end zhuliqi*/

});