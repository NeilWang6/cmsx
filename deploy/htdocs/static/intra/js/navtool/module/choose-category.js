//JavaScript Document
//**copyright by exodus.1688.com
//author:Lenny
//**用于选择类目对话框
//2011-08-10
var Choose_Category=function(){
		//载入HTML代码，附加到body上去
		this.InitialHtml=function(htmlid){
		var thehtml='<div  id="cc" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">关闭</a><h5></h5></header>\
						<section>\
						<div class="cc">\
                            	<div class="cc-row">\
	                        		<label for="keywords">输入类目名：</label><input type="hidden" id="ajaxqueen" value="" />\
	                        		<input type="text" class="" id="keyword" name="keyword"/>\
                                	<input type="submit" class="btn-basic btn-gray mg-20"  id="cc-form-button-search" value="搜索"/>\
                            	</div>\
                            	<div class="cc-row">\
									<ul class="cc-result-box" id="cc-result-box"></ul>\
                            	</div>\
                            	<div class="cc-row">\
									<ul class="cc-categorybox-list">\
										<li>\
                            				<button class="cc-leftList-button"><</button>\
										</li>\
										<li>\
											<dl>\
												<dt>一级类目：</dt>\
												<dd><ul class="cc-categorylist-box" id="cc-grade1-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>二级类目：</dt>\
												<dd><ul class="cc-categorylist-box" id="cc-grade2-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
											<dl>\
												<dt>三级类目：</dt>\
												<dd><ul class="cc-categorylist-box" id="cc-grade3-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>四级类目：</dt>\
												<dd><ul class="cc-categorylist-box" id="cc-grade4-list"></ul></dd>\
											</dl>\
										</li>\
										<li style="display:none">\
											<dl>\
												<dt>五级类目：</dt>\
												<dd><ul class="cc-categorylist-box" id="cc-grade5-list"></ul></dd>\
											</dl>\
										</li>\
										<li>\
                            				<button class="cc-rightList-button">></button>\
										</li>\
									</ul>\
                            	</div>\
                           </div>\
                        </section>\
						<footer class="ank-row-bottom">\
                        	<input type="button" class="btn-basic btn-blue mr16"  id="cc-form-button-choose" value="确定"/>\
                        	<input type="button" class="btn-basic btn-blue close"  id="cc-form-button-close" value="关闭"/>\
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
	// 处理得到的搜索类目结果的json
	this.dealSearchResult = function(data,grade){
		var myjson=data.categoryList;
		var categoryList="";
		for(var i=0;i<myjson.length;i++){
			categoryList+="<li><input type='radio' name='category' fullName='"+myjson[i].fullName+"'  id=\""+myjson[i].id+"\" >"+myjson[i].fullName+" </li>";
		};
		jQuery("ul.cc-result-box").html(categoryList);
	};
	// 处理得到的类目结果的json
	this.dealCateResult = function(data,grade){
		var myjson=data.categoryList;
		var categoryList="";
		for(var i=0;i<myjson.length;i++){
			categoryList+="<li><input type=radio name=\"category\" fullName=\""+myjson[i].fullName+"\" id=\""+myjson[i].id+"\">"+myjson[i].categoryName;
			
			if(myjson[i].leaf==false){
				categoryList+= " >> ";
			}
			categoryList+= "</li>";
		};
		jQuery("#cc-grade"+grade+"-list").html(categoryList);
		//将下下级的目录清空
		jQuery("#cc-grade"+(grade+1)+"-list").html("");
			jQuery(".cc-rightList-button").hide();
		//显示4,5级目录
		if(grade==4&&categoryList!=""){
			jQuery(".cc-categorybox-list").children().eq(1).hide();
			jQuery(".cc-categorybox-list").children().eq(4).show();
			jQuery(".cc-leftList-button").show();
		}
		if(grade==5&&categoryList!=""){
			jQuery(".cc-categorybox-list").children().eq(2).hide();
			jQuery(".cc-categorybox-list").children().eq(5).show();
		}
		//获取选中状态
		var thefullname=jQuery(".ac-category-Name").val();	//获取全类目名称		
		if(thefullname!=undefined&&thefullname!=""){
			var nowcategorynamearray=[];
			var thegradelist=jQuery("#cc-grade"+grade+"-list");
			var isclicked=thegradelist.attr("isclicked");
			nowcategorynamearray=thefullname.split(">>");
			if(isclicked!="Y"&&nowcategorynamearray.length>(grade-1)){
				var thefirstname=nowcategorynamearray[grade-1].trim();
				var thefirstnamemore=thefirstname+">>";
				var thelis=thegradelist.find("li");
				var thetext="";
				for(var i=0;i<thelis.length;i++){
					thetext=thelis.eq(i).text().replace(/\s*/g, "");
					if(thetext==thefirstname||thetext==thefirstnamemore){
						thelis.eq(i).click();
						thegradelist.attr("isclicked","Y");
						return;
					}
				}
			}
			
		}
	};
	// 选中li所在的item
	this.chooseItem = function(item){
  		jQuery(item).find('input').attr('checked',true);
  		jQuery(".cc-item-active").removeClass("cc-item-selected");
  		jQuery(item).siblings().andSelf().removeClass("cc-item-active");
  		jQuery(item).addClass("cc-item-active");
  		jQuery(item).addClass("cc-item-selected");
		
	};
	//绑定事件只许调用一次
	this.BindEvent=function(){
		var self = this;
		var cc_dialog,thebutton;
		jQuery('.choose-category').live("click",function() {
			 thebutton=jQuery(this);
			 
			 jQuery("input").removeClass("ac-category-Id").removeClass("ac-category-Name");
             jQuery("span.ac-category-Name-span").removeClass("ac-category-Name-span");
                  //清除完毕表示现在的值
             thebutton.parent().find("input[name=ank-categoryId]").addClass("ac-category-Id");
             thebutton.parent().find("input[name=ank-categoryName]").addClass("ac-category-Name");
             thebutton.parent().find("span[class=ank-categoryName]").addClass("ac-category-Name-span");
			 
             jQuery.use('ui-dialog',function(){
             	jQuery('#cc').dialog({
	     			modal: true,
	                shim: true,
	                draggable: true,
	                center: true,
	                close: function(){

						jQuery("ul.cc-categorylist-box").html("");
						jQuery("ul.cc-result-box").html("");
						jQuery("#keyword").val("");
						jQuery(".boxy-wrapper").not(jQuery(".boxy-wrapper:has(.boxy-content)")).remove();
	                },
	                open: function(){
	                	jQuery('#cc').find('h5').html('查找');
						jQuery(".cc-categorylist-box").attr("isclicked",""); //clear all the attr
						jQuery(".cc-leftList-button").click();
						self.getCategory(-1,self.dealCateResult,1);
	                }
             	})
             })

   //           if(cc_dialog){
			// 	cc_dialog.show();
			// }else{
	  //            cc_dialog= new Boxy("#cc", {
			// 		modal: true, //模式对话框是不能拖动的。
			// 		//clone: true,
			// 		//draggable:true,
			// 		title:"选取类目",//最好加上标题就可以了
			// 		afterHide:function(){
			// 			 jQuery("ul.cc-categorylist-box").html("");
			// 			 jQuery("ul.cc-result-box").html("");
			// 			 jQuery("#keyword").val("");
			// 			 this.removeOtherNull();
			// 		},
	  //              afterShow:function(){
			// 			jQuery(".cc-categorylist-box").attr("isclicked",""); //clear all the attr
			// 			jQuery(".cc-leftList-button").click();
			// 			self.getCategory(-1,self.dealCateResult,1);
			// 		}
	  //             });
			// }
              return false;
          });
			//各级类目的点击事件
          jQuery('ul.cc-result-box li').live("click",(function(){
          		self.chooseItem(this);
          }))
          jQuery('#cc-grade1-list li').live("click",(function(){
          		self.chooseItem(this);
				var categoryId = jQuery(this).find('input').attr("id");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,2);
				
          }))
          jQuery('#cc-grade2-list li').live("click",(function(){
          		self.chooseItem(this);
				var categoryId = jQuery(this).find('input').attr("id");
				self.getCategory("categoryId="+categoryId,self.dealCateResult,3);
          }))
          jQuery('#cc-grade3-list li').live("click",(function(){
				var categoryId = jQuery(this).find('input').attr("id");
          		self.chooseItem(this);
				self.getCategory("categoryId="+categoryId,self.dealCateResult,4);
          }))
          jQuery('#cc-grade4-list li').live("click",(function(){
				var categoryId = jQuery(this).find('input').attr("id");
          		self.chooseItem(this);
				self.getCategory("categoryId="+categoryId,self.dealCateResult,5);
          }))
          jQuery('#cc-grade5-list li').live("click",(function(){
          		self.chooseItem(this);
          }))
          //按钮的事件
          jQuery('#cc-form-button-choose').live("click",(function(){
				var selected_item = jQuery(".cc :checked");
				var selected_category=selected_item.attr("fullName");
				var selected_caid=selected_item.attr("id");
				jQuery(".ac-category-Id").val(selected_caid);
				jQuery(".ac-category-Name").val(selected_category);
				jQuery(".ac-category-Name-span").text(selected_category);
				jQuery('#cc-form-button-close').click();
				if(jQuery("#bmc-url"))
					jQuery("#bmc-url").change();
				
          }));
          jQuery("#cc-form-button-search").click(function(){
				var keyword = jQuery("#keyword") .attr("value");
				if(keyword==""||keyword==null){
					alertInfo({type:"info",content:"请输入关键字"},function(){});
					return;
				}
				self.getCategory("keyword="+keyword,self.dealSearchResult,0);
          });
          jQuery(".cc-leftList-button").click(function(){
			jQuery(".cc-categorybox-list").children().eq(1).show();
			jQuery(".cc-categorybox-list").children().eq(2).show();
			jQuery(".cc-categorybox-list").children().eq(4).hide();
			jQuery(".cc-categorybox-list").children().eq(5).hide();
			jQuery(this).hide();
			jQuery(".cc-rightList-button").show();
          })
          jQuery(".cc-rightList-button").click(function(){
			jQuery(".cc-categorybox-list").children().eq(1).hide();
			jQuery(".cc-categorybox-list").children().eq(2).hide();
			jQuery(".cc-categorybox-list").children().eq(4).show();
			jQuery(".cc-categorybox-list").children().eq(5).show();
			jQuery(this).hide();
			jQuery(".cc-leftList-button").show();
          })
	};

};