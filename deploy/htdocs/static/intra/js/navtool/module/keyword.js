// JavaScript Document
//��������
var Keyword=function(){
	
	//��ʼ��html
	this.InitailHtml=function(htmlid){
		var thehtml='<div id="ank" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">�ر�</a><h5></h5></header>\
						<section>\
						<div  class="ank">\
                    	<div class="ank-row"><span class="ank-show-categorylist">+/-ѡ��չʾ��Ŀ</span></div>\
                        <div class="ank-block ank-category-block">\
                        	<div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">һ����Ŀ</h2>\
                                <ul id="ank-categorylist1" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">������Ŀ</h2>\
                                <ul id="ank-categorylist2" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">���Ѵ�</h2>\
                                <ul id="ank-categorylist3" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist ank-categorylist-right">\
                                <div class="ank-hotkeys-add">���</div>\
                            </div>\
                        </div>\
                        <div class="ank-row"><span class="ank-item-add">+����</span></div>\
                        <div class="ank-block">\
                        	<table cellspacing="0" cellpadding="0" class="table-sub">\
                            	<thead><tr>\
                                	<th>�����ؼ���</th>\
                                    <th>չʾ�ؼ���</th>\
                                    <th>ת��URL</th>\
                                    <th>��Ŀ</th>\
                                    <th>��ɫ����</th>\
                                    <th>�±�ʶ</th>\
                                    <th>�ȱ�ʶ</th>\
                                    <th>����</th>\
                                </tr>\
                                </thead><tbody class="ank-newkeyword-demo">\
                                <tr>\
                                	<td><input type="text" name="search-keyword" class="ank-form-text ank-search-keyword"></td>\
                                    <td><input type="text" name="show-keyword" class="ank-form-text ank-show-keyword"></td>\
                                    <td>\
                                    	<select name="switch-url">\
                                        	<option value="1">���г�</option>\
                                            <option value="2">��ҵƷ����</option>\
											<option value="3">ԭ����</option>\
                                            <option value="0">�Զ���</option>\
                                        </select>\
                                    </td>\
                                    <td><span class="ank-categoryName"></span><input type="hidden" name="ank-categoryName" value=""><input type="hidden" name="ank-categoryId" value=""><span class="choose-category">�������</span></td>\
                                    <td>\
                                    	<select name="iscolor">\
                                        	<option value="Y">��</option>\
                                            <option selected="selected" value="N">��</option>\
                                        </select>\
                                    </td>\
                                    <td>\
                                    	<select name="isnew">\
                                        	<option value="Y">��</option>\
                                            <option selected="selected" value="N">��</option>\
                                        </select>\
                                    </td>\
                                    <td>\
                                    	<select name="ishot">\
                                        	<option value="Y">��</option>\
                                            <option selected="selected" value="N">��</option>\
                                        </select>\
                                    </td>\
                                    <td><span class="ank-delete">ɾ��</span>&nbsp;|&nbsp;<span class="ank-copy">����</span></td>\
                                </tr>\
                                </tbody>\
                                <tbody class="ank-newkeyword-real">\
                                </tbody>\
                            </table>\
                        </div>\
	                    </section>\
						<footer class="ank-row-bottom">\
                            	<input type="button" class="ank-keywords-add btn-basic btn-blue mr16"  id="anc-form-button-add" value="�ύ"/>\
                            	<input type="button" class="btn-basic btn-blue close"  id="anc-form-button-close" value="�ر�"/>\
	                	</footer>\
	                </div>\
	            </div>';
        if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}          
	};
	//���¼�ֻ�����һ��
	this.BindEvent=function(){
		var self=this;
		//�Զ����������ؼ���
		jQuery("input.ank-search-keyword").live("keyup",function(){
			jQuery(this).parent("td").parent("tr").find("input.ank-show-keyword").val(jQuery(this).val());
		});
		//��ѡ�����¼�
		jQuery("li.ank-item").live("click",function(){
			jQuery(this).siblings().removeClass("ank-item-selected");
			jQuery(this).addClass("ank-item-selected");
			jQuery(this).children(":radio").attr("checked",true);
			var fatherid=jQuery(this).children(":radio").val();
			self.showHotkey(fatherid);
			if(jQuery(this).parent().attr("id")=="ank-categorylist1")
				self.getCategory(fatherid,"ank-categorylist2","1");
		});
		//��checkbox���ӵ���¼�
		jQuery("li.ank-item-hotkey").live("click",function(){
			var ischecked=jQuery(this).children(":checkbox");
			if(!ischecked.attr("checked"))
				ischecked.attr("checked",true);
			else
				ischecked.attr("checked",false);
				
		});
		jQuery("li.ank-item-hotkey input").live("click",function(e){
			e.stopPropagation();
				
		});
		//hoverÿһ����¼�
		jQuery("li.ank-item").live("hover",function(){
			jQuery(".ank-item").removeClass("ank-item-hover");
			jQuery(this).addClass("ank-item-hover");
		});
		//չʾ������Ŀѡ������
		jQuery("span.ank-show-categorylist").live("click",function(){
			
			jQuery(".ank-category-block").toggle();
		});
		//�����Ŀѡ���е��ȴʼ�¼
		jQuery("div.ank-hotkeys-add").live("click",function(){
			var selectedcheck=jQuery("#ank-categorylist3 input[type=checkbox]:checked");
			var i=0;
			var categoryNames=jQuery(".ank-item-selected");
			var categoryName="";
			var categoryId=jQuery("input[name=ank-c1]:checked").val()||"";
			if(categoryNames.length<=1){
				categoryName=categoryNames.eq(0).text();
			}else{
				categoryName=categoryNames.eq(0).text()+">>"+categoryNames.eq(1).text();
			}
			for(i=0;i<selectedcheck.length;i++){
				self.addKeywordItem(selectedcheck.eq(i).val(),categoryId,categoryName);
			}
		});
		//����һ����¼
		jQuery("span.ank-item-add").live("click",function(){
			
			//jQuery(".ank-newkeyword-demo tr").toggleClass("odd");
			var newitemhtml=jQuery(".ank-newkeyword-demo").html();
			jQuery(".ank-newkeyword-real").append(newitemhtml);
		});
		//ɾ����¼
		jQuery("span.ank-delete").live("click",function(){
			jQuery(this).parent("td").parent("tr").remove();
		});
		//���Ƽ�¼
		jQuery("span.ank-copy").live("click",function(){
			var parenttr=jQuery(this).parent("td").parent("tr");
			parenttr.after(parenttr.clone());
			
		});
		
		//ÿ����¼��hover�¼�
		// jQuery(".ank-newkeyword-real tr").live("hover",function(){
		// 	jQuery(".ank-newkeyword-real tr").removeClass("ank-newkeyword-item-hover");
		// 	jQuery(this).addClass("ank-newkeyword-item-hover");
		// });
		
		//���水ť���¼���
		jQuery("input.ank-keywords-add").live("click",function(){
			self.saveKeywords();
		});
		//�����IE�򲻹̶���С
		
		if(jQuery.browser.msie){
			jQuery("#ank").css({"height":"auto", "overflow-y":"auto" });
		}
		
	};
	//��ʼ������
	this.Initial=function(){
		
		this.getCategory("0","ank-categorylist1","0");
	};
	//��ȡ�Ӳ˵�
	this.getCategory=function(fid,boxid,grade){
		var thesystemurl=jQuery("#elf_url").val();
		jQuery.ajax({
			type:"get",
			url:thesystemurl+"/tools/get_child_by_category.do?categoryId="+fid,
			dataType:"jsonp",
			cache:false,
			beforeSend:function(){},
			success:function(data,textStatus){
					var firstlis="";
					var results=data.categoryList;
					for(var i=0;i<results.length;i++){
						firstlis+="<li class='ank-item'><input type='radio' name='ank-c1' value='"+results[i].id+"'/>"+results[i].categoryName+"</li>";
					}
					jQuery("#"+boxid).html(firstlis);
				},
			complete:function(){},
			error:function(){}
		});
	};
	//չʾ�ȴ�
	//@fid ��Ӧ�����ID
	this.showHotkey=function(fid){
		jQuery.ajax({
			type:"get",
			url:"http://top.1688.com/remote/topBoardWithNoSecure?action=getSingleCategoryBoard&cateId="+fid+"&boardType=hot&showFeatureBoard=n",
			dataType:"jsonp",
			cache:false,
			beforeSend:function(){},
			success:function(backdata,textStatus){
					var firstlis="";
					if(backdata.success){
						var results=backdata.data.hotBoard.query;
						
							for(var i=0;i<results.length;i++){
								firstlis+="<li class='ank-item-hotkey'><input type='checkbox'  value='"+results[i].query+"'/>&nbsp;"+results[i].query+"</li>";
							}
						
					}else{
							firstlis="<li>����������Ѵ�</li>";
					}
					jQuery("#ank-categorylist3").html(firstlis);
					
				},
			complete:function(){},
			error:function(){}
		});
	};
	//����һ����¼
	//�ȴ�����
	this.addKeywordItem=function(keyname,catid,catname){
		//jQuery(".ank-newkeyword-demo tr").toggleClass("odd");
		var temptr=jQuery(".ank-newkeyword-demo tr").clone();
		temptr.find("input[type=text]").val(keyname);
		temptr.find("input[name=ank-categoryId]").val(catid);
		temptr.find("input[name=ank-categoryName]").val(catname);
		temptr.find("span[class=ank-categoryName]").text(catname);
		jQuery(".ank-newkeyword-real").append(temptr);
	};
	//������м�¼������
	this.unloadList=function(){
		jQuery(".ank-categorylist-box").html("");
		jQuery(".ank-newkeyword-real").html("");
	};
	//�������еļ�¼
	this.saveKeywords=function(){
		var pageId=jQuery("#pageId").val();
		var parentId=jQuery("#ank-parentid").val();
		var boxid=jQuery(".ank-boxid").eq(0).val();
		var vnavType="A";
		var i=0,j=0;
		switch(boxid){
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
		var existitem=jQuery("#"+boxid+" li");
		var orderIdBase1=jQuery("#"+boxid).find("li").last().attr("orderId");
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
		var colorFlag=[];
		var newFlag=[];
		var hotFlag=[];
		var navType=[];
		var orderId=[];
		var customUrl=[];
		var newitemobj=[];
		var isflag=false;
		var tempobj={};
		var items=jQuery(".ank-newkeyword-real tr");
		if(items.length<1)
			return false;
		for(i=0;i<items.length;i++){
			tempobj={};
			
			tempobj.searchKeyword=items.eq(i).find("input[name='search-keyword']").val();
			tempobj.showKeyword=items.eq(i).find("input[name='show-keyword']").val();
			tempobj.showName=tempobj.showKeyword;
			tempobj.fullCategoryName=items.eq(i).find("input[name='ank-categoryName']").val();
			tempobj.categoryId=items.eq(i).find("input[name='ank-categoryId']").val();
			if(tempobj.categoryId=="")
				tempobj.categoryId="0";
			tempobj.defaultUrlId=items.eq(i).find("select[name='switch-url']").val();
			tempobj.customUrl="#";
			tempobj.orderId=i+orderIdBase+1;
			tempobj.colorFlag=items.eq(i).find("select[name='iscolor']").val();
			tempobj.newFlag=items.eq(i).find("select[name='isnew']").val();
			tempobj.hotFlag=items.eq(i).find("select[name='ishot']").val();	
			tempobj.treeList=[];
			tempobj.hotList=[];
			tempobj.isHotKey=(boxid=="cw-categorylist4")?true:false;
			tempobj.parentId=parentId;
			tempobj.navType=vnavType;
			if(tempobj.showKeyword==""){
				alertInfo({type:"info",content:"����д������չʾ�ؼ���"},function(){});
				return false;
			}else{
				searchKeyword.push(encodeURIComponent(tempobj.searchKeyword));	//���ı���Ҫ�������ֱ��뷽���ſ��Է�ֹ��̨������
				showKeyword.push(encodeURIComponent(tempobj.showKeyword));
				fullCategoryName.push(encodeURIComponent(tempobj.fullCategoryName));
				defaultUrlId.push(tempobj.defaultUrlId);
				colorFlag.push(tempobj.colorFlag);
				newFlag.push(tempobj.newFlag);
				hotFlag.push(tempobj.hotFlag);
				categoryId.push(tempobj.categoryId);
				newitemobj.push(tempobj);
				navType.push(vnavType);
				orderId.push(i+orderIdBase+1);
				customUrl.push("");
			}
		}
		//�ж��Լ����ӵĵ����Ƿ����ظ���
		for(i=0;i<showKeyword.length;i++){
			for(j=i+1;j<showKeyword.length;j++){
				if(showKeyword[i]==showKeyword[j]){
					var a = decodeURIComponent(showKeyword[i])+"������Ϣ�Ĺؼ�����������Ϣ�����ظ���";
					
					alertInfo({type:"info",content:a},function(){});
					return false;
				}
					
			}
		}
		//����һ���ж��Ƿ����ظ������Ѵ��ڵ�����
		for(i=0;i<newitemobj.length;i++){
			for(j=0;j<existitem.length;j++){
				if(existitem.eq(j).text()==newitemobj[i].showName){
					alertInfo({type:"info",content:newitemobj[i].showName+'������Ϣ�����ظ���'},function(){});
					return false;
				}
			}
		}
		//����������н�������
		
		//alert(data4update);
		
		jQuery.ajax({
			type:"post",
			dataType:"json",
			traditional: true,
			url:get_elf_url()+"/tools/add_nav.do?charset=utf-8",
			data:{"act":"Q","dataCount":items.length,"pageId":pageId,"parentId":parentId,"orderId":orderId,"searchKeyword":searchKeyword,"showKeyword":showKeyword,"categoryId":categoryId,"fullCategoryName":fullCategoryName,"navType":vnavType,"defaultUrlId":defaultUrlId,"customUrl":customUrl,"colorFlag":colorFlag,"newFlag":newFlag,"hotFlag":hotFlag},
			cache:false,
			beforeSend:function(){},
			success:function(backdata,textStatus){
					if(backdata.msg){
						alertInfo({type:'error',content:backdata.msg},function(){});
						return false;
					}else{
						if(backdata.ids){
								for(i=0;i<backdata.ids.length;i++){
									newitemobj[i].id=backdata.ids[i];
								}
								var newitem=new Citem("0");
								newitem.addItem("0",boxid,newitemobj);
								jQuery("#anc-form-button-close").delay(800).click();
								
								//return true;
								
								
							}else{
								alertInfo({type:"error",content:"����ʧ��"},function(){});
								return false;
							}
					}
					
				},
			complete:function(){},
			error:function(){}
			
		});
		
		
	};
	
};