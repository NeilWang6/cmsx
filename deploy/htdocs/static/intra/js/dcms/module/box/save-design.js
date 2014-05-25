/**
 * @author hongss
 * @userfor �������ҳ������ģ���е����ݲ���
 * @date  2012.02.13
 */

;(function($, D, undefined) {
    /**
     * @methed sendContent �������ҳ������ģ���е����ݲ���
     * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
     pageIdInput:input(jQuery���󣬴��pageId),
     draftIdInput:input(jQuery���󣬴��draftId),
     data: json(����������Ҫ�Ĳ�������pageId��draftId��content),
     //isReview:boolean(�Ƿ���Ԥ��),
     success:fn(����ɹ���Ļص�����),
     error:fn(����ʧ�ܺ�Ļص�����),
     complete: fn(�����ִ�У����δ�޸Ĺ�Ҳִ��)
     //previewUrl:url
     }
     */
    D.sendContent = {
        /*init: function(opts){
        if (!(opts['container']&&opts['pageIdInput']
        &&opts['draftIdInput']&&opts['data'])){ return; }

        if (D.BoxTools.getIsEdited()===true){
        this._requestSave(opts);
        } else {
        if (opts['isReview']===true){
        this._openReview(opts);
        }
        if (opts['aftersave'] && $.isFunction(opts['aftersave'])===true){
        opts['aftersave'].call(this);
        }
        }
        },*/
        /**
         * @methed save ����
         * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
         *                    pageIdInput:input(jQuery���󣬴��pageId),
         *                      draftIdInput:input(jQuery���󣬴��draftId),
         *                        form: form(jQuery����form��)
         *                  }
         */
        save : function(opts) {
            if(!(opts['container'] && opts['pageIdInput'] && opts['draftIdInput'] && opts['data'])) {
                return;
            }
            if(D.BoxTools.getIsEdited() === true) {
                this._requestSave(opts);
            } else {
                if(opts['preType'] === 'template') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
                    var draftId = opts['draftIdInput'].val();
                    window.location = D.domain + '/page/box/preview_template.html?flag=' + opts['flag'] + ( draftId ? '&draftId=' + draftId : '') + (opts['templateId'] ? '&templateId=' + opts['templateId'] : '') + (opts['templateType'] ? '&templateType=' + opts['templateType'] : '');
                    return;
                }
                if(opts['preType'] === 'page') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
                    var draftId = opts['draftIdInput'].val();
                    window.location = D.domain + '/page/box/preview_page.html?from=' + opts['from'] + ( draftId ? '&draftId=' + draftId : '') + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
                    return;
                }
                if(opts['preType'] === 'dynamicPage') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
                    var draftId = opts['draftIdInput'].val();
                    window.location = D.domain + '/page/dynamic/view_page.html?action=dynamic_page_manager_action&event_submit_do_view_page=true'  + ( draftId ? '&draftId=' + draftId : '') + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
                    return;
                }
                if(opts['complete'] && $.isFunction(opts['complete']) === true) {
                    opts['complete'].call(this);
                }
            }
        },
        /**
         * @methed save ����
         * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
         *                        pageIdInput:input(jQuery���󣬴��pageId),
         *                          draftIdInput:input(jQuery���󣬴��draftId),
         *                            content:input(jQuery���󣬴��content),
         *                              form: form(jQuery����form��),
         *                                previewUrl:url
         *                     }
         */
        review : function(opts) {
            if(!(opts['content'] && opts['pageIdInput'] && opts['container'] && opts['previewUrl'] && opts['draftIdInput'] && opts['form'])) {
                return;
            }

            var url = D.domain + opts['previewUrl'];
            //+'?draftId=' + opts['draftIdInput'].val()
            // opts['form'].attr('target', '_blank');
            opts['form'].attr('action', url);
            opts['content'].val(this.getContainerHtml(opts['container']));
            opts['form'].submit();
        },
        /**
         * @methed _requestSave ���ͱ�������
         * @param opts ������  ͬ��
         */
        _requestSave : function(opts) {
            var self = this, url = D.domain + '/page/box/save_draft.htm?_input_charset=UTF-8',
            //data = {},
            pageId = opts['pageIdInput'].val(), draftId = opts['draftIdInput'].val(), tempType;
            if(opts['templateTypeInput']) {
                tempType = opts['templateTypeInput'].val();
            }

            //data['action'] = 'BoxDraftAction';
            //data['event_submit_do_savePageDraft'] = 'true';
            if(pageId) {
                opts.data['resourceId'] = pageId;
            }
            if(draftId) {
                opts.data['draftId'] = draftId;
            }
            if(tempType) {
                opts.data['templateType'] = tempType;
            }

            if(opts['flag']) {
                opts.data['isLib'] = opts['flag'];
            } else {
                opts.data['isLib'] = 'F';
            }

            opts.data['content'] = self.getContainerHtml(opts.container);

            $.ajax({
                url : url,
                type : 'POST',
                data : opts.data,
                timeout : 15000, //��ʱʱ��
                success : function(o) {
                    o = $.parseJSON(o);
                    if(o.success === true) {
                        var temp = draftId || o.draftId;
                        if(opts['preType'] === 'template') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
                            window.location = D.domain + '/page/box/preview_template.html?draftId=' + temp + '&flag=' + opts['flag'] + (opts['templateId'] ? '&templateId=' + opts['templateId'] : '') + (opts['templateType'] ? '&templateType=' + opts['templateType'] : '');
                            return;
                        }
                        if(opts['preType'] === 'page') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
                            window.location = D.domain + '/page/box/preview_page.html?draftId=' + temp + '&from=' + opts['from'] + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
                            return;
                        }
                        if(!draftId && o.draftId) {
                            opts['draftIdInput'].val(o.draftId);
                        }
                        if(!pageId && o.pageId) {
                            opts['pageIdInput'].val(o.pageId);
                        }
                        /*if (opts['isReview']===true){
                         self._openReview(opts);
                         }*/
                        D.BoxTools.resetEdited();
                        if(opts['success'] && $.isFunction(opts['success']) === true) {
                            opts['success'].call(this, o);
                        }

                        if(opts['complete'] && $.isFunction(opts['complete']) === true) {
                            opts['complete'].call(this, o);
                        }
                    } else {
                        //���治�ɹ�ʱ�Ĵ���
                        if(opts['error'] && $.isFunction(opts['error']) === true) {
                            opts['error'].call(this, o);
                        } else {
                            //alert('ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���');
                            D.Msg.error({
                                timeout : 5000,
                                message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
                            });
                        }
                    }
                },
                error : function(o) {
                    //���治�ɹ�ʱ�Ĵ���
                    if(opts['error'] && $.isFunction(opts['error']) === true) {
                        opts['error'].call(this, o);
                    } else {
                        D.Msg.error({
                            timeout : 5000,
                            message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
                        });
                    }
                }
            });
        },
        /**
         * @methed getContainerHtml ��ȡ������HTML���룬��Ҫ�������޳�ϵͳ����ӵ�������class����
         * @param container ָ������
         */
        getContainerHtml : function(container) {
            var div = $('<div />'), CONSTANTS = D.sendContent.CONSTANTS;
            //div.html(container.html());
            D.InsertHtml.init(container.html(), div, 'html', false);
            //ȥ�����༭���ݡ�ʱ�ӵ�class��
            this._removeClassName(div, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
            //ȥ�����༭�ؼ���ʱ�ӵ�class��
            this._removeClassName(div, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);
            //ȥ������ǰԪ�ء�����ʱ�ӵ�class��
            this._removeClassName(div, CONSTANTS.TARGET_CURRENT_CLASS_NAME);
            this._removeClassName(div, CONSTANTS.LAYOUT_HIGHT_CLASS_NAME);
            //ȥ����JSʧЧ��ʱ�����ӵ�class��
            this._removeClassName(div, CONSTANTS.JS_CONTROL_CURRENT);
            //ɾ������ǰ�����ı�ʶ����
            this._removeElements(div, '.' + CONSTANTS.ENABLE_BEFORE_CLASS_NAME + ', .' + CONSTANTS.ENABLE_AFTER_CLASS_NAME);
            this._removeClassName(div, CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
            
            //ȥ��������Ϣ
            this._removeElements(div, '.'+D.box.editor.config.CLASS_ERROR_MESSAGE);
            this._removeClassName(div, D.box.editor.config.CLASS_POSITION_RELATIVE);
            
            return div.html();
        },
        /**
         * @methed _romveClassName �Ƴ�class��
         * @param container ָ������
         */
        _removeClassName : function(container, className) {
            container.find('.' + className).removeClass(className);
        },
        /**
         * @methed _removeElements �Ƴ�Ԫ��
         * @param container ָ������
         */
        _removeElements : function(container, selector) {
            container.find(selector).remove();
        },
        /**
         * @methed _openReview ��Ԥ��ҳ��
         * @param opts ��������������ע��
         */
        _openReview : function(opts) {
            var pageId = opts['pageIdInput'].val(), url = D.domain + opts['previewUrl'] + '?draftId=' + opts['draftIdInput'].val();
            if(pageId) {
                url += '&pageId=' + pageId;
            }
            window.open(url);
        }
    }

    D.sendContent.CONSTANTS = {
        ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area', //���༭���ݡ�ʱ�ӵ�class��
        ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell', //���༭�ؼ���ʱ�ӵ�class��
        TARGET_CURRENT_CLASS_NAME : 'crazy-box-target-current', //����ǰԪ�ء�����ʱ�ӵ�class��
        ENABLE_BEFORE_CLASS_NAME : 'crazy-box-before-singer', //������ǰ��������ݵı�ʶclass��
        ENABLE_AFTER_CLASS_NAME : 'crazy-box-after-singer', //�����ں���������ݵı�ʶclass��
        JS_CONTROL_CURRENT : 'crazy-box-control-current', //��JSʧЧ��ʱ�����ӵ�class��
        LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red',
        HEIGHT_LIGHT_CELL_CURRENT : 'crazy-box-cell-current'   //����ǰcell������ʱ�ӵ�class��
    }

})(dcms, FE.dcms);
