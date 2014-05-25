/**
 * @userfor ���ӻ��༭ - �༭����
 * @author hongss
 * @date 2011.08.11
 */

;(function($, D, undefined){
    D.Viewedit = function(els, config){
        this._init(els, config);
    };
    D.Viewedit.defConfig = {
        /*className: 'dcms-cover-editing',
        position: 'position',
        template: 'template',*/
        container: null,
        editDialog: 'edit.dcms-edit-dialog',
        editDialogTab: '.dcms-edit-tabs',
        editDialogUl: '.dcms-list-edit-titles',
        editDialogBox: '.dcms-tab-b',
        editDialogSubmit: '.dcms-edit-submit',
        editDialogCancel: '.dcms-edit-cancel',
        editBoxA: $('edit .dcms-eidt-a'),
        editBoxImg: $('edit .dcms-edit-img'),
        editBoxArea: $('edit .dcms-edit-area'),
        editBoxText: $('edit .dcms-edit-text'),
        editBoxAText: $('edit .dcms-edit-a-text'),
        attrName: 'writeable',   //�Ƿ�ɱ༭��������
        event: 'mouseup',
        specialEvent: 'ctrl mouseup',
        lockable: true,     //�Ƿ������Ĭ�ϼ���
        lockUrl: '/page/lock_resource.htm'  //��������
    };
    D.Viewedit.CONSTANTS = {
        EDIT_COVER_TAG_NAME: 'editcover',
        EDIT_COVER_CLASS_NAME: 'dcms-edit-cover',
        EDIT_BOX_DATA_EL:'editel',
        EDIT_INPUT_ATTR_TYPE:'edittype',
        EDIT_VALID_ELS_ATTR:'[dcmsvg=1]'
    };
    D.Viewedit.prototype = {
        _init: function(els, config){
            //���els�����ڣ����˳�
            //if (!els) { return; }

            var self = this,
            constants = D.Viewedit.CONSTANTS;
            self.config = $.extend(D.Viewedit.defConfig, config);
            self.editCoverObj = $('<'+constants.EDIT_COVER_TAG_NAME+' class="'+constants.EDIT_COVER_CLASS_NAME+'"></'+constants.EDIT_COVER_TAG_NAME+'>');
            self.editcovers = $(constants.EDIT_COVER_TAG_NAME+'.'+constants.EDIT_COVER_CLASS_NAME);
            self.els = els;
            self.awakeEl = $('#dcms-message-awake');
            self.confirmEl = $('#dcms-message-confirm');
            //��¼���޸ĵ����ݣ���������
            //���ݽṹ��[{"el":el, value:[ {"node":node, "nodeName":[beforeedit, nodeName], editType:[beforeedit, editType], editType1:[beforeedit, editType1], ...}, ... ] } , ... ]
            //ע�����ݸ�ʽ����˫���ŵ�Ϊ����
            self.modifyData = [];
            //��¼�����������ݣ�����ԭ�ã� ���ݸ�ʽͬ��
            self.cancelData = [];

            //�༭���ڵ������������֤
            self._initFormValid();

            //ʹ�����༭�����е�a����Ĭ�Ϲ���ʧЧ
            els.find('a').bind('click', function(e){
                e.preventDefault();
            });

            self._bindEvents();
        },
        /**
         * @methed _initFormValid ��ʼ������֤
         */
        _initFormValid: function(){
            var self = this;
            $.use('web-valid',function(){
                self.editValid = new FE.ui.Valid('', {
                    onValid: function(res, o){
                        var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                        if (res==='pass'){
                            tip.removeClass('dcms-validator-error');
                        } else {
                            switch (res){
                                case 'required':
                                    msg = '������'+o.key;
                                    break;
                                case 'url':
                                    msg = '��������ȷ��'+o.key;
                                    break;
                                default:
                                    msg = '��������ȷ������';
                                    break;
                            }
                            tip.text(msg);
                            tip.addClass('dcms-validator-error');
                        }
                    }
                });
            });
        },
        /**
         * @methed _bindEvents ������¼�
         */
        _bindEvents: function(){
            var self = this,
            editcovers = self.editcovers,
            els = self.els, timeId;

            editcovers.live('mouseenter', function(e){
                $(this).show();
            });
            editcovers.live('mouseleave mousedown', function(e){
                $(this).hide();
                if (e.type==='mousedown'){
                    els.unbind('mouseover');
                }
            });

            //�ɱ༭����ɱ༭��Ԫ��mouseenter�����֣�������ʾ
            els.bind('mouseover', function(e){
                if (timeId){
                    clearTimeout(timeId);
                    timeId = null;
                }
                timeId = window.setTimeout(function(){
                    if (self._isEditEl(e)){
                        var editable = self._getEditable(e);
                        if (editable){
                            self._setEditCover($(editable[0]));
                        }
                    }
                }, 200);
            });

            //�ɱ༭����ɱ༭��Ԫ��mouseleave��ɾ�����ֲ�
            /*els.bind('mouseout', function(e){
                if (timeId){
                    clearTimeout(timeId);
                    timeId = null;
                }
                timeId = window.setTimeout(function(){
                    if (self._isEditEl(e)){
                        var editable = self._getEditable(e);
                        if (editable){
                            self._hideEditCover($(editable[0]));
                        }
                    }
                }, 200);

            });*/

            //�ɱ༭����ɱ༭��Ԫ��mouseup�󣬽��б༭
            els.bind('mouseup', function(e){
                if (self._isEditEl(e)){
                    var editable = self._getEditable(e);

                    if (editable){
                        //�Ǳ༭��������
                        self._editOrLock(editable);

                        self._unbindEvents();
                    } /*else if (eidtable) {
                        //������˲��ɱ༭Ԫ��ʱִ��
                        this._requestLock(el, templateCode, mode);
                    }*/
                }
            });
        },
        /**
         * @methed _editOrLock �Ǳ༭��������
         * @param editable {array} [1)Ԫ�ض���  2)�Ƿ�ΪA��ǩ  3)A��ǩ���Ƿ�����Ԫ��]
         */
        _editOrLock: function(editable){
            var el = $(editable[0]),
            self = this,
            container = this._getContainer(el),
            resourceCode = container.attr('templatecode'),
            type = 'template';
            if (container.length===0){
                container = el.parents('.dcms-editpage-container');
                resourceCode = container.attr('pageid');
                type = 'page';
            }
            var isLocked = container.data('isLocked'),
            locking = container.data('locking'),
            unlocking = container.data('unlocking');
            if (isLocked===true || self.config.lockable===false){    //�����ģ���Ѿ����༭����������ֱ��ִ�б༭���ݷ���
                //ִ�б༭���룬���絯��ͼƬ��A���ӱ༭��
                self._handlerEditEl(editable, container);
            } else if(unlocking===true){
                D.Message.awake(self.awakeEl, {
                    msg: '���ڽ��������Եȡ���',
                    relatedEl: el
                });
            } else if(locking===true){   //�������������������ʾ��ʾ��Ϣ
                D.Message.awake(self.awakeEl, {
                    msg: '�����������������Եȡ���',
                    relatedEl: el
                });
            } else {  //������������
                this._requestLock(el, resourceCode, type, container, editable);
            }
        },
        /**
         * @methed _requestLock ��������
         * @param el {object} ��Ҫ�༭��Ԫ��
         * @param templateCode {string} ģ�������/ҳ��ID
         * @param type {object} ���ͣ�ģ��/ҳ��
         * @param container {object} ģ��Ԫ��
         * @param editable {array} [1)Ԫ�ض���  2)�Ƿ�ΪA��ǩ  3)A��ǩ���Ƿ�����Ԫ��]
         */
        _requestLock: function(el, resourceCode, type, container, editable){
            var self = this,
            params = {},
            url = D.domain + self.config.lockUrl;
            params['resourceCode'] = resourceCode;
            params['type'] = type;
            container.data('locking', true);
            //result = false;
            $.ajax({
                url: url,
                data: params,
                dataType: 'jsonp',
                success: function(o){
                    if (o){
                        if (o.success===true){  //�����ɹ�
                            //������������Ϣ
                            container.data('isLocked', true);

                            //ִ�б༭���룬���絯��ͼƬ��A���ӱ༭��
                            self._handlerEditEl(editable, container);
                            self._bindBeforeunload(el, resourceCode, type, 'false', container);
                        } else if(o.isAllow===true) {  //����ʧ�ܣ��������
                            D.Message.confirm(self.confirmEl, {
                                title: '�Ƿ����',
                                msg: '����Դ�ѱ�'+o.lockedUser+'��'+o.lockedTime+'����������������ȷ������������㡰ȡ������',
                                enter: function(){
                                    self.requestUnlock(el, resourceCode, type, false, true, container, editable);
                                }
                            });
                        } else if (o.isAllow===false && o.lockedUser) {   //����ʧ�ܣ��Ҳ��������
                            D.Message.awake(self.awakeEl, {
                                msg: '����Դ�ѱ�'+o.lockedUser+'��'+o.lockedTime+'����������Ȩ������',
                                relatedEl: el
                            });
                            //��Ȩ����ʱ����writeable����Ϊfalse
                            container.attr('writeable', 'false');
                        } else if(o.error){    //����ʧ�ܣ����ִ���
                            D.Message.awake(self.awakeEl, {
                                msg: o.error,
                                relatedEl: el
                            });
                            container.attr('writeable', 'false');
                        }
                    }
                    container.removeData('locking');
                },
                error: function(){
                    D.Message.awake(self.awakeEl, {
                        msg: '��������ʧ�ܣ��޷����б༭�����Ժ����ԣ�',
                        relatedEl: el
                    });
                    container.attr('writeable', 'false');
                    container.removeData('locking');
                }
            });
        },
        /**
         * @methed requestUnlock �������
         * @param el {object} ��Ҫ�༭��Ԫ��
         * @param resourceCode {string} ģ�������/ҳ��ID
         * @param type {object} ���ͣ�ģ��/ҳ��
         * @param container {object} ģ��Ԫ��
         * @param editable {array} [1)Ԫ�ض���  2)�Ƿ�ΪA��ǩ  3)A��ǩ���Ƿ�����Ԫ��]
         */
        requestUnlock: function(el, resourceCode, type, release, needLock, container, editable){
            var self = this,
            params = {},
            url = D.domain + '/page/unlock_resource.htm';
            params['type'] = type;
            params['resourceCode'] = resourceCode;
            params['lock'] = needLock;
            params['release'] = release;
            container.data('unlocking', true);
            $.ajax({
                url: url,
                data: params,
                dataType: 'jsonp',
                success: function(o){
                    if (needLock===true && o){
                        if (o.success===true){
                            container.data('isLocked', true);
                            D.Message.awake(self.awakeEl, {
                                msg: '�����ɹ������Խ��б༭��',
                                relatedEl: el
                            });
                            self._handlerEditEl(editable, container);
                            self._bindBeforeunload(el, resourceCode, type, 'false', container);
                        } else {
                            var msg = '',
                            result = o.result,
                            end = '<br />';
                            for (var i=0, l=result.length; i<l; i++){
                                if (i===l-1){
                                    end = '';
                                }
                                msg += result[i].code+'����ʧ�ܣ��������£�'+result[i].error+end;
                            }
                            D.Message.awake(self.awakeEl, {
                                msg: msg,
                                relatedEl: el
                            });
                        }
                    } else {
                        self.unbindBeforeunload();
                    }
                    container.removeData('unlocking');
                },
                error: function(){
                    if (needLock===true){
                        D.Message.awake(self.awakeEl, {
                            msg: '�������ʧ�ܣ����Ժ����ԣ�',
                            relatedEl: el
                        });
                    } else {
                        self.unbindBeforeunload();
                    }
                    container.removeData('unlocking');
                }
            });
        },
        /**
         * @methed _bindBeforeunload �� beforeunload�¼�
         * @param el {object} ��Ҫ�༭��Ԫ��
         * @param resourceCode {string} ģ�������/ҳ��ID
         * @param type {object} ���ͣ�ģ��/ҳ��
         * @param container {object} ģ��Ԫ��
         */
        _bindBeforeunload: function(el, resourceCode, type, needLock, container){
            var self = this;
            $(window).bind('beforeunload', function(){
                self.requestUnlock(el, resourceCode, type, true, needLock, container);

                return '��ǰ������δ���棡ȷ���뿪��';
            });
        },
        /**
         * @methed _unbindBeforeunload ��� beforeunload�¼�
         */
        unbindBeforeunload: function(){
            $(window).unbind('beforeunload');
        },
        /**
         * @methed _getContainer ��ȡ��Ӧ��ģ��Ԫ�أ�parse|template|position
         * @param el {object} ��Ҫ�༭��Ԫ��
         */
        _getContainer: function(el){
            var container = el.parents('parse');
            if (container.length===0){
                container = el.parents('dtemplate');
            }
            if (container.length===0){
                container = el.parents('position');
            }
            return container;
        },
        /**
         * @methed _unbindEvents �������¼�
         */
        _unbindEvents: function(){
            var self = this,
            editcovers = self.editcovers,
            els = self.els;
            //���editcovers��els��ص������¼�
            editcovers.die('mouseenter mouseleave mousedown');
            els.unbind('mouseover mouseout mouseup');
        },
        /**
         * @methed _isEditEl �Ƿ�Ϊ�ɱ༭Ԫ��
         * @param e {object} ��ѡ�������¼��Ķ���
         */
        _isEditEl: function(e){
            var tagName = e.target.nodeName.toUpperCase(),
            children = e.target.childNodes;
            if (tagName==='IMG' || tagName==='AREA' || tagName==='A'){
                return true;
            }
            /*if (tagName==='COVER'){
                return false;
            }*/
            for (var i=0, l=children.length; i<l; i++){
                var child = children[i],
                nodeValue = $.trim(child.nodeValue);
                if (child.nodeName.toUpperCase()==='#TEXT' && !(nodeValue==='\n'||nodeValue==='')){
                    return true;
                }
            }
            return false;
        },
        /**
         * @methed _getEditableEl ���ؿɱ༭��Ԫ��
         * @param e {object} ��ѡ���������¼�����
         */
        _getEditable: function(e){
            var config = this.config,
            target = $(e.target),
            isWrite = target.parents('['+config.attrName+']').attr(config.attrName),
            parentA = target.parents('a');
            if (isWrite==='false'){
                return false;     //��Ԫ�ز��ɱ༭
            }
            if (target[0].tagName.toUpperCase()==='A'){
                if (target.children().length>0){
                    return [target[0], true, true];
                }
                return [target[0], true, false];     //���ص�����ֵ�ĺ��壺1)Ԫ�ض���  2)�Ƿ�ΪA��ǩ  3)A��ǩ���Ƿ�����Ԫ��
            }
            if (parentA.length===0){
                return [target[0], false];
            } else if(parentA.length>0){
                return [parentA[0], true, true];
            }
        },
        /**
         * @methed _setEditCover ������ʾ�ɱ༭�����ֲ�
         * @param el {object} ��ѡ����Ҫ�����ֵ�Ԫ��
         */
        _setEditCover: function(el){
            var children = el.children();
            if (el[0].tagName.toUpperCase()==='A' && children.length===1 && children[0].tagName.toUpperCase()==='IMG'){
                //edited �������ڼ�¼���޸ĵ�Style���Ա��ڱ������ʱ��ԭ����
                //edited="pos"ʱ˵���޸���position:relative��edited="dis"˵���޸���display:inline-block
                var edited = el.attr('edited');
                el.css('display','inline-block');
                (edited && edited==='pos') ? el.attr('edited', 'pos,dis') : el.attr('edited', 'dis');
            }

            var editCoverEl = this._getEditCoverEl(el),
            elOffset = this._getEditElOffset(el);

            //�ж�editCoverEl�Ƿ���ڣ�������show���������el����
            if (editCoverEl.length>0){
                editCoverEl.show();
            } else {
                editCoverEl = this.editCoverObj.clone();
                el.after(editCoverEl);
            }
            editCoverEl.css({'top':elOffset[0]+'px', 'left':elOffset[1]+'px', 'height':elOffset[2]+'px', 'width':elOffset[3]+'px'});
        },
        /**
         * @methed _getEditElOffset ��ȡԪ�ص�top,left,height,width
         * @param el {object} ��ѡ����Ҫ��ȡ��Щ���ݵ�Ԫ��
         */
        _getEditElOffset: function(el, isOffset){
            var  width = el.outerWidth(),
            height = el.outerHeight(),
            position = (isOffset===true) ? el.offset() : el.position(),
            top = position.top,
            left = position.left,
            marginLeft = parseInt(el.css('margin-left')),
            marginTop = parseInt(el.css('margin-top'));

            if (D.isNumber(marginLeft)){
                left = left + marginLeft;
            }
            if (D.isNumber(marginTop)){
                top = top + marginTop;
            }
            return [top, left, height, width];
        },
        /**
         * @methed _hideEditCover ������ʾ�ɱ༭�����ֲ�
         * @param el {object} ��ѡ����Ҫ�����ֵ�Ԫ��
         */
        _hideEditCover: function(el){
            var editCoverEl = this._getEditCoverEl(el);
            if (editCoverEl){
                editCoverEl.hide();
            }
        },
        /**
         * @methed _getEditCoverEl �����ʾ�ɱ༭�����ֲ�Ԫ��
         * @param el {object} ��ѡ����Ҫ�����ֵ�Ԫ��
         */
        _getEditCoverEl: function(el){
            var constants = D.Viewedit.CONSTANTS;
            return el.next(constants.EDIT_COVER_TAG_NAME+'.'+constants.EDIT_COVER_CLASS_NAME);
        },
        /**
         * @methed _handlerEditEl �༭Ԫ�ز���
         * @param editable {array} �Զ������� [ 1)Ԫ�ض���,  2)�Ƿ�ΪA��ǩ,  3)A��ǩ���Ƿ�����Ԫ�� ]
         */
        _handlerEditEl: function(editable, container){
            var self = this,
            config = self.config,
            editEl = $(editable[0]),
            editDialog = self._createEditDialog(editable),
            editDialogBoxes = editDialog.find(config.editDialogBox),
            submitButton = editDialog.find(config.editDialogSubmit),
            cancelButton = editDialog.find(config.editDialogCancel),
            validEls = $(D.Viewedit.CONSTANTS.EDIT_VALID_ELS_ATTR, editDialog);

            //������Ҫ��֤��Ԫ��
            self.editValid.add(validEls);

            //��ȷ����ť�¼�
            submitButton.click(function(e){
                e.preventDefault();
                if (self.editValid.valid()===true){
                    var modification = {};
                    modification['el'] = editEl,
                    modification['value'] = [];
                    for (var i=0, l=editDialogBoxes.length; i<l; i++){
                        var editDialogBox = editDialogBoxes.eq(i);
                        modification['value'].push(self._editElContent(editDialogBox, true, container));
                    }
                    //���޸ĺ�����ݴ洢��modifyData��
                    self.modifyData.push(modification);
                    self._removeEl(editDialog);
                    self._bindEvents();
                    //ɾ����֤����е�Ԫ��
                    self.editValid.remove(validEls);
                }
            });
            //��ȡ����ť�¼�
            cancelButton.click(function(e){
                e.preventDefault();
                self._removeEl(editDialog);
                self._bindEvents();
                //ɾ����֤����е�Ԫ��
                self.editValid.remove(validEls);
            });
        },
        /**
         * @methed _createEditDialog ���ɱ༭�Ի���
         * @param editable {array} �Զ������� [ 1)Ԫ�ض���,  2)�Ƿ�ΪA��ǩ,  3)A��ǩ���Ƿ�����Ԫ�� ]
         */
        _createEditDialog: function(editable){
            var config = this.config,
            editEl = $(editable[0]),
            editDialog = $(config.editDialog).clone(),
            editDialogTab = editDialog.find(config.editDialogTab),
            editDialogUl = editDialog.find(config.editDialogUl),
            editBoxInfoes = this._getEditBoxInfoes(editable);
            for (var i=0, l = editBoxInfoes.length; i<l; i++){
                var editBoxInfo = editBoxInfoes[i],
                editDialogTitle = editBoxInfo['title'],
                editDialogBox = editBoxInfo['box'];
                editDialogUl.append(editDialogTitle);
                editDialogTab.append(editDialogBox);
                this._editElContent(editDialogBox, false);
            }

            editEl.after(editDialog);
            this._setEditTabTitlesWidth(editDialogUl);
            this._setEditDialogPosition(editEl, editDialog);

            $.use('ui-draggable', function(){
                editDialog.draggable();
            });
            $.use('ui-tabs', function(){
                var editTabs = editDialogTab.tabs({
                    isAutoPlay:false,
                    currentClass: 'dcms-current',
                    titleSelector: '.dcms-tab-t',
                    boxSelector: '.dcms-tab-b',
                    event:'click'
                });
            });

            editDialog.show();

            return editDialog;
        },
        /**
         * @methed _createEditDialog ���ɱ༭�Ի���
         * @param editable {array} �Զ������� [ 1)Ԫ�ض���,  2)�Ƿ�ΪA��ǩ,  3)A��ǩ���Ƿ�����Ԫ�� ]
         */
        _getEditBoxInfoes: function(editable){
            var editEl = editable[0],
            editBoxInfoes = [];
            if (editable[1]===true){
                if (editable[2]===true){
                    //���༭Ԫ��ΪA��ǩ��������Ԫ��ʱ
                    editBoxInfoes.push(this._getEditBoxInfo('A', editEl));

                    editBoxInfoes = this._getEditEls(editEl, editBoxInfoes);
                } else {
                    //���༭Ԫ��ΪA��ǩ������Ԫ��ʱ
                    var editBoxInfo = this._getEditBoxInfo('#A', editEl);
                    editBoxInfoes.push(editBoxInfo);
                }
            } else {
                //���༭Ԫ�ز���A��ǩʱ
                editBoxInfoes = this._getEditEls(editEl, editBoxInfoes);
            }

            return editBoxInfoes;
        },
        _getEditEls: function(node, editBoxInfoes){
            var childNodes = node.childNodes;
            if (childNodes.length>0){
                for (var i=0, l=childNodes.length; i<l; i++){
                    var child = childNodes[i],
                    nodeName = child.nodeName.toUpperCase(),
                    nodeValue = $.trim(child.nodeValue);
                    if (nodeName==='#TEXT' && (nodeValue==='\n'||nodeValue==='')){
                        continue;
                    }
                    if (nodeName==='COVER'){
                            continue;
                        }
                    if (nodeName==='A'){
                        nodeName='#A'
                    }
                    if ($(child).children().length>0){
                        this._getEditEls(child, editBoxInfoes);
                    } else {
                        var text = $.trim($(child).text());
                        if (text || nodeName==='IMG' || nodeName==='AREA'){
                            var editBoxInfo = this._getEditBoxInfo(nodeName, child);
                            editBoxInfoes.push(editBoxInfo);
                        }
                    }
                }
            } else {
                var nodeName = node.nodeName,
                editBoxInfo = this._getEditBoxInfo(nodeName, node);
                editBoxInfoes.push(editBoxInfo);
            }
            return editBoxInfoes;
        },
        /**
         * @methed _getEditBoxInfo ѡ��༭��
         * @param tagName {string} �༭Ԫ�ر�ǩ����
         */
        _getEditBoxInfo: function(tagName, node){
            var config = this.config,
            editBoxInfo = {};
            switch (tagName){
                case 'IMG':
                    editBoxInfo['box'] = config.editBoxImg.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="img �༭">img</list>';
                    break;
                case 'AREA':
                    editBoxInfo['box'] = config.editBoxArea.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="area �༭">area</list>';
                    break;
                case 'A':
                    editBoxInfo['box'] = config.editBoxA.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="a���� �༭">a</list>';
                    break;
                case '#A':
                    editBoxInfo['box'] = config.editBoxAText.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="ֻ�����ֵ�A���� �༭">a-text</list>';
                    break;
                default:
                    editBoxInfo['box'] = config.editBoxText.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="�ı� �༭">text</list>';
                    break;
            }
            editBoxInfo['box'].data(D.Viewedit.CONSTANTS.EDIT_BOX_DATA_EL, node);
            return editBoxInfo;
        },
        /**
         * @methed _setEditTabTitlesWdith ѡ��༭��
         * @param editDialogUl {object} �༭����tabs��title������Ԫ��
         */
        _setEditTabTitlesWidth: function(editDialogUl){
            var titles = editDialogUl.children(),
            length = titles.length,
            width = titles.eq(0).outerWidth(),
            ulWidth = editDialogUl.width();
            if (width*length>ulWidth){
                var elWidth = Math.floor(ulWidth/length)-1;
                titles.css('width', elWidth+'px');
            }
        },
        /**
         * @methed _setEditDialogPosition ���ñ༭���λ��
         * @param editEl {object} ��Ҫ�༭��Ԫ��
         * @param editDialog {object} �༭��
         */
        _setEditDialogPosition: function(editEl, editDialog){
            var body = document.body,
            clientWidth = $(body).width(),
            clientHeight = $(body).height(),
            dialogWidth = editDialog.outerWidth(),
            dialogHeight = editDialog.outerHeight(),
            //��ȡͨ��position�õ���λ������
            editElOffset = this._getEditElOffset(editEl),
            //��ȡͨ��offset�õ���λ������
            editElOffsetO = this._getEditElOffset(editEl, true),
            top = editElOffset[0],
            offTop = editElOffsetO[0],
            left = editElOffset[1]+editElOffset[3],
            offLeft = editElOffsetO[1]+editElOffsetO[3];
            if (offTop+dialogHeight>clientHeight){
                top = top-(offTop+dialogHeight-clientHeight);
            }
            if (offLeft+dialogWidth>clientWidth){
                left = left-(offLeft+dialogWidth-clientWidth);
            }
            editDialog.css({'top':top+'px', 'left':left+'px'});
        },
        /**
         * @methed _editDialogContent ���û��߻�ȡ�༭����input������
         * @param editDialogBox {object} ��Ҫ����input���ݵ�tab box
         * @param isSet {boolean} false:��ҳ���е������input�У�true����input�е������ҳ����
         */
        _editElContent: function(editDialogBox, isSet, container){
            var constants = D.Viewedit.CONSTANTS,
            node = editDialogBox.data(constants.EDIT_BOX_DATA_EL),
            nodeName = node.nodeName.toUpperCase(),
            inputs = editDialogBox.find('input'),
            config = this.config,
            modifyValue = {}, editContent = {},
            templateCode, cmsId;
            //��isSetΪtrueʱ����ȡ��ǰ�޸ĵĺۼ�
            if (isSet===true){
                var dataContent = config.container.data('editcontent');
                if (dataContent){
                    editContent = dataContent;
                }
                templateCode = container.attr('templatecode');
                if (!templateCode){
                    templateCode = container.attr('pageid');
                }
                if (!editContent[templateCode]){
                    editContent[templateCode] = {};
                }
            }

            if (nodeName==='#TEXT'){
                if (isSet===false){
                    $(inputs[0]).val(node.nodeValue);
                } else if(isSet===true){
                    var nodeValue = $(inputs[0]).val(),
                    beforeEdit = node.nodeValue,
                    parent = node.parentNode,
                    cmsId = parent.getAttribute('cmsid');

                    beforeEdit = (beforeEdit) ? beforeEdit : '';
                    if (beforeEdit!==nodeValue){
                        node.nodeValue = nodeValue;
                        modifyValue['node'] = node;
                        modifyValue['nodeName'] = nodeName;
                        modifyValue['text'] = [beforeEdit, nodeValue];
                        if (!editContent[templateCode][cmsId]){
                            editContent[templateCode][cmsId] = {};
                        }
                        editContent[templateCode][cmsId]['body'] = $.util.escapeHTML($.util.unescapeHTML(nodeValue));
                    }
                }

            } else {
                var el = $(node);
                if (isSet===true){
                    modifyValue['node'] = node;
                    modifyValue['nodeName'] = nodeName;
                    cmsId = el.attr('cmsid');
                    if (!editContent[templateCode][cmsId]){
                        editContent[templateCode][cmsId] = {};
                    }
                }

                for (var i=0, l=inputs.length; i<l; i++){
                    var input = inputs.eq(i),
                    editType = input.attr(constants.EDIT_INPUT_ATTR_TYPE);
                    if (editType==='text'){
                        if (isSet===false){
                            input.val(el.html());
                        } else if(isSet===true){
                            var editValue = $.util.escapeHTML($.util.unescapeHTML(input.val())),
                            beforeEdit = $.util.escapeHTML($.util.unescapeHTML(el.html()));
                            beforeEdit = (beforeEdit) ? beforeEdit : '';

                            if (beforeEdit!==editValue){
                                el.html(editValue);
                                modifyValue[editType] = [beforeEdit, editValue];
                                //�޸ļ�¼�����ڱ�������
                                editContent[templateCode][cmsId]['body'] = editValue;
                            }
                        }
                        continue;
                    }
                    if (isSet===false){
                        input.val(el.attr(editType));
                    } else if(isSet===true){
                        var editValue = $.util.escapeHTML($.util.unescapeHTML(input.val())),
                        beforeEdit = el.attr(editType);
                        beforeEdit = (beforeEdit) ? beforeEdit : '';
                        if (beforeEdit!==editValue){
                            el.attr(editType, editValue);
                            modifyValue[editType] = [beforeEdit, editValue];
                            editContent[templateCode][cmsId][editType] = editValue;
                        }
                    }
                }
            }
            if (isSet===true){
                config.container.data('editcontent', editContent);
                //console.log(config.container.data('editcontent'));
                return modifyValue;
            }
        },
        /**
         * @methed _rewriteElContent ������/�ָ��������޸ĵ�ҳ����
         * @param data {object} ��Ҫ�Ƴ���Ԫ��
         * @param isRevoke {object} �Ƿ�Ϊ����
         */
        _rewriteElContent: function(data, isRevoke){
            var el = data.el,
            values = data.value;
            for (var i=0, l=values.length; i<l; i++){
                var value = values[i],
                node = value.node,
                nodeName = value.nodeName,
                nodeEl = $(node);
                for (var type in value){
                    if (type==='node' || type==='nodeName'){ continue; }

                    if (type==='text'){
                        if (nodeName==='#TEXT'){
                            var typeValue = value[type],
                            nodeValue = (isRevoke===true) ? typeValue[0] : typeValue[1];
                            node.nodeValue = nodeValue;

                        } else {
                            var typeValue = value[type],
                            text = (isRevoke===true) ? typeValue[0] : typeValue[1];
                            nodeEl.html(text);
                        }
                    } else {
                        var typeValue = value[type],
                        attrValue = (isRevoke===true) ? typeValue[0] : typeValue[1];
                        nodeEl.attr(type, attrValue);
                    }
                }
            }
        },
        /**
         * @methed _removeEl �Ƴ�Ԫ��
         * @param el {object} ��Ҫ�Ƴ���Ԫ��
         */
        _removeEl: function(el){
            el.remove();
        },
        /**
         * @methed revoke ����
         */
        revoke: function(){
            if (this.isCouldRevoke()===true){
                var modification = this.modifyData.pop();
                this._rewriteElContent(modification, true);
                this.cancelData.push(modification);
            }
        },
        /**
         * @methed resume �ָ�
         */
        resume: function(){
            if (this.isCouldResume()===true){
                var modification = this.cancelData.pop();
                this._rewriteElContent(modification, false);
                this.modifyData.push(modification);
            }
        },
        /**
         * @methed isCouldRevoke �����Ƿ������ݿ��Գ���
         */
        isCouldRevoke: function(){
            var result;
            result = (this.modifyData.length>0) ? true : false;
            return result;
        },
        /**
         * @methed isCouldRevoke �����Ƿ������ݿ��Իָ�
         */
        isCouldResume: function(){
            var result;
            result = (this.cancelData.length>0) ? true : false;
            return result;
        },
        /**
         * @methed quit �˳����ӻ��༭״̬
         */
        quit: function(){
            var constants = D.Viewedit.CONSTANTS,
            config = this.config,
            els = this.els,
            parent = els.parent();
            this._unbindEvents();
            els.find('a:not(.dcms-btn)').unbind('click');
            els.find(constants.EDIT_COVER_TAG_NAME).remove();
            els.find(config.editDialog).remove();
            parent.find('parse').andSelf().removeData('isLocked');
            //this.config.container.removeData('editcontent');
        }
    };
})(jQuery, FE.dcms);