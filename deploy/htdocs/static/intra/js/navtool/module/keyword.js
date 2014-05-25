// JavaScript Document
//参数传递
var Keyword=function(){
	
	//初始化html
	this.InitailHtml=function(htmlid){
		var thehtml='<div id="ank" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">关闭</a><h5></h5></header>\
						<section>\
						<div  class="ank">\
                    	<div class="ank-row"><span class="ank-show-categorylist">+/-选择展示类目</span></div>\
                        <div class="ank-block ank-category-block">\
                        	<div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">一级类目</h2>\
                                <ul id="ank-categorylist1" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">二级类目</h2>\
                                <ul id="ank-categorylist2" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist">\
                            	<h2 class="ank-categorylist-title">热搜词</h2>\
                                <ul id="ank-categorylist3" class="ank-categorylist-box">\
                                </ul>\
                            </div>\
                            <div class="ank-categorylist ank-categorylist-right">\
                                <div class="ank-hotkeys-add">添加</div>\
                            </div>\
                        </div>\
                        <div class="ank-row"><span class="ank-item-add">+增加</span></div>\
                        <div class="ank-block">\
                        	<table cellspacing="0" cellpadding="0" class="table-sub">\
                            	<thead><tr>\
                                	<th>搜索关键字</th>\
                                    <th>展示关键字</th>\
                                    <th>转向URL</th>\
                                    <th>类目</th>\
                                    <th>颜色字体</th>\
                                    <th>新标识</th>\
                                    <th>热标识</th>\
                                    <th>操作</th>\
                                </tr>\
                                </thead><tbody class="ank-newkeyword-demo">\
                                <tr>\
                                	<td><input type="text" name="search-keyword" class="ank-form-text ank-search-keyword"></td>\
                                    <td><input type="text" name="show-keyword" class="ank-form-text ank-show-keyword"></td>\
                                    <td>\
                                    	<select name="switch-url">\
                                        	<option value="1">大市场</option>\
                                            <option value="2">工业品超市</option>\
											<option value="3">原材料</option>\
                                            <option value="0">自定义</option>\
                                        </select>\
                                    </td>\
                                    <td><span class="ank-categoryName"></span><input type="hidden" name="ank-categoryName" value=""><input type="hidden" name="ank-categoryId" value=""><span class="choose-category">点击查找</span></td>\
                                    <td>\
                                    	<select name="iscolor">\
                                        	<option value="Y">是</option>\
                                            <option selected="selected" value="N">否</option>\
                                        </select>\
                                    </td>\
                                    <td>\
                                    	<select name="isnew">\
                                        	<option value="Y">是</option>\
                                            <option selected="selected" value="N">否</option>\
                                        </select>\
                                    </td>\
                                    <td>\
                                    	<select name="ishot">\
                                        	<option value="Y">是</option>\
                                            <option selected="selected" value="N">否</option>\
                                        </select>\
                                    </td>\
                                    <td><span class="ank-delete">删除</span>&nbsp;|&nbsp;<span class="ank-copy">复制</span></td>\
                                </tr>\
                                </tbody>\
                                <tbody class="ank-newkeyword-real">\
                                </tbody>\
                            </table>\
                        </div>\
	                    </section>\
						<footer class="ank-row-bottom">\
                            	<input type="button" class="ank-keywords-add btn-basic btn-blue mr16"  id="anc-form-button-add" value="提交"/>\
                            	<input type="button" class="btn-basic btn-blue close"  id="anc-form-button-close" value="关闭"/>\
	                	</footer>\
	                </div>\
	            </div>';
        if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}          
	};
	//绑定事件只许调用一次
	this.BindEvent=function(){
		var self=this;
		//自动输入搜索关键字
		jQuery("input.ank-search-keyword").live("keyup",function(){
			jQuery(this).parent("td").parent("tr").find("input.ank-show-keyword").val(jQuery(this).val());
		});
		//绑定选择项事件
		jQuery("li.ank-item").live("click",function(){
			jQuery(this).siblings().removeClass("ank-item-selected");
			jQuery(this).addClass("ank-item-selected");
			jQuery(this).children(":radio").attr("checked",true);
			var fatherid=jQuery(this).children(":radio").val();
			self.showHotkey(fatherid);
			if(jQuery(this).parent().attr("id")=="ank-categorylist1")
				self.getCategory(fatherid,"ank-categorylist2","1");
		});
		//给checkbox增加点击事件
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
		//hover每一项的事件
		jQuery("li.ank-item").live("hover",function(){
			jQuery(".ank-item").removeClass("ank-item-hover");
			jQuery(this).addClass("ank-item-hover");
		});
		//展示隐藏类目选择区域
		jQuery("span.ank-show-categorylist").live("click",function(){
			
			jQuery(".ank-category-block").toggle();
		});
		//添加类目选择中的热词记录
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
		//增加一条记录
		jQuery("span.ank-item-add").live("click",function(){
			
			//jQuery(".ank-newkeyword-demo tr").toggleClass("odd");
			var newitemhtml=jQuery(".ank-newkeyword-demo").html();
			jQuery(".ank-newkeyword-real").append(newitemhtml);
		});
		//删除记录
		jQuery("span.ank-delete").live("click",function(){
			jQuery(this).parent("td").parent("tr").remove();
		});
		//复制记录
		jQuery("span.ank-copy").live("click",function(){
			var parenttr=jQuery(this).parent("td").parent("tr");
			parenttr.after(parenttr.clone());
			
		});
		
		//每条记录的hover事件
		// jQuery(".ank-newkeyword-real tr").live("hover",function(){
		// 	jQuery(".ank-newkeyword-real tr").removeClass("ank-newkeyword-item-hover");
		// 	jQuery(this).addClass("ank-newkeyword-item-hover");
		// });
		
		//保存按钮的事件绑定
		jQuery("input.ank-keywords-add").live("click",function(){
			self.saveKeywords();
		});
		//如果是IE则不固定大小
		
		if(jQuery.browser.msie){
			jQuery("#ank").css({"height":"auto", "overflow-y":"auto" });
		}
		
	};
	//初始化数据
	this.Initial=function(){
		
		this.getCategory("0","ank-categorylist1","0");
	};
	//获取子菜单
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
	//展示热词
	//@fid 对应的类别ID
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
							firstlis="<li>暂无相关热搜词</li>";
					}
					jQuery("#ank-categorylist3").html(firstlis);
					
				},
			complete:function(){},
			error:function(){}
		});
	};
	//增加一条记录
	//热词名称
	this.addKeywordItem=function(keyname,catid,catname){
		//jQuery(".ank-newkeyword-demo tr").toggleClass("odd");
		var temptr=jQuery(".ank-newkeyword-demo tr").clone();
		temptr.find("input[type=text]").val(keyname);
		temptr.find("input[name=ank-categoryId]").val(catid);
		temptr.find("input[name=ank-categoryName]").val(catname);
		temptr.find("span[class=ank-categoryName]").text(catname);
		jQuery(".ank-newkeyword-real").append(temptr);
	};
	//清除所有记录及界面
	this.unloadList=function(){
		jQuery(".ank-categorylist-box").html("");
		jQuery(".ank-newkeyword-real").html("");
	};
	//保存所有的记录
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
				alertInfo({type:"info",content:"请填写完整的展示关键词"},function(){});
				return false;
			}else{
				searchKeyword.push(encodeURIComponent(tempobj.searchKeyword));	//中文必需要采用这种编码方法才可以防止后台的乱码
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
		//判断自己增加的当中是否有重复的
		for(i=0;i<showKeyword.length;i++){
			for(j=i+1;j<showKeyword.length;j++){
				if(showKeyword[i]==showKeyword[j]){
					var a = decodeURIComponent(showKeyword[i])+"这条信息的关键词与其他信息存在重复！";
					
					alertInfo({type:"info",content:a},function(){});
					return false;
				}
					
			}
		}
		//增加一个判断是否有重复的在已存在的里面
		for(i=0;i<newitemobj.length;i++){
			for(j=0;j<existitem.length;j++){
				if(existitem.eq(j).text()==newitemobj[i].showName){
					alertInfo({type:"info",content:newitemobj[i].showName+'这条信息存在重复！'},function(){});
					return false;
				}
			}
		}
		//与服务器进行交换保存
		
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
								alertInfo({type:"error",content:"增加失败"},function(){});
								return false;
							}
					}
					
				},
			complete:function(){},
			error:function(){}
			
		});
		
		
	};
	
};