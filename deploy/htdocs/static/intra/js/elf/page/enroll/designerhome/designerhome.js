/**
 * @author: lusheng.linls
 * @Date: 2012-11-15
 */

;
(function($, T) {
    var cmsDomain=$('#domain_cmsModule').val();
    var pageSweetInst,templateSweetInst,topicDetailInst;
    $.use('web-sweet', function(){
        var pageTpl = '<dl class="items">\
        <% for ( var i = 0; i < $data.length; i++ ) { %>\
            <dd class="item">\
                <dl class="item-detail">\
                    <dt class="title" title="<%=$data[i].name %>"><a class="op-link" href="'+cmsDomain+'/page/box/preview_page.html?draftId=<%=$data[i].draftId%>&from=specialTools&pageId=<%=$data[i].pageId %>"><%= $data[i].name.cut(24,"...") %></a></dt>\
                    <dd class="txt" title="<%=$data[i].catalogs %>">类目：<%= $data[i].catalogs.toString().cut(22,"...") %></dd>\
                    <dd class="txt">创建时间：<%=new Date($data[i].gmtCreate.time).format("yyyy-MM-dd") %></dd>\
                </dl>\
                <p class="operate">\
                    <span class="icon-uncommit"></span>\
                    <span class="txt-2"><% if($data[i].status == "UNSUBMIT"){ %>未提交<% }else{%>未知<%} %></span>\
                    <span class="op-link"><a href="'+cmsDomain+'/page/box/new_page_design.html?draft_id=<%= $data[i].draftId %>">继续设计</a></span>\
                </p>\
            </dd>\
        <% } %>\
        </dl>';
        var templateTpl = '<dl class="items">\
        <% for ( var i = 0; i < $data.length; i++ ) { %>\
            <dd class="item">\
                <dl class="item-detail">\
                    <dt class="title" title="<%=$data[i].name %>"><a href="'+cmsDomain+'/page/box/view_personal_lib.html?id=<%= $data[i].id %>&type=pl_template"><%= $data[i].name.cut(24,"...") %></a></dt>\
                    <dd class="txt" title="<%=$data[i].tag %>">标签：<%= $data[i].tag.cut(24,"...") %></dd>\
                    <dd class="txt">创建时间：<%=new Date($data[i].gmtCreate.time).format("yyyy-MM-dd") %></dd>\
                </dl>\
                <p class="operate">\
                    <% if($data[i].status=="UNSUBMIT"){ %>\
                        <span class="icon-uncommit"></span>\
                        <span class="txt-2">未提交</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">继续设计</a></span>\
                    <% }else if($data[i].status=="UNPASS"){ %>\
                        <span class="icon-unpass"></span>\
                        <span class="txt-warn">未通过</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">修改</a></span>\
                        <div class="tui-tips">\
                            <span class="arrow-up"></span>\
                            <div class="tips-content"><%=$data[i].message %></div>\
                        </div>\
                    <% }else if($data[i].status=="UNPASS"){ %>\
                        <span class="icon-unpass"></span>\
                        <span class="txt-warn">未通过</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">修改</a></span>\
                        <div class="tui-tips">\
                            <span class="arrow-up"></span>\
                            <div class="tips-content"><%=$data[i].message %></div>\
                        </div>\
                    <% }%>\
                </p>\
            </dd>\
        <% } %>\
        </dl>';
		var topicDetailTpl = '<div><p class="logo-img"><%= $data.topicModel.velocityCountTemp %></p></div>\
			<table class="topic-table">\
    		<tbody>\
				<tr>\
    				<td class="left-td"><em class="bold">专场名称（id:<%= $data.topicModel.id %>）：</em>\
					</td><td class="right-td"><a class="op-link" target="_blank" href="/enroll/v2012/view_topic.htm?topicId=<%= $data.topicModel.id %>" ><%= $data.topicModel.name %></a></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">所属系列：</em>\
					</td><td class="right-td"><%= $data.topicModel.series.name %></td>\
				</tr>\
				<tr class="sample">\
    				<td class="left-td"><em class="bold">需求负责人：</em>\
					</td><td class="right-td"><%= $data.owner %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">头部文案：</em>\
					</td><td class="right-td"><%= $data.topicModel.docket %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">页面布局：</em>\
					</td><td class="right-td">\
					<% if($data.topicModel.layout != null ) {%>\
						<p><%= $data.topicModel.layout.name %></p>\
                        <p><a href="<%= $data.topicModel.layout.url %>" target="_blank"><img src="<%= $data.topicModel.layout.bigImg %>"/></a></p><% } %>\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">页面区块：</em>\
					</td><td class="right-td">\
					<% for( var i=0; i< $data.topicBlockList.length; i++){ %>\
					<p><%= $data.topicBlockList[i].blockName %>（id:<%= $data.topicBlockList[i].id %>），<% if( $data.topicBlockList[i].blockType=="pin") {%>推品  <%} else if ( $data.topicBlockList[i].blockType=="sp") {%> 推商 <% } %></p>\
					<% } %>\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">相关活动模板：</em>\
					</td><td class="right-td">\
						<% if( $data.topicModel.relaActivity =="199300") {%> 女装-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199316") {%> 女装-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199317") {%> 童装-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199318") {%> 童装-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199319") {%> 男装-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199320") {%> 男装-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199321") {%> 内衣-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199322") {%> 内衣-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199323") {%> 鞋靴-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199324") {%> 鞋靴-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199325") {%> 配件-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199326") {%> 配件-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199327") {%> 运动-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199328") {%> 运动-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199303") {%> 汽车用品-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199304") {%> 饰品-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199305") {%> 工艺礼品-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199306") {%> 玩具-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199301") {%> 3c数码-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199307") {%> 办公文教-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199308") {%> 橡塑-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199309") {%> 精细-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199310") {%> 化工-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199311") {%> 纺织-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199312") {%> 包装-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199313") {%> 农业-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199314") {%> 冶金-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199315") {%> 能源-01 <% } %>\
						（id:<%= $data.topicModel.relaActivity %>）\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">运营建议完成时间：</em>\
					</td><td class="right-td"><%= $data.topicModel.suggestDate %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">组长安排完成时间：</em>\
					</td><td class="right-td"><%= $data.topicModel.finishDate %></td>\
				</tr>\
				<tr>\
					<td colspan=2 class="dotted-line"><% if($data.topicModel.pageId !=null && $data.topicModel.pageId != "") {%><span class="op-link dcms-page-design" data-pageid="<%= $data.topicModel.pageId %>"><a href="#" class="btn-basic btn-blue">开始设计</a> </span> <% } %></td>\
				</tr>\
			</tbody>';
		topicDetailInst = FE.util.sweet(topicDetailTpl);
        pageSweetInst = FE.util.sweet(pageTpl);
        templateSweetInst = FE.util.sweet(templateTpl);		

    });

    var readyFun = [
    /**待执行任务*/
    function() {
        var topicSizeInView=5;
        var animating=false;
        var scrollDetail=$('#topic-scroll-detail');
        var scrollShade=scrollDetail.closest('.topic-scroll-shade');
        var scrollleft=$('#scrollleft');
        var scrollright=$('#scrollright');
        var topicCount=scrollDetail.find('.show-win-3').size();
        if(topicCount>topicSizeInView){
            scrollright.css('visibility','visible');
        }
        scrollShade.css('width',(topicSizeInView*232-20)+'px');
		
		$('.show-win-3_').click(function(){
			 var ids = $(this).attr('id').split('_');
			 var topicId = ids[1];
			 var velocityCount = ids[2];
			$('.dcms-going-tabs').hide();   
			$('#topic-info').show();
			viewTopic(topicId,velocityCount);
		});

        scrollright.bind('click',function(){
            if(animating){
                return;
            }
            animating=true;
            var left=scrollDetail.css('left');
            left=left.replace('px','');
            if(!$.isNumeric(left)){
                left='0';
            }
            left=parseInt(left);
            var leftEl=Math.abs(left/232);
            if(leftEl+topicSizeInView>=topicCount){
                animating=false;
                return;
            }
            scrollDetail.animate({
                left: '-=232'
              }, 200, function() {
                if(leftEl+topicSizeInView>=topicCount-1){
                    scrollright.css('visibility','hidden');
                }
                scrollleft.css('visibility','visible');
                animating=false;
              });
        });
        scrollleft.bind('click',function(){
            if(animating){
                return;
            }
            animating=true;
            var left=scrollDetail.css('left');
            left=left.replace('px','');
            if(!$.isNumeric(left)){
                left='0';
            }
            left=parseInt(left);
            var leftEl=Math.abs(left/232);
            if(leftEl<=0){
                animating=false;
                return;
            }
            scrollDetail.animate({
                left: '+=232'
              }, 200, function() {
                if(leftEl<=1){
                    scrollleft.css('visibility','hidden');
                }
                scrollright.css('visibility','visible');
                animating=false;
              });
        });
    },

    /**正在创建*/
    function() {
        $.use('ui-tabs', function(){
            var goingTabs=$('#dcms-going-tabs');
            goingTabs.tabs({
                isAutoPlay: false,
                event: 'click',
                titleSelector: '.list-tabs-t li',
                boxSelector: '.tab-a-box',
                select: function(e,data){
                    var curTabs=$(goingTabs.find('.tab-a-box')[data.index]);
                    if(curTabs.find('.item').size()==0){
                        search(curTabs,0);
                    }

                }
            });
        });

        $('.paging-s .prev,.paging-s .next').live('click',function(e){
            e.preventDefault();
            var elthis=$(this);
            if(!elthis.data('page')){
                return;
            }
            search(elthis.closest('.tab-a-box'),elthis.data('page'));
        });
    }];
	
	function viewTopic(topicId, velocityCount) {
		var urlPost = T.domain + "/enroll/v2012/view_topic_detail.json";
		var data='topicId='+topicId+'&velocityCount='+velocityCount;
		$.ajax({
			url : urlPost,
			type: "post",
			data : data,
			error: function(jqXHR, textStatus, errorThrown) {
				return;
			},
			success: function(_data){			
				var html =	topicDetailInst.applyData(_data);		
				$('#topic-info').html(html);
			}
		});	
	};
	
	

    var searchEnable = true;
    //page页码
    function search(tabBody,page) {
        if(!searchEnable) {
            return;
        }
        showLoading(tabBody);
        searchEnable = false;
        var type=tabBody.data('type');
        var data='type='+type+'&page='+page+'&pageSize='+20;
        $.ajax({
            url : T.domain + "/enroll/v2012/going_design.json",
            type : "post",
            data : data,
            error : function(jqXHR, textStatus, errorThrown) {
                searchEnable = true;
                var msg = '页面超时，请刷新重试';
                if(jqXHR.status === 0) {
                    msg = '没权限！'
                }
                showMsg(msg,tabBody);
                return;
            },
            success : function(rs, textStatus, jqXHR) {
                searchEnable = true;
                if(!rs.success) {
                    showMsg('页面超时，请刷新重试',tabBody);
                    return;
                }
                if(!rs.model || !rs.model.dataList || rs.model.dataList.length==0){
                    if(type == 'page'){
                        showAddWin('新建页面',cmsDomain+'/page/box/new_page_design.html',tabBody);
                    }else if(type == 'template'){
                        showAddWin('新建模板',cmsDomain+'/page/box/new_template_design.html?template_type=pl_template',tabBody);
                    }
                    return;
                }
                tabBody.empty();
                 if(type == 'page'){
                    tabBody.append(pageSweetInst.applyData(rs.model.dataList));

                 }else if(type == 'template'){
                    tabBody.append(templateSweetInst.applyData(rs.model.dataList));
                 }
                 buildPage(tabBody,rs.model.paginator)
            }
        });

    };

    //分页
    function buildPage(tabBody,paginator) {
        if(!paginator){
            return;
        }
        var pagingS=$('.paging-s').last().clone();
        var type=tabBody.data('type');
        var pagesize = paginator.length;
        var cur = paginator.page;
        var pageCount = paginator.pages;

        pagingS.find('.description').text('共'+paginator.items+'个结果');
        pagingS.find('.pnum').text(paginator.page+'/'+paginator.pages);
        if(paginator.previousPage === paginator.page){
            pagingS.find('.prev').removeClass('btn-gray').addClass('btn-disabled-gray');
        }else{
            pagingS.find('.prev').data('page',paginator.previousPage);
        }
        if(paginator.nextPage === paginator.page){
            pagingS.find('.next').removeClass('btn-gray').addClass('btn-disabled-gray');
        }else{
            pagingS.find('.next').data('page',paginator.nextPage);
        }
        pagingS.appendTo(tabBody);
        pagingS.css('display','');
    };

    function showLoading(target){
        var loading=$('.loading').last().clone();
        loading.css('display','');
        target.empty();
        loading.appendTo(target);
    };
    function showAddWin(msg,url,target){
        var jsAdd=$('.js-add').last().clone();
        jsAdd.find('.txt').text(msg);
        jsAdd.find('a').prop('href',url);
        jsAdd.css('display','');
        target.empty();
        jsAdd.appendTo(target);
    };

    function showMsg(msg,target){
        var msgWarning=$('.msg-warn').last().clone();
        msgWarning.find('.summary').text(msg);
        msgWarning.css('display','');
        target.empty();
        msgWarning.appendTo(target);
    };

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
})(jQuery, FE.tools);