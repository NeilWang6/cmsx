//JavaScript Document
//**copyright by exodus.1688.com
//author:Lenny
//**���������Ŀ�Ի���
//2011-08-10
var Add_Category=function(){
		this.InitialHtml=function(htmlid){
		var thehtml='<div id="ac" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">�ر�</a><h5></h5></header>\
						<section>\
						<div class="ac form-vertical" >\
                            	<dl class="item-form">\
	                        		<dt for="keywords" class="topic" >������Ŀ����</dt>\
	                        		<dd><input type="text" class="" id="ac-keyword" name="ac-keyword"/>\
                                	<input type="submit" class="btn-basic btn-grey"  id="ac-form-button-search" value="����"/></dd>\
                            	</dl>\
                            	<div class="ac-row">\
									<ul class="ac-result-box"></ul>\
                                </div>\
                            	<div class="ac-row">\
									<ul class="ac-categorybox-list">\
										<li>\
                            				<button class="ac-leftList-button"><</button>\
										</li>\
										<li>\
											<dl>\
												<dt>һ����Ŀ��</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade1-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>������Ŀ��</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade2-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>������Ŀ��</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade3-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>�ļ���Ŀ��</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade4-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>�弶��Ŀ��</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade5-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
                            				<button class="ac-rightList-button">></button>\
										</li>\
									</ul>\
                                </div>\
                            	<div class="ac-row">\
									<input type="hidden" name="ac-pageid" id="ac-pageid"/>\
									<input type="hidden" name="ac-parentid" id="ac-parentid"/>\
									<input type="hidden" name="ac-boxid" id="ac-boxid"/>\
											<dl>\
												<dt>�Ѿ�ѡ�����Ŀ:</dt>\
												<dd><ul class="ac-selected-box"></ul></dd>\
											</dl>\
                            	<div class="ac-row">\
	                                <input type="radio" value="1" checked="checked"  name="urlRule"/><label for="">���ô��г�URL����</label>\
	                                <input type="radio" value="2" name="urlRule"/><label for="">���ù�ҵƷURL����</label>\
									<input type="radio" value="3" name="urlRule"/><label for="">����ԭ����URL����</label>\
	                                <input type="radio" value="0"  name="urlRule"/><label for="">������Ĭ��ֵ</label>\
                                </div>\
								</form>\
							</div>\
							</section>\
							<footer id="cw-block-foot" class="cw-block">\
                                	<input type="button" class="form-button btn-basic btn-blue mr16"  id="ac-form-button-add" value="���"/>\
                                	<input type="button" class="form-button btn-basic btn-blue close"  id="ac-form-button-close" value="�ر�"/>\
		                	</footer>\
		                </div>\
		            </div>';
  		if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}
  		
	};
	//��ȡ���ϲ�ѯ�������¼���Ŀ��json����ִ�лص�����,searchParam����ʽΪkeyword=abc��ֻ�ܰ���һ��������-1Ϊ��ѯ����һ����Ŀ
	this.getCategory=function(searchParam,callbackFunc,grade){
			if(searchParam==-1){
				reqUrl = get_elf_url()+"/tools/get_child_by_category.do";
			}else if(searchParam.indexOf("keyword")!=-1){
				reqUrl = get_elf_url()+"/tools/get_category_by_keyword.do?"+searchParam;
			}else if(searchParam.indexOf("categoryId")!=-1){
				reqUrl = get_elf_url()+"/tools/get_child_by_category.do?"+searchParam;
			}else{
				return;
			}
			jQuery.ajax({
						type:"get",
						url:reqUrl,
						dataType:"jsonp",
						success:function(data,textStatus){
								result = data;
								callbackFunc(data,grade);
							},
						error:function(){ 
							alertInfo({type:"error",content:"��ȡ��Ŀʧ�ܣ�"},function(){});
						}
          })
      	  return;
	};
	//ѡ��item����item������ѡ�еĿ���
	this.addSelectedItem = function(cateId,fullName){
		var isaddit=true;
		var thefullnames=jQuery("ul.ac-selected-box span.ac-category-full-name");
		for(var jjj=0,thelth=thefullnames.length;jjj<thelth;jjj++){
			if(thefullnames.eq(jjj).text()==fullName)
				isaddit=false;
		}
		if(isaddit){
			var category="";
			category +="<li name='"+cateId+"'>";
			category +=  "<span class='ac-category-full-name'>"+fullName+"</span>";
			category +="<span class='ac-delete-button'></span></li>";
			jQuery("ul.ac-selected-box").prepend(category);
		}
		
	};
	// ����õ���������Ŀ�����json
	this.dealSearchResult = function(data){
		var myjson=data.categoryList;
		var categoryList="";
		for(var i=0;i<myjson.length;i++){
			categoryList+="<li><input type='checkbox' name='"+myjson[i].id+"' fullName='"+myjson[i].fullName+"'>"+myjson[i].fullName+" </li>";
		};
		jQuery("ul.ac-result-box").html(categoryList);
		//����ѡ�е�Ŀ¼������ʼ����ѡ�е�Ŀ¼
		jQuery("ul.ac-selected-box li").each(function(){
			jQuery("#ac input[name="+jQuery(this).attr("name")+"]").attr("checked","checked");
		})
	};
	// ����õ�����Ŀ�����json
	this.dealCateResult = function(data,grade){			
		var myjson=data.categoryList;
		var categoryList="";
		for(var i=0;i<myjson.length;i++){
			categoryList+="<li><input type=checkbox name='"+myjson[i].id+"' fullName='"+myjson[i].fullName+"'>"+myjson[i].categoryName;
			if(myjson[i].leaf==false){
				categoryList+= " >> ";
			}
			categoryList+= "</li>";
		};
		jQuery("#ac-grade"+grade+"-list").html(categoryList);
		//�����¼���Ŀ¼���
		jQuery("#ac-grade"+(grade+1)+"-list").html("");
		jQuery(".ac-rightList-button").hide();
		//��ʾ4,5��Ŀ¼
		if(grade==4&&categoryList!=""){
			jQuery("ul.ac-categorybox-list").children().eq(1).hide();
			jQuery("ul.ac-categorybox-list").children().eq(4).show();
			jQuery(".ac-leftList-button").show();
		}
		if(grade==5&&categoryList!=""){
			jQuery("ul.ac-categorybox-list").children().eq(2).hide();
			jQuery("ul.ac-categorybox-list").children().eq(5).show();
		}
			//����ѡ�е�Ŀ¼������ʼ����ѡ�е�Ŀ¼
		jQuery("ul.ac-selected-box li").each(function(){
			jQuery("input[name="+jQuery(this).attr("name")+"]").attr("checked","checked");
		})
	};
	//���¼�ֻ�����һ��
	this.BindEvent=function(){
		var self=this;
		var ac_dialog;
		//����ҳ���������Ŀ��ť���¼�
        jQuery('div.cw-add-category').click(function() {
			var navtype=jQuery(this).attr("navtype");
			var boxid=jQuery(this).attr("pid");
			var parentid="0";
			switch(boxid){
				case"cw-categorylist2":
					parentid=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					break;
				case"cw-categorylist3":
					parentid=jQuery("#cw-categorylist2 .cw-item-icon-selected:visible").parent().attr("cid");
					break;
				case"cw-categorylist4":
					//parentid=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					//parentid=jQuery(".cw-item-selected").attr("cid");
					parentid=jQuery(this).data('parentId');
					if( jQuery('.cw-block').find('.cw-item-selected').size() == 0 ){
						parentid = undefined;
					}
					break;
				default:	//Ĭ��Ϊ��һ����
					parentid="0";
					break;
				
			}
			if(parentid==undefined){
				alertInfo({type:"info",content:"�Բ�����ѡ�����Ӧ�ĸ���Ŀ"},function(){});
				return false;
			}
			jQuery("#ac-boxid").val(boxid);
			jQuery("#ac-parentid").val(parentid);

			jQuery.use('ui-dialog',function(){
				jQuery('#ac').dialog({
			        modal: true,
                    shim: true,
                    draggable: true,
                    center: true,
                    open: function(){ 
                    	jQuery('#ac').find('h5').html('�����Ŀ')
                    	self.getCategory(-1,self.dealCateResult,1);
                    },
                    close: function(){
            			 jQuery(".boxy-wrapper").not(jQuery(".boxy-wrapper:has(.boxy-content)")).remove();
						 jQuery(".ac-categorylist-box").html("");
						 jQuery(".ac-selected-box").html("");
						 jQuery(".ac-result-box").html("");
						 jQuery("#ac-keyword").val("");
                    }
				})

			})
			// if(ac_dialog){
			// 	ac_dialog.show();
			// }else{
	  //            	ac_dialog= new Boxy("#ac", {
			// 		modal: true, 
			// 		title:"�����Ŀ",
			// 		afterHide:function(){
			// 			 this.removeOtherNull();
			// 			 jQuery(".ac-categorylist-box").html("");
			// 			 jQuery(".ac-selected-box").html("");
			// 			 jQuery(".ac-result-box").html("");
			// 			 jQuery("#ac-keyword").val("");
						 
						 
			// 		},
	  //              afterShow:function(){			
			// 				self.getCategory(-1,self.dealCateResult,1);
			// 		}
	  //             });
	  //        }
              return false;
          });
		  //һ����Ŀ������¼�
          jQuery('#ac-grade1-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,2);

          }))
		  //������Ŀ������¼�
          jQuery('#ac-grade2-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,3);
          }))
		  //������Ŀ������¼�
          jQuery('#ac-grade3-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,4);

          }))
		  //�ļ���Ŀ������¼�
          jQuery('#ac-grade4-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,5);
          }))
		  //�弶��Ŀ������¼�
          jQuery('#ac-grade5-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
          }));
			//checkbox���¼�
          jQuery('#ac input[type=checkbox]').live("click",(function(e){
         	var thename=jQuery(this).attr("name").trim();
			if(jQuery(this).attr("checked")=="checked"){
				jQuery("#ac input[name='"+thename+"']").attr("checked",true);
         		self.addSelectedItem(thename,jQuery(this).attr("fullName"));
			}else{
				jQuery("#ac input[name='"+thename+"']").attr("checked",false);
				//alert(jQuery("#ac li[name='"+thename+"']").size());
				jQuery("#ac li[name='"+thename+"']").remove();
			}
			e.stopPropagation();
			
           }));
           //������������item���¼�
           jQuery('ul.ac-result-box li').live("click",(function(event){
          		jQuery(this).find('input').attr("checked",jQuery(this).find('input').attr("checked")=="checked"?false:true);
		     	if(jQuery(this).find('input').attr("checked")=="checked"){
					jQuery("#ac input[name="+jQuery(this).find("input").attr("name")+"]").attr("checked",true);
		     		self.addSelectedItem(jQuery(this).find("input").attr("name"),jQuery(this).find("input").attr("fullName"));
				}else{
					jQuery("#ac input[name="+jQuery(this).find("input").attr("name")+"]").attr("checked",false);
					jQuery("ul.ac-selected-box li[name="+jQuery(this).attr("name")+"]").remove();
				}
           }))
           //ѡ�н�����item���¼�
           jQuery('ul.ac-selected-box li').live("hover",(function(){
          		jQuery("ul.ac-selected-box span.ac-delete-button").hide();
          		jQuery(this).find('span.ac-delete-button').show();
           		//���ie6�µ�hover
          		jQuery(this).toggleClass("ac-selected-hover");
           }))
           //���ie6�µ�hover
           jQuery('ul.ac-categorylist-box li').live("hover",(function(){
          		jQuery(this).css("cursor","pointer");
           }))
           jQuery('ul.ac-result-box li').live("hover",(function(){
          		jQuery(this).css("cursor","pointer");
           }))
           //ѡ�п�ɾ����ť���¼�
           jQuery('span.ac-delete-button').live("click",(function(){
				jQuery(this).parent().remove();
				jQuery("#ac input[name="+jQuery(this).parent().attr("name")+"]").attr("checked",false);
           }))
           //������ť���¼�
          jQuery("#ac-form-button-search").click(function(){
				var keyword = jQuery("#ac-keyword") .attr("value");
				if(keyword==""||keyword==null){
					alertInfo({type:"info",content:"������ؼ���"},function(){});
					return;
				}
				self.getCategory("keyword="+keyword,self.dealSearchResult);
          })
          //�رհ�ť���¼�
    //       jQuery("#ac-form-button-close").click(function(){
				// ac_dialog.hide()
    //         	return false;
    //       })
          //��Ӱ�ť���¼�
          jQuery("#ac-form-button-add").live("click",function(){
			var pageId=jQuery("#pageId").val();
			var boxId=jQuery("#ac-boxid").val();
			var parentId=jQuery("#ac-parentid").val();
			var vnavType="A";
			var fulltext="";
			var categoryname="";
			switch(boxId){
				case "cw-categorylist1":
					vnavType="A";
					parentId=0;
					break;
				case "cw-categorylist2":
					vnavType="B";
					parentId=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					break;
				case "cw-categorylist3":
					parentId=jQuery("#cw-categorylist2 .cw-item-icon-selected:visible").parent().attr("cid");
					vnavType="N";
					break;
				case "cw-categorylist4":
					//parentId=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					vnavType="H";
					break;
			}
			var orderIdBase1=jQuery("#"+boxId).find("li").last().attr("orderId");
			var orderIdBase=0;
			if(orderIdBase1==undefined||orderIdBase1==null)
				orderIdBase=0;
			else
				orderIdBase=parseInt(orderIdBase1);
			var searchKeyword=[];
			var showKeyword=[];
			var categoryName=[];
			var fullCategoryName=[];
			var categoryId=[];
			var defaultUrlId=[];
			var navType=[];
			var orderId=[];
			
			var newitemobj=[];
			
			var tempobj={};
			var items=jQuery(".ac-selected-box li");
			if(items.length<1)
				return false;
			for(var i=0;i<items.length;i++){
				tempobj={};
				fulltext=items.eq(i).find(".ac-category-full-name").text();
				categoryname=fulltext.split(">>");
				categoryname=categoryname[categoryname.length-1];
				tempobj.searchKeyword="";
				tempobj.showKeyword="";
				tempobj.showName=categoryname;
				tempobj.fullCategoryName=fulltext;
				tempobj.categoryId=items.eq(i).attr("name");
				tempobj.orderId=i+orderIdBase+1;
				tempobj.treeList=[];
				tempobj.hotList=[];
				tempobj.isHotKey=(boxId=="cw-categorylist4")?true:false;
				tempobj.defaultUrlId=jQuery("input[name='urlRule']:checked").val();
				tempobj.category=true;
				tempobj.parentId=parentId;
				tempobj.navType=vnavType;
				tempobj.colorFlag="N";
				tempobj.hotFlag="N";
				tempobj.newFlag="N";
				tempobj.customUrl="#";
				if(tempobj.categoryName==""){
					alertInfo({type:"info",content:"����д��������Ŀ����"},function(){});
					return false;
				}else{
					searchKeyword.push("");	//���ı���Ҫ�������ֱ��뷽���ſ��Է�ֹ��̨������
					showKeyword.push("");
					fullCategoryName.push(encodeURIComponent(tempobj.fullCategoryName));
					categoryId.push(tempobj.categoryId);
					navType.push(vnavType);
					orderId.push(tempobj.orderId);
					defaultUrlId.push(tempobj.defaultUrlId);
					newitemobj.push(tempobj);
				}
			}
			var existitem=jQuery("#"+boxId+" li"); 
			//����һ���ж��Ƿ����ظ������Ѵ��ڵ�����
			for(var i=0;i<newitemobj.length;i++){
				for(var j=0;j<existitem.length;j++){
					if(existitem.eq(j).text()==newitemobj[i].showName){
						alertInfo({type:"info",content:newitemobj[i].showName+'������Ϣ�����ظ���'},function(){});
						return false;
					}
				}
			}
			
			jQuery.ajax({
					type:"post",
					dataType:"json",
					traditional: true,
					url:get_elf_url()+"/tools/add_nav.do?charset=utf-8",
					data:{"act":"C","dataCount":items.length,"pageId":pageId,"parentId":parentId,"orderId":orderId,"defaultUrlId":defaultUrlId,"searchKeyword":searchKeyword,"showKeyword":showKeyword,"categoryId":categoryId,"fullCategoryName":fullCategoryName,"navType":vnavType},
					cache:false,
					success:function(backdata,textStatus){
							if(backdata.msg){
								alertInfo({type:"info",content:backdata.msg},function(){});
								return false;
							}else{
									if(backdata.ids){
										for(i=0;i<backdata.ids.length;i++){
											newitemobj[i].id=backdata.ids[i];
										}
										var newitem=new Citem("0");
										newitem.addItem("1",boxId,newitemobj);
										jQuery('#ac').find('a.close').click();
										return true;
									}else{
										alertInfo({type:"error",content:"����ʧ�ܣ�"},function(){});
										return false;
									}
							}
					},
					error:function(){ 
						alertInfo({type:"error",content:"���ʧ��"},function(){});
					}
			});
          });

          jQuery(".ac-leftList-button").click(function(){
			jQuery("ul.ac-categorybox-list").children().eq(1).show();
			jQuery("ul.ac-categorybox-list").children().eq(2).show();
			jQuery("ul.ac-categorybox-list").children().eq(4).hide();
			jQuery("ul.ac-categorybox-list").children().eq(5).hide();
			jQuery(this).hide();
			jQuery(".ac-rightList-button").show();
          });
          jQuery(".ac-rightList-button").click(function(){
			jQuery("ul.ac-categorybox-list").children().eq(1).hide();
			jQuery("ul.ac-categorybox-list").children().eq(2).hide();
			jQuery("ul.ac-categorybox-list").children().eq(4).show();
			jQuery("ul.ac-categorybox-list").children().eq(5).show();
			jQuery(this).hide();
			jQuery(".ac-leftList-button").show();
          });
				
	};
	
	
};