var categoryJson=null;
function get_cms_url(){
	return jQuery("#cms_url").val();
}
function get_elf_url(){
	return jQuery("#elf_url").val();
}


//���a
function alertInfo(data,callback){
    jQuery.use('web-sweet',function(){
        //��ƴ��HTML
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

	var cw_dialog,pageid,pageName,thisid;	//һ��Ҫ�о�����������
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
                                             $('#cw').find('h5').html("<b>"+pageName+"</b>-----����ҳ�����ù���")
                                             //cw_dialog.setTitle("<b>"+pageName+"</b>-----����ҳ�����ù���");//���ñ���
                                             //���õ�����
                                             var citem1=new Citem(thisid);
                                             citem1.findCitemById();
                                             citem1.chooseItem();
                                             jQuery("#pageId").val(pageid);
                                         },
                                     complete:function(){},
                                     error:function(){
                                            // alert("ϵͳ����������");
                                            alertInfo({type:"error",content:"ϵͳ���������ԣ�"},function(){});
                                    }
                                    }); 
                                },
                                beforeClose: function(){
                                    //this.removeOtherNull();
                                    if(jQuery("#isurlchanged").val()=="true"){//������޸�
                                        jQuery('#keywordQueryManagerForm').submit(); //ˢ�µ�ǰҳ��
                                    }
                                },
                                close: function(){
                                }
                        });

                    });
              });

	var citem1=new Citem();
	citem1.InitialHtml(); //��ʼ��html����
	citem1.BindEvent(); //�����ý�����¼�	
	
	var keyword1=new Keyword();
	keyword1.InitailHtml(); //��ʼ��html����
	keyword1.BindEvent();	//����ӹؼ��ʵ��¼�

	var add_category1=new Add_Category();
	add_category1.InitialHtml();	///��ʼ��html����
	add_category1.BindEvent();	//��ѡ����Ŀ���¼�
		
	  var mjc1=new Manage_Junk_Category();
	  mjc1.InitialHtml();	//��ʼ��html����
	  mjc1.BindEvent();	//������Ŀ������¼�
	  
	var choose_category1=new Choose_Category();
	choose_category1.InitialHtml();	//��ʼ��html����
	choose_category1.BindEvent();	//�����ӵ���ҳ���¼�
			
});