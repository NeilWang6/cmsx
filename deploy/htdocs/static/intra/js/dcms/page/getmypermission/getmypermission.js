;(function($,d){
	var readyFun = [
	  //�ҵ�վ����ȫ��վ���tab�л�
	  function(){
		   $.use('ui-tabs', function(){
		         $('#tabs').tabs({
		             isAutoPlay: false,
		             event: 'click',
		             titleSelector: '.list-tabs-t li',
		             boxSelector: '.tab-a-box'
		         });
		   }); 
	  },
	  
	  //����վ���ɫȨ��
      function(){
          $(".site-list").on("click",".apply-roles",function(){
          	var siteId 	= $(this).parent().parent().find('.site-id').val(),
	        	siteName = $(this).parent().parent().find('.site-name').text(),
	        	siteType = $(this).parent().parent().find('.site-type').text(),
	        	grantRoles = $(this).parent().parent().find('.grant-roles').text(),
				applyingRoles = $(this).parent().parent().find('.applying-roles').text();
			$("#siteId").val(siteId);
			$("#applyUser").text($("#userName").val());//��ǰ��¼�û���Ҳ��������
			$("#siteName").text(siteName);
			$("#siteType").text(siteType);//
			$("#grantRoles").text(grantRoles);
			$("#applyingRoles").text(applyingRoles);
			//��ѯ������Ľ�ɫ
			$.ajax({ 
                type: "post",
                url: "/admin/can_apply_roles.html",
                data: {'siteId': siteId },
                dataType: "json",
                complete: function(){
                },
                success: function(data){
					//��Ⱦ�������ϵ�"�������ɫ"
					if(data.msg && data.msg!=''){
						$("#roles").text(data.msg);
					}else{
						$.use('web-sweet', function(){
							var rolesModule='<span class="all-span">\
												<p class="tui-mult-choice apply-roles-padding">\
													<% for(var i=0, l=$data.length; i<l; i++) {  %>\
														<span class="item-choice roles-span" data-val="<%= $data[i].id %>"><%= $data[i].name %></span>\
													<% } %>\
												</p>\
												<input type="hidden" id="roleIds" name="roles" class="role-ids" value="" />\
												<span class="validator-tip">������ʾ</span>\
											</span>';
							var strHtml = FE.util.sweet(rolesModule).applyData(data.val);
							$("#roles").html(strHtml);
							
							//�������ɫѡ��-��֤��ѡ����ѡ
							new FE.tools.MultChoice({
								area : '.all-span',
								ableCancel : true,
								valueInput : '.roles-list .role-ids'
							});
						});
						
					}
					
					$.use('ui-dialog,ui-draggable', function(){
            		   var dialog = $('.dialog-apply-roles').dialog({
                            center: true,
                            fixed:true,
                            modal: true,
                            shim: true,
                            draggable: {
                             	 handle: 'header.apply-roles-draggable-area',
                             	 containment: 'body'
                            }
                        });
       	
                        $('.dialog-apply-roles .btn-cancel, .dialog-apply-roles .close').click(function(){
                            dialog.dialog('close');
                        });
       	         	});

                },
                error:function(textStatus){
                }
            });
	        
          });
       },
       
       //����վ���ɫ�������е��ύ��ť�¼�
       function(){
           $(".dialog-apply-roles").on("click",".btn-ok",function(){
        	   var tip = $("#roleIds").next('.validator-tip');
        	   if($("#roleIds").val()==''){
        		  tip.text("������ѡ��һ����ɫ");
        		  tip.show();
        	  }else{
        		  tip.hide();
	              $.ajax({ 
	                type: "post",
	                dataType: "json",
	                url: "/admin/apply_role_permission.html",
	                data: {
	              	  'siteId':$("#siteId").val(),
	              	  'roles': $("#roleIds").val()
	                },
	                complete: function(){
	                },
	                success: function(data){
	                	if(data.code==0){
	                		alert("����ɹ�����ȴ�");
	                		$(".dialog-apply-roles").dialog('close');
	              		  	//���ص���ǰҳ��������Ҫ��ȡ���µ�վ���ɫ���ݣ��������������get_my_permission���첽������վ�б���Ϣ
	              		  	var status = $("#status").val();
	              		  	if(status=='0'){
			              		$.ajax({
					                  type: "post",
					                  dataType: "html",
					                  url: "/admin/get_my_permission.html",
					                  data: {'status': status},
					                  complete: function(){
					                  },
					                  success: function(data){
					                	  var newList=$(data).find(".site-list ul");
					                	  $(".site-list").find("ul").remove();
					                	  $(".site-list").html(newList);
					                  },
					                  error:function(textStatus){
					                  }
					            });
	              		  	}
	   					}else{
	   						alert(data.msg);
	   						//$(".dialog-apply-roles").dialog('close');
	   					}
	                },
	                error:function(textStatus){
	                }
	              });
        	  }
           });
       }

    ];
	 
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

})(jQuery, FE.dcms);