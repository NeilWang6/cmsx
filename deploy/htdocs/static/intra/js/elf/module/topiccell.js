/**
 * @author lusheng.linls
 * @usefor ר��Cell ���������Ⱦ���¼��󶨡�ҳ��ȫ��ֻ��new T.Topiccell()һ�Σ�������ظ����¼�
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
    
    //�ղء�ȡ���ղ�ר��-�ύ�����޸�ҳ����ʽ
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
                 var msg = 'ִ��ʧ��';
                 if(jqXHR.status === 0) {
                     msg = 'ûȨ�ޣ�'
                 }
                 alert(msg);
                 return;
             },
             success : function(rs, textStatus, jqXHR) {
                 if(!rs.success) {
                     var msg = 'ִ��ʧ��';
                     if(rs.msg) {
                         msg = msg + ':' + rs.msg;
                     }
                     alert(msg);
                     return;
                 }
                 if(setCollect){
                	 el.find('.js-collect-operate').text('ȡ���ղ�');
                	 //��ֹҳ�淴Ӧ����ʱ�򣬶�ε�����ղ�ר���������¶��������Ͻǵ��ղ�ͼ��
	                 if (!el.find('.js-topic-name a.js-act-collect-topic')[0]){
	                	 el.find('.js-topic-name').append('<a href="#" class="js-act-collect-topic"><em class="icon icon-collection"></em></a>');
	                 }
                 }else{
                	 //����ǰtab���ҵ��ղأ���ôȡ���ղز��������ظ�ר����(sample)
                	 if($("#searchType").val()==="myCollection"){
                		 el.hide();
                	 }else{
	                	 el.find('.js-collect-operate').text('�ղ�ר��');
	                	 el.find('.js-topic-name a.js-act-collect-topic')[0].remove();
                	 }
                 }
             }
         });
    };
    
    T.Topiccell.prototype = {
        _init : function(scopeEl, opts) {
            var scopeEl = $(scopeEl), config = $.extend({}, T.Topiccell.defConfig, opts), self = this, csrfToken = scopeEl.find('input[name=_csrf_token]').val();

            //��������л�
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
            //�ö�/ȡ���ö�
            scopeEl.delegate('.js-act-order-num', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                var txt=el.find('.txt').text();
                var setTop=false;
                if(txt==='�ö�'){
                	setTop=true;
                }
                if(confirm('ȷ��Ҫ'+txt+'��')) {
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
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = 'ִ��ʧ��';
                                if(rs.msg) {
                                    msg = msg + ':' + rs.msg;
                                }
                                alert(msg);
                                return;
                            }
                            if(setTop){
	                            el.find('.txt').text('ȡ���ö�');
                            }else{
                            	el.find('.txt').text('�ö�');
                            }
                        }
                    });
                }
            });
            //��������
            scopeEl.delegate('.js-act-end-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("ȷ������������")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/close_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = 'ִ��ʧ��';
                                if(rs.msg) {
                                    msg = msg + ':' + rs.msg;
                                }
                                alert(msg);
                                return;
                            }
                            //ר��״̬
                            var jsTopicState = sample.find('.js-topic-state');
                            jsTopicState.text('�ѽ���');
                            var jsTopicStateIcon = jsTopicState.siblings('em');
                            jsTopicStateIcon.removeClass('icon-time-ov').addClass('icon-time');
                        }
                    });
                }
            });
            //ɾ��ר��
            scopeEl.delegate('.js-act-del-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("ȷ��ɾ����ר����ע��ɾ�����ָܻ�������")) {
                    $.ajax({
                        url : T.domain + "/enroll/v2012/del_topic.json",
                        type : "post",
                        data : {
                            '_input_charset' : 'UTF-8',
                            'topicId' : baseData.data('mainRec').topicId,
                            '_csrf_token' : csrfToken
                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "ɾ��ʧ��";
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
            //��Ӫȷ�����
            scopeEl.delegate('.js-act-operate-confirm', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("Ҫȷ�������")) {
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
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "�ύʧ��";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                alert(msg);
                                return;
                            }
                            //����״̬
                            var jsWorkflowState = sample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            jsWorkflowState.text('������');
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            alert("�ύ�ɹ�");
                        }
                    });
                }
            });
            //�ύ��ued
            scopeEl.delegate('.js-act-commit-ued', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                if(confirm("ȷ���ύ��ued��")) {
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
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "�ύʧ��";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                alert(msg);
                                return;
                            }
                            //����״̬
                            var jsWorkflowState = sample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            jsWorkflowState.text('δ����');
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            alert("�ύ�ɹ�");
                        }
                    });
                }
            });
            //�������ʦ
            //�Ի���
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
            
            //�ղء�ȡ���ղ�ר��
            scopeEl.delegate('.js-act-collect-topic', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var sample = el.closest('.sample');
                var baseData = el.closest('.show-win-2nd');
                var loginId = el.closest('.detail').find('input[name="loginId"]').val();
                var txt=el.find('.txt').text();
                if(txt && txt=='�ղ�ר��'){
                	collectTopic(T.domain + "/enroll/v2012/collect_topic.json","post",baseData.data('mainRec').topicId,loginId,true,sample,csrfToken);
                }else{
                	if(confirm('��ȷ��Ҫȡ���ղ���')) {
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
                         jsDialog.find('.js-dialog-error').text('��������ʦ���������鳤�������ʱ��');
                         return;
                     }
                     if(!designer){
                         jsDialog.find('.js-dialog-error').text('��������ʦ');
                         return;
                     }
                     if(!suggest){
                         jsDialog.find('.js-dialog-error').text('�������鳤�������ʱ��');
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
                            var msg = 'ִ��ʧ��';
                            if(jqXHR.status === 0) {
                                msg = 'ûȨ�ޣ�'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "�ύʧ��";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                jsDialog.find('.js-dialog-error').text(msg);
                                return;
                            }
                            //����״̬
                            var jsWorkflowState = T.Topiccell.globalSample.find('.js-workflow-state');
                            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
                            var selectOption=jsDialog.find('.js-designer')[0];
                            jsWorkflowState.text('���ʦ��'+selectOption[selectOption.selectedIndex].text);
                            jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
                            jsDialog.find('.js-dialog-error').text('�ύ�ɹ�');
                        }
                    });
                });

            //���ڿؼ�
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
        //��Ⱦר��
        renderTopic : function(sample, mainRec, loginId) {
            if(!sample.closest('#search-topic')[0]) {
                return;
            }
            sample.find('.hide').click();
            var baseData=sample.find('.show-win-2nd');
            baseData.data('mainRec', mainRec);
            //ר������
            var subTopicName = mainRec.topicName;
            if(subTopicName) {
                subTopicName = mainRec.topicName.substring(0, 33);
                if(subTopicName !== mainRec.topicName) {
                    subTopicName = subTopicName + '...';
                }
            }
            subTopicName=$.util.escapeHTML(subTopicName);
            //����logingId
            sample.closest('.detail').find('input[name="loginId"]').val(loginId);
            if(mainRec.enrollUrl) {
                subTopicName = '<a target="_blank" class="subTopicName" href="' + mainRec.enrollUrl + '">' + subTopicName + '</a>';
            }
            //�����ղ�ͼ��
            var isCollected = mainRec.isCollected;
            if(isCollected){
            	subTopicName = subTopicName + '<a class="js-act-collect-topic" href="#"><em class="icon icon-collection"></em></a>';
        		sample.find('.js-collect-operate').text('ȡ���ղ�');
            }else{
            	sample.find('.js-collect-operate').text('�ղ�ר��');
            }
            	
            sample.find('.js-topic-name').html(subTopicName).find('.subTopicName').attr('title', mainRec.topicName);

            //ר��״̬
            var jsTopicState = sample.find('.js-topic-state');
            var jsTopicStateIcon = jsTopicState.siblings('em');
            var topicState = mainRec.state;
            if(mainRec.state === '������ʼ') {
                topicState = topicState + '(' + mainRec.promotionBegin + '��ʼ)';
            } else if(mainRec.state === '���ڱ���') {
                if(mainRec.promotionEnd) {
                    topicState = topicState + '(' + mainRec.promotionEnd + '����)';
                }
            } else if(mainRec.state === '�ѽ���') {
                topicState = topicState;
            } else if(mainRec.state === '�ѹ���') {
                topicState = topicState + '(' + mainRec.promotionEnd + '����)';
            }
            if(mainRec.state === '���ڱ���') {
                jsTopicStateIcon.removeClass('icon-time').addClass('icon-time-ov');
            } else {
                jsTopicStateIcon.removeClass('icon-time-ov').addClass('icon-time');
            }
            jsTopicState.text(topicState);
            //����û�
            var auditMember = sample.find('.js-audit-member');
            var memberIcon = auditMember.closest('a').siblings('.js-icon');
            if(mainRec.enrollMember > 0 && mainRec.auditMember < mainRec.enrollMember) {
                memberIcon.addClass('icon-member-ov').removeClass('icon-member');
            } else {
                memberIcon.addClass('icon-member').removeClass('icon-member-ov');
            }
            auditMember.text(mainRec.auditMember);
            sample.find('.js-enroll-member').text(mainRec.enrollMember);
            //���Offer
            var auditOffer = sample.find('.js-audit-offer');
            var offerIcon = auditOffer.closest('a').siblings('.js-icon');
            if(mainRec.enrollOffer > 0 && mainRec.auditOffer < mainRec.enrollOffer) {
                offerIcon.addClass('icon-offer-ov').removeClass('icon-offer');
            } else {
                offerIcon.addClass('icon-offer').removeClass('icon-offer-ov');
            }
            auditOffer.text(mainRec.auditOffer);
            sample.find('.js-enroll-offer').text(mainRec.enrollOffer);
            
            //����״̬
            var jsWorkflowState = sample.find('.js-workflow-state');
            var jsWorkflowStateIcon = jsWorkflowState.siblings('em');
            if(mainRec.workFlowState === '�����') {
                jsWorkflowState.text('���ʦ��' + mainRec.curOwnerCn);
                jsWorkflowStateIcon.removeClass('icon-designer').addClass('icon-designer-ov');
            } else {
                jsWorkflowState.text(mainRec.workFlowState);
                jsWorkflowStateIcon.removeClass('icon-designer-ov').addClass('icon-designer');
            }

            //������
            sample.find('.js-operator-topic').text(mainRec.operatorCn);

            //�ײ�����
            var jsOrderNum = sample.find('.js-act-order-num');
            if(mainRec.seriesType === 1) {
	            if(mainRec.orderNum === 0) {
	                jsOrderNum.find('.txt').text('�ö�');
	            } else {
	                jsOrderNum.find('.txt').text('ȡ���ö�');
	            }
	            jsOrderNum.removeClass('display-none');
            }else{
            	jsOrderNum.addClass('display-none');
            }
            //�������
            //��ʾ���ʵ��޸�ҳ������ �޸ı������ð�ť
            var editTopic = sample.find('.js-act-edit-topic');
            var editTopicConfig = sample.find('.js-act-edit-topic-config');
            if(mainRec.seriesType === 1) {
                if(mainRec.pageId && mainRec.pageId > 0){ //��pageId�Ŀ����޸�ҳ������
                    editTopic.attr('href', T.domain + '/enroll/v2012/topic.htm?topicId=' + mainRec.topicId).closest('li').removeClass('display-none');
                }else{  //��pageId�ļ�һ����ʶ�����������Ų����⣨��Ӱ���߼����̣�
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
            //Ԥ��\��ʼ���
            var preview = sample.find('.js-act-preview');
            var design = sample.find('.js-act-design');
            if(mainRec.pageId && mainRec.pageId > 0) {
                preview.data('pageid', mainRec.pageId).closest('li').removeClass('display-none');
                design.data('pageid', mainRec.pageId).closest('li').removeClass('display-none');
            } else {
                preview.closest('li').addClass('display-none');
                design.closest('li').addClass('display-none');
            }
            //����״̬��ť:�ύ��ued/�������ʦ/��Ӫȷ�����
            //�����¼���״̬�仯�󣬲�������������Ⱦ��Ӧ��ť����Ϊ��һ��״̬һ������һ����ɫ�����ģ�û��Ҫ���ڸ���ǰ��ɫ��ʾ��һ��״̬�µİ�ť
            var commitUed = sample.find('.js-act-commit-ued')
            var assignUed = sample.find('.js-act-assign-ued')
            var operateConfirm = sample.find('.js-act-operate-confirm')
            if(mainRec.workFlowState === 'δ�ύ') {
                commitUed.closest('li').removeClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            } else if(mainRec.workFlowState === 'δ����') {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').removeClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            } else if(mainRec.workFlowState === '�����') {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').removeClass('display-none');
            } else {
                commitUed.closest('li').addClass('display-none');
                assignUed.closest('li').addClass('display-none');
                operateConfirm.closest('li').addClass('display-none');
            }
            //�Ƿ���ʾ����������ť
            var endTopic = sample.find('.js-act-end-topic').closest('li');
            if(mainRec.promotionEnd && (mainRec.state === '������ʼ' || mainRec.state === '���ڱ���')) {
                endTopic.removeClass('display-none');
            } else {
                endTopic.addClass('display-none');
            }
            //�Ƿ���ʾɾ��ר����ť
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
