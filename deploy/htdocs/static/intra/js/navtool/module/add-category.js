//JavaScript Document
//**copyright by exodus.1688.com
//author:Lenny
//**用于添加类目对话框
//2011-08-10
var Add_Category=function(){
		this.InitialHtml=function(htmlid){
		var thehtml='<div id="ac" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">关闭</a><h5></h5></header>\
						<section>\
						<div class="ac form-vertical" >\
                            	<dl class="item-form">\
	                        		<dt for="keywords" class="topic" >输入类目名：</dt>\
	                        		<dd><input type="text" class="" id="ac-keyword" name="ac-keyword"/>\
                                	<input type="submit" class="btn-basic btn-grey"  id="ac-form-button-search" value="搜索"/></dd>\
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
												<dt>一级类目：</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade1-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>二级类目：</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade2-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>三级类目：</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade3-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>四级类目：</dt>\
												<dd><ul class="ac-categorylist-box" id="ac-grade4-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>五级类目：</dt>\
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
												<dt>已经选择的类目:</dt>\
												<dd><ul class="ac-selected-box"></ul></dd>\
											</dl>\
                            	<div class="ac-row">\
	                                <input type="radio" value="1" checked="checked"  name="urlRule"/><label for="">设置大市场URL规则</label>\
	                                <input type="radio" value="2" name="urlRule"/><label for="">设置工业品URL规则</label>\
									<input type="radio" value="3" name="urlRule"/><label for="">设置原材料URL规则</label>\
	                                <input type="radio" value="0"  name="urlRule"/><label for="">不设置默认值</label>\
                                </div>\
								</form>\
							</div>\
							</section>\
							<footer id="cw-block-foot" class="cw-block">\
                                	<input type="button" class="form-button btn-basic btn-blue mr16"  id="ac-form-button-add" value="添加"/>\
                                	<input type="button" class="form-button btn-basic btn-blue close"  id="ac-form-button-close" value="关闭"/>\
		                	</footer>\
		                </div>\
		            </div>';
  		if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}
  		
	};
	//获取符合查询参数的下级类目的json，并执行回调函数,searchParam的形式为keyword=abc，只能包含一个条件，-1为查询所有一级类目
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
							alertInfo({type:"error",content:"获取类目失败！"},function(){});
						}
          })
      	  return;
	};
	//选中item，将item加入已选中的框中
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
	// 处理得到的搜索类目结果的json
	this.dealSearchResult = function(data){
		var myjson=data.categoryList;
		var categoryList="";
		for(var i=0;i<myjson.length;i++){
			categoryList+="<li><input type='checkbox' name='"+myjson[i].id+"' fullName='"+myjson[i].fullName+"'>"+myjson[i].fullName+" </li>";
		};
		jQuery("ul.ac-result-box").html(categoryList);
		//遍历选中的目录栏，初始化己选中的目录
		jQuery("ul.ac-selected-box li").each(function(){
			jQuery("#ac input[name="+jQuery(this).attr("name")+"]").attr("checked","checked");
		})
	};
	// 处理得到的类目结果的json
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
		//将下下级的目录清空
		jQuery("#ac-grade"+(grade+1)+"-list").html("");
		jQuery(".ac-rightList-button").hide();
		//显示4,5级目录
		if(grade==4&&categoryList!=""){
			jQuery("ul.ac-categorybox-list").children().eq(1).hide();
			jQuery("ul.ac-categorybox-list").children().eq(4).show();
			jQuery(".ac-leftList-button").show();
		}
		if(grade==5&&categoryList!=""){
			jQuery("ul.ac-categorybox-list").children().eq(2).hide();
			jQuery("ul.ac-categorybox-list").children().eq(5).show();
		}
			//遍历选中的目录栏，初始化己选中的目录
		jQuery("ul.ac-selected-box li").each(function(){
			jQuery("input[name="+jQuery(this).attr("name")+"]").attr("checked","checked");
		})
	};
	//绑定事件只许调用一次
	this.BindEvent=function(){
		var self=this;
		var ac_dialog;
		//配置页面里添加类目按钮的事件
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
				default:	//默认为第一级别
					parentid="0";
					break;
				
			}
			if(parentid==undefined){
				alertInfo({type:"info",content:"对不起，请选择好相应的父类目"},function(){});
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
                    	jQuery('#ac').find('h5').html('添加类目')
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
			// 		title:"添加类目",
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
		  //一级类目点击的事件
          jQuery('#ac-grade1-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,2);

          }))
		  //二级类目点击的事件
          jQuery('#ac-grade2-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,3);
          }))
		  //三级类目点击的事件
          jQuery('#ac-grade3-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,4);

          }))
		  //四级类目点击的事件
          jQuery('#ac-grade4-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
				var categoryId = jQuery(this).find('input').attr("name");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,5);
          }))
		  //五级类目点击的事件
          jQuery('#ac-grade5-list li').live("click",(function(){
          		jQuery(this).siblings().andSelf().removeClass("ac-item-active");
          		jQuery(this).addClass("ac-item-active");
          }));
			//checkbox的事件
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
           //搜索结果框里的item的事件
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
           //选中结果框的item的事件
           jQuery('ul.ac-selected-box li').live("hover",(function(){
          		jQuery("ul.ac-selected-box span.ac-delete-button").hide();
          		jQuery(this).find('span.ac-delete-button').show();
           		//针对ie6下的hover
          		jQuery(this).toggleClass("ac-selected-hover");
           }))
           //针对ie6下的hover
           jQuery('ul.ac-categorylist-box li').live("hover",(function(){
          		jQuery(this).css("cursor","pointer");
           }))
           jQuery('ul.ac-result-box li').live("hover",(function(){
          		jQuery(this).css("cursor","pointer");
           }))
           //选中框删除按钮的事件
           jQuery('span.ac-delete-button').live("click",(function(){
				jQuery(this).parent().remove();
				jQuery("#ac input[name="+jQuery(this).parent().attr("name")+"]").attr("checked",false);
           }))
           //搜索按钮的事件
          jQuery("#ac-form-button-search").click(function(){
				var keyword = jQuery("#ac-keyword") .attr("value");
				if(keyword==""||keyword==null){
					alertInfo({type:"info",content:"请输入关键字"},function(){});
					return;
				}
				self.getCategory("keyword="+keyword,self.dealSearchResult);
          })
          //关闭按钮的事件
    //       jQuery("#ac-form-button-close").click(function(){
				// ac_dialog.hide()
    //         	return false;
    //       })
          //添加按钮的事件
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
					alertInfo({type:"info",content:"请填写完整的类目名称"},function(){});
					return false;
				}else{
					searchKeyword.push("");	//中文必需要采用这种编码方法才可以防止后台的乱码
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
			//增加一个判断是否有重复的在已存在的里面
			for(var i=0;i<newitemobj.length;i++){
				for(var j=0;j<existitem.length;j++){
					if(existitem.eq(j).text()==newitemobj[i].showName){
						alertInfo({type:"info",content:newitemobj[i].showName+'这条信息存在重复！'},function(){});
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
										alertInfo({type:"error",content:"增加失败！"},function(){});
										return false;
									}
							}
					},
					error:function(){ 
						alertInfo({type:"error",content:"添加失败"},function(){});
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