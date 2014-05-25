/**
 * @userfor 可视化编辑 - 编辑对象
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
        attrName: 'writeable',   //是否可编辑的属性名
        event: 'mouseup',
        specialEvent: 'ctrl mouseup',
        lockable: true,     //是否加锁，默认加锁
        lockUrl: '/page/lock_resource.htm'  //加锁连接
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
            //如果els不存在，则退出
            //if (!els) { return; }

            var self = this,
            constants = D.Viewedit.CONSTANTS;
            self.config = $.extend(D.Viewedit.defConfig, config);
            self.editCoverObj = $('<'+constants.EDIT_COVER_TAG_NAME+' class="'+constants.EDIT_COVER_CLASS_NAME+'"></'+constants.EDIT_COVER_TAG_NAME+'>');
            self.editcovers = $(constants.EDIT_COVER_TAG_NAME+'.'+constants.EDIT_COVER_CLASS_NAME);
            self.els = els;
            self.awakeEl = $('#dcms-message-awake');
            self.confirmEl = $('#dcms-message-confirm');
            //记录被修改的数据，做撤销用
            //数据结构：[{"el":el, value:[ {"node":node, "nodeName":[beforeedit, nodeName], editType:[beforeedit, editType], editType1:[beforeedit, editType1], ...}, ... ] } , ... ]
            //注：数据格式中无双引号的为变量
            self.modifyData = [];
            //记录被撤销的数据，做还原用， 数据格式同上
            self.cancelData = [];

            //编辑框内的输入框内容验证
            self._initFormValid();

            //使整个编辑区域中的a连接默认功能失效
            els.find('a').bind('click', function(e){
                e.preventDefault();
            });

            self._bindEvents();
        },
        /**
         * @methed _initFormValid 初始化表单验证
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
                                    msg = '请输入'+o.key;
                                    break;
                                case 'url':
                                    msg = '请输入正确的'+o.key;
                                    break;
                                default:
                                    msg = '请输入正确的内容';
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
         * @methed _bindEvents 绑定相关事件
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

            //可编辑区域可编辑的元素mouseenter后被遮罩，以作提示
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

            //可编辑区域可编辑的元素mouseleave后，删除遮罩层
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

            //可编辑区域可编辑的元素mouseup后，进行编辑
            els.bind('mouseup', function(e){
                if (self._isEditEl(e)){
                    var editable = self._getEditable(e);

                    if (editable){
                        //是编辑还是上锁
                        self._editOrLock(editable);

                        self._unbindEvents();
                    } /*else if (eidtable) {
                        //当点击了不可编辑元素时执行
                        this._requestLock(el, templateCode, mode);
                    }*/
                }
            });
        },
        /**
         * @methed _editOrLock 是编辑还是上锁
         * @param editable {array} [1)元素对象  2)是否为A标签  3)A标签内是否有子元素]
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
            if (isLocked===true || self.config.lockable===false){    //如果此模板已经被编辑者锁定，则直接执行编辑内容方法
                //执行编辑代码，比如弹出图片、A连接编辑框
                self._handlerEditEl(editable, container);
            } else if(unlocking===true){
                D.Message.awake(self.awakeEl, {
                    msg: '正在解锁，请稍等……',
                    relatedEl: el
                });
            } else if(locking===true){   //如果已请求上锁，则显示提示信息
                D.Message.awake(self.awakeEl, {
                    msg: '正在请求上锁，请稍等……',
                    relatedEl: el
                });
            } else {  //否则请求上锁
                this._requestLock(el, resourceCode, type, container, editable);
            }
        },
        /**
         * @methed _requestLock 请求上锁
         * @param el {object} 需要编辑的元素
         * @param templateCode {string} 模板调用名/页面ID
         * @param type {object} 类型，模板/页面
         * @param container {object} 模板元素
         * @param editable {array} [1)元素对象  2)是否为A标签  3)A标签内是否有子元素]
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
                        if (o.success===true){  //上锁成功
                            //加上已上锁信息
                            container.data('isLocked', true);

                            //执行编辑代码，比如弹出图片、A连接编辑框
                            self._handlerEditEl(editable, container);
                            self._bindBeforeunload(el, resourceCode, type, 'false', container);
                        } else if(o.isAllow===true) {  //上锁失败，允许解锁
                            D.Message.confirm(self.confirmEl, {
                                title: '是否解锁',
                                msg: '此资源已被'+o.lockedUser+'于'+o.lockedTime+'锁定，解锁请点击“确定”，否则请点“取消”。',
                                enter: function(){
                                    self.requestUnlock(el, resourceCode, type, false, true, container, editable);
                                }
                            });
                        } else if (o.isAllow===false && o.lockedUser) {   //上锁失败，且不允许解锁
                            D.Message.awake(self.awakeEl, {
                                msg: '此资源已被'+o.lockedUser+'于'+o.lockedTime+'锁定，您无权解锁。',
                                relatedEl: el
                            });
                            //无权解锁时，将writeable设置为false
                            container.attr('writeable', 'false');
                        } else if(o.error){    //上锁失败，出现错误
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
                        msg: '请求上锁失败，无法进行编辑，请稍后再试！',
                        relatedEl: el
                    });
                    container.attr('writeable', 'false');
                    container.removeData('locking');
                }
            });
        },
        /**
         * @methed requestUnlock 请求解锁
         * @param el {object} 需要编辑的元素
         * @param resourceCode {string} 模板调用名/页面ID
         * @param type {object} 类型，模板/页面
         * @param container {object} 模板元素
         * @param editable {array} [1)元素对象  2)是否为A标签  3)A标签内是否有子元素]
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
                                msg: '解锁成功，可以进行编辑！',
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
                                msg += result[i].code+'解锁失败，错误如下：'+result[i].error+end;
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
                            msg: '请求解锁失败，请稍后再试！',
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
         * @methed _bindBeforeunload 绑定 beforeunload事件
         * @param el {object} 需要编辑的元素
         * @param resourceCode {string} 模板调用名/页面ID
         * @param type {object} 类型，模板/页面
         * @param container {object} 模板元素
         */
        _bindBeforeunload: function(el, resourceCode, type, needLock, container){
            var self = this;
            $(window).bind('beforeunload', function(){
                self.requestUnlock(el, resourceCode, type, true, needLock, container);

                return '当前内容尚未保存！确认离开吗？';
            });
        },
        /**
         * @methed _unbindBeforeunload 解绑 beforeunload事件
         */
        unbindBeforeunload: function(){
            $(window).unbind('beforeunload');
        },
        /**
         * @methed _getContainer 获取相应的模板元素，parse|template|position
         * @param el {object} 需要编辑的元素
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
         * @methed _unbindEvents 解绑相关事件
         */
        _unbindEvents: function(){
            var self = this,
            editcovers = self.editcovers,
            els = self.els;
            //解绑editcovers、els相关的所有事件
            editcovers.die('mouseenter mouseleave mousedown');
            els.unbind('mouseover mouseout mouseup');
        },
        /**
         * @methed _isEditEl 是否为可编辑元素
         * @param e {object} 必选，触发事件的对象
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
         * @methed _getEditableEl 返回可编辑的元素
         * @param e {object} 必选，触发的事件对象
         */
        _getEditable: function(e){
            var config = this.config,
            target = $(e.target),
            isWrite = target.parents('['+config.attrName+']').attr(config.attrName),
            parentA = target.parents('a');
            if (isWrite==='false'){
                return false;     //此元素不可编辑
            }
            if (target[0].tagName.toUpperCase()==='A'){
                if (target.children().length>0){
                    return [target[0], true, true];
                }
                return [target[0], true, false];     //返回的三个值的含义：1)元素对象  2)是否为A标签  3)A标签内是否有子元素
            }
            if (parentA.length===0){
                return [target[0], false];
            } else if(parentA.length>0){
                return [parentA[0], true, true];
            }
        },
        /**
         * @methed _setEditCover 设置提示可编辑的遮罩层
         * @param el {object} 必选，需要被遮罩的元素
         */
        _setEditCover: function(el){
            var children = el.children();
            if (el[0].tagName.toUpperCase()==='A' && children.length===1 && children[0].tagName.toUpperCase()==='IMG'){
                //edited 属性用于记录被修改的Style，以便在保存代码时还原回来
                //edited="pos"时说明修改了position:relative，edited="dis"说明修改了display:inline-block
                var edited = el.attr('edited');
                el.css('display','inline-block');
                (edited && edited==='pos') ? el.attr('edited', 'pos,dis') : el.attr('edited', 'dis');
            }

            var editCoverEl = this._getEditCoverEl(el),
            elOffset = this._getEditElOffset(el);

            //判断editCoverEl是否存在；存在则show，否则插在el后面
            if (editCoverEl.length>0){
                editCoverEl.show();
            } else {
                editCoverEl = this.editCoverObj.clone();
                el.after(editCoverEl);
            }
            editCoverEl.css({'top':elOffset[0]+'px', 'left':elOffset[1]+'px', 'height':elOffset[2]+'px', 'width':elOffset[3]+'px'});
        },
        /**
         * @methed _getEditElOffset 获取元素的top,left,height,width
         * @param el {object} 必选，需要获取这些数据的元素
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
         * @methed _hideEditCover 隐藏提示可编辑的遮罩层
         * @param el {object} 必选，需要被遮罩的元素
         */
        _hideEditCover: function(el){
            var editCoverEl = this._getEditCoverEl(el);
            if (editCoverEl){
                editCoverEl.hide();
            }
        },
        /**
         * @methed _getEditCoverEl 获得提示可编辑的遮罩层元素
         * @param el {object} 必选，需要被遮罩的元素
         */
        _getEditCoverEl: function(el){
            var constants = D.Viewedit.CONSTANTS;
            return el.next(constants.EDIT_COVER_TAG_NAME+'.'+constants.EDIT_COVER_CLASS_NAME);
        },
        /**
         * @methed _handlerEditEl 编辑元素操作
         * @param editable {array} 自定义数组 [ 1)元素对象,  2)是否为A标签,  3)A标签内是否有子元素 ]
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

            //增加需要验证的元素
            self.editValid.add(validEls);

            //绑定确定按钮事件
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
                    //将修改后的数据存储到modifyData中
                    self.modifyData.push(modification);
                    self._removeEl(editDialog);
                    self._bindEvents();
                    //删除验证组件中的元素
                    self.editValid.remove(validEls);
                }
            });
            //绑定取消按钮事件
            cancelButton.click(function(e){
                e.preventDefault();
                self._removeEl(editDialog);
                self._bindEvents();
                //删除验证组件中的元素
                self.editValid.remove(validEls);
            });
        },
        /**
         * @methed _createEditDialog 生成编辑对话框
         * @param editable {array} 自定义数组 [ 1)元素对象,  2)是否为A标签,  3)A标签内是否有子元素 ]
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
         * @methed _createEditDialog 生成编辑对话框
         * @param editable {array} 自定义数组 [ 1)元素对象,  2)是否为A标签,  3)A标签内是否有子元素 ]
         */
        _getEditBoxInfoes: function(editable){
            var editEl = editable[0],
            editBoxInfoes = [];
            if (editable[1]===true){
                if (editable[2]===true){
                    //当编辑元素为A标签，且有子元素时
                    editBoxInfoes.push(this._getEditBoxInfo('A', editEl));

                    editBoxInfoes = this._getEditEls(editEl, editBoxInfoes);
                } else {
                    //当编辑元素为A标签，无子元素时
                    var editBoxInfo = this._getEditBoxInfo('#A', editEl);
                    editBoxInfoes.push(editBoxInfo);
                }
            } else {
                //当编辑元素不是A标签时
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
         * @methed _getEditBoxInfo 选择编辑框
         * @param tagName {string} 编辑元素标签名称
         */
        _getEditBoxInfo: function(tagName, node){
            var config = this.config,
            editBoxInfo = {};
            switch (tagName){
                case 'IMG':
                    editBoxInfo['box'] = config.editBoxImg.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="img 编辑">img</list>';
                    break;
                case 'AREA':
                    editBoxInfo['box'] = config.editBoxArea.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="area 编辑">area</list>';
                    break;
                case 'A':
                    editBoxInfo['box'] = config.editBoxA.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="a连接 编辑">a</list>';
                    break;
                case '#A':
                    editBoxInfo['box'] = config.editBoxAText.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="只有文字的A连接 编辑">a-text</list>';
                    break;
                default:
                    editBoxInfo['box'] = config.editBoxText.clone();
                    editBoxInfo['title'] = '<list class="dcms-tab-t" title="文本 编辑">text</list>';
                    break;
            }
            editBoxInfo['box'].data(D.Viewedit.CONSTANTS.EDIT_BOX_DATA_EL, node);
            return editBoxInfo;
        },
        /**
         * @methed _setEditTabTitlesWdith 选择编辑框
         * @param editDialogUl {object} 编辑框内tabs的title的容器元素
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
         * @methed _setEditDialogPosition 设置编辑框的位置
         * @param editEl {object} 需要编辑的元素
         * @param editDialog {object} 编辑框
         */
        _setEditDialogPosition: function(editEl, editDialog){
            var body = document.body,
            clientWidth = $(body).width(),
            clientHeight = $(body).height(),
            dialogWidth = editDialog.outerWidth(),
            dialogHeight = editDialog.outerHeight(),
            //获取通过position得到的位置数据
            editElOffset = this._getEditElOffset(editEl),
            //获取通过offset得到的位置数据
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
         * @methed _editDialogContent 设置或者获取编辑框内input的内容
         * @param editDialogBox {object} 需要设置input内容的tab box
         * @param isSet {boolean} false:将页面中的内容填到input中；true：将input中的内容填到页面中
         */
        _editElContent: function(editDialogBox, isSet, container){
            var constants = D.Viewedit.CONSTANTS,
            node = editDialogBox.data(constants.EDIT_BOX_DATA_EL),
            nodeName = node.nodeName.toUpperCase(),
            inputs = editDialogBox.find('input'),
            config = this.config,
            modifyValue = {}, editContent = {},
            templateCode, cmsId;
            //当isSet为true时，获取先前修改的痕迹
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
                                //修改记录，用于保存内容
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
         * @methed _rewriteElContent 将撤销/恢复的数据修改到页面上
         * @param data {object} 需要移除的元素
         * @param isRevoke {object} 是否为撤销
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
         * @methed _removeEl 移除元素
         * @param el {object} 需要移除的元素
         */
        _removeEl: function(el){
            el.remove();
        },
        /**
         * @methed revoke 撤消
         */
        revoke: function(){
            if (this.isCouldRevoke()===true){
                var modification = this.modifyData.pop();
                this._rewriteElContent(modification, true);
                this.cancelData.push(modification);
            }
        },
        /**
         * @methed resume 恢复
         */
        resume: function(){
            if (this.isCouldResume()===true){
                var modification = this.cancelData.pop();
                this._rewriteElContent(modification, false);
                this.modifyData.push(modification);
            }
        },
        /**
         * @methed isCouldRevoke 返回是否有数据可以撤销
         */
        isCouldRevoke: function(){
            var result;
            result = (this.modifyData.length>0) ? true : false;
            return result;
        },
        /**
         * @methed isCouldRevoke 返回是否有数据可以恢复
         */
        isCouldResume: function(){
            var result;
            result = (this.cancelData.length>0) ? true : false;
            return result;
        },
        /**
         * @methed quit 退出可视化编辑状态
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