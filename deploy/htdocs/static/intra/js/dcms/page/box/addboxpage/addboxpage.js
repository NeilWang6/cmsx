/**
 * @package FD.app.cms.rule.create
 * @author: zhaoyang.maozy
 * @Date: 2012-01-09
 */

 ;(function($, D){
    var addPageForm = $('#js-save-page'),
    releaseTimeDatepicker = $('#dcms-page-release-time'),
    intervalTime=$('#dcms-page-interval-time'),
    hostNameInput = $('#js-get-hostname'),
    readyFun = [
        /**
         * ��ʼ����Ŀ����
         */
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
            var popTree = new D.PopTree({modify: function(){
                $('#selectCatBtn').parent().find('.dcms-validator-error').css('display','none');
            }}),
            categoryIdEl = $('#selCategoryId'),
            categoryEl = $('#selcategoryName'),
            selectCatBtn = $('#selectCatBtn');
            
            popTree.show(selectCatBtn, categoryEl, categoryIdEl, false);
            selectCatBtn.click(function(){
                popTree.show(selectCatBtn, categoryEl, categoryIdEl);
            });
        },
        /**
         * ѡ������
         */
        function(){
            var hostNameSpan = $('#js-page-hostname'),
            hostName = hostNameInput.val();
            if (hostName){
                hostNameSpan.text('http://'+$(':selected', hostNameInput).text());
            }
            hostNameInput.change(function(){
                hostNameSpan.text('http://'+$(':selected', $(this)).text());
            });
        },
        /**
         * ��ҳ���򵼣�ѡ��layout�Ի���
         */
        function(){
            var layoutDialogEl = $('#dcms-select-layout'),
            closeBtn = $('.close-btn', layoutDialogEl),
            layListUl = $('.list-layout', layoutDialogEl),
            layoutDialog;
            
            //��ʾѡ��layout�Ի���
            $('#js-open-page-guid').click(function(e){
                e.preventDefault();
                layoutDialog = layoutDialogEl.dialog({
                    fixed: true,
                    center: true
                });
            });
            
            //�Ի��򡰹رա��¼�
            closeBtn.click(function(e){
                e.preventDefault();
                layoutDialog.dialog('close');
            });
            
            layListUl.delegate('a', 'click', function(e){
                e.preventDefault();
                var layoutId = $(this).data('layoutid');
                $('#dcms-form-template-id').val(layoutId);
                $('#dcms-form-event-type').attr('name', 'event_submit_do_getLayoutcode');
                layoutDialog.dialog('close');
                addPageForm.submit();
            });
        }, 
        /**
         * ���ʱ��ؼ�
         */
        function(){
            var nowDate = new Date().format() + ' 00:00:00';
            releaseTimeDatepicker.datepicker({
                triggerType: 'focus',
                minDate: new Date(),
                date: new Date.parseDate(nowDate),
                showTime: true,
                select: function(e, ui){
                    doSelect(this, e, ui);
                },
                timeSelect: function(e, ui) {
                    doSelect(this, e, ui);
                    $(this).datepicker('hide');
                }
            });
            /**
             * ѡ��ʱ������ں�Ĳ���
             */
            function doSelect(el, e, ui) {
                var releaseTime=$(el);
                releaseTime.val(ui.date.format('yyyy-MM-dd hh:mm'));
            }
        },
        /**
         * �л���ʱ����ģʽ
         */
        function(){
            if ('timing'===intervalTime.val()) {
                releaseTimeDatepicker.css('display','inline');
            };
            intervalTime.change(function(){
                if('timing'===$(this).val()){
                    releaseTimeDatepicker.css('display','inline');
                }else{
                    releaseTimeDatepicker.css('display','none');
                }
            });
            
        },
        /**
         * ����֤
         */
        function(){
            var validEls = $('[vg=1]', addPageForm),
            formValid = new FE.ui.Valid(validEls, {
                onValid: function(res, o){
                    var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                    if (tip.length>1){
                        for (var i=0, l=tip.length-1; i<l; i++){
                            tip.eq(i).remove();
                        }
                    }
                    if (res==='pass') {
                        tip.removeClass('dcms-validator-error');
                    } else {
                        switch (res){
                            case 'required':
                                msg = o.key+' ����Ϊ��';
                                break;
                            case 'userIsWrong' :
                                msg = '�û�['+o.msg+']�����ڻ�Ȩ�޲���';
                                break;
                            default:
                                msg = '����д��ȷ������';
                                break;
                        }
                        tip.text(msg);
                        tip.addClass('dcms-validator-error');
                    }
                }
            });
            addPageForm.submit(function(){
                return formValid.valid();
            });
        }
    ];
     
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    D.checkReleaseTime = function(){
        if ('timing'===intervalTime.val()&&!releaseTimeDatepicker.val()) {
            return '��ѡ��ʱ��';
        }
        return true;
    }
    D.checkUserExist = function(config, handle){
        var self = this,
        userIds = $(this).val(),
        url = D.domain + '/page/check_user.html',
        opt = config['opt'],
        cfg = config['cfg'],
        data = {};
        data['users'] = userIds;
        data['permission'] = '';
        $.post(url, data, function(o){
            if (o!=='ok'){
                opt.msg = o;
                handle.call(self,'userIsWrong',opt);
            } else {
                cfg.isValid=true;
                handle.call(self,'pass',opt);
            }
        });
    }
 })(dcms, FE.dcms);
