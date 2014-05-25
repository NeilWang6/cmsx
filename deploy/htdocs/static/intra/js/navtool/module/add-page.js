//JavaScript Document
//**copyright by exodus.1688.com
//author:Lenny
//**用于添加导航页的事件绑定
//2011-07-08
var Add_Page=function(){
		this.InitialHtml=function(htmlid){
		var thehtml='  <div class="dialog-basic" id="apw">\
						<div class="dialog-b">\
							<header><a href="#" class="close">关闭</a><h5>DIALOG提示主题</h5></header>\
							<seciton>\
							<div class="apw" >\
                            	<div class="apw-row">\
	                        		<label for="keywords" class="pageNameLablel">页面名称：</label>\
	                        		<input type="text" class="mr10" id="apw-input-pageName" name="pageName"/>\
	                        		<label for="keywords" class="keywordsLable">关键字：</label>\
	                        		<input type="text" class="mr10" id="apw-input-keywords" name="keywords"/>\
	                        		<label for="keywords" class="urlLabel">URL：</label>\
	                        		<input type="text" class="form-text-large mr10" id="apw-input-URL" name="URL"/>&nbsp;如index.html\
                                	<input type="button" class="form-button btn-basic btn-gray"  id="apw-form-button-search" value="搜索" />\
                        		</div>\
                            	<div class="apw-row">\
									<table class="apw-table table-sub" cellspacing="0">\
										<colgroup>\
											<col id="IsChoose" />\
											<col id="ID" />\
											<col id="PageName" />\
											<col id="Keyword" />\
											<col id="URL" />\
										</colgroup>\
										<caption></caption>\
										<thead>\
										<tr>\
											<th class="th1"></th>\
											<th class="th2">ID</th>\
											<th class="th3">页面名称</th>\
											<th class="th4">关键字</th>\
											<th class="th5">页面URL</th>\
										</tr>\
											</thead>\
										<tbody>\
										</tbody>\
									</table>\
                        		</div>\
                            	<div class="apw-row apw-pagelist">\
                            		<div class="apw-pageInfo">\
										<form action="" id="subForm">\
										<input type="hidden" name="id" id="apw-id"/>\
										<input type="hidden" name="pageId" id="apw-pageId"/>\
										<input type="hidden" name="pageName" id="apw-pageName"/>\
										<input type="hidden" name="pageURL" id="apw-pageURL"/>\
										<input type="hidden" name="oldPageId" id="apw-oldPageId"/>\
		                        		<label for="apw-url-isitem">所属行业：</label>\
		                        		<select type="text" id="apw-buType" class="mr10">\
	                            			<option value="C">消费品</option>\
	                            			<option value="P">原材料</option>\
	                            			<option value="I">工业品</option>\
		                        		</select>\
		                                <label for="apw-url-isitem">是否全类目：</label>\
	                                    	<input type="radio" class="apw-form-checkbox" name="isCategory"   value="Y"/>\
	                                    	<label for="apw-url-isitem" >是</label>\
	                                        <input type="radio" class="apw-form-checkbox" checked="true" name="isCategory" value="N"/>\
	                                    	<label for="apw-url-isitem">否</label>\
										</form>\
									</div>\
									<div class="apw-pageNum">\
	                            		<label id="totalnum"></label>\
	                            		<a class="page-button prev-button" href="#" id="last-Page">上一页</a>\
	                            		<a class="page-button next-button" href="#" id="next-Page">下一页</a>\
	                            	</div>\
                        		</div>\
                            	<div class="apw-row apw-none">\
                        		</div>\
            			</div>\
            			</section>\
        				<footer>\
        					<input type="button" class="form-button btn-basic btn-blue"  id="apw-form-button-add" value="添加"/>\
                        	<input type="button" class="form-button btn-basic btn-blue"  id="apw-form-button-modify" value="修改"/>\
                        </footer>\
        			</div>\
        		</div>';
  		if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}
  		
	};
	//用于剪裁字符串，s为源字符串，max为最大字符数，isEllipsis代表多余内容是否用...表示
    this.truncateStr=function(s, max, isEllipsis){
		var n=0;
		for(var i=0,l=s.length;i<l;i++){
		if(s.charCodeAt(i) > 255){
		n+=2;
		}
		else{
		n++;
		}
		if(n === max){
		return s.substring(0, i+1).concat(isEllipsis?"...":"");
		}
		else if(n > max){
		return s.substring(0, i).concat(isEllipsis?"...":"");
		}
		}
	return s;
	} 
	//处理从cms获取到的pagelist
   this.dealPagesFromCMS = function(pageInfoJson){
   			var self = this;
			var pagelist = "",pageUrl;
			var myjson=pageInfoJson.pageList;
			var oddFlag=true;
			jQuery("#totalnum").html("共找到:("+self.page1.totalRecordNum+")"+self.page1.cur_page+"/"+(parseInt(self.page1.totalRecordNum/self.page1.num_per_page)+1));
			for(var i=0;i<myjson.length;i++){		
				pageUrl = "";							
				if(myjson[i].domainPath!=null){
					pageUrl += myjson[i].domainPath.domain+myjson[i].domainPath.contextPath;
				}
				pageUrl += myjson[i].specificUrl;
				if(oddFlag==true){
					pagelist+="<tr>"+
						"<td><input type=radio  name=\"isSelected\"/></td>"+
						"<td name='id' >"+myjson[i].id+"</td>"+
						"<td name='pageName' title=\""+myjson[i].title+"\">"+self.truncateStr(myjson[i].title,70,true)+"</td>"+
						"<td title=\""+myjson[i].keywords+"\">"+self.truncateStr(myjson[i].keywords,30,true)+"</td><td name='pageURL' title=\""+pageUrl+"\">"+self.truncateStr(myjson[i].specificUrl,30,true)+"</td></tr>";
					oddFlag = false;
				}
				else{
					pagelist+="<tr>"+
						"<td><input type=radio  name=\"isSelected\"/></td>"+
						"<td name='id' >"+myjson[i].id+"</td>"+
						"<td name='pageName' title=\""+myjson[i].title+"\">"+self.truncateStr(myjson[i].title,70,true)+"</td>"+
						"<td title=\""+myjson[i].keywords+"\">"+self.truncateStr(myjson[i].keywords,30,true)+"</td><td name='pageURL' title=\""+pageUrl+"\">"+self.truncateStr(myjson[i].specificUrl,30,true)+"</td></tr>";
					oddFlag = true;
			}
			}
			jQuery(".apw-table tbody").html(pagelist);
			jQuery(".apw-table :radio:first").click();
      };
	this.page1 = new Paging("",this.dealPagesFromCMS,this);//分页变量
	//绑定事件只许调用一次
	this.BindEvent=function(){
		var self = this;
		jQuery("#next-Page").click(function(){self.page1.go_next_page();});
		jQuery("#last-Page").click(function(){self.page1.go_last_page();});
		//table奇偶行的样式
		jQuery('.mp-table tr:odd').addClass("odd");
		var page_dialog,id,pageid;
      
      	jQuery('.mp-modify').live("click",function() {
			jQuery("#apw-form-button-modify").show();
			jQuery("#apw-form-button-add").hide();
			 id = jQuery(this).parent().siblings().eq(0).find("input[name='id']").val();
			 pageid = jQuery(this).parent().siblings().eq(0).find("input[name='pageId']").val();
			 
			 jQuery.use('ui-dialog',function(){
			 	jQuery('#apw').dialog({
			 		modal: true,
	                shim: true,
	                draggable: true,
	                center: true,
	                close: function(){
	                	jQuery(".boxy-wrapper").not(jQuery(".boxy-wrapper:has(.boxy-content)")).remove();

	                },
	                open: function(){
	                	jQuery('#apw').find('h5').html('修改到导航页')
	                }
			 	})
			 })
   //           if(page_dialog){ 
			// 	page_dialog.setTitle("修改导航页");
   //           	page_dialog.show();
				
   //           }else{
	  //            page_dialog= new Boxy("#apw", {
			// 		modal: true, 
			// 		title:"修改导航页",
			// 		afterHide:function(){this.removeOtherNull();}
	  //             });
            
			// }
			//page_dialog.moveToY(30);
			//modify by Lenny 放入oldPageId
			jQuery("#apw-oldPageId").val(pageid);
			//请求cms页面信息
			 self.page1.url = get_cms_url()+'/page/open/pagesearch.html?pageId='+pageid;
			 self.page1.sendReq(1);
			//请求类目管理系统中的页面信息
			jQuery.ajax({
				type:"get",
				url:get_elf_url()+"/tools/get_nav_page.do?id="+id,
				dataType:"jsonp",
				cache:false,
				success:function(data,textStatus){
						var pageInfo=data;
						jQuery("#apw-buType").val(pageInfo.buType);
						jQuery("#apw input[name='isCategory'][value="+pageInfo.isCategory+"]").attr("checked",true);
						jQuery("#apw-id").val(pageInfo.id);
					},
				error:function(){ 
					alertInfo({type:'error',content:'查询失败'},function(){});
				}
			});
              return false;
          });
		  
          jQuery('#mp-form-button-add').live("click",function() {
          	self.page1.url = get_cms_url()+'/page/open/pagesearch.htm';
			self.page1.sendReq(1,function(){

			    jQuery.use('ui-dialog',function(){		    	
                    //changeFormType(operate,changeForm);
                    jQuery('#apw').dialog({
                        modal: true,
                        shim: true,
                        draggable: true,
                        center: true,
                        open: function(){                            
                            //reflahInfo();
                            jQuery('#apw').find('h5').html('增加导航页')
                            jQuery('.apw').show();
                        }
                    })    
                }) 
			});
			jQuery("#apw-form-button-modify").hide();
			jQuery("#apw-form-button-add").show();
 			
			// if(page_dialog){
			// 	page_dialog.setTitle("增加导航页");
			// 	page_dialog.show();
				
			// }else{

 
	    //          page_dialog= new Boxy("#apw", {
					// modal: true,
					// title:"增加导航页",
					// afterHide:function(){this.removeOtherNull();}
	    //           });
            
			//}
			// page_dialog.moveToY(30);

              return false;
          });
          jQuery('.apw-table input').live("click",function(e){
				jQuery('#apw-pageId').val(jQuery(this).parent().parent().find("td[name='id']").text());
				jQuery('#apw-pageName').val(jQuery(this).parent().parent().find("td[name='pageName']").text());
				jQuery('#apw-pageURL').val(jQuery(this).parent().parent().find("td[name='pageURL']").text());
				e.stopPropagation();
          });
          jQuery('.apw-table tr').live("click",function(){
          		jQuery(this).find("input").click();
          });
	      jQuery('#apw-form-button-add').click(function(){
   				//提交新页面信息表单
				jQuery.ajax({
					type:"get",
					url:get_elf_url()+"/tools/update_nav_page.do",
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					dataType:"text",
					data:{"pageId":jQuery("#apw-pageId").val(),"pageName":encodeURIComponent(jQuery("#apw-pageName").val()),"pageURL":encodeURIComponent(jQuery("#apw-pageURL").val()),"buType":jQuery("#apw-buType option:selected").val(),"isCategory":jQuery("#apw input[name='isCategory']").val(),"charset":"UTF-8"},
					cache:false,
					success:function(data,textStatus){
							if(data=="OK"){
									alertInfo({type:"success",content:"添加成功！"},function(){

										jQuery('#apw').find('a.close').click();
										jQuery("#navPageForm").submit();
									});
									
							}else{
								alertInfo({type:"info",content:data},function(){});
							}
						},
					error:function(){ 
						alertInfo({type:"error",content:"添加失败"},function(){});
					}
				});
         });
	      jQuery('#apw-form-button-modify').click(function(){
   				//提交修改后的页面信息表单
   				jQuery.ajax({
					type:"get",
					url:get_elf_url()+"/tools/update_nav_page.do",
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					dataType:"text",
					data:{"id":jQuery("#apw-id").val(),"pageId":jQuery("#apw-pageId").val(),"pageName":encodeURIComponent(jQuery("#apw-pageName").val()),"pageURL":encodeURIComponent(jQuery("#apw-pageURL").val()),"buType":jQuery("#apw-buType option:selected").val(),"isCategory":jQuery("#apw input[name='isCategory']:checked").val(),"charset":"UTF-8","oldPageId":jQuery("#apw-oldPageId").val()},
					cache:false,
					success:function(data,textStatus){
							if(data=="OK"){
									alertInfo({type:"success",content:"修改成功！"},function(){
										jQuery('#apw').dialog('close');
										jQuery("#navPageForm").submit();
									});

							}else{
								alertInfo({type:"info",content:data},function(){});
							}
						},
					error:function(){ 
						alertInfo({type:"error",content:"修改失败"},function(){});
					}
				});
         });
	      jQuery("#apw-form-button-search").click(function(){	
	      			var pageName=jQuery("#apw-input-pageName").val().trim(),keywords=jQuery("#apw-input-keywords").val().trim(),url=jQuery("#apw-input-URL").val().trim();
	      			var searchParam = "";
	      			if(pageName!=""){
	      				searchParam += "&title="+pageName;
	      			}
	      			if(keywords!=""){
	      				searchParam += "&keywords="+keywords;
	      			}
	      			if(url!=""){
	      				searchParam += "&specialUrl="+url;
	      			}
					if(searchParam!=""){
						searchParam = searchParam.replace("&","?");
					}
                 	self.page1.url = get_cms_url()+'/page/open/pagesearch.htm'+searchParam;
					self.page1.sendReq(1);
         });
};
}
