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
                    <dd class="txt" title="<%=$data[i].catalogs %>">��Ŀ��<%= $data[i].catalogs.toString().cut(22,"...") %></dd>\
                    <dd class="txt">����ʱ�䣺<%=new Date($data[i].gmtCreate.time).format("yyyy-MM-dd") %></dd>\
                </dl>\
                <p class="operate">\
                    <span class="icon-uncommit"></span>\
                    <span class="txt-2"><% if($data[i].status == "UNSUBMIT"){ %>δ�ύ<% }else{%>δ֪<%} %></span>\
                    <span class="op-link"><a href="'+cmsDomain+'/page/box/new_page_design.html?draft_id=<%= $data[i].draftId %>">�������</a></span>\
                </p>\
            </dd>\
        <% } %>\
        </dl>';
        var templateTpl = '<dl class="items">\
        <% for ( var i = 0; i < $data.length; i++ ) { %>\
            <dd class="item">\
                <dl class="item-detail">\
                    <dt class="title" title="<%=$data[i].name %>"><a href="'+cmsDomain+'/page/box/view_personal_lib.html?id=<%= $data[i].id %>&type=pl_template"><%= $data[i].name.cut(24,"...") %></a></dt>\
                    <dd class="txt" title="<%=$data[i].tag %>">��ǩ��<%= $data[i].tag.cut(24,"...") %></dd>\
                    <dd class="txt">����ʱ�䣺<%=new Date($data[i].gmtCreate.time).format("yyyy-MM-dd") %></dd>\
                </dl>\
                <p class="operate">\
                    <% if($data[i].status=="UNSUBMIT"){ %>\
                        <span class="icon-uncommit"></span>\
                        <span class="txt-2">δ�ύ</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">�������</a></span>\
                    <% }else if($data[i].status=="UNPASS"){ %>\
                        <span class="icon-unpass"></span>\
                        <span class="txt-warn">δͨ��</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">�޸�</a></span>\
                        <div class="tui-tips">\
                            <span class="arrow-up"></span>\
                            <div class="tips-content"><%=$data[i].message %></div>\
                        </div>\
                    <% }else if($data[i].status=="UNPASS"){ %>\
                        <span class="icon-unpass"></span>\
                        <span class="txt-warn">δͨ��</span>\
                        <span class="op-link"><a href="'+cmsDomain+'/page/box/new_edit_template.html?templateId=<%= $data[i].id %>">�޸�</a></span>\
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
    				<td class="left-td"><em class="bold">ר�����ƣ�id:<%= $data.topicModel.id %>����</em>\
					</td><td class="right-td"><a class="op-link" target="_blank" href="/enroll/v2012/view_topic.htm?topicId=<%= $data.topicModel.id %>" ><%= $data.topicModel.name %></a></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">����ϵ�У�</em>\
					</td><td class="right-td"><%= $data.topicModel.series.name %></td>\
				</tr>\
				<tr class="sample">\
    				<td class="left-td"><em class="bold">�������ˣ�</em>\
					</td><td class="right-td"><%= $data.owner %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">ͷ���İ���</em>\
					</td><td class="right-td"><%= $data.topicModel.docket %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">ҳ�沼�֣�</em>\
					</td><td class="right-td">\
					<% if($data.topicModel.layout != null ) {%>\
						<p><%= $data.topicModel.layout.name %></p>\
                        <p><a href="<%= $data.topicModel.layout.url %>" target="_blank"><img src="<%= $data.topicModel.layout.bigImg %>"/></a></p><% } %>\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">ҳ�����飺</em>\
					</td><td class="right-td">\
					<% for( var i=0; i< $data.topicBlockList.length; i++){ %>\
					<p><%= $data.topicBlockList[i].blockName %>��id:<%= $data.topicBlockList[i].id %>����<% if( $data.topicBlockList[i].blockType=="pin") {%>��Ʒ  <%} else if ( $data.topicBlockList[i].blockType=="sp") {%> ���� <% } %></p>\
					<% } %>\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">��ػģ�壺</em>\
					</td><td class="right-td">\
						<% if( $data.topicModel.relaActivity =="199300") {%> Ůװ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199316") {%> Ůװ-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199317") {%> ͯװ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199318") {%> ͯװ-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199319") {%> ��װ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199320") {%> ��װ-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199321") {%> ����-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199322") {%> ����-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199323") {%> Ьѥ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199324") {%> Ьѥ-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199325") {%> ���-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199326") {%> ���-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199327") {%> �˶�-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199328") {%> �˶�-02 <% } %>\
						<% if( $data.topicModel.relaActivity =="199303") {%> ������Ʒ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199304") {%> ��Ʒ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199305") {%> ������Ʒ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199306") {%> ���-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199301") {%> 3c����-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199307") {%> �칫�Ľ�-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199308") {%> ����-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199309") {%> ��ϸ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199310") {%> ����-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199311") {%> ��֯-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199312") {%> ��װ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199313") {%> ũҵ-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199314") {%> ұ��-01 <% } %>\
						<% if( $data.topicModel.relaActivity =="199315") {%> ��Դ-01 <% } %>\
						��id:<%= $data.topicModel.relaActivity %>��\
					</td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">��Ӫ�������ʱ�䣺</em>\
					</td><td class="right-td"><%= $data.topicModel.suggestDate %></td>\
				</tr>\
				<tr>\
    				<td class="left-td"><em class="bold">�鳤�������ʱ�䣺</em>\
					</td><td class="right-td"><%= $data.topicModel.finishDate %></td>\
				</tr>\
				<tr>\
					<td colspan=2 class="dotted-line"><% if($data.topicModel.pageId !=null && $data.topicModel.pageId != "") {%><span class="op-link dcms-page-design" data-pageid="<%= $data.topicModel.pageId %>"><a href="#" class="btn-basic btn-blue">��ʼ���</a> </span> <% } %></td>\
				</tr>\
			</tbody>';
		topicDetailInst = FE.util.sweet(topicDetailTpl);
        pageSweetInst = FE.util.sweet(pageTpl);
        templateSweetInst = FE.util.sweet(templateTpl);		

    });

    var readyFun = [
    /**��ִ������*/
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

    /**���ڴ���*/
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
    //pageҳ��
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
                var msg = 'ҳ�泬ʱ����ˢ������';
                if(jqXHR.status === 0) {
                    msg = 'ûȨ�ޣ�'
                }
                showMsg(msg,tabBody);
                return;
            },
            success : function(rs, textStatus, jqXHR) {
                searchEnable = true;
                if(!rs.success) {
                    showMsg('ҳ�泬ʱ����ˢ������',tabBody);
                    return;
                }
                if(!rs.model || !rs.model.dataList || rs.model.dataList.length==0){
                    if(type == 'page'){
                        showAddWin('�½�ҳ��',cmsDomain+'/page/box/new_page_design.html',tabBody);
                    }else if(type == 'template'){
                        showAddWin('�½�ģ��',cmsDomain+'/page/box/new_template_design.html?template_type=pl_template',tabBody);
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

    //��ҳ
    function buildPage(tabBody,paginator) {
        if(!paginator){
            return;
        }
        var pagingS=$('.paging-s').last().clone();
        var type=tabBody.data('type');
        var pagesize = paginator.length;
        var cur = paginator.page;
        var pageCount = paginator.pages;

        pagingS.find('.description').text('��'+paginator.items+'�����');
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