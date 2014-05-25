/**
 * @author lusheng.linls
 * @usefor 专场Cell 包含相关渲染和事件绑定。页面全局只能new T.Topiccell()一次，否则会重复绑定事件
 * @date   2012.09.13
 * @dependent show-win.css
 */

;(function($, T) {
	T.cmsDomain = $("#domain_cmsModule").val();
    T.Topiccell = function(scopeEl, opts) {
        this._init(scopeEl, opts);
    };
    T.Topiccell.defConfig = {

    };
    T.Topiccell.globalSample='';
    
    //收藏、取消收藏专场-提交请求，修改页面样式
    function collectTopic(url,type,topicId,memberId,setCollect,el,csrfToken){
    	 $.ajax({
             url : url,
             type : type,
             data : {
                 '_input_charset' : 'UTF-8',
                 'topicId' : topicId,
                 'memberId' : memberId,
                 'setCollect' : setCollect,
                 '_csrf_token' : csrfToken
             },
             error : function(jqXHR, textStatus, errorThrown) {
                 var msg = '执行失败';
                 if(jqXHR.status === 0) {
                     msg = '没权限！'
                 }
                 alert(msg);
                 return;
             },
             success : function(rs, textStatus, jqXHR) {
                 if(!rs.success) {
                     var msg = '执行失败';
                     if(rs.msg) {
                         msg = msg + ':' + rs.msg;
                     }
                     alert(msg);
                     return;
                 }
                 if(setCollect){
                	 el.find('.js-collect-operate').text('取消收藏');
                	 //防止页面反应慢的时候，多次点击“收藏专场”，导致多次添加右上角的收藏图标
	                 if (!el.find('.js-topic-name a.js-act-collect-topic')[0]){
	                	 el.find('.js-topic-name').append('<a href="#" class="js-act-collect-topic"><em class="icon icon-collection"></em></a>');
	                 }
                 }else{
                	 //若当前tab是我的收藏，那么取消收藏操作后，隐藏该专场块(sample)
                	 if($("#searchType").val()==="myCollection"){
                		 el.hide();
                	 }else{
	                	 el.find('.js-collect-operate').text('收藏专场');
	                	 el.find('.js-topic-name a.js-act-collect-topic')[0].remove();
                	 }
                 }
             }
         });
    };
    
    T.Topiccell.prototype = {
        _init : function(scopeEl, opts) {
            var scopeEl = $(scopeEl), config = $.extend({}, T.Topiccell.defConfig, opts), self = this, csrfToken = scopeEl.find('input[name=_csrf_token]').val();

            //操作面板切换
            scopeEl.delegate('.show-win-2nd .show-operate', 'click', function(e) {
                e.preventDefault();
                scopeEl.find('.operate').hide();
                var el = $(this);
                el.closest('.show-win-2nd').find('.operate').show();
            });
            scopeEl.delegate('.show-win-2nd .hide', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                el.closest('.operate').hide();
            });
            //置顶/取消置顶
            scopeEl.delegate('.js-act-order-num', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                var txt=el.find('.txt').text();
                var setTop=false;
                if(txt==='置顶'){
                	setTop=true;
                }
                if(confirm('确定要'+txt+'吗？')) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/top_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            'setTop' : setTop,
                            '_csrf_token' : csrfToken
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = '执行失败';
                                if(rs.msg) {
                                    msg = msg + ':' + rs.msg;
                                }
                                alert(msg);
                                return;
                            }
                            if(setTop){
	                            el.find('.txt').text('取消置顶');
                            }else{
                            	el.find('.txt').text('置顶');
                            }
                        }
                    });
                }
            });
            //结束报名
            scopeEl.delegate('.js-act-end-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("确定结束报名吗？")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/close_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = '执行失败';
                                if(rs.msg) {
                                    msg = msg + ':' + rs.msg;
                                }
                                alert(msg);
                                return;
                            }
                            //专场状态
                            var jsTopicState = sample.find('.js-topic-state');
                            jsTopicState.text('已结束');
                            var jsTopicStateIcon = jsTopicState.siblings('em');
                            jsTopicStateIcon.removeClass('icon-time-ov').addClass('icon-time');
                        }
                    });
                }
            });
            //删除专场
            scopeEl.delegate('.js-act-del-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("确定删除该专场吗？注意删除后不能恢复！！！")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/del_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "删除失败";
                                if(rs.msg) {
                                    msg = msg + ":" + rs.msg;
                                }
                                alert(msg);
                                return;
                            }
                            sample.hide(300);
                        }
                    });
                }
            });
            //运营确认设计
            scopeEl.delegate('.js-act-operate-confirm', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("要确认设计吗？")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/confirm_design.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken,
                            'workFlowState' : 'finish'
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "提交失败";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                alert(msg);
                                return;
                            }
                            //流程状态
                            var jsWorkflowState = sample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            jsWorkflowState.text('设计完成');
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            alert("提交成功");
                        }
                    });
                }
            });
            //提交给ued
            scopeEl.delegate('.js-act-commit-ued', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("确定提交给ued吗？")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/assign_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken,
                            'assigner' : 'dawei.handw',
                            'workFlowState' : 'wait_assign'
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "提交失败";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                alert(msg);
                                return;
                            }
                            //流程状态
                            var jsWorkflowState = sample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            jsWorkflowState.text('未分配');
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            alert("提交成功");
                        }
                    });
                }
            });
            //分配设计师
            //对话框
            var jsDialog = $('.js-dialog');
            jsDialog.find('.js-dialog-close,.close').click(function(e) {
                e.preventDefault();
                jsDialog.dialog('close');
                jsDialog.find('.js-dialog-error').text('');
            });
            scopeEl.delegate('.js-act-assign-ued', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                T.Topiccell.globalSample=sample;
                var baseData = el.closest('.show-win-2nd');
                var title = baseData.find('.js-topic-name').attr('title');
                var operator = baseData.find('.js-operator-topic').text();
                var operatorSuggest = baseData.data('mainRec').operatorSuggest;
                jsDialog.find('.js-dialog-header').attr('title', title).text(title).data('topicId',baseData.data('mainRec').topicId);
                jsDialog.find('.js-operator').text(operator);
                jsDialog.find('.js-operator-suggest').text(operatorSuggest);

                $.use('ui-dialog', function() {
                    jsDialog.dialog({
                        center : true,
                        modal : true,
                        fixed : true
                    });
                });
            });
            
            //收藏、取消收藏专场
            scopeEl.delegate('.js-act-collect-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                var loginId = el.closest('.detail').find('input[name="loginId"]').val();
                var txt=el.find('.txt').text();
                if(txt && txt=='收藏专场'){
                	collectTopic(T.domain + "/enroll/v2012/collect_topic.json","post",baseData.data('mainRec').topicId,loginId,true,sample,csrfToken);
                }else{
                	if(confirm('你确认要取消收藏吗？')) {
                		collectTopic(T.domain + "/enroll/v2012/collect_topic.json","post",baseData.data('mainRec').topicId,loginId,false,sample,csrfToken);
                	}
                }
            });
            
            $('.js-submit').click(function(e){
                     e.preventDefault();
                     var el = $(this);
                     var designer=jsDialog.find('.js-designer').val();
                     var suggest=jsDialog.find('.js-leader-suggest').val();
                    if(!designer&&!suggest){
                         jsDialog.find('.js-dialog-error').text('请分配设计师，并设置组长安排完成时间');
                         return;
                     }
                     if(!designer){
                         jsDialog.find('.js-dialog-error').text('请分配设计师');
                         return;
                     }
                     if(!suggest){
                         jsDialog.find('.js-dialog-error').text('请设置组长安排完成时间');
                         return;
                     }
                     jsDialog.find('.js-dialog-error').text('');
                     $.ajax({
                        url : T.domain + "/enroll/v2012/ued_assign_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : jsDialog.find('.js-dialog-header').data('topicId'),
                            '_csrf_token' : csrfToken,
                            'assigner' : designer,
                            'workFlowState' : 'design',
                            'finishDate' : suggest
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "提交失败";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                jsDialog.find('.js-dialog-error').text(msg);
                                return;
                            }
                            //流程状态
                            var jsWorkflowState = T.Topiccell.globalSample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            var selectOption=jsDialog.find('.js-designer')[0];
                            jsWorkflowState.text('设计师：'+selectOption[selectOption.selectedIndex].text);
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            jsDialog.find('.js-dialog-error').text('提交成功');
                        }
                    });
                });

            //日期控件
            $.use('ui-datepicker-time, util-date', function() {
                $('.js-select-date').datepicker({
                    zIndex: 3000,
                    showTime: true,
                    closable: true,
                    select: function(e, ui) {
                        var date = ui.date.format('yyyy-MM-dd');
                        $(this).val(date);
                    }
                });
            });
        },
        //渲染专场
        renderTopic : function(sample, mainRec, loginId) {
            if(!sample.closest('#search-topic')[0]) {
                return;
            }
            sample.find('.hide').click();
            var baseData=sample.find('.show-win-2nd');
            baseData.data('mainRec', mainRec);
            //专场标题
            var subTopicName = mainRec.topicName;
            if(subTopicName) {
                subTopicName = mainRec.topicName.substring(0, 33);
                if(subTopicName !== mainRec.topicName) {
                    subTopicName = subTopicName + '...';
                }
            }
            subTopicName=$.util.escapeHTML(subTopicName);
            //设置logingId
            sample.closest('.detail').find('input[name="loginId"]').val(loginId);
            if(mainRec.enrollUrl) {
                subTopicName = '<a target="_blank" class="subTopicName" href="' + mainRec.enrollUrl + '">' + subTopicName + '</a>';
            }
            //设置收藏图标
            var isCollected = mainRec.isCollected;
            if(isCollected){
            	subTopicName = subTopicName + '<a class="js-act-collect-topic" href="#"><em class="icon icon-collection"></em></a>';
        		sample.find('.js-collect-operate').text('取消收藏');
            }else{
            	sample.find('.js-collect-operate').text('收藏专场');
            }
            	
            sample.find('.js-topic-name').html(subTopicName).find('.subTopicName').attr('title', mainRec.topicName);

            //专场状态
            var jsTopicState = sample.find('.js-topic-state');
            var jsTopicStateIcon = jsTopicState.siblings('em');
            var topicState = mainRec.state;
            if(mainRec.state === '即将开始') {
                topicState = topicState + '(' + mainRec.promotionBegin + '开始)';
            } else if(mainRec.state === '正在报名') {
                if(mainRec.promotionEnd) {
                    topicState = topicState + '(' + mainRec.promotionEnd + '过期)';
                }
            } else if(mainRec.state === '已结束') {
                topicState = topicState;
            } else if(mainRec.state === '已过期') {
                topicState = topicState + '(' + mainRec.promotionEnd + '过期)';
            }
            if(mainRec.state === '正在报名') {
                jsTopicStateIcon.removeClass('icon-time').addClass('icon-time-ov');
            } else {
                jsTopicStateIcon.removeClass('icon-time-ov').addClass('icon-time');
            }
            jsTopicState.text(topicState);
            //审核用户
            var auditMember = sample.find('.js-audit-member');
            var memberIcon = auditMember.closest('a').siblings('.js-icon');
            if(mainRec.enrollMember > 0 && mainRec.auditMember < mainRec.enrollMember) {
                memberIcon.addClass('icon-member-ov').removeClass('icon-member');
            } else {
                memberIcon.addClass('icon-member').removeClass('icon-member-ov');
            }
            auditMember.text(mainRec.auditMember);
            sample.find('.js-enroll-member').text(mainRec.enrollMember);
            //审核Offer
            var auditOffer = sample.find('.js-audit-offer');
            var offerIcon = auditOffer.closest('a').siblings('.js-icon');
            if(mainRec.enrollOffer > 0 && mainRec.auditOffer < mainRec.enrollOffer) {
                offerIcon.addClass('icon-offer-ov').removeClass('icon-offer');
            } else {
                offerIcon.addClass('icon-offer').removeClass('icon-offer-ov');
            }
            auditOffer.text(mainRec.auditOffer);
            sample.find('.js-enroll-offer').text(mainRec.enrollOffer);
            
            //流程状态
            var jsWorkflowState = sample.find('.js-workflow-state');
            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
            if(mainRec.workFlowState === '设计中') {
                jsWorkflowState.text('设计师：' + mainRec.curOwnerCn);
                jsWorkflowStateIcon.removeClass('icon-designer').addClass('icon-designer-ov');
            } else {
                jsWorkflowState.text(mainRec.workFlowState);
                jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
            }

            //创建人
            sample.find('.js-operator-topic').text(mainRec.operatorCn);

            //底部操作
            var jsOrderNum = sample.find('.js-act-order-num');
            if(mainRec.seriesType === 1) {
	            if(mainRec.orderNum === 0) {
	                jsOrderNum.find('.txt').text('置顶');
	            } else {
	                jsOrderNum.find('.txt').text('取消置顶');
	            }
	            jsOrderNum.removeClass('display-none');
            }else{
            	jsOrderNum.addClass('display-none');
            }
            //操作面板
            //显示合适的修改页面设置 修改报名设置按钮
            var editTopic = sample.find('.js-act-edit-topic');
            var editTopicConfig = sample.find('.js-act-edit-topic-config');
            if(mainRec.seriesType === 1) {
                if(mainRec.pageId && mainRec.pageId > 0){ //有pageId的可以修改页面设置
                    editTopic.attr('href', T.domain + '/enroll/v2012/topic.htm?topicId=' + mainRec.topicId).closest('li').removeClass('display-none');
                }else{  //无pageId的加一个标识参数，便于排查问题（不影响逻辑流程）
                    editTopic.attr('href', T.domain + '/enroll/v2012/topic.htm?isJump=y&topicId=' + mainRec.topicId).closest('li').removeClass('display-none');
                }
                editTopicConfig.attr('href', T.domain + '/enroll/v2012/topic_config.htm?topicId=' + mainRec.topicId).closest('li').removeClass('display-none');
            }else if(mainRec.seriesId === 106){
            	editTopicConfig.attr('href', T.domain + '/enroll/vip_auto.htm?id=' + mainRec.topicId).closest('li').removeClass('display-none');
                editTopic.closest('li').addClass('display-none');
            } else {
                editTopicConfig.attr('href', T.domain + '/enroll/topic.htm?id=' + mainRec.topicId).closest('li').removeClass('display-none');
                editTopic.closest('li').addClass('display-none');
            }
            //预览\开始设计
            var preview = sample.find('.js-act-preview');
            var design = sample.find('.js-act-design');
            if(mainRec.pageId && mainRec.pageId > 0) {
                preview.data('pageid', mainRec.pageId).closest('li').removeClass('display-none');
                design.data('pageid', mainRec.pageId).closest('li').removeClass('display-none');
            } else {
                preview.closest('li').addClass('display-none');
                design.closest('li').addClass('display-none');
            }
            //流程状态按钮:提交给ued/分配设计师/运营确认设计
            //触发事件，状态变化后，并不打算重新渲染相应按钮，因为下一个状态一般是另一个角色触发的，没必要急于给当前角色显示另一个状态下的按钮
            var commitUed = sample.find('.js-act-commit-ued')
            var assignUed = sample.find('.js-act-assign-ued')
            var operateConfirm = sample.find('.js-act-operate-confirm')
            if(mainRec.workFlowState === '未提交') {
                commitUed.closest('li').removeClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            } else if(mainRec.workFlowState === '未分配') {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').removeClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            } else if(mainRec.workFlowState === '设计中') {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').removeClass('display-none');
            } else {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            }
            //是否显示结束报名按钮
            var endTopic = sample.find('.js-act-end-topic').closest('li');
            if(mainRec.promotionEnd && (mainRec.state === '即将开始' || mainRec.state === '正在报名')) {
                endTopic.removeClass('display-none');
            } else {
                endTopic.addClass('display-none');
            }
            //是否显示删除专场按钮
            var delTopic = sample.find('.js-act-del-topic').closest('li');
            if(mainRec.enrollMember <= 0) {
                delTopic.removeClass('display-none');
            } else {
                delTopic.addClass('display-none');
            }

            sample.find('.js-act-copy-topic').attr('href', T.domain + '/enroll/v2012/topic_config.htm?iscopy=1&topicId=' + mainRec.topicId);
            sample.find('.js-act-audit-member,.js-act-audit-member2').attr('href', T.domain + '/enroll/v2012/audit_member.htm?seriesId=' + mainRec.seriesId + '&topicId=' + mainRec.topicId+ '&topicName=' + mainRec.topicName);
            sample.find('.js-act-audit-offer,.js-act-audit-offer2').attr('href', T.domain + '/enroll/v2012/audit_offer.htm?seriesId=' + mainRec.seriesId + '&topicId=' + mainRec.topicId + '&topicName=' + mainRec.topicName);
            sample.find('.js-act-data-classify').attr('href', T.domain + '/topic/enroll_offer.htm?topic_id=' + mainRec.topicId);
            sample.find('.js-act-view-topic').attr('href', T.domain + '/enroll/v2012/view_topic.htm?topicId=' + mainRec.topicId);
            sample.find('.js-act-make-page').attr('href', T.domain + '/enroll/v2012/edit_page.htm?topicId=' + mainRec.topicId);
            sample.find('.js-act-page-mgr').attr('href', T.cmsDomain + '/page/box/minieditor_search.html?action=PageManager&event_submit_do_searchTopicPage=true&pageType=BOX&pageId=' + mainRec.pageId + '&topicId=' + mainRec.topicId);

			var arrange = sample.find('.js-act-arrange-block');
			arrange.attr('href', T.domain + '/enroll/v2012/arrange_block.htm?topicId=' + mainRec.topicId);
			arrange.closest('li').removeClass('display-none');
        }
    }
})(jQuery, FE.tools);
