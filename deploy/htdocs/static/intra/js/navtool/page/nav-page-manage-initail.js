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
                                             $('#cw').find('h5').html("<b>"+pageName+"</b>-----����ҳ�����ù���")
                                             //self.setTitle("<b>"+pageName+"</b>-----����ҳ�����ù���");//t���ñ���
                                             //���õ�����
                                             citem1=new Citem();
                                             citem1.Initial();
                                             jQuery("#pageId").val(pageid);
                                                
                                         },
                                     complete:function(){},
                                     error:function(){
                                        alertInfo({type:"info",content:"ϵͳ����������"},function(){})
                                    }
                                 }); 
                            },
                            beforeClose: function(){
                                 var cid=jQuery(".cw-item-selected").attr("cid");
                                 citem1=new Citem(cid);
                                 citem1.findCitemById();
                                 global.ischanged = (global.ischanged === 1 ? false : citem1.isChanged());
                                 if(global.ischanged){
                                        jQuery('#enterButton').find('section').html('ȷ�ϲ������޸�����ô?');
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
    		// 			modal: true, //ģʽ�Ի����ǲ����϶��ġ�
    		// 			center:false,
						
    		// 			title:"����ҳ�����ù���",//��ü��ϱ���Ϳ�����
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
    		// 							self.setTitle("<b>"+pageName+"</b>-----����ҳ�����ù���");//���ñ���
    		// 							//���õ�����
    		// 							citem1=new Citem();
    		// 							citem1.Initial();
    		// 							jQuery("#pageId").val(pageid);
    									
    		// 						},
    		// 					complete:function(){},
    		// 					error:function(){alert("ϵͳ����������");}
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
						// 		return(confirm("ȷ�ϲ������޸�����ô��"));
						// },
    		// 			unloadOnHide: false
    		// 		  });
    				
    		// 		  return false;
    		// 		}
					
              });
            
			var citem1=new Citem();	
			citem1.InitialHtml(); //��ʼ��html����
			citem1.BindEvent();		//�����ý�����¼�
			citem1=null;
			
			var keyword1=new Keyword();
			keyword1.InitailHtml(); //��ʼ��html����
			keyword1.BindEvent();	//����ӹؼ��ʵ��¼�
			
		 	var add_category1=new Add_Category();
			add_category1.InitialHtml();	///��ʼ��html����
			add_category1.BindEvent();	//��ѡ����Ŀ���¼�

			var choose_category1=new Choose_Category();
			choose_category1.InitialHtml();	//��ʼ��html����
			choose_category1.BindEvent();	//���޸ĵ���ҳ���¼�
            
			var add_page1=new Add_Page();
			add_page1.InitialHtml();	//��ʼ��html����
			add_page1.BindEvent();	//�����ӵ���ҳ���¼�
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
                        alertInfo({type:"info",content:"����������������1��"+ sumPage +"��"},function(){})
                        return
                     }
                     $('#pageNum').val(page_num);
                     $('#navPageForm').submit();
                })                            
            }

            goPgeEvent();
    //��ҳ
    var data = {
        curPage: $('input#curpage').val(),
        page: $('input#page').val(),//��ҳ
        titlelist: $('input#titlelist').val(),//������
        leftContent: '<input id="mp-form-button-add" class="btn-basic btn-blue" type="button" value="����">',
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