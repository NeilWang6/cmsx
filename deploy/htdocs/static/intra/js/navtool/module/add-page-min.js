var Add_Page=function(){this.InitialHtml=function(htmlid){var thehtml='  <div class="apw" id="apw">                            \t<div class="apw-row">\t                        \t\t<label for="keywords">\u9875\u9762\u540d\u79f0\uff1a</label>\t                        \t\t<input type="text" class="" id="apw-input-pageName" name="pageName"/>\t                        \t\t<label for="keywords">\u5173\u952e\u5b57\uff1a</label>\t                        \t\t<input type="text" class="" id="apw-input-keywords" name="keywords"/>                            \t</div>                            \t<div class="apw-row">                            \t\t<span class="apw-title">\u8bf7\u9009\u62e9\u5bfc\u822a\u9875:</span>\t                        \t\t<label for="keywords">URL\uff1a</label>\t                        \t\t<input type="text" class="form-text-large" id="apw-input-URL" name="URL"/>&nbsp;\u5982index.html                                \t<input type="button" class="form-button"  id="apw-form-button-search" value="\u641c\u7d22" />                        \t\t</div>                            \t<div class="apw-row">\t\t\t\t\t\t\t\t\t<table class="apw-table" cellspacing="0">\t\t\t\t\t\t\t\t\t\t<colgroup>\t\t\t\t\t\t\t\t\t\t\t<col id="IsChoose" />\t\t\t\t\t\t\t\t\t\t\t<col id="ID" />\t\t\t\t\t\t\t\t\t\t\t<col id="PageName" />\t\t\t\t\t\t\t\t\t\t\t<col id="Keyword" />\t\t\t\t\t\t\t\t\t\t\t<col id="URL" />\t\t\t\t\t\t\t\t\t\t</colgroup>\t\t\t\t\t\t\t\t\t\t<thead>\t\t\t\t\t\t\t\t\t\t<tr>\t\t\t\t\t\t\t\t\t\t\t<th></th>\t\t\t\t\t\t\t\t\t\t\t<th >ID</th>\t\t\t\t\t\t\t\t\t\t\t<th>\u9875\u9762\u540d\u79f0</th>\t\t\t\t\t\t\t\t\t\t\t<th>\u5173\u952e\u5b57</th>\t\t\t\t\t\t\t\t\t\t\t<th>\u9875\u9762URL</th>\t\t\t\t\t\t\t\t\t\t</tr>\t\t\t\t\t\t\t\t\t\t\t</thead>\t\t\t\t\t\t\t\t\t\t<tbody>\t\t\t\t\t\t\t\t\t\t</tbody>\t\t\t\t\t\t\t\t\t</table>                        \t\t</div>                            \t<div class="apw-row">                            \t\t<div class="apw-pageInfo">\t\t\t\t\t\t\t\t\t\t<form action="" id="subForm">\t\t\t\t\t\t\t\t\t\t<input type="hidden" name="id" id="apw-id"/>\t\t\t\t\t\t\t\t\t\t<input type="hidden" name="pageId" id="apw-pageId"/>\t\t\t\t\t\t\t\t\t\t<input type="hidden" name="pageName" id="apw-pageName"/>\t\t\t\t\t\t\t\t\t\t<input type="hidden" name="pageURL" id="apw-pageURL"/>\t\t\t\t\t\t\t\t\t\t<input type="hidden" name="oldPageId" id="apw-oldPageId"/>\t\t                        \t\t<label for="apw-url-isitem">\u6240\u5c5e\u884c\u4e1a\uff1a</label>\t\t                        \t\t<select type="text" id="apw-buType">\t                            \t\t\t<option value="C">\u6d88\u8d39\u54c1</option>\t                            \t\t\t<option value="P">\u539f\u6750\u6599</option>\t                            \t\t\t<option value="I">\u5de5\u4e1a\u54c1</option>\t\t                        \t\t</select>\t\t                                <label for="apw-url-isitem">\u662f\u5426\u5168\u7c7b\u76ee\uff1a</label>\t                                    \t<input type="radio" class="apw-form-checkbox" name="isCategory"   value="Y"/>\t                                    \t<label for="apw-url-isitem">\u662f</label>\t                                        <input type="radio" class="apw-form-checkbox" checked="true" name="isCategory" value="N"/>\t                                    \t<label for="apw-url-isitem">\u5426</label>\t\t\t\t\t\t\t\t\t\t</form>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="apw-pageNum">\t                            \t\t<label id="totalnum"></label>\t                            \t\t<a class="page-button" href="#" id="last-Page">\u4e0a\u4e00\u9875</a>\t                            \t\t<a class="page-button" href="#" id="next-Page">\u4e0b\u4e00\u9875</a>\t                            \t</div>                        \t\t</div>                            \t<div class="apw-row">                                \t<input type="button" class="form-button"  id="apw-form-button-add" value="\u6dfb\u52a0"/>                                \t<input type="button" class="form-button"  id="apw-form-button-modify" value="\u4fee\u6539"/>                        \t\t</div>            </div>';
if(htmlid!=undefined&&jQuery(htmlid)!=undefined)jQuery(htmlid).append(thehtml);else jQuery("body").append(thehtml)};this.truncateStr=function(s,max,isEllipsis){var n=0;for(var i=0,l=s.length;i<l;i++){if(s.charCodeAt(i)>255)n+=2;else n++;if(n===max)return s.substring(0,i+1).concat(isEllipsis?"...":"");else if(n>max)return s.substring(0,i).concat(isEllipsis?"...":"")}return s};this.dealPagesFromCMS=function(pageInfoJson){var self=this;var pagelist="",pageUrl;var myjson=pageInfoJson.pageList;var oddFlag=
true;jQuery("#totalnum").html("\u5171\u627e\u5230:("+self.page1.totalRecordNum+")"+self.page1.cur_page+"/"+(parseInt(self.page1.totalRecordNum/self.page1.num_per_page)+1));for(var i=0;i<myjson.length;i++){pageUrl="";if(myjson[i].domainPath!=null)pageUrl+=myjson[i].domainPath.domain+myjson[i].domainPath.contextPath;pageUrl+=myjson[i].specificUrl;if(oddFlag==true){pagelist+='<tr class="odd">'+'<td><input type=radio  name="isSelected"/></td>'+"<td name='id' >"+myjson[i].id+"</td>"+"<td name='pageName' title=\""+
myjson[i].title+'">'+self.truncateStr(myjson[i].title,70,true)+"</td>"+'<td title="'+myjson[i].keywords+'">'+self.truncateStr(myjson[i].keywords,30,true)+"</td><td name='pageURL' title=\""+pageUrl+'">'+self.truncateStr(myjson[i].specificUrl,30,true)+"</td></tr>";oddFlag=false}else{pagelist+="<tr>"+'<td><input type=radio  name="isSelected"/></td>'+"<td name='id' >"+myjson[i].id+"</td>"+"<td name='pageName' title=\""+myjson[i].title+'">'+self.truncateStr(myjson[i].title,70,true)+"</td>"+'<td title="'+
myjson[i].keywords+'">'+self.truncateStr(myjson[i].keywords,30,true)+"</td><td name='pageURL' title=\""+pageUrl+'">'+self.truncateStr(myjson[i].specificUrl,30,true)+"</td></tr>";oddFlag=true}}jQuery(".apw-table tbody").html(pagelist);jQuery(".apw-table :radio:first").click()};this.page1=new Paging("",this.dealPagesFromCMS,this);this.BindEvent=function(){var self=this;jQuery("#next-Page").click(function(){self.page1.go_next_page()});jQuery("#last-Page").click(function(){self.page1.go_last_page()});
jQuery(".mp-table tr:odd").addClass("odd");var page_dialog,id,pageid;jQuery(".mp-modify").live("click",function(){jQuery("#apw-form-button-modify").show();jQuery("#apw-form-button-add").hide();id=jQuery(this).parent().siblings().eq(0).find("input[name='id']").val();pageid=jQuery(this).parent().siblings().eq(0).find("input[name='pageId']").val();if(page_dialog){page_dialog.setTitle("\u4fee\u6539\u5bfc\u822a\u9875");page_dialog.show()}else page_dialog=new Boxy("#apw",{modal:true,title:"\u4fee\u6539\u5bfc\u822a\u9875",
afterHide:function(){this.removeOtherNull()}});page_dialog.moveToY(30);jQuery("#apw-oldPageId").val(pageid);self.page1.url=get_cms_url()+"/page/open/pagesearch.html?pageId="+pageid;self.page1.sendReq(1);jQuery.ajax({type:"get",url:get_elf_url()+"/tools/get_nav_page.do?id="+id,dataType:"jsonp",cache:false,success:function(data,textStatus){var pageInfo=data;jQuery("#apw-buType").val(pageInfo.buType);jQuery("#apw input[name='isCategory'][value="+pageInfo.isCategory+"]").attr("checked",true);jQuery("#apw-id").val(pageInfo.id)},
error:function(){alert("\u67e5\u8be2\u5931\u8d25")}});return false});jQuery("#mp-form-button-add").live("click",function(){jQuery("#apw-form-button-modify").hide();jQuery("#apw-form-button-add").show();if(page_dialog){page_dialog.setTitle("\u589e\u52a0\u5bfc\u822a\u9875");page_dialog.show()}else page_dialog=new Boxy("#apw",{modal:true,title:"\u589e\u52a0\u5bfc\u822a\u9875",afterHide:function(){this.removeOtherNull()}});page_dialog.moveToY(30);self.page1.url=get_cms_url()+"/page/open/pagesearch.htm";
self.page1.sendReq(1);return false});jQuery(".apw-table input").live("click",function(e){jQuery("#apw-pageId").val(jQuery(this).parent().parent().find("td[name='id']").text());jQuery("#apw-pageName").val(jQuery(this).parent().parent().find("td[name='pageName']").text());jQuery("#apw-pageURL").val(jQuery(this).parent().parent().find("td[name='pageURL']").text());e.stopPropagation()});jQuery(".apw-table tr").live("click",function(){jQuery(this).find("input").click()});jQuery("#apw-form-button-add").click(function(){jQuery.ajax({type:"get",
url:get_elf_url()+"/tools/update_nav_page.do",contentType:"application/x-www-form-urlencoded; charset=utf-8",dataType:"text",data:{"pageId":jQuery("#apw-pageId").val(),"pageName":encodeURIComponent(jQuery("#apw-pageName").val()),"pageURL":encodeURIComponent(jQuery("#apw-pageURL").val()),"buType":jQuery("#apw-buType option:selected").val(),"isCategory":jQuery("#apw input[name='isCategory']").val(),"charset":"UTF-8"},cache:false,success:function(data,textStatus){if(data=="OK"){alert("\u6dfb\u52a0\u6210\u529f\uff01");
page_dialog.hide();jQuery("#navPageForm").submit()}else alert(data)},error:function(){alert("\u6dfb\u52a0\u5931\u8d25")}})});jQuery("#apw-form-button-modify").click(function(){jQuery.ajax({type:"get",url:get_elf_url()+"/tools/update_nav_page.do",contentType:"application/x-www-form-urlencoded; charset=utf-8",dataType:"text",data:{"id":jQuery("#apw-id").val(),"pageId":jQuery("#apw-pageId").val(),"pageName":encodeURIComponent(jQuery("#apw-pageName").val()),"pageURL":encodeURIComponent(jQuery("#apw-pageURL").val()),
"buType":jQuery("#apw-buType option:selected").val(),"isCategory":jQuery("#apw input[name='isCategory']:checked").val(),"charset":"UTF-8","oldPageId":jQuery("#apw-oldPageId").val()},cache:false,success:function(data,textStatus){if(data=="OK"){alert("\u4fee\u6539\u6210\u529f\uff01");page_dialog.hide();jQuery("#navPageForm").submit()}else alert(data)},error:function(){alert("\u4fee\u6539\u5931\u8d25")}})});jQuery("#apw-form-button-search").click(function(){var pageName=jQuery("#apw-input-pageName").val().trim(),
keywords=jQuery("#apw-input-keywords").val().trim(),url=jQuery("#apw-input-URL").val().trim();var searchParam="";if(pageName!="")searchParam+="&title="+pageName;if(keywords!="")searchParam+="&keywords="+keywords;if(url!="")searchParam+="&specialUrl="+url;if(searchParam!="")searchParam=searchParam.replace("&","?");self.page1.url=get_cms_url()+"/page/open/pagesearch.htm"+searchParam;self.page1.sendReq(1)})}};