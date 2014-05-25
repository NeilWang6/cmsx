;(function($,d){
	var readyFun = [
	  //我的站点与全部站点的tab切换
	  function(){
		   $.use('ui-tabs', function(){
		         $('#tabs').tabs({
		             isAutoPlay: false,
		             event: 'click',
		             titleSelector: '.list-tabs-t li',
		             boxSelector: '.tab-a-box',
		             selected : 1
		         });
		   }); 
	  },
	  
	  function() {
		  	//站点分类选择-无验证，单选
			new FE.tools.MultChoice({
				area : '.site-classify-list',
				type : 'radio',
				ableCancel : false,
				valueInput : '.site-classify-list .classify-ids',
				choice : function(val, itemEl, inputEl) {//选中后的回调函数,返回参数：当前操作的值、当前操作的元素，存放value的输入框，所有选项元素集
					$.ajax({ //站点分类点击事件
		                  type: "post",
		                  dataType: "html",
		                  url: "site_list_new.html",
		                  data: {'catid': val },
		                  complete: function(){
		                  },
		                  success: function(data){
		                	  //返回子站列表,重新渲染子站列表的那部分页面
		                	  var newList=$(data).find(".search-list");
		                	  //cataId=0表示全部站点，此时站点管理员和站点类型都不需要额外查，后台都已给出；
		                	  //但当点击的是具体的站点分类(cataId!=0)，站点管理员不需要额外查(查询接口为/admin/query_user_info.html?siteManagerID=liuxinl.lx);
		                	  //站点类型需要获取当前选中的站点分类
		                	  if(val!=0){
		                		  var siteType=itemEl.find('.catalog-name').text();
		                		  newList.find('.site-type').text(siteType);
		                	  }
		                	  $(".site-list").find("ul").remove();
		                	  $(".site-list").html(newList);
		                  },
		                  error:function(textStatus){
		                  }
		            });
				}
			});
			
	  },
	  
	  //申请站点角色权限
      function(){
		  $(".site-list").on("click",".apply-roles",function(){
          	var siteId 	= $(this).parent().parent().find('.site-id').val(),
	        	siteName = $(this).parent().parent().find('.site-name').text(),
	        	siteType = $(this).parent().parent().find('.site-type').text(),
	        	grantRoles = $(this).parent().parent().find('.grant-roles').text(),
				applyingRoles = $(this).parent().parent().find('.applying-roles').text();
			$("#siteId").val(siteId);
			$("#applyUser").text($("#userName").val());//当前登录用户，也即申请人
			$("#siteName").text(siteName);
			$("#siteType").text(siteType);//
			$("#grantRoles").text(grantRoles);
			$("#applyingRoles").text(applyingRoles);
			//查询可申请的角色
			$.ajax({ 
                type: "post",
                url: "/admin/can_apply_roles.html",
                data: {'siteId': siteId },
                dataType: "json",
                complete: function(){
                },
                success: function(data){
					//渲染弹出框上的"可申请角色"
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
												<span class="validator-tip">错误提示</span>\
											</span>';
							var strHtml = FE.util.sweet(rolesModule).applyData(data.val);
							$("#roles").html(strHtml);
							
							//可申请角色选择-验证必选，多选
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
       
       //申请站点角色弹出框中的提交按钮事件
       function(){
           $(".dialog-apply-roles").on("click",".btn-ok",function(){
        	   var tip = $("#roleIds").next('.validator-tip');
        	   if($("#roleIds").val()==''){
        		  tip.text("请至少选择一个角色");
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
	                		alert("申请成功，请等待");
	                		$(".dialog-apply-roles").dialog('close');
	              		  	//返回到当前页，但是需要获取最新的站点角色数据，以及保留已被选中的站点分类，因而站点分类不动，重新请求下面的sitelistnew，异步更新子站列表信息
	              		  	var catId = $(".classify-ids").val();
		              		$.ajax({
				                  type: "post",
				                  dataType: "html",
				                  url: "site_list_new.html",
				                  data: {'catid': catId},
				                  complete: function(){
				                  },
				                  success: function(data){
				                	  var newList=$(data).find(".search-list");
				                	  if(catId!=0){
				                		  var siteType=$('.item-choice.current').find('.catalog-name').text();
				                		  newList.find('.site-type').text(siteType);
				                	  }
				                	  $(".site-list").find("ul").remove();
				                	  $(".site-list").html(newList);
				                  },
				                  error:function(textStatus){
				                  }
				            });
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