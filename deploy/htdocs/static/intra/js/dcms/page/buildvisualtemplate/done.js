/**
 * @package FD.app.cms.previewpage
 * @author: hongss
 * @Date: 2011-08-10
 */

 ;(function($, D){
    var POSITION_TAG = 'POSITION',
    TEMPLATE_TAG = 'TEMPLATE',
    OPERATE_DIV_HEIGHT = 24,
    positionOperate = $('operate.js-operate-position'),
    templateOperate = $('operate.js-operate-template'),
    pageid = $('.dcms-editpage-container').attr('pageid'),
    positionId, positionCode, templateCode, 
    currentMod, editObj,coverObj,
    awakeEl = $('#dcms-message-awake'),
    confirmEl = $('#dcms-message-confirm'),
    readyFun = [
        /**
         * �����е�TDP����������writeable="false"
         */
        function(){
            $('tdp').attr('writeable', 'false');
        },
        /**
         * ��̬����iframe�����ڱ�������
         */
        function(){
            $('#dcms-save-content-form').before($('<iframe name="saveModPageCode" style="display:none"></iframe>'));
        },
        /**
         * ʵ�������ֶ��󣬲���show��hide�ص���ʵ�ֲ��������ʾ������
         */
        function(){
            coverObj = new D.Cover({
                show: function(el){
                    var operate = el.children('operate');
                    operate.hide();
                },
                hide: function(el){
                    var operate = el.children('operate');
                    if ((operate.length===0)){
                        operate = getOperate(el).clone();
                        el.append(operate);
                    }
                    setOperateOffset(el, operate);
                    operate.show();
                    currentMod = el;
                }
            });
            
            //������ȷ�Ĳ��������
            function getOperate(el){
                var operate;
                if (el[0].tagName.toUpperCase()===POSITION_TAG){
                    operate = positionOperate;
                } else {
                    operate = templateOperate;
                }
                return operate;
            }
        },
        /**
         * ҳ��λ�á���ͨģ�� 
         */
        function(){
            var lockEl = $('operate .dcms-edit-lock-cover'),
            unlockEl = $('operate .dcms-edit-unlock-cover'),
            otherEditOperate = $('operate .dcms-edit-other-operate');
            
            lockEl.live('click', function(e){
                e.preventDefault();
                var el = $(this),
                mod = currentMod.children(':not(operate)');
                coverObj.lock();
                el.hide();
                el.siblings('.dcms-edit-operate').show();
                //ִ����Ȩ����ʾ
                
                //������ӻ��༭
                editObj = new D.Viewedit(mod, {
                    container: currentMod,
                    lockable: false
                });
                $(window).bind('resize', function(e){
                    var container = getContainer(el),
                    operate = container.find('operate');
                    setOperateOffset(container, operate);
                });
            });
            
            unlockEl.live('click', function(e){
                e.preventDefault();
                var el = $(this);
                
                //�������ִ��
                //D.Savecode.module(currentMod);
                saveCode(currentMod, 'event_submit_do_save_template');
                
                //����ɹ���Ĳ���
                editObj.unbindBeforeunload();
                quitEditStat(el);
            });
            
            $('operate .dcms-edit-quit').live('click', function(e){
                e.stopPropagation();
                var el = $(this);
                el.parents('.dcms-other-operate-list').hide(),
                container = getContainer(el);
                //����
                var templates = container.find('parse').andSelf(),
                arrRec = [];
                templates.each(function(){
                    var el = $(this);
                    if (el.data('isLocked')){
                        arrRec.push(el.attr('templatecode'));
                    }
                });
                if (arrRec.length>0){
                    var resourceCode = arrRec.join(',');
                    editObj.requestUnlock(container, resourceCode, 'template', true, false, container);
                }
                
                //�˳�
                quitEditStat(el);
            });
            
            $('operate .dcms-edit-revoke').live('click', function(e){
                if (editObj && editObj.isCouldRevoke()===true){
                    editObj.revoke();
                }
            });
            $('operate .dcms-edit-resume').live('click', function(e){
                if (editObj && editObj.isCouldResume()===true){
                    editObj.resume();
                }
            });
            
            //���otherEditOperateʱ����ʾ�༭���ݵ���������
            otherEditOperate.live('click', function(e){
                var el = $(this);
                el.find('.dcms-other-operate-list').slideDown(400);
                //���ó���/�ָ��Ƿ�ɲ�������ʽ
                if (editObj){
                    setCouldDoStyle(editObj.isCouldRevoke(), el.find('.dcms-edit-revoke'), '#333', '#666');
                    setCouldDoStyle(editObj.isCouldResume(), el.find('.dcms-edit-resume'), '#333', '#666');
                }
            });
            
            //������Ƴ�.dcms-edit-operateʱ�����ر༭���ݵ���������
            $('operate .dcms-edit-operate').live('mouseleave', function(e){
                var el = $(this);
                el.find('.dcms-other-operate-list').slideUp(400);
            });
            
            //���ó���/�ָ��Ƿ�ɲ�������ʽ
            function setCouldDoStyle(is, el, color1, color2){
                if (is===true){
                    el.css('color', color1);
                } else {
                    el.css('color', color2);
                }
            }
        },
        /**
         * ����ҳ�����ݵĴ���
         */
        function(){
            var bar = $('.dcms-edit-page-bar'),
            container = $('.dcms-editpage-container'),
            writeable = container.attr('writeable'),
            beforeEdit = $('.dcms-before-edit', bar),
            afterEdit = $('.dcms-after-edit', bar),
            editBtn = $('.dcms-page-into-edit', bar),   //ҳ�����ݱ༭
            saveBtn = $('.dcms-page-save-edit', bar),   //���沢�˳�
            quitBtn = $('.dcms-page-quit-edit', bar),   //ֱ���˳�
            revokeBtn = $('.dcms-page-revoke-edit', bar),    //����
            resumeBtn = $('.dcms-page-resume-edit', bar);    //�ָ�
            
            if (writeable==='false'){
                editBtn.removeClass('submit-btn');
                editBtn.addClass('dcms-disable');
            }
            
            editBtn.click(function(e){
                e.preventDefault();
                if (writeable==='true'){
                    var children = container.children().filter(':not(editpage)');
                    beforeEdit.hide();
                    afterEdit.show();
                    coverObj.lock();
                    //����ҳ�����ݿ��ӻ��༭
                    editObj = new D.Viewedit(children, {
                        container: container,
                        lockable: false
                    });
                } else {
                    D.Message.awake(awakeEl, {
                        msg: '�ܱ�Ǹ����û���޸�Ȩ�ޣ�',
                        relatedEl: bar
                    });
                }
            });
            saveBtn.click(function(e){
                e.preventDefault();
                //ִ�б���
                //D.Savecode.page(container);
                saveCode(container, 'event_submit_do_saveVisualTemplate');
                
                afterEdit.hide();
                beforeEdit.show();
                //����
                editObj.requestUnlock(bar, pageid, 'page', true, false, container);
                
                coverObj.unlock();
                //�˳����ӻ��༭�������editObj����
                editObj.quit();
                editObj = null;
            });
            
            revokeBtn.click(function(e){
                e.preventDefault();
                if (editObj){
                    editObj.revoke();
                    setReBtnClass();
                }
            });
            
            resumeBtn.click(function(e){
                e.preventDefault();
                if (editObj){
                    editObj.resume();
                    setReBtnClass();
                }
            });
            
            quitBtn.click(function(e){
                e.preventDefault();
                afterEdit.hide();
                beforeEdit.show();
                //����
                editObj.requestUnlock(bar, pageid, 'page', true, false, container);
                
                coverObj.unlock();
                //�˳����ӻ��༭�������editObj����
                editObj.quit();
                editObj = null;
            });
            
            bar.mouseover(function(){
                if (editObj){
                    setReBtnClass();
                }
            });
            
            function setCouldDoClass(is, el){
                var couldUse = 'submit-btn',
                cannotUse = 'cancel-btn';
                if (is===true){
                    el.addClass(couldUse);
                    el.removeClass(cannotUse);
                } else {
                    el.addClass(cannotUse);
                    el.removeClass(couldUse);
                }
            }
            
            function setReBtnClass(){
                setCouldDoClass(editObj.isCouldRevoke(), revokeBtn);
                setCouldDoClass(editObj.isCouldResume(), resumeBtn);
            }
        },
        /**
         * ������������ƺ��������׼��
         */
        function(){
            var operates = $('operate');
            operates.live('mouseenter', function(e){
                var currentEl = $(this),
                container = getContainer(currentEl),
                codeEditBtn = $('.dcms-edit-template', currentEl),
                posEditBtn = $('.dcms-edit-position', currentEl);
                if (container.length>0){
                    positionId = container.attr('positionid'),
                    positionCode = container.attr('positioncode'),
                    templateCode = container.attr('templatecode');
                }
                
                if (codeEditBtn.length>0){
                    codeEditBtn.attr('href', D.domain+'/page/edit_template.html?templateName='+templateCode);
                }
                if (posEditBtn.length>0){
                    posEditBtn.attr('href', D.domain+'/position/modify_position.html?id='+positionId);
                }
            });
        },
        /**
         * ��ȡ�����б�
         */
        function(){
            var rulesBtn = $('operate .dcms-get-rule btn');
            rulesBtn.live('click', function(e){
                e.preventDefault();
                var el = $(this),
                container = getContainer(el),
                rulesContainer = el.next('ruleselect'),
                params = {};
                params['positionId'] = positionId;
                $.ajax({
                    url: D.domain+'/position/queryRuleList.html',
                    data: params,
                    dataType: 'jsonp',
                    success: function(o){
                        if(o && o.dataList && o.dataList.length>0){
                            var data = o.dataList,
                            strHtml = '<ul>';
                            for (var i=0, l=data.length; i<l; i++) {
                                strHtml += '<li templatecode="'+data[i].templateCode+'">'+data[i].ruleName+'</li>';
                            }
                            strHtml += '</ul>';
                            rulesContainer.html(strHtml);
                        } else {
                            rulesContainer.html('<ul><li>��������</li></ul>');
                        }
                        rulesContainer.slideDown(400);
                    },
                    error: function(){
                        rulesContainer.html('<ul><li>���ݼ���ʧ�ܣ�������</li></ul>');
                        rulesContainer.slideDown(400);
                    }
                });
            });
        },
        /**
         * ������Ƴ����򲿷�ʱ�������б�����
         */
        function(){
            var ruleEl = $('operate .dcms-get-rule');
            ruleEl.live('mouseleave', function(e){
                $(this).find('.dcms-rules-select').slideUp(400);
            });
        },
        /**
         * ��������б��е�ĳһ������
         */
        function(){
            var rulesList = $('operate .dcms-rules-select li');
            rulesList.live('click', function(e){
                e.preventDefault();
                var currentEl = $(this),
                tempCode = currentEl.attr('templatecode'),
                currentPath = D.domain+location.pathname+'?',
                currentSearch = location.search.replace('?', ''),
                args = currentSearch.split('&'),
                urlConfigO = {},
                urlConfig = {};
                
                //���ԭURL�и���������������һ������
                for (var i=0, l=args.length; i<l; i++){
                    var arg = args[i].split('=');
                    urlConfigO[arg[0]] = arg[1];
                }
                //����������Ĳ�������һ������
                urlConfig[ '_pos_'+positionCode ] = tempCode;
                
                //���¡��ϲ�������ϲ���������һ���µĲ�������
                urlConfig = $.extend(urlConfigO, urlConfig);
                
                args = [];
                for (var p in urlConfig){
                    if (p){
                        args.push(p+'='+urlConfig[p]);
                    }
                }
                location.href = currentPath + args.join('&');
            });
        },
        /**
         * ���dcms-choose-showʱ��ʾ������
         */
        function(){
            $('.dcms-edit-page-bar .dcms-choose-show').click(function(e){
                var parent = $(this).parent();
                parent.toggleClass('dcms-edit-page-bar-hide');
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
    
    //����containerԪ�أ�Ϊtemplate��position
    function getContainer(el){
        var container = el.parents('dtemplate');
        if (container.length===0){
            container = el.parents('position');
        }
        return container;
    }
    
    //���ò�����ĸߺͿ�
    function setOperateOffset(el, operate){
        var firstChild = el.children(':visible').filter(':not(style)').filter(':not(script)').filter(':not(link)').first();
        getFirstChild(firstChild);
        var position = firstChild.position(),
        top = position.top,
        left = position.left,
        marginTop = parseInt(firstChild.css('margin-top')),
        marginLeft = parseInt(firstChild.css('margin-left'));
        if (D.isNumber(marginTop)){
            top = top + marginTop;
        }
        if (D.isNumber(marginLeft)){
            left = left + marginLeft;
        }
        operate.css({'top': (top-OPERATE_DIV_HEIGHT)+'px', 'left': left+'px'});
        
        function getFirstChild(el){
            var text = $.trim(el.text()),
            nodeName = el[0].tagName.toUpperCase();
            
            if (nodeName==='TEXT'&&(text==='\n'||text==='')){
                getFirstChild(el.next());
            } else {
                firstChild = el;
            }
        }
    }
    
    
    
    //�˳����ӻ��༭״̬
    function quitEditStat(el){
        var parent = el.parents('.dcms-edit-operate');
        $(window).unbind('resize');
        parent.hide();
        parent.siblings('.dcms-edit-lock-cover').show();
        
        coverObj.unlock();
        //�˳����ӻ��༭�������editObj����
        editObj.quit();
        editObj = null;
    }
    //����Ҫ������������õ�from���У����ύ����
    function saveCode(el, eventName){
        var editContent = el.data('editcontent');
        $('#dcms-save-form-event').attr('name', eventName);
        $('#dcms-save-form-content').val(JSON.stringify(editContent));
        //console.log(JSON.stringify(editContent));
        $('#dcms-save-content-form').submit();
    }
    
    D.saveErrorMsg = function(msg){
        if (msg){
            var comfirmEl = $('#dcms-message-confirm'),
            cancelBtn = $('.js-cancel-btn', comfirmEl);
            cancelBtn.hide();
            D.Message.confirm(confirmEl, {
                title: '����ʧ����Ϣ',
                msg: msg,
                enter: function(){
                    cancelBtn.show();
                }
            });
        }
    }
    D.reLoadPage = function(templateIds){
        var comfirmEl = $('#dcms-message-confirm'),
        cancelBtn = $('.js-cancel-btn', comfirmEl);
        cancelBtn.hide();
	var msg = '��ϲ�㣬���ݱ���ɹ�';
	if(templateIds){
		msg = '<div class="dcms-save-templates"><h4>��ϲ�㣬ģ�屣��ɹ�</h4>';
		msg += '<dl><dt>�޸ĺ��ģ����Ҫ��˺������ߣ����������ģ��:</dt><ul>';
		$(templateIds).each(function(){
			msg += '<li><a target="_blank" href="/page/preview_template.html?template_name='+this.code+'">' + this.code + '</a></li>';
		});
		msg += '</ul></dl></div>';
	}
	
        D.Message.confirm(confirmEl, {
            title: '����ɹ�',
            msg: msg,
            enter: function(){
                cancelBtn.show();
                window.location.href = window.location.href;
            },
            cancel: function(){
                cancelBtn.show();
                window.location.href = window.location.href;
            }
        });
    }
 })(dcms, FE.dcms);
