//JavaScript Document
//**copyright by exodus.1688.com
//author:Lenny
//**��������Ŀ����
//2011-08-10
var Manage_Junk_Category=function(){
	
		this.InitialHtml=function(htmlid){
		var thehtml='<div  id="bmc" class="dialog-basic">\
					<div class="dialog-b">\
					<header><a href="#" class="close">�ر�</a><h5></h5></header>\
					<section>\
						<div class="bmc"  >\
							<input type="hidden" name="bmc-submitURL" id="bmc-submitURL">\
							<div class="bmc-row">\
								<label for="url">URL����</label>\
								<input type=text name="url" readonly="true" id="bmc-url" >\
					    		</div>\
						    	<div class="bmc-row">\
									<label for="cateName">��Ŀ����</label>\
									<input type=text readonly="true" id="bmc-cateName" name="ank-categoryName">\
									<input type=hidden  id="bmc-categoryId" name="ank-categoryId"/>\
									<input type=hidden name="pageid" id="bmc-pageid"/>\
									<input type=hidden name="ids" id="bmc-ids"/>\
									<span class="choose-category">����</span>\
						    	</div>\
						    	<div class="bmc-row">\
						    		<label for="searchKeywords">�����ؼ��֣�</label>\
						    		<input type="text" id="bmc-searchKeyword" name="searchKeyword"/>\
						    	</div>\
						    	<div class="bmc-row">\
						    		<label for="showKeywords">չʾ�ؼ��֣�</label>\
						    		<input type="text" id="bmc-showKeyword" name="showKeyword"/>\
						    	</div>\
					 	</div>\
					</section>\
					<footer class="bmc-row nm-text-center">\
					        		<input type="button" class="btn-basic btn-blue"  id="bmc-form-button-bp" value="���沢Ԥ��"/>\
					        		<input type="button" class="btn-basic btn-blue close mg-20"  id="bmc-form-button-close" value="�ر�"/>\
		                		</footer>\
		            		</div>\
		            	</div>\
		            	<div  id="bp" class="dialog-basic">\
		            		<div class="dialog-b">\
					<header><a href="#" class="close">�ر�</a><h5></h5></header>\
					<section>\
				            		<div class="bp" >\
							<table class="table-sub" cellspacing="0">\
								<thead>\
									<tr>\
										<th>PageId</th>\
										<th>ҳ������</th>\
										<th>Ԥ��</th>\
									</tr>\
								</thead>\
								<tbody>\
								</tbody>\
							</table>\
						</div>\
					</section>\
				</div>\
			</div>';

  		if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}
  		
	};
	//����url
	this.generateUrl = function(){
			var url = ""
			if(jQuery("#bmc-categoryId").val()!=null&&jQuery("#bmc-categoryId").val()!=""){
				url += "c-"+jQuery("#bmc-categoryId").val()+"&";
			}
			if(jQuery("#bmc-searchKeyword").val()!=null&&jQuery("#bmc-searchKeyword").val()!=""){
				url += "k-"+jQuery("#bmc-searchKeyword").val()+"&";
			}
			url = url.substring(0,(url.length-1));
			jQuery("#bmc-url").val(url);
	}
	//���¼�ֻ�����һ��
	this.BindEvent=function(){
		  var self = this;
		  var bmc_dialog,bp_dialog,cc_dialog;
          jQuery('.mjc-table tr:odd').addClass("odd");
          jQuery('.mjc-table tr').bind("click",function(){
          		jQuery(this).find('input[type=checkbox]').attr('checked',(jQuery(this).find('input[type=checkbox]').attr('checked')=='checked')?false:true);
          })
          jQuery(':checkbox').bind("click",function(event){
			  event.stopPropagation();
          })
          jQuery('#mjc-form-button-bmc').live('click',function(){  
	if(jQuery(".mjc-table :checked").length==0){
		//alert("����ûѡ����Ŀ");
		alertInfo({type:"info",content:"����ûѡ����Ŀ��"},function(){});
		return;
	}  
	var ids= jQuery(".mjc-table :checked:first").parent().find("input[name='ids']").val();
	var pageid = jQuery(".mjc-table :checked:first").parent().find("input[name='ids']").val();
	var categoryId = jQuery(".mjc-table :checked:first").parent().find("input[name='categoryId']").val();
	var previewURL= jQuery(".mjc-table :checked:first").parent().find("input[name='previewURL']").val();
	var cateFullName= jQuery(".mjc-table :checked:first").parent().find("input[name='fullCategoryName']").val();
	var cateName= jQuery(".mjc-table :checked:first").parent().parent().find("td[name='cateName']").text();
	var searchKeyword= jQuery(".mjc-table :checked:first").parent().parent().find("td[name='searchKeyword']").text();
	var showKeyword= jQuery(".mjc-table :checked:first").parent().parent().find("td[name='showKeyword']").text();
	var url= jQuery(".mjc-table :checked:first").parent().parent().find("td[name='url']").text();
	var flag=true;
	jQuery(".mjc-table :checked:gt(0)").each(function(){
		if(jQuery(this).parent().find("input[name='categoryId']").val()!=categoryId){
			//alert("��ĿID��ͬ��������ѡ��");
			alertInfo({type:"info",content:"��ĿID��ͬ��������ѡ��"},function(){});
			flag=false;
			return false;
		}
		if(jQuery(this).parent().parent().find("td[name='searchKeyword']").text()!=searchKeyword){
			//alert("�����ؼ��ֲ�ͬ��������ѡ��");
			alertInfo({type:"info",content:"�����ؼ��ֲ�ͬ��������ѡ��"},function(){});
			flag=false;
			return false;
		}
		if(jQuery(this).parent().parent().find("td[name='showKeyword']").text()!=showKeyword){
			//alert("չʾ�ؼ��ֲ�ͬ��������ѡ��");
			alertInfo({type:"info",content:"չʾ�ؼ��ֲ�ͬ��������ѡ��"},function(){});
			flag=false;
			return false;
		}
		ids += ","+jQuery(this).parent().find("input[name='ids']").val();
		
	})
	if(flag){
		
		jQuery("#bmc-url").attr("value",url);
		jQuery("#bmc-cateName").attr("value",cateFullName);
		jQuery("#bmc-searchKeyword").attr("value",searchKeyword);
		jQuery("#bmc-showKeyword").attr("value",showKeyword);
		jQuery("#bmc-categoryId").attr("value",categoryId);
		jQuery("#bmc-pageid").attr("value",pageid);
		jQuery("#bmc-ids").attr("value",ids);

		// if(bmc_dialog){
		// 	bmc_dialog.show();
		// }else{
		// 	bmc_dialog= new Boxy("#bmc", {
		// 	//modal: true, //ģʽ�Ի����ǲ����϶��ġ�
		// 	//clone: true,
		// 	//draggable:true,
		// 	title:"�����޸�URL����",//��ü��ϱ���Ϳ�����
		// 	beforeUnload: function() {
			 
		// 	},
		// 	unloadOnHide: false
		// 	});
		// }
		jQuery.use('ui-dialog',function(){
			 jQuery('#bmc').dialog({
				modal: true,
				shim: true,
				draggable: true,
				center: true,
				fixed:true,
				open: function(){ 
					jQuery('#bmc').find('h5').html('�����޸�URL����');
				},
				close: function(){
				}
			});
		});

	}else{
		return;
	}
				
          })
		jQuery("#bmc-url").change(function(){
			//var self=this;
			self.generateUrl();
		});
       jQuery('#bmc-form-button-bp').click(function(){    
       				//�ύ��
       				jQuery.ajax({
						type:"post",
						url:jQuery("#bmc-submitURL").val(),
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:"json",
						data:{"url":encodeURIComponent(jQuery("#bmc-url").val()),"categoryId":jQuery("#bmc-categoryId").val(),"searchKeyword":encodeURIComponent(jQuery("#bmc-searchKeyword").val()),"showKeyword":encodeURIComponent(jQuery("#bmc-showKeyword").val()),"ids":jQuery("#bmc-ids").val(),"charset":"UTF-8"},
						cache:false,
						success:function(data,textStatus){
							if(data.result=="Ok"){
								alertInfo({type:"info",content:"��ӳɹ���"},function(){});
								//alert("��ӳɹ���");
								//bmc_dialog.hide();
								// if(bp_dialog){
								// 	bp_dialog.show();
								// }else{
								// 	bp_dialog= new Boxy("#bp", {
								// 	//modal: true, //ģʽ�Ի����ǲ����϶��ġ�
								// 	//clone: true,
								// 	//draggable:true,
								// 	title:"����Ԥ��",
								// 	afterHide: function() {
								// 		jQuery("#keywordQueryManagerForm").submit();
								// 	},
								// 	afterShow:function(){
								// 		var checkedList = "" ;
								// 		jQuery(".mjc-table :checked").each(function(){
								// 			checkedList += "<tr><td>"+jQuery(this).parent().find("input[name='pageid']").val()+"</td>"+
								// 							"<td>"+ jQuery(this).parent().parent().find("td[name='pageName']").text() +"</td>"+
								// 							"<td><a target='_blank' href=\""+jQuery(this).parent().find("input[name='previewURL']").val()+"\">Ԥ��</a></td></tr>"
								// 		});
								// 		jQuery(".bp-table").find("tbody").html(checkedList);
								// 	},
								// 	unloadOnHide: false
								// 	});
							 //    }
								jQuery.use('ui-dialog',function(){
									 jQuery('#bp').dialog({
										modal: true,
										shim: true,
										draggable: true,
										center: true,
										open: function(){ 
											var checkedList = "" ;
											jQuery('#bp').find('h5').html('����Ԥ��');
											jQuery(".mjc-table :checked").each(function(){
											checkedList += "<tr><td>"+jQuery(this).parent().find("input[name='pageid']").val()+"</td>"+
													"<td>"+ jQuery(this).parent().parent().find("td[name='pageName']").text() +"</td>"+
													"<td><a target='_blank' href=\""+jQuery(this).parent().find("input[name='previewURL']").val()+"\">Ԥ��</a></td></tr>"
											});
											jQuery(".table-sub").find("tbody").html(checkedList);
										},
										close: function(){
										}
									});

									// jQuery("#bmc-form-button-add").click(function(){
									//         jQuery("#keywordQueryManagerForm").submit();
									// });       

									  // afterHide: function() {
								// 		jQuery("#keywordQueryManagerForm").submit();
								// 	},
								// 	afterShow:function(){
								// 		var checkedList = "" ;
								// 		jQuery(".mjc-table :checked").each(function(){
								// 			checkedList += "<tr><td>"+jQuery(this).parent().find("input[name='pageid']").val()+"</td>"+
								// 							"<td>"+ jQuery(this).parent().parent().find("td[name='pageName']").text() +"</td>"+
								// 							"<td><a target='_blank' href=\""+jQuery(this).parent().find("input[name='previewURL']").val()+"\">Ԥ��</a></td></tr>"
								// 		});
								// 		jQuery(".bp-table").find("tbody").html(checkedList);
								// 	},               
									
								});
							}else{
								//alert(data.result);
								alertInfo({type:"error",content:data.result},function(){});
							}
							
						},
						error:function(){ 
							//alert("���ʧ��");
							alertInfo({type:"info",content:"���ʧ�ܣ�"},function(){});

						}
					});
					
          });
    //   	jQuery('#bmc-form-button-close').click(function(){ 
				// //bmc_dialog.hide();
    //       });	
          jQuery("#bmc-searchKeyword").keyup(function(){
          	self.generateUrl();
          });
          jQuery("#bmc-categoryId").bind("propertychange",function(){
          	self.generateUrl();
          });
	};
	
	
};