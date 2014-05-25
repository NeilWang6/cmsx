var categoryJson=null;
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
        });
    });
}




jQuery(function($) {

            $(document).on('click','.close,#cw-form-button-check',function(){
                $(this).parents('.dialog-basic').dialog('close');
            });

            $(document).on('click','.close,#cw-form-button-check',function(){
                $(this).parents('.dialog-basic').dialog('close');
            });

	var cw_dialog,pageid,pageName,thisid;	//一定要研究作用域问题
    	jQuery('.mjc-config').live("click",function() {
    				
		pageid=jQuery(this).attr("pageId");
		pageName=jQuery(this).parent("td").siblings (".mjc-name").text();
		thisid=jQuery(this).attr("cid");

                        jQuery.use('ui-dialog',function(){
                            $('#cw').dialog({
                                modal: true,
                                shim: true,
                                draggable: true,
                                fixed:true,
                                center: true,
                                open: function(){                            
                                    jQuery.ajax({
                                     type:"get",
                                     url:get_elf_url()+"/tools/get_preview_nav.do?pageId="+pageid,
                                     dataType:"jsonp",
                                     cache:false,  
                                     beforeSend:function(){},
                                     success:function(jsonp){
                                             categoryJson=jsonp.areas;
                                             $('#cw').find('h5').html("<b>"+pageName+"</b>-----导航页面配置管理")
                                             //cw_dialog.setTitle("<b>"+pageName+"</b>-----导航页面配置管理");//设置标题
                                             //设置导航区
                                             var citem1=new Citem(thisid);
                                             citem1.findCitemById();
                                             citem1.chooseItem();
                                             jQuery("#pageId").val(pageid);
                                         },
                                     complete:function(){},
                                     error:function(){
                                            // alert("系统错误请重试");
                                            alertInfo({type:"error",content:"系统错误请重试！"},function(){});
                                    }
                                    }); 
                                },
                                beforeClose: function(){
                                    //this.removeOtherNull();
                                    if(jQuery("#isurlchanged").val()=="true"){//如果有修改
                                        jQuery('#keywordQueryManagerForm').submit(); //刷新当前页面
                                    }
                                },
                                close: function(){
                                }
                        });

                    });
              });

	var citem1=new Citem();
	citem1.InitialHtml(); //初始化html代码
	citem1.BindEvent(); //绑定配置界面的事件	
	
	var keyword1=new Keyword();
	keyword1.InitailHtml(); //初始化html代码
	keyword1.BindEvent();	//绑定添加关键词的事件

	var add_category1=new Add_Category();
	add_category1.InitialHtml();	///初始化html代码
	add_category1.BindEvent();	//绑定选择类目的事件
		
	  var mjc1=new Manage_Junk_Category();
	  mjc1.InitialHtml();	//初始化html代码
	  mjc1.BindEvent();	//废弃类目管理的事件
	  
	var choose_category1=new Choose_Category();
	choose_category1.InitialHtml();	//初始化html代码
	choose_category1.BindEvent();	//绑定增加导航页的事件
			
});