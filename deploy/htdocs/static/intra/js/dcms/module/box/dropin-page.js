/**
 * @author hongss
 * @userfor ��קԪ����ҳ���У����������ƶ�������
 * @date  2012.02.14
 * "��module����Ϊrow����������Ҫ�����⴦��"���Դ˾�Ϊע��˵��������ҵ���Ӧ�ĸĶ�����
 */

;(function($, D, undefined) {
    D.DropInPage = {
        /**
         * ���Զ���
         */
        config : null, //������
        dropTransport : null, //������ק��Ԫ�أ�jQuery����  transport-object
        moveTransport : null, //������ק��Ԫ�أ�jQuery����
        transportMod : null, //��¼����ģʽ��chrome���������Ҫ��ֵ
        dropArea : null, //����ҳ����Ҫ�༭����
        state : null, //״̬��copy|null
        chooseLevel : 'module', //ѡ��㼶��layout|grid|row|box|module
        copyBtn : $('#crazy-box-copy'),
        delBtn : $('#crazy-box-del'),
        currentElem : null, //��ǰѡ�е�Ԫ��
        copyElem : null, //����Ԫ��
        iframeBody : null,
        iframeDoc : null,
        singerArea : null, //��ʶ���������jQuery����
        fixHighLightEl : null,
        loading : null, //�������ڼ�����
        widgetType : null, //��ǰԪ������
        enableClass : null, //��ǰ�������Ԫ�����͵�class��
        elemInfo : null, //��ǰԪ����Ϣ
        elemClass : null, //��ǰԪ�����͵�class��
        transportTimeid : null, //�ӳ�ִ��_showTransport������id
        iframeIntervalId : null,
        /**
         * @methed _init ��ʼ��
         * @param config ������
         */
        init : function(config) {
            var self = this;

            self.config = $.extend({}, D.DropInPage.defConfig, config);
            var config = self.config;

            // transport-object start
            self.dropTransport = $(config.dropTransport);
            if(self.dropTransport.length === 0) {
                self.dropTransport = $('<div draggable="true" id="crazy-box-droptransport" data-mode="dropin" class="crazy-box-target-current"></div>').appendTo($('body', document));
            }
            // transport-object end
            //����iframe������onload�¼�
            self._insertIframe();

            //�����㼶layout|grid|row|box|module ��ť����¼�
            self._levelListener();
            self._docmentListener();
        },
        /**
         * @methed _insertIframe ������ء�ҳ�桱���ݵ�iframe
         */
        _insertIframe : function() {
            //��onload�¼������Ե���ʽ���ڱ�ǩ����Ϊ�˱�֤chrome/IE��ÿ��ǿ��ˢ��ʱ���ܴ���onload�¼�
            var config = this.config, pageUrl = config.pageUrl, iframe = $('<iframe id="dcms_box_main" class="dcms-box-main" src="' + pageUrl + '" onload="FE.dcms.DropInPage.handleLoad(this)" />');

            $(config.editArea).html('').append(iframe);
        },
        /**
         * @methed _levelListener �����㼶 layout|grid|row|box|module ��ť����¼�
         */
        _levelListener : function() {
            var self = this, config = this.config;

            $(config.levelParent).delegate(config.chooseLevel, 'click', function(e) {
                var el = $(this), chooseLevel = el.data('val');
                if(chooseLevel === 'layout') {
                    self.iframeBody.addClass('edit-layout');
                } else {
                    self.iframeBody.removeClass('edit-layout');
                }

                //��ť��ʽ�ĸı���options.js�ļ���ִ��

                //��self.chooseLevel��ֵ
                if(self.chooseLevel !== chooseLevel) {
                    self.chooseLevel = chooseLevel;
                    self._hideHighLight();
                    self._hideSingerArea();
                    self._hideTransport(self.moveTransport);
                    //self._hideCellLightFix();
                    self._hideCellLight(self.fixCellHighLightEl);
                    //΢����
                    self._hideMicro();

                    //ͨ��class�����Ƹ��ư�ť�Ƿ�ɵ�
                    /*if (self._enableCopyLevel()===true){
                    self._replaceClass(self.copyBtn, 'disable', self.config.copyButton);
                    } else {
                    self._replaceClass(self.copyBtn, self.config.copyButton, 'disable');
                    }*/

                    //ͨ��class������ɾ����ť�Ƿ�ɵ�
                    /*if (self._enableCopyLevel()===true){
                     self._replaceClass(self.delBtn, 'disable', self.config.delButton);
                     } else {
                     self._replaceClass(self.delBtn, self.config.delButton, 'disable');
                     }*/
                }
            });
        },
        /**
         * @methed _docmentListener �����ⲿ�ĵ��¼�
         */
        _docmentListener : function() {
            var self = this, doc = $(document);

            doc.bind('click', function(e) {
                var target = $(e.target);
                //��stateΪcopyʱ���κβ��ڱ༭�����ڵĵ�����������Ʋ���
                if(self.state === 'copy') {
                    if(target.closest(self.iframeBody).length === 0 && target.hasClass(self.config.copyButton) !== true) {
                        self._cancelCopy(self.copyBtn);
                    }
                }

                //���Ϊ���Զ��������飬��ʹ�Զ�����봦�ڿ��ӻ�״̬
                /*if (self.editTextarea && self.editTextarea.css('display')!=='none'
                 && target.closest('.'+self.config.defineCell).length===0){
                 self._setDefineCodeView(self.editTextarea);
                 }*/
            });

        },
        /**
         * @methed _enableCopy �ж��Ƿ�������
         * @return true(������) | false
         */
        _enableCopyLevel : function(chooseLevel) {
            chooseLevel = chooseLevel || this.chooseLevel;
            if(chooseLevel === 'layout' || chooseLevel === 'row' || chooseLevel === 'module' || chooseLevel === 'cell') {
                return true;
            } else {
                return false;
            }
        },
        /**
         * @methed _enableCopy �ж��Ƿ�����ɾ��
         * @return true(����ɾ��) | false
         */
        _enableDelLevel : function(elem) {
            var result = {},
            //type = this._getWidgetType(elem) || this.chooseLevel,
            type = D.ManagePageDate.getWidgetType(elem) || this.chooseLevel, currentElem = elem || this.currentElem;
            //��module����Ϊrow����������Ҫ�����⴦��
            if(type === 'module') {
                type = 'row';
                currentElem = currentElem.closest('.crazy-box-row');
            }

            if(type === 'layout' || type === 'row' || type === 'cell') {// || type==='module'
                if(currentElem && (type === 'row' && currentElem.siblings('.crazy-box-row').length <= 0 || type === 'layout' && currentElem.siblings('.crazy-box-layout').length <= 0)) {
                    result['enable'] = false;
                    result['msg'] = '���һ��' + type + '������ɾ����';
                    //��module����Ϊrow����������Ҫ�����⴦��
                    if(type === 'row') {
                        result['msg'] = 'module';
                    }

                } else {
                    result['enable'] = true;
                    result['type'] = type;
                }
            } else if(type === 'label') {
                var options = currentElem.data(D.DropInPage.CONSTANTS.TAG_DATA_BOX_OPTIONS);

                if(options && D.BoxTools.parseOptions(options, ['ability', 'delete', 'enable']) === "true") {
                    result['enable'] = true;
                    result['type'] = type;
                } else {
                    result['enable'] = false;
                    result['msg'] = '�˱�ǩ������ɾ����';
                }
            } else if(type === 'module') {
                result['enable'] = false;
                result['msg'] = 'module';
            } else {
                result['enable'] = false;
                result['msg'] = '��Ԫ�ز�����ɾ����';
            }
            return result;
        },
        /**
         * @methed _replaceClass �滻class
         * @param el ��Ҫִ���滻class��Ԫ�أ�jQuery����
         * @param oldClass �滻ǰ��class��
         * @param newClass �滻���class��
         */
        _replaceClass : function(el, oldClass, newClass) {
            el.removeClass(oldClass);
            el.addClass(newClass);
        },
        /**
         * @methed handleLoad ����iframe load�¼�
         * @param el ����onload�¼���Ԫ��
         */
        handleLoad : function(el) {
            var self = this, doc = $(el.contentWindow.document);
            self.iframeDoc = doc;
            self.iframeBody = $('body', doc);
            //ִ�лص�����
            if(self.config.callback && $.isFunction(self.config.callback)) {
                self.config.callback.call(self, doc);
            }
            //��������CSS��ʽ�����ڿ��ӻ��༭
            //$('head', doc).append($('<link rel="stylesheet" href="css/empty.css" />'));

            this.singerArea = $(this.config.singerArea, doc);
            this.moveTransport = $(this.config.moveTransport, doc);
            this._insertSecondary(self.iframeBody);
            this._insertEditarea(self.iframeBody);

            D.BoxTools.setEdited();
            //Ϊcontainer�ı�ǩ�����������Ԫ������(crazy-box-enable-XXXX)�ı�ʶ
            self._addEnableClass(doc);

            //����Ԫ�ؿ⡱�е�Ԫ��mouseenterʱ
            self._enterPackage();

            //self._insertCellHighLight();
            //����cell ����
            D.HtmlHelper.insertCellHighLight(self);
            //����΢���� ����
            D.HtmlHelper.insertMicrolayoutHighLight(self);

            self.getGlobalAttr(doc);
            //��ҳ�������еĵ�Ԫ��mouseenterʱ
            self._enterPagePackage();
            self._leavePagePackage();
            self._leaveCopyPackage();
            self._clickPagePackage();
            self._enterFixHightLight();
            self._resizeFixHightLight();

            //self._elemDragDrop();
            //copyʱ��Ҫִ�е���ز������¼�����
            self._copyBtnListener();
            self._delBtnListener();

            self._singerBtnsListener(self.singerArea);

            //�����Ƿ���ҪJSʧЧ
            self.jsControl = new D.JsControl({
                inureBtn : $(self.config.jsControlInureBtn, doc),
                iframeDoc : doc
            });

            //ҳ����˲���
            D.PageOperateHistory.init();
            //��ʼ��D.uuid
            self._setInitUuid($('.crazy-box-layout, .crazy-box-row, .crazy-box-module', doc));
        },

        getGlobalAttr : function(doc) {
            //����ҳ����Ҫ�༭����
            //this.dropArea = $(this.config.dropArea, doc);
            //this.singerArea = $(this.config.singerArea, doc);
            //this.moveTransport = $(this.config.moveTransport, doc);
            //this._insertSecondary(doc);
            this.dropArea = $(this.config.dropArea, doc);

            //��ק�¼���
            this._elemDragDrop();

            this._copyListener();
        },
        _setInitUuid : function(els) {
            var self = this, nameIds = [];
            //��ʼ��D.uuid
            els.each(function(i, el) {
                var el = $(el),
                //type = self._getWidgetType(el),
                type = D.ManagePageDate.getWidgetType(el), classReg = new RegExp('^cell-' + type + '-(\\d+)'), className = D.BoxTools.getClassName(el, classReg);
                if(className) {
                    nameIds.push(className.match(/\d+/)[0]);
                }
            });
            D.BoxTools.initUuid(D.BoxTools.getMax(nameIds));
        },
        /**
         * @methed _insertSecondary ����ѡ�и���ʱ�õ�Ԫ��
         */
        _insertSecondary : function(body) {
            /*this.fixHighLightEl = $(this.config.fixHighLight, doc);
             if (this.fixHighLightEl.length===0){
             this.fixHighLightEl = $('<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>');
             this.iframeBody.append(this.fixHighLightEl);
             }*/
            var html = '<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>';
            this.fixHighLightEl = this._insertElem(this.config.fixHighLight, html, body);
            D.highLightEl = this.fixHighLightEl;
        },
        /**
         * @methed _insertEditarea ����༭����iframeBody��
         * @param body  �ĵ�body����
         */
        _insertEditarea : function(body) {
            //var html = '<div id="crazy-box-edit-textarea"><textarea class="crazy-box-textarea" placeholder="��������ش���"></textarea></div>';
            var html = '<div id="crazy-box-edit-textarea"><ul><li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" /><label for="crazy-box-code-html">HTML����</label></li><li><input type="radio" name="code-type" value="vm" id="crazy-box-code-vm" /><label for="crazy-box-code-vm">VM����</label></li></ul><textarea class="crazy-box-textarea" placeholder="��������ش���"></textarea></div>';
            this.editTextarea = this._insertElem(this.config.editTextarea, html, body);
        },
        /**
         * @methed _insertElem �����ʶԪ�ص�iframeBody��
         * @param selector ���ҵ���Ԫ�ص�ѡ����
         * @param html  ��Ҫ�����html����elemԪ��
         * @param body  �ĵ�body����
         */
        _insertElem : function(selector, html, body) {
            var elem = $(selector, body);
            if(elem.length === 0) {
                elem = $(html);
                body.append(elem);
            }
            return elem;
        },
        /**
         * @methed _elemDropIn �ϷŶ���Ч��
         */
        _elemDragDrop : function() {
            var self = this, CONSTANTS = D.DropInPage.CONSTANTS, transports = self.dropTransport.add(self.moveTransport).add(self.fixCellHighLightEl).add(self.cellHighLightEl);

            //��ֹfirefox��drop�󴥷���������¼�
            /*D.DragAddDrop.init({
            dragEls: transports,
            dropEls: $(document),
            drop: function(e){
            }
            });*/

            //�Ϸ�Ч��
            D.DragAddDrop.init({
                dragEls : transports,
                dropEls : self.dropArea,
                dragstart : function(e) {
                    self.iframeIntervalId && clearInterval(self.iframeIntervalId);
                    self._dragStart(e);
                },
                dragend : function() {
                    self.iframeIntervalId && clearInterval(self.iframeIntervalId);
                    self._setTempDataNull();
                    self._emptySinger(self.dropArea);
                    //**
                    self._lowAllLight(self.dropArea);
                    //**
                    self.transportMod = null;
                    //D.BoxTools.hideCellLight(self.fixCellHighLightEl, true);
                    self._hideCellLight(self.cellHighLightEl);
                    self._hideCellLight(self.fixCellHighLightEl);
                    //if (self.chooseLevel==='microlayout'){
                    // self.chooseLevel = 'module';
                    //}
                    //self._hideMicro();
                    //self._hideCellLightFix();
                },
                dragenter : function(e) {//ʾ��������������
                    //self.iframeIntervalId&&clearInterval(self.iframeIntervalId);
                    self.enableClass = CONSTANTS.ENABLE_CLASS_PREFIX + self.widgetType;
                    self.elemClass = CONSTANTS.ELEMENT_CLASS_PREFIX + self.widgetType;
                    self._dropEvent(e, 'Enter');
                },
                dragover : self._dropInOver,
                dragleave : function(e) {//ȥ����ʶ
                    self.iframeIntervalId && clearInterval(self.iframeIntervalId);
                    var h = $('#pub_header').height() + $('#dcms_box_main').height() - 70;
                    if(e && e.clientY < $('#pub_header').height()) {
                        self.iframeIntervalId = setInterval(function() {
                            if(!self._fixScrollTop(-1)) {
                                clearInterval(self.iframeIntervalId);
                            }
                        }, 100);
                    } else if(e && e.clientY > h) {
                        self.iframeIntervalId = setInterval(function() {
                            if(!self._fixScrollTop(1)) {
                                clearInterval(self.iframeIntervalId);
                            }
                        }, 100);
                    }
                    self._dropEvent(e, 'Leave');
                },
                drop : function(e) {
                    self.iframeIntervalId && clearInterval(self.iframeIntervalId);
                    self._dropEvent(e, 'Drop');
                    //���������ʱ����
                    self._setTempDataNull();
                }
            });
        },
        /**
         * @methed _copyBtnListener �������ư�ť�¼�
         */
        _copyBtnListener : function() {
            var self = this, copyBtn = this.config.copyButton;

            $('.' + copyBtn, self.iframeDoc).live('mousedown', function(e) {
                var btn = self.copyBtn = $(this), copyElem = self.copyElem = self._getCopyElem(self.currentElem);

                if(copyElem && self._enableCopyLevel() === true) {
                    if(self.state === 'copy') {//ȡ������
                        self._cancelCopy();
                    } else {
                        self.state = 'copy';
                        //���ϡ�ճ���������İ�ť����ʽ
                        //$('span', btn).text('ȡ������');
                        btn.text('ȡ������');

                        self.fixHighLightEl.hide();
                        // add by pingchun.yupc 2012-08-09
                        //self._hideSingerArea();
                        //end
                        self._hideJsControl(copyElem, true);
                        // add by pingchun.yupc 2012-08-09
                        //self._lowLightCurrent(self.currentElem);
                        //end
                        //hide cell high light
                        //self._hideCellLightFix();
                        self._hideCellLight(self.fixCellHighLightEl);
                    }
                } else if(!copyElem) {
                    //��ʾ��ѡ��Ԫ�غ���ܸ��ơ�
                    alert('��ѡ����Ҫ���Ƶ����ݣ�');
                } else if(self._enableCopyLevel() !== true) {
                    alert('��Ԫ�ز��ܱ����ƣ�');
                }
                btn.closest('.mousedown').removeClass('mousedown');
            });
        },
        /**
         * @methed _getCopyElem ��ȡcopyԪ�أ����elem�Ǳ�ǩ��ȡ�����ڵ�module
         * @param elem ��ǰԪ�أ�jQuery����
         */
        _getCopyElem : function(elem) {
            if(!elem) {
                return;
            }
            //var type = this._getWidgetType(elem);
            var type = D.ManagePageDate.getWidgetType(elem);
            if(type === 'label') {
                return elem.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'module');
            }
            return elem;
        },
        /**
         * @methed _copyBtnListener ����ɾ����ť�¼�
         */
        _delBtnListener : function() {
            var self = this;

            $('.' + self.config.delButton, self.iframeDoc).live('mousedown', function(e) {
                deleteFn.apply(this, arguments);
            });
            $('.' + self.config.delButton).live('mousedown', function(e) {
                deleteFn.apply(this, arguments);
            });
            var deleteFn = function(e) {
                var currentElem = self._getCurrentElem(), result = self._enableDelLevel(currentElem), delBtn = self.delBtn = $(this);
                if(self.state === 'copy') {//ȡ������
                    self._cancelCopy();
                }
                //��module����Ϊrow����������Ҫ�����⴦��
                if(result['type'] === 'row') {
                    currentElem = currentElem.closest('.crazy-box-row');
                }

                if(currentElem && result['enable'] === true) {
                    var editDelSteps = D.EditContent.editDel({
                        'elem' : currentElem,
                        'isEdit' : true
                    });
                    self.currentElem = null;
                    D.BoxTools.setEdited({
                        'param' : editDelSteps,
                        'callback' : null
                    });
                    switch (result['type']) {
                        case 'label':
                            self._hideHighLight();
                            D.bottomAttr.closeDialog();
                            break;
                        case 'cell':
                            self._hideHighLight();
                            //self._hideCellLightFix();
                            self._hideCellLight(self.fixCellHighLightEl);
                            D.bottomAttr.closeDialog();
                            break;
                        default:
                            self._hideSingerArea();
                            self._hideJsControl(currentElem);
                            //hide cell high light
                            //self._hideCellLightFix();
                            self._hideCellLight(self.fixCellHighLightEl);
                            self._hideHighLight();
                            break;
                    }

                } else if(result['enable'] === false && result['msg'] === 'module') {
                    
                    self._emptyModule(currentElem);
                } else if(!currentElem) {
                    alert('��ѡ����Ҫɾ�������ݣ�');
                } else if(result['enable'] !== true) {
                    alert(result['msg']);
                }
                delBtn.closest('.mousedown').removeClass('mousedown');

            };
        },
        /**
         * @methed _emptyModule ���module������module��������ʽ
         */
        _emptyModule : function(target) {
            var type = 'module',$row = target.closest('.crazy-box-row');
            //���һ��grid���ж��module��ɾ��һ������module��ǩҲͬʱɾ������cellһ�� ɾ��module����ɾ��row
            if(target.hasClass('crazy-box-module') && $row.siblings().size() !== 0) {
                type = 'cell';
            }
            var parent = $row.parent(), opts = {
                'mod' : 'replace',
                'target' : $row,
                'type' : type
            },
            //htmlcode =  this._handleStyle(this.config.emptyModuleHtml, opts, true),
            htmlcode = D.ManagePageDate.handleStyle(this.config.emptyModuleHtml, opts, true), replaceSteps = this._replaceHtml({
                'htmlcode' : htmlcode,
                'target' : $row,
                'isEdit' : true
            });
            this._addEnableClass(parent);

            this.hideAllSingers();
            //��¼�Ѿ������޸�
            D.BoxTools.setEdited({
                'param' : replaceSteps,
                'callback' : null
            });
        },
        /**
         * @methed _getCurrentElem ��ȡ��ǰԪ�أ�jQuery����
         */
        _getCurrentElem : function() {
            var currentElem = this.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM) || this.currentElem;
            return currentElem;
        },
        /**
         * @methed _cancelCopy ȡ������
         */
        _cancelCopy : function(btn) {
            this.state = null;
            //this._setTempDataNull();
            //$('span', this.copyBtn).text('����');
            this.copyBtn.text('����');
            //ȥ����ճ���������İ�ť����ʽ
            //<!-- ûд�� -->

            this._emptySinger(this.dropArea);
            this._lowAllLight(this.dropArea);
        },
        /**
         * @methed _copyListener ����copy�¼��Ƿ���ִ��
         */
        _copyListener : function() {
            var self = this;
            if($(self.dropArea)[0]) {
                $(self.dropArea)[0].addEventListener('click', function(e) {
                    if(self.state === 'copy') {
                        self._judgeDropIn(e, function(target) {
                            self._lowLightCurrent(target);
                            self._hideSinger(target);

                            //var htmlcode = self._handleCopyHtml(self.copyElem, 'isReplace', target);
                            var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'isReplace', target, self.chooseLevel);
                            //�滻HTML
                            //D.InsertHtml.init(htmlcode, target, 'replaceWith', self.iframeDoc);
                            var editInsertSteps = D.InsertHtml.init({
                                'html' : htmlcode,
                                'container' : target,
                                'insertType' : 'replaceWith',
                                'doc' : self.iframeDoc,
                                'isEdit' : true
                            });
                            //target.replaceWith(self.currentElem.clone());
                            D.BoxTools.setEdited({
                                'param' : editInsertSteps,
                                'callback' : null
                            });
                        }, function(target, el) {
                            //var htmlcode = self._handleCopyHtml(self.copyElem, 'sibling', target);
                            var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'sibling', target, self.chooseLevel);
                            //��HTML������ڱ�ʶ֮��
                            //D.InsertHtml.init(htmlcode, target, 'after', self.iframeDoc);
                            var editInsertSteps = D.InsertHtml.init({
                                'html' : htmlcode,
                                'container' : target,
                                'insertType' : 'after',
                                'doc' : self.iframeDoc,
                                'isEdit' : true
                            });
                            //target.after(self.currentElem.clone());

                            target.removeClass(self.config.currentSinger);
                            self._hideSinger(el);
                            D.BoxTools.setEdited({
                                'param' : editInsertSteps,
                                'callback' : null
                            });
                        }, function(target) {
                            target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell').each(function(i, el) {
                                self._hideSinger($(el));
                            });
                            //var htmlcode = self._handleCopyHtml(self.copyElem, 'container', target);
                            var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'container', target, self.chooseLevel);
                            //��HTML�������������
                            //D.InsertHtml.init(htmlcode, target, 'html', self.iframeDoc);
                            var editInsertSteps = D.InsertHtml.init({
                                'html' : htmlcode,
                                'container' : target,
                                'insertType' : 'html',
                                'doc' : self.iframeDoc,
                                'isEdit' : true
                            });
                            //target.html(self.currentElem.clone());

                            self._lowLightCurrent(target);
                            D.BoxTools.setEdited({
                                'param' : editInsertSteps,
                                'callback' : null
                            });
                        }, self.copyElem, true);

                        self._emptySinger(self.dropArea);
                        //����һ�κ��������
                        //self._cancelCopy();
                    }
                }, true);
            }
        },
        /**
         * @methed _handleCopyHtml ����copy��Ҫ�õ�html����
         * @param el ��������Ԫ�أ�jQuery����
         * @param mod container|replace|sibling�����п���ʱ��ģʽ
         * @param target ����Ԫ��
         * @return ������htmlcode
         */
        /*_handleCopyHtml: function(el, mod, target){
        var self = this,
        htmlcode, classReg, className, oldModuleClass, newModuleClass,
        type = self._getWidgetType(el) || self.chooseLevel,
        opts = {'mod':mod, 'target':target, 'type':type};
        if (type==='cell'){
        var moduleClass = '.crazy-box-module',
        moduleReg = /^(cell-module$)|(cell-module-\d+$)/;
        classReg = /^cell-/;
        oldModuleClass = D.BoxTools.getClassName(el.closest(moduleClass), moduleReg);
        newModuleClass = D.BoxTools.getClassName(target.closest(moduleClass), moduleReg);
        } else {
        //modify by hongss on 2012.02.23
        //classReg = new RegExp('^(crazy-'+type+'$)|(crazy-'+type+'-\\d+$)');
        classReg = new RegExp('^(cell-'+type+'$)|(cell-'+type+'-\\d+$)');
        }
        className = D.BoxTools.getClassName(el, classReg);
        opts['classname'] = className;

        htmlcode = self._getCopyHtml(el, type, className);
        htmlcode = self._handleStyle(htmlcode, opts, false, oldModuleClass, newModuleClass);
        return htmlcode;
        },*/
        /**
         * @methed _getCopyHtml ��ȡ��Ҫ���Ƶ�html����
         * @param el ��Ҫ���Ƶ�Ԫ�أ�jQuery����
         * @param type Ԫ�����ͣ�layout|grid|row|box|module|cell
         * @return ������Ҫ���Ƶ�html���룬����style��script
         */
        /*_getCopyHtml: function(el, type, className){
        var parent = (type==='cell') ? el.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'module') : el.parent(),
        div = $('<div />'),
        elem = el.clone(),
        scriptsObj = parent.find('script[data-for='+className+']').clone();

        this._setScriptAttr(elem.find('script'), 'text/plain');
        this._setScriptAttr(scriptsObj, 'text/plain');

        div.append(parent.find('link[data-for='+className+'],style[data-for='+className+']').clone())
        .append(elem).append(scriptsObj);

        //ȥ��cell������class��
        div.find('.'+this.config.cellHightLightCurrent).removeClass(this.config.cellHightLightCurrent);

        return div.html();
        },*/
        /**
         * @methed _setScriptAttr ����script��ǩ��type����ֵ
         * @param scripts script��ǩ����jQuery����
         * @param type typeֵ
         */
        /*_setScriptAttr: function(scripts, type){
        scripts.each(function(i, el){
        $(el).attr('type', type);
        });
        },*/
        /**
         * @methed _dropEvent �Ϸ��¼�����
         * @param e �¼�����
         * @param type �¼�����
         */
        _dropEvent : function(e, type) {
            var self = this, mode = e.dataTransfer.getData('text/plain') || self.transportMod;
            switch (mode) {
                case 'dropin':
                    self._hideTransport(self.moveTransport);
                    //self._hideCellLightFix();
                    self._hideCellLight(self.fixCellHighLightEl);
                    self['_dropIn'+type](e);
                    break;
                case 'move':
                    self['_move'+type](e);
                    break;
            }
        },
        /**
         * @methed _dragStart ��ʼ��ק
         */
        _dragStart : function(e) {
            var CONSTANTS = D.DropInPage.CONSTANTS, ELEMENT_DATA_INFO = CONSTANTS.ELEMENT_DATA_INFO, TRANSPORT_DATA_ELEM = CONSTANTS.TRANSPORT_DATA_ELEM, TRANSPORT_DATA_MODE = CONSTANTS.TRANSPORT_DATA_MODE, target = $(e.target), elem = target.data(TRANSPORT_DATA_ELEM), mod = target.data(TRANSPORT_DATA_MODE), elemInfo;

            //className = D.BoxTools.getClassName(elem, WIDGET_TYPE_CLASS_REG);
            this._hideHighLight();
            this._hideSingerArea();
            this._hideJsControl(this._getCurrentElem(), true);
            D.bottomAttr.closeDialog();
            if(this.chooseLevel === 'microlayout') {
                this.chooseLevel = 'module';
            }
            this._hideMicro();
            //this.hideAllSingers();
            //D.BoxTools.hideCellLight(this.fixCellHighLightEl, true);
            this.transportMod = mod;
            //chrome����Ҫʹ�ô�ֵ
            switch (mod) {
                case 'dropin':
                    this.elemInfo = elemInfo = elem.data(ELEMENT_DATA_INFO);
                    this.widgetType = elemInfo['type'] = this._setWidgetType(elemInfo['type']);
                    this.currentElem = null;

                    //this._lowPackage(elem);
                    break;
                case 'move':
                    //this.elemInfo = elemInfo = elem.data(ELEMENT_DATA_INFO);
                    this.widgetType = this.chooseLevel;
                    break;
            }

            //��dataTransfer�ϼ�ֵ������޺��ʵ��������������ȡHTML
            this._addDataTransfer(e, elem, elemInfo);
        },
        /**
         * ����դ�������layoutH990/layoutQ990���������ͣ�add by hongss on 2012.08.06
         */
        _setWidgetType : function(type) {
            if(type.indexOf('layout') !== -1) {
                return 'layout';
            } else {
                return type;
            }
        },
        /**
         * @methed _setTempDataNull ������ק�����в�������ʱ��������Ϊnull
         */
        _setTempDataNull : function() {
            this.widgetType = this.enableClass = this.elemInfo = this.elemClass = this.currentElem = null;
        },
        /**
         * @methed _dropInEnter ��dropinʱ������ק����Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _dropInEnter : function(e) {
            var self = this, elemInfo = this.elemInfo;
            this._judgeDropIn(e, function(els) {//�����ͬ��Ԫ��
                els.each(function(i, el) {
                    var target = $(el), isEnable = self._isEnableDropIn(target.parent(), elemInfo);
                    if(isEnable[0] === true) {//�������ʺ�
                        //self._showDragenterhighLight(target);
                        if(isEnable[2] === true) {//����������Ԫ��
                            setTimeout(function() {
                                var beforeOffset = target.offset(), afterOffset;
                                self._clearTimeoutId(target);
                                self._showSinger(target);
                                //**
                                self._highLightCurrent(target);
                                //**
                                afterOffset = target.offset();
                                //self._adjustCursorOffset(beforeOffset, afterOffset);
                            }, 1);
                        } else {
                            setTimeout(function() {
                                self._clearTimeoutId(target);
                                //self._showSinger(target);
                                self._highLightCurrent(target);
                                //**
                            }, 1);
                        }
                    }
                });
            }, function(target, el) {//�����ǰ��������ʶ
                setTimeout(function() {
                    self._clearTimeoutId(el);
                    self._showSinger(el);
                    //**
                    self._lowLightCurrent(el);
                    //**
                }, 1);
                target.addClass(self.config.currentSinger);
            }, function(target) {//���������Ԫ��
                var isEnable = self._isEnableDropIn(target, elemInfo);
                if(isEnable[0] === true && isEnable[1] === false) {
                    self._highLightCurrent(target);
                    //self._showDragenterhighLight(target);
                }
            });
        },
        /**
         * @methed _adjustCursorOffset ���������ˣ�Ŀǰ��ʵ�ϵ������ǹ�������λ�ã�
         * @param beforeOffset ����������ǰ��ƫ����
         * @param afterOffset ���������ݺ��ƫ����
         */
        _adjustCursorOffset : function(beforeOffset, afterOffset) {
            var scrollTop = this.iframeDoc.scrollTop();
            this.iframeDoc.scrollTop(afterOffset.top - beforeOffset.top + scrollTop);
            /*e.pageX = e.pageX + afterOffset.top - beforeOffset.top;
             e.pageY = e.pageY + afterOffset.left - beforeOffset.left;*/
        },
        _fixScrollTop : function(type) {
            var scrollTop = this.iframeDoc.scrollTop();
            var offset = type > 0 ? 10 : -10;

            if(type < 0 && scrollTop <= 10)
                return false;
            this.iframeDoc.scrollTop(scrollTop + offset);
            return true;

        },
        _dropInOver : function(e) {

        },
        /**
         * @methed _moveEnter ��moveʱ������ק�뿪Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _moveEnter : function(e) {
            var self = this;
            this._judgeMove(e, function(target, elem) {
                self._highLightCurrent(target);
                //self._showDragenterhighLight(target);
            }, function(target, elem) {
                var isEnable = self._isEnableDropIn(target, self.elemInfo);
                if(isEnable[0] === true && isEnable[1] === false) {
                    self._highLightCurrent(target);
                    //self._showDragenterhighLight(target);
                }
            });
        },
        /**
         * @methed _dropInLeave ��dropinʱ������ק�뿪Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _dropInLeave : function(e) {
            var self = this;
            this._judgeDropIn(e, function(els) {
                els.each(function(i, el) {
                    var target = $(el), timeId = window.setTimeout(function() {
                        self._clearTimeoutId(target);
                        self._lowLightCurrent(target);
                        self._hideSinger(target);
                    }, 200);
                    self._setTimeoutId(target, timeId);
                });
                //self._hideDragenterhighLight();
            }, function(target, el) {
                var timeId = window.setTimeout(function() {
                    self._clearTimeoutId(el);
                    self._hideSinger(el);
                }, 200);
                self._setTimeoutId(el, timeId);
                target.removeClass(self.config.currentSinger);
            }, function(target) {
                self._lowLightCurrent(target);
                //self._hideDragenterhighLight();
            });
        },
        /**
         * @methed _setTimeoutId ��Ԫ��el�ϼ���timeidֵ
         * @param el ��Ҫ��timeid��Ԫ�أ�jQuery����
         * @param timeId timeidֵ
         */
        _setTimeoutId : function(el, timeId) {
            if(!el && !timeId) {
                return;
            }
            var timeIds = el.data('timeid') || [];
            timeIds.push(timeId);
            el.data('timeid', timeIds);
        },
        /**
         * @methed _clearTimeoutId �����Ԫ��el�ϵ�timeidֵ
         * @param el ��Ҫ���timeidֵ��Ԫ�أ�jQuery����
         */
        _clearTimeoutId : function(el) {
            if(!el) {
                return;
            }
            var timeIds = el.data('timeid'), timeid;
            if(timeIds && !!( timeid = timeIds.shift())) {
                window.clearTimeout(timeid);
                el.data('timeid', timeIds);
            }
        },
        /**
         * @methed _moveLeave ��moveʱ������ק�Ϸŵ�Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _moveLeave : function(e) {
            var self = this;
            this._judgeMove(e, function(target, elem) {
                self._lowLightCurrent(target);
                //this._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
                //self._hideDragenterhighLight();
            }, function(target, elem) {
                var isEnable = self._isEnableDropIn(target, self.elemInfo);
                if(isEnable[0] === true && isEnable[1] === false) {
                    self._lowLightCurrent(target);
                    //this._hideCellLightFix();
                    self._hideCellLight(self.fixCellHighLightEl);
                    //self._hideDragenterhighLight();
                }
            });
        },
        /**
         * @methed _dropInDrop ��dropinʱ������ק�Ϸŵ�Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _dropInDrop : function(e) {
            var self = this;
            this._judgeDropIn(e, function(els) {
                var target = els.eq(0);
                self._lowLightCurrent(target);
                //self._hideDragenterhighLight();
                self._hideSinger(target);
                //�滻HTML
                var//htmlcode = e.dataTransfer.getData("text/html"),
                htmlcode = self.dropTransport.data(D.DropInPage.CONSTANTS.ELEMENT_DATA_HTML_CODE), parent = target.parent(), opts = {
                    'mod' : 'replace',
                    'target' : target,
                    'type' : self.elemInfo['type'],
                    'classname' : self.elemInfo['className']
                };

                htmlcode = self._dataLoading(htmlcode, opts);
                var replaceSteps = self._replaceHtml({
                    'htmlcode' : htmlcode,
                    'target' : target,
                    'isEdit' : true
                });
                self._addEnableClass(parent);

                //��¼�Ѿ������޸�
                D.BoxTools.setEdited({
                    'param' : replaceSteps,
                    'callback' : null
                });
            }, function(target, el) {
                if(!self.elemInfo) {
                    return;
                }
                //��HTML������ڱ�ʶ֮��
                var//htmlcode = e.dataTransfer.getData("text/html");
                htmlcode = self.dropTransport.data(D.DropInPage.CONSTANTS.ELEMENT_DATA_HTML_CODE), opts = {
                    'mod' : 'sibling',
                    'target' : target,
                    'type' : self.elemInfo['type'],
                    'classname' : self.elemInfo['className']
                };

                htmlcode = self._dataLoading(htmlcode, opts);

                //target.after(htmlcode);
                var editInsertSteps = D.InsertHtml.init({
                    'html' : htmlcode,
                    'container' : target,
                    'insertType' : 'after',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });
                self._addEnableClass(target.parent());

                self._hideSinger(el);
                target.removeClass(self.config.currentSinger);
                //��¼�Ѿ������޸�
                D.BoxTools.setEdited({
                    'param' : editInsertSteps,
                    'callback' : null
                });
            }, function(target) {
                self._lowLightCurrent(target);
                target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell').each(function(i, el) {
                    self._hideSinger($(el));
                });

                //self._hideDragenterhighLight();

                //��HTML�������������
                var//htmlcode = e.dataTransfer.getData("text/html");
                htmlcode = self.dropTransport.data(D.DropInPage.CONSTANTS.ELEMENT_DATA_HTML_CODE), opts = {
                    'mod' : 'container',
                    'target' : target,
                    'type' : self.elemInfo['type'],
                    'classname' : self.elemInfo['className']
                };
                htmlcode = self._dataLoading(htmlcode, opts);
                //target.html(htmlcode);

                var editInsertSteps = D.InsertHtml.init({
                    'html' : htmlcode,
                    'container' : target,
                    'insertType' : 'html',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });
                self._addEnableClass(target);

                //��¼�Ѿ������޸�
                D.BoxTools.setEdited({
                    'param' : editInsertSteps,
                    'callback' : null
                });
            }, true);
            //self._emptySinger(self.dropArea);
        },
        /**
         * @methed _dataLoading ���ݼ���
         * @param htmlcode ���ز���Ҫ���������
         * @return opts ������ {'mod':'container|replace|sibling', 'target':target(), 'type':����(layout|grid...)}
         */
        _dataLoading : function(htmlcode, opts) {
            if(!htmlcode) {
                htmlcode = '<div id="crazy-box-data-loading">�������ڼ����У����Եȡ���</div>';
                //htmlcode.data(D.DropInPage.CONSTANTS.LOADING_DATA_HANDLE_INFO, opts);
                this.loading = opts;
            } else {
                //htmlcode = this._handleStyle(htmlcode, opts, true);
                htmlcode = D.ManagePageDate.handleStyle(htmlcode, opts, true);
            }
            return htmlcode;
        },
        /**
         * @methed _handleStyle ����style���������
         * @param htmlcode ���ز���Ҫ���������
         * @param opts ������ {'mod':'container|replace|sibling', 'target':target(), 'classname':className, 'type':����(layout|grid...)}
         * @param isNew �Ƿ�Ϊ����
         * @param oldModuleClass ��ѡ��module��class����ֻ�е�opts['type']==='cell'��isNew===false����
         * @param newModuleClass ��ѡ��module��class����ֻ�е�opts['type']==='cell'��isNew===false����
         * @return ������htmlcode
         */
        /*_handleStyle: function(htmlcode, opts, isNew, oldModuleClass, newModuleClass){
        if ($.type(isNew)!=='boolean'){
        newModuleClass = oldModuleClass;
        oldModuleClass = isNew;
        isNew = null;
        }
        //��module����Ϊrow����������Ҫ�����⴦��
        if (opts['type']==='module' && (isNew===true||this.state==='copy')){
        htmlcode = '<div class="crazy-box-row cell-row" data-boxoptions=\'{"css":[{"key":"background","name":"��������","type":"background"}],"ability":{"copy":{"enable":"true"}}}\'>\
        <div class="crazy-box-box box-100" data-boxoptions=\'{"css":[{"key":"background","name":"��������","type":"background"},{"key":"width","name":"���","type":"input","disable":"true"}],"ability":{"container":{"enableType":"module","number":"1"}}}\'>'
        + htmlcode + '</div></div>';
        opts['type'] = 'row';
        }

        htmlcode = this._handleReplaceClass(htmlcode, opts['type'], oldModuleClass, newModuleClass);

        switch(opts['mod']){
        case 'replace':
        htmlcode = this._delStyle(htmlcode, opts['target'], opts['classname'], true);
        break;
        case 'container':
        case 'sibling':
        htmlcode = this._delStyle(htmlcode, opts['target'], opts['classname'], false);
        break;
        }
        if (isNew===true){
        htmlcode = this._addFixpreClass(htmlcode, opts['target'], opts['type']);
        }
        return htmlcode;
        },*/
        /**
         * @methed _delStyle ����Ԫ���е�style
         * @param htmlcode ��Ҫ�����html����
         * @param target ����Ԫ�أ�jQuery����
         * @param isReplace �Ƿ��滻��true|false
         * @return ���ش�����htmlcode
         */
        /*_delStyle: function(htmlcode, target, className, isReplace){
        var module = target.closest('.crazy-box-module');
        //className = this.elemInfo['className'];
        if (module.length>0){
        var length = module.find('.'+className).length;
        if (length>1){
        htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
        } else if(length===1) {
        if (isReplace===true && !target.hasClass(className)){
        //htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
        } else if(isReplace===false){
        htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
        }
        }
        }
        return htmlcode;
        },*/
        /**
         * @methed _handleReplaceClass �����滻class��
         * @param htmlcode ��Ҫ�����html����
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @param oldModuleClass ��ѡ���ϵ�module class��
         * @param newModuleClass ��ѡ���µ�module class��
         * @return ���ش�����htmlcode
         */
        /*_handleReplaceClass: function(htmlcode, type, oldModuleClass, newModuleClass){
        var div = $('<div />'), htmlNode;
        //div.html(htmlcode);
        D.InsertHtml.init(htmlcode, div, 'html', false);
        switch (type){
        case 'layout':
        htmlcode = this._handleReplace(div, htmlcode, 'layout');
        case 'row':
        htmlcode = this._handleReplace(div, htmlcode, 'row');
        case 'module':
        htmlcode = this._handleReplace(div, htmlcode, 'module');
        break;
        case 'cell':
        htmlcode = this._replaceNewClass(htmlcode, null, 'cell', oldModuleClass, newModuleClass);
        break;
        }
        return htmlcode;
        },*/
        /**
         * @methed _handleReplace �����滻
         * @param div jQuery����
         * @param htmlcode ��Ҫ�����html�ַ���
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @return ���ش�����htmlcode
         */
        /*_handleReplace: function(div, htmlcode, type){
        var htmlNode, replaceHtml, className,
        classReg = new RegExp('^(cell-'+type+'$)|(cell-'+type+'-\\d+$)');

        htmlNode = div.find('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+type);
        for (var i=0, l=htmlNode.length; i<l; i++){
        var el = htmlNode.eq(i);
        className = D.BoxTools.getClassName(el, classReg);
        replaceHtml = this._getCopyHtml(el, type, className);
        replaceHtml = this._replaceNewClass(replaceHtml, el, type, className);
        this._replaceHtml({'htmlcode':replaceHtml, 'target':el, 'isExecJs':false});
        htmlcode = div.html();
        }
        return htmlcode;
        },*/
        /**
         * @methed _replaceHtml �滻html����
         * @param opts {'htmlcode':htmlcode, 'target':target, 'isExecJs':true|false, 'isEdit':true|false}
         * @param htmlcode ��Ҫ�滻��html����
         * @param target ��Ҫ���滻��Ŀ��Ԫ��
         * @param isExecJs �Ƿ�ִ��JS
         * @param isEdit �Ƿ���б༭��������ҳ���ϵģ����ڼ�¼isEdited�͡��س�������
         */
        _replaceHtml : function(opts) {
            var div, editAfterSteps;
            //var div = $('<div />');
            //opts['target'].after(div);
            if(opts['isEdit'] === true) {
                editAfterSteps = D.InsertHtml.init({
                    'html' : '<div></div>',
                    'container' : opts['target'],
                    'insertType' : 'before',
                    'doc' : this.iframeDoc,
                    'isEdit' : opts['isEdit']
                });

                div = D.BoxTools.getElem(editAfterSteps[0]['undo']['node'], this.iframeBody);
            } else {
                div = $('<div />');
                opts['target'].before(div);
            }

            var editInsertSteps = D.InsertHtml.init({
                'html' : opts['htmlcode'],
                'container' : div,
                'insertType' : 'replaceWith',
                'doc' : this.iframeDoc,
                'isExecJs' : opts['isExecJs'],
                'isEdit' : opts['isEdit']
            });
            var editDelSteps = D.EditContent.editDel({
                'elem' : opts['target'],
                'isEdit' : opts['isEdit']
            });
            if(opts['isEdit'] === true) {
                return editAfterSteps.concat(editInsertSteps, editDelSteps);
                //editDelSteps.concat(editInsertSteps)
            }
        },
        /**
         * @methed _replaceNewClass �滻���µ�class��
         * @param htmlcode ��Ҫ�����html����
         * @param htmlNode ��Ҫ�滻�Ľڵ�
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @param oldClass ��ѡ��ԭ���ϵ�class��
         * @return ���ش�����htmlcode
         */
        /*_replaceNewClass: function(htmlcode, htmlNode, type, oldClass, newClass){
        if (type==='layout'||type==='row'||type==='module' || type==='cell'){
        //D.BoxTools.setUuid();
        //var classMod = 'crazy-'+type,  modify by hongss on 2012.02.23
        var classMod = 'cell-'+type,
        classReg = new RegExp('^('+classMod+'$)|('+classMod+'-\d+$)');
        newClass = newClass || classMod + '-' + D.BoxTools.getUuid();
        oldClass = oldClass || D.BoxTools.getClassName(htmlNode, classReg);
        htmlcode = D.BoxTools.replaceClassName(htmlcode, oldClass, newClass);
        }
        return htmlcode;
        },*/
        /**
         * @methed _addFixpreClass ����ǰ׺class��
         * @param htmlcode ��Ҫ�����html����
         * @param target ����Ԫ��
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @return ���ش�����htmlcode
         */
        /*_addFixpreClass: function(htmlcode, target, type){
        if (type==='cell'){
        var parentNode = target.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'module'),
        htmlNode = $(htmlcode).filter('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+type),
        //preClassName = D.BoxTools.getClassName(parentNode, /^(crazy-module$)|(crazy-module-\d+$)/),  modify by hongss on 2012.02.23
        preClassName = D.BoxTools.getClassName(parentNode, /^(cell-module$)|(cell-module-\d+$)/),
        fixClassName = D.BoxTools.getClassName(htmlNode, /^cell-/);

        htmlcode = D.EditContent.addPrefix({'htmlcode':htmlcode, 'fixstr':fixClassName, 'prestr':preClassName});
        }
        return htmlcode;
        },*/
        /**
         * @methed _getParentType ��ȡ��һ������
         * @param type ��������
         * @return ������һ������
         */
        _getParentType : function(type) {
            var parentType;
            switch (type) {
                case 'grid':
                    parentType = 'layout';
                    break;
                case 'box':
                    parentType = 'row';
                    break;
                case 'cell':
                    parentType = 'module';
                    break;
            }
            return parentType;
        },
        /**
         * @methed _moveDrop ��moveʱ������ק�Ϸŵ�Ŀ��Ԫ��ʱ
         * @param e �¼�����
         */
        _moveDrop : function(e) {
            var self = this;
            this._judgeMove(e, function(target, elem) {
                //ȥ���ƶ�����(_moveEnter)ʱ�����ĸ���
                self._lowLightCurrent(target);
                //self._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
                //�����ͬ��Ԫ�أ����û�п��ǿ�Ȳ����ʵ����
                //var targetHtmlcode = self._handleCopyHtml(target, 'replace', elem),
                var targetHtmlcode = D.ManagePageDate.handleCopyHtml(target, 'replace', elem, self.chooseLevel),
                //    elemHtmlcode = self._handleCopyHtml(elem, 'replace', target),
                elemHtmlcode = D.ManagePageDate.handleCopyHtml(elem, 'replace', target, self.chooseLevel), targetEl, elemEl, editAllSteps, editAfterSteps1, editDelStesp1, editAfterSteps2, editDelStesp2, enableDelStyle = self._enableDelStyle(target, elem);

                /*if (enableDelStyle===false){
                 //targetEl = target;
                 //elemEl = elem;
                 //} else {
                 //var elemEl = $('<div />'),
                 //    targetEl = elemEl.clone();
                 //elem.after(elemEl);
                 }*/
                editAfterSteps1 = D.InsertHtml.init({
                    'html' : '<div></div>',
                    'container' : elem,
                    'insertType' : 'before',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });
                elemEl = D.BoxTools.getElem(editAfterSteps1[0]['undo']['node'], this.iframeBody);
                editDelStesp1 = D.EditContent.editDel({
                    'elem' : elem,
                    'isEdit' : true
                });
                //target.after(targetEl);
                editAfterSteps2 = D.InsertHtml.init({
                    'html' : '<div></div>',
                    'container' : target,
                    'insertType' : 'before',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });
                targetEl = D.BoxTools.getElem(editAfterSteps2[0]['undo']['node'], this.iframeBody);
                editDelStesp2 = D.EditContent.editDel({
                    'elem' : target,
                    'isEdit' : true
                });

                //D.InsertHtml.init(this._getObjHtml(el), elem, 'replaceWith', self.iframeDoc);
                var editInsertSteps1 = D.InsertHtml.init({
                    'html' : targetHtmlcode,
                    'container' : elemEl,
                    'insertType' : 'replaceWith',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                }),
                //target.replaceWith(elem);
                editInsertSteps2 = D.InsertHtml.init({
                    'html' : elemHtmlcode,
                    'container' : targetEl,
                    'insertType' : 'replaceWith',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });

                /*editAllSteps = (enableDelStyle===false) ? editInsertSteps1.concat(editInsertSteps2)
                 : editAfterSteps1.concat(editDelStesp1, editAfterSteps2, editDelStesp2, editInsertSteps1, editInsertSteps2);*/
                editAllSteps = editAfterSteps1.concat(editDelStesp1, editAfterSteps2, editDelStesp2, editInsertSteps1, editInsertSteps2);
                D.BoxTools.setEdited({
                    'param' : editAllSteps,
                    'callback' : null
                });
            }, function(target, elem) {
                //self._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
                //�����������
                var isEnable = self._isEnableDropIn(target, self.elemInfo);
                if(isEnable[0] === true && isEnable[1] === false) {
                    //target.append(elem);
                    //var elemHtmlcode = self._handleCopyHtml(elem, 'container', target),
                    var elemHtmlcode = D.ManagePageDate.handleCopyHtml(elem, 'container', target, self.chooseLevel), editDelSteps = D.EditContent.editDel({
                        'elem' : elem,
                        'isEdit' : true
                    }), editInsertSteps = D.InsertHtml.init({
                        'html' : elemHtmlcode,
                        'container' : target,
                        'insertType' : 'append',
                        'doc' : self.iframeDoc,
                        'isEdit' : true
                    });
                    D.BoxTools.setEdited({
                        'param' : editDelSteps.concat(editInsertSteps),
                        'callback' : null
                    });
                }
            }, true);
        },
        /**
         * @methed _enableDelStyle �Ƿ�����ɾ��sytle
         * @param target jQuery����Ŀ��Ԫ��
         * @param elem jQuery���󣬵�ǰԪ��
         */
        _enableDelStyle : function(target, elem) {
            var moduleClass = '.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'module', targetMel = target.closest(moduleClass)[0], elemMel = elem.closest(moduleClass)[0], enableDelStyle;
            if(targetMel === elemMel) {
                enableDelStyle = false;
            } else {
                enableDelStyle = true;
            }
            return enableDelStyle;
        },
        /**
         * @methed _getObjHtml ��ȡ�����HTML����
         * @param els jQuery����
         */
        /*_getObjHtml: function(elem){
        var div = $('<div />');
        this._setScriptAttr(els.find('script'), 'text/plain');
        div.html(els);
        return div.html();
        },*/
        /**
         * @methed _judgeDropIn ��dropinʱ���ж�Ŀ��Ԫ�ص��������ִ����Ӧ�Ļص�
         * @param e �¼�����
         * @param fn1 �����ͬ��Ԫ��ʱִ�еĻص�
         * @param fn2 �����ǰ��������ʶʱִ�еĻص�
         * @param fn3 ���������Ԫ��ʱִ�еĻص�
         * @param elem ���ڻ�ȡwidget��Ϣ��Ԫ�أ�jQuery������copyʱ��Ҫ���˲���
         * @param isReturn �����������жϣ���cellǶ��ʱ���������������
         * @param judgeChild ���ж�����Ԫ�أ�_dropInLeave/_moveLeaveʱ��Ҫʹ�ô˲���,��false
         */
        _judgeDropIn : function(e, fn1, fn2, fn3, elem, isReturn) {
            if($.type(elem) === 'boolean') {
                isReturn = elem;
                elem = null;
            }

            var self = this, CONSTANTS = D.DropInPage.CONSTANTS, config = self.config, target = $(e.target), widget, before, after, elem = elem || this.currentElem,
            //widgetClasses = this._getWidgetClasses(elem);
            widgetClasses = D.ManagePageDate.getWidgetClasses(elem, this.elemClass, this.enableClass);

            //��module����Ϊrow����������Ҫ�����⴦��
            widgetClasses = self._getModuleClassSpecial(widgetClasses);

            //���������Ԫ��
            if(target.hasClass(widgetClasses['enableClass']) === true) {
                e.stopPropagation();
                //�ص�fn3
                if(fn3 && $.isFunction(fn3) === true) {
                    fn3.call(this, target);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

            //�����ǰ��������ʶ
            if(( before = target.hasClass(CONSTANTS.ENABLE_BEFORE_CLASS_NAME)) === true || ( after = target.hasClass(CONSTANTS.ENABLE_AFTER_CLASS_NAME)) === true) {
                e.stopPropagation();
                var el = before ? target.next() : target.prev();
                //�ص�fn2
                if(fn2 && $.isFunction(fn2) === true) {
                    fn2.call(this, target, el);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

            //�����ͬ��Ԫ��
            if(target.hasClass(widgetClasses['elemClass']) === true || ( widget = target.parents('.' + widgetClasses['elemClass'])).length > 0) {
                e.stopPropagation();
                var els = (widget && widget.length) ? widget : target;
                //�ص�fn1
                if(fn1 && $.isFunction(fn1) === true) {
                    fn1.call(this, els);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

        },
        /**
         * @methed _judgeMove ��moveʱ���ж�Ŀ��Ԫ�ص��������ִ����Ӧ�Ļص�
         * @param e �¼�����
         * @param fn1 �����ͬ��Ԫ��ʱִ�еĻص�
         * @param fn3 ���������Ԫ��ʱִ�еĻص�
         */
        _judgeMove : function(e, fn1, fn2, isReturn) {
            var CONSTANTS = D.DropInPage.CONSTANTS, TRANSPORT_DATA_ELEM = CONSTANTS.TRANSPORT_DATA_ELEM, target = $(e.target), widget, elem = this.moveTransport.data(TRANSPORT_DATA_ELEM), scope = this._getMoveScope(elem),
            //widgetClasses = this._getWidgetClasses(elem);
            widgetClasses = D.ManagePageDate.getWidgetClasses(elem, this.elemClass, this.enableClass);

            if(target.closest(scope).length > 0) {
                //���������Ԫ��
                if(target.hasClass(widgetClasses['enableClass']) === true) {
                    e.stopPropagation();
                    if(fn2 && $.isFunction(fn2) === true) {
                        fn2.call(this, target, elem);
                    }
                    if(isReturn === true) {
                        return;
                    }
                }

                //�����ͬ��Ԫ�أ����û�п��ǿ�Ȳ����ʵ����
                if(target.hasClass(widgetClasses['elemClass']) === true || ( widget = target.closest('.' + widgetClasses['elemClass'])).length > 0) {
                    e.stopPropagation();
                    var el = (widget && widget.length) ? widget : target;
                    if(fn1 && $.isFunction(fn1) === true) {
                        fn1.call(this, el, elem);
                    }
                    if(isReturn === true) {
                        return;
                    }
                }

                //�����ǰ��������ʶ
                /*if ((before=target.hasClass(CONSTANTS.ENABLE_BEFORE_CLASS_NAME))===true
                 || (after=target.hasClass(CONSTANTS.ENABLE_AFTER_CLASS_NAME))===true){
                 e.stopPropagation();
                 var el = before ? target.next() : target.prev();
                 //�ص�fn2
                 if (fn2 && $.isFunction(fn2)===true){
                 fn2.call(this, target, el);
                 }
                 if (isReturn && isReturn===true){
                 return;
                 }
                 }*/

            }
        },
        /**
         * @methed _getModuleClassSpecial ��layout��������moudle�������������Ҫ(ǰ̨��row����)
         * @param classObj �� _getWidgetClasses ���ص����ݸ�ʽһ��
         */
        _getModuleClassSpecial : function(classObj) {
            if(classObj['elemClass'] === 'crazy-box-module') {
                classObj['elemClass'] = 'crazy-box-row';
                classObj['enableClass'] = 'crazy-box-enable-row';
                return classObj;
            } else {
                return classObj;
            }
        },
        /**
         * @methed _getWidgetClasses ��ȡԪ��(widget)�����class����elemClass��enableClass
         * @param elem Ԫ��Ԫ�أ�jQuery����
         */
        /*_getWidgetClasses: function(elem){
        var type = this._getWidgetType(elem),
        CONSTANTS = D.DropInPage.CONSTANTS,
        elemClass, enbaleClass;
        if ($.inArray(type, CONSTANTS.ALL_WIDGET_TYPES)>-1){
        elemClass = CONSTANTS.ELEMENT_CLASS_PREFIX+type;
        enableClass = CONSTANTS.ENABLE_CLASS_PREFIX+type;
        } else {
        elemClass = this.elemClass;
        enableClass = this.enableClass;
        }
        return {'elemClass':elemClass, 'enableClass':enableClass};
        },*/
        /**
         * @methed _getWidgetType ��ȡԪ��������
         * @param elem Ԫ��Ԫ�أ�jQuery����
         */
        /*_getWidgetType: function(elem){
        if (!elem){ return; }
        var ALL_WIDGET_TYPES = D.DropInPage.CONSTANTS.ALL_WIDGET_TYPES,
        type;
        for (var i=ALL_WIDGET_TYPES.length-1; i>0; i--){
        if (elem.hasClass(D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+ALL_WIDGET_TYPES[i])===true){
        type = ALL_WIDGET_TYPES[i];
        break;
        }
        }
        type = type || 'label';
        return type;
        },*/
        /**
         * @methed _addEnableClass Ϊcontainer�ı�ǩ�����������Ԫ������(crazy-box-enable-XXXX)�ı�ʶ
         * @param {element} root ��ӷ�Χ��jQuery�����ṩ��InsertHtmlʹ��
         */
        _addEnableClass : function(root) {
            var CONSTANTS = D.DropInPage.CONSTANTS, ALL_WIDGET_TYPES = CONSTANTS.ALL_WIDGET_TYPES, ENABLE_CLASS_PREFIX = CONSTANTS.ENABLE_CLASS_PREFIX, TAG_DATA_BOX_OPTIONS = CONSTANTS.TAG_DATA_BOX_OPTIONS, els = $('[data-' + TAG_DATA_BOX_OPTIONS + ']', root);

            els.each(function(i, el) {
                el = $(el);
                var boxOptions = el.data(TAG_DATA_BOX_OPTIONS), enableType = D.BoxTools.parseOptions(boxOptions, ['ability', 'container', 'enableType']), enableClass = ENABLE_CLASS_PREFIX + enableType;

                if(enableType && $.inArray(enableType, ALL_WIDGET_TYPES) > -1 && el.hasClass(enableClass) === false) {
                    el.addClass(enableClass);
                }
            });
        },
        addEnableClass : function(root) {
            this._addEnableClass(root);
        },
        /**
         * @methed _enterPackage ��Ԫ��mouseenterʱ
         */
        _enterPackage : function() {
            var self = this, config = this.config;

            $(config.packageParent).delegate(config.dragPackage, 'mouseover', function(e) {
                var el = $(this);
                self._showTransport(el, self.dropTransport, false);
                //'dropin'
                //self._highPackage(el);
            });
            $(config.packageParent).delegate(config.dragPackage, 'mouseout', function(e) {
                if(self.transportTimeid) {
                    window.clearTimeout(self.transportTimeid);
                    self.transportTimeid = null;
                }
            });
        },
        /**
         * @methed _highPackage ����Ԫ�ؿ��е�Ԫ��
         * el ��Ҫ������Ԫ��
         */
        /*_highPackage: function(el){
        el.parent().addClass('dcms-box-layoutcontent-high');
        },*/
        /**
         * @methed _highPackage ȡ������Ԫ�ؿ��е�Ԫ��
         * el ��Ҫȡ��������Ԫ��
         */
        /*_lowPackage: function(el){
        el.parent().removeClass('dcms-box-layoutcontent-high');
        },*/
        /**
         * @methed _enterPagePackage ��ҳ�������еĵ�Ԫ��mouseenterʱ
         */
        _enterPagePackage : function() {
            var self = this;
            self.fixCellHighLightEl.bind('mouseenter', function(e) {
                e.preventDefault();
                var target = $(e.target);
                var currentElem = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                self.currentElem = currentElem;
                //����϶��Ŀؼ���cell   ��������
                self.moveTransport.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);

            });

            self.cellHighLightEl.bind('mouseover', function(e) {
                var cell = D.HighLight.getLightElemData(self.cellHighLightEl);
                self._showCellLight(cell);
                //����϶��Ŀؼ���cell   ��������
                self.moveTransport.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, cell);
            });

            $(self.dropArea).live('mouseover', function(e) {
                var target = $(e.target), widget, className = self.elemClass = self._getCurrentWidgetClass();

                if(!self.chooseLevel) {
                    return;
                }
                if(self.chooseLevel === 'label') {
                    self._highLightCurrent(target);
                    //self._showTransport(target, 'move');
                } else if(self.chooseLevel === 'microlayout') {
                    //����΢����
                    var _boxMicroTd = target.closest('.crazy-table-containter-td');
                    D.HighLight.showMicroLightFix(_boxMicroTd, self.fixMicroHighLightEl);

                } else {
                    self.enableClass = D.DropInPage.CONSTANTS.ENABLE_CLASS_PREFIX + self.chooseLevel;

                    if(self.state === 'copy') {//����ڸ���״̬
                        self._dropInEnter(e);
                    } else {//����ڷǸ���״̬
                        //�༭ĳ��module�еı�ǩʱ
                        var ENABLE_EDIT_AREA_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                        if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                            self._highLightCurrent(target);
                            //add by pingchun.yupc 2012-05-30
                            self._showCellLight(target);
                            //end
                            return;
                        }

                        //�༭ĳ��module�е�Cellʱ
                        // var ENABLE_EDIT_CELL_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME;
                        // if (target.hasClass(ENABLE_EDIT_CELL_CLASS_NAME)===true
                        //  || target.closest('.'+ENABLE_EDIT_CELL_CLASS_NAME).length>0){
                        // var cellWidget = target.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'cell');

                        // self._showTransport(cellWidget, self.moveTransport); //'move'
                        // return;
                        // }

                        //ѡ��ĳ������ʱ
                        if(target.hasClass(className) === true || ( target = target.closest('.' + className)).length > 0) {
                            e.stopPropagation();

                            //��ʾ��������
                            self._showTransport(target, self.moveTransport);
                            //'move'
                        }
                    }
                }

            });

            /*$(window).bind('EditContent.text',function(event,param){
             //console.log(param);

             //self._showHighLight(param.elem, true);
             });*/

        },
        /**
         * @methed high light show cell
         */
        _showCellLight : function(target) {
            var self = this;
            var _boxCell = target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell');
            if(_boxCell.length > 0) {
                self._clearTimeoutId(_boxCell);
                self._checkCellMove(_boxCell);
                D.BoxTools.showCellLight(self.cellHighLightEl, _boxCell);
            }
        },
        _hideCellLight : function(lightEl, cell) {
            //if (lightEl){ return; }
            //D.BoxTools.hideCellLight(this.cellHighLightEl,true);
            var lightCell = D.HighLight.getLightElemData(lightEl);
            if(!cell || cell[0] === lightCell[0]) {
                D.HighLight.hideLight(lightEl, false);
            }
            if(lightCell && lightCell.length) {
                D.HighLight.removeLightClassName(cell || lightCell, this.config.cellHightLightCurrent);
            }
        },
        /**
         *���� ΢���ָ���
         */
        _hideMicro : function() {
            var self = this;
            if(self.mircolayout) {
                self.mircolayout.unbind();
                self.mircolayout = null;
            }
            if(D.Microlayout) {
                D.Microlayout.hideMicroHightlight(self.microHighLightEl, self.fixMicroHighLightEl);
            }

        },
        /**
         * @methed high light show cell
         */
        _showCellLightFix : function(target) {
            var self = this;
            var _boxCell = target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell');
            if(_boxCell.length > 0) {

                D.BoxTools.showCellLight(self.fixCellHighLightEl, _boxCell);
            }
        },
        /*_hideCellLightFix:function(){
         D.BoxTools.hideCellLight(this.fixCellHighLightEl,true);
         },*/
        _showCellAttr : function(lightEl) {
            this._hideHighLight();
            var currentElem = D.HighLight.getLightElemData(lightEl);
            this.currentElem = currentElem;
            D.showAttr(currentElem);
        },
        /**
         * @methed _leaveCopyPackage ��ҳ�������еĵ�Ԫ��mouseenterʱ
         */
        _leaveCopyPackage : function() {
            var self = this;

            $(self.dropArea).live('mouseout', function(e) {
                var target = $(e.target);

                if(self.state === 'copy') {//����ڸ���״̬
                    self._dropInLeave(e);
                }

            });
        },
        /**
         * @methed _leavePagePackage ��ҳ�������еĵ�Ԫ��mouseleaveʱ
         */
        _leavePagePackage : function() {
            var self = this;

            // transport-object start
            /*self.transport.bind('mouseout', function(e){
             var target = $(this),
             mode = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_MODE);

             if (mode==='dropin'){   //������ڡ�dropin��״̬��ʧȥԪ�صĸ���
             self._lowPackage(target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM));
             }

             if (!(self.state==='copy' && mode==='move')) {   //��������ڸ���״̬
             self._hideTransport(mode);
             }
             });*/

            self.dropTransport.bind('mouseout', function(e) {
                self._hideTransport($(this));
            });
            self.moveTransport.bind('mouseout', function(e) {
                if(self.state !== 'copy') {
                    self._hideTransport($(this));
                }
            });
            self.cellHighLightEl.bind('mouseout', function(e) {
                var cell = self.cellHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                self._delayHideCellLight(self.cellHighLightEl, cell);
            });
            // transport-object end

            $(self.dropArea).live('mouseout', function(e) {
                var target = $(e.target), ENABLE_EDIT_AREA_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                //label�㼶��ť��¶ʱ
                if(self.chooseLevel === 'label') {
                    self._lowLightCurrent(target);
                } else if(self.chooseLevel === 'microlayout') {
                    //����΢����

                    D.HighLight.removeMicroLight(self.fixMicroHighLightEl);
                } else {

                    //add by pingchun.yupc 2012-05-30
                    var ENABLE_EDIT_AREA_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                    if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                        var cell = target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell');
                        if(cell.length) {
                            self._delayHideCellLight(self.cellHighLightEl, cell);
                        }
                    }
                    //end
                    if(self.transportTimeid) {
                        window.clearTimeout(self.transportTimeid);
                        self.transportTimeid = null;
                    }
                }

                //�༭���� ��������
                if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                    self._lowLightCurrent(target);
                }
            });
        },
        _delayHideCellLight : function(lightEl, cell) {
            var self = this, timeId = setTimeout(function() {
                self._hideCellLight(lightEl, cell);
            }, 20);
            self._setTimeoutId(cell, timeId);
        },
        /**
         * @methed _clickPagePackage ����ҳ���е�Ԫ����ѡ��Ԫ��
         */
        _clickPagePackage : function() {
            var self = this, ENABLE_EDIT_AREA_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, ENABLE_EDIT_CELL_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME;

            self.iframeDoc.bind('click', function(e) {
                //console.log(self.editTextarea);
                var target = $(e.target);
                if(self.editTextarea.css('display') !== 'none' && target.closest('.' + self.config.defineCell).length === 0 && target.closest(self.config.editTextarea).length === 0) {
                    self._setDefineCodeView(self.editTextarea);
                }
            });
            /**
             *���� ΢���ֵĵ�Ԫ��
             */
            self.fixMicroHighLightEl.bind('click', function(e) {
                e.preventDefault();
                var target = $(e.target), $table;
                var _elem = D.HighLight.getLightElemData(target);
                $table = _elem.closest('table');
                if(!$table.hasClass('current')) {
                    return;
                }

                D.HighLight.hideLight(self.fixCellHighLightEl);
                //����Ƿ���Ժϲ�
                self.mircolayout.showIsMerge(_elem[0]);
                //����ѡ�еĵ�Ԫ��
                self.mircolayout.getMicroHightlight().data('elem', _elem);

                D.BoxTools.showHighLight(_elem, self.fixCellHighLightEl);
            });
            // click cell high light
            self.fixCellHighLightEl.bind('click', function(e) {
                e.preventDefault();
                if(self.chooseLevel !== 'microlayout') {
                    var target = $(e.target);
                    self._showCellAttr(target);
                }
            });

            $('.edit-cell-bin', self.cellHighLightEl).bind('click', function(e) {
                e.preventDefault();
                var target = $(e.target), cell = D.HighLight.getLightElemData(target.closest('.crazy-box-cell-target-current'));
                self._showCellAttr(target.closest('.crazy-box-cell-target-current'));

                //self._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
                self._showCellLightFix(cell);
            });

            self.moveTransport.bind('click', function(e) {
                var target = $(this);
                //mode = target.data(CONSTANTS.TRANSPORT_DATA_MODE),
                //el = target.data(CONSTANTS.TRANSPORT_DATA_ELEM);

                //e.stopImmediatePropagation();
                /*if (self.chooseLevel==='module' && el.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX+'module')===true){
                 self._hideJsControl(el);
                 self._showSingerArea(el);
                 } else {
                 self._showHighLight(target);
                 }*/

                self._handleChooseHight(target, true);
                self._hideTransport(target);
                //add by pingchun.yupc
                //self._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
            });

            // transport-object end
            //������벻��ʹ��click�¼����������chrome�п��ٵ��ʱ�޷�����(ԭ����)
            self.dropArea.live('mousedown', function(e) {
                e.preventDefault();
                var target = $(e.target), defineModule = self.config.defineModule, className = self.elemClass = self._getCurrentWidgetClass();

                //label�㼶��ť��¶ʱ
                /*if (self.chooseLevel==='label'){
                //window.setTimeout(function(){}, 50);
                self._showHighLight(target);
                }*/

                //�༭���� ��������
                if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                    //self._showHighLight(target, true);
                    return;
                } else if(target.hasClass(ENABLE_EDIT_CELL_CLASS_NAME) === true || target.closest('.' + ENABLE_EDIT_CELL_CLASS_NAME).length > 0) {//�����ٵ��������Ԫ�ػ�Ϊ����ǰ��ѡ��ĳ��cellʱ
                    e.stopPropagation();
                    var cellWidget = target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell');
                    self._handleChooseHight(cellWidget);

                } else if((self.state !== 'copy' && (target.hasClass(className) === true//�����ٵ��������Ԫ�ػ�Ϊ����ǰ��ѡ��ĳ������ʱ
                || ( target = target.closest('.' + className)).length > 0)) || ( target = target.closest('.' + defineModule)).length > 0) {//���������Զ���ģ��
                    e.stopPropagation();
                    self._handleChooseHight(target);
                    self._hideCellLight(self.fixCellHighLightEl);
                }

                //���������Զ���ģ��
                /*if ((target=target.closest('.'+defineModule)).length>0){
                self._hideJsControl(target);
                self._showSingerArea(target);
                }*/
                //���Ϊ���Զ��������飬��ʹ�Զ�����봦�ڿ��ӻ�״̬

            });

            //�������ʹ��click�¼��������ʹtab�л��е�click�¼���Ч
            self.dropArea.live('click', function(e) {
                e.preventDefault();
                var target = $(e.target);

                //label�㼶��ť��¶ʱ
                if(self.chooseLevel === 'label') {
                    //window.setTimeout(function(){}, 50);
                    self._lowLightCurrent(target);
                    self._showHighLight(target);
                }

                if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                    //pingchun.yupc
                    //self._hideCellLightFix();
                    self._hideCellLight(self.fixCellHighLightEl);
                    self._showCellLightFix(target);

                    //modify by hongss on 2012.06.07 for �����Զ���ؼ�
                    var defineCell;
                    if((( defineCell = target.closest('.' + self.config.defineCell)).length > 0) || (( defineCell = target.closest('.' + self.config.dsCodeEdit)).length > 0)) {
                        e.stopPropagation();
                        target = defineCell;
                        self._setDefineCodeEdit(target, self.editTextarea);
                    } else {
                        self._lowLightCurrent(target);
                        self._showHighLight(target, true);
                    }
                }
            });
        },
        /**
         * @methed _handleChooseHight ����ѡ���ĸ���
         * @param target Ŀ��Ԫ�أ�jQuery����
         * @param isTransport Ŀ��Ԫ���Ƿ�Ϊ����Ԫ��
         */
        _handleChooseHight : function(target, isTransport) {
            var CONSTANTS = D.DropInPage.CONSTANTS, el, self = this;
            el = (isTransport === true) ? target.data(CONSTANTS.TRANSPORT_DATA_ELEM) : target;
            if(this.chooseLevel === 'module' && el.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'module') === true) {
                this._hideJsControl(el);
                this._showSingerArea(el);
                this._setDefineCodeView(this.editTextarea);
            } else if(this.chooseLevel === 'layout') {
                this._showSingerArea(el);
                self._handleLayoutConfig();
            } else if(this.chooseLevel === 'microlayout') {
                //����΢����
                //console.log(999);
                //console.log('microlayout');
            } else {
                this._showHighLight(el, true);
            }

        },
        /**
         *����layout �ױ߾�
         */
        _handleLayoutConfig : function() {
            var self = this,
            //layout �ױ߾�
            _$mBottom = $('#margin_bottom', self.iframeDoc);
            _$mBottom.val(parseInt(self.currentElem.css('margin-bottom')));
            if(_$mBottom && _$mBottom.length > 0) {
                //console.log(_$mBottom[0]);
                _$mBottom[0].addEventListener('input', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    //self.currentElem
                    var _$self = $(this);
                    if(isNaN(_$self.val())) {
                        alert('�ף�����Ƿ�,���������룡');
                        return;
                    }
                    /**
                     *�޸� firefox ie �� margin-top/bottom��bug
                     * ������Ƕ�׹�ϵ��div��������div�ĸ�Ԫ��paddingֵΪ0����ô�ڲ�div��margin-top����margin-bottom��ֵ�ᡰת�ơ������div��
                     */
                    //$('<div style="height:0;">&nbsp;</div>').insertBefore(self.currentElem);
                    D.EditContent.editCss({
                        'elem' : self.currentElem,
                        'key' : 'margin-bottom',
                        'value' : _$self.val() + 'px'
                    });
                });
            }
        },
        /**
         * @methed _hideJsControl ���JSʧЧ����
         * @param el Ŀ��Ԫ�أ�jQuery����
         * @param unCurrent �Ƿ��ǶԵ�ǰԪ���������˲����ڸ���ʱʹ�ú�start
         */
        _hideJsControl : function(el, unCurrent) {
            if(this.iframeDoc.find('.' + this.config.jsControlClass).length > 0 && (unCurrent || el.closest('.' + this.config.jsControlClass).length === 0)) {
                this.jsControl.jsValid();
            }
        },
        /**
         * @methed _singerBtnsListener ������ʶ��������ڵİ�ť
         * @param target ��ʶ�������Ԫ�أ�jQuery����
         */
        _singerBtnsListener : function(singer) {
            var config = this.config, self = this, CONSTANTS = D.DropInPage.CONSTANTS, singerMain = $(config.singerMain, singer), singerBtnsUl = $(config.singerBtnsUl, singer);

            /*//�Զ���ģ��ı༭����
            $('.'+CONSTANTS.SINGER_AREA_EDIT_HTML_BTN, singer).live('click', function(e){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            textarea = $('<textarea placeholder="��������ش���"></textarea>'),
            btnsHtml = self._getSingerBtnsHtml(el, 'coding');
            //textarea.attr('style', singerMain.attr('style'));
            textarea.width(singerMain.width()-2);
            textarea.height(singerMain.height()-2);
            textarea.text($.trim(el.html()));
            singerMain.html(textarea);
            singerBtnsUl.html(btnsHtml);
            self._hideHighLight();
            });*/

            //Ԥ���Զ���ģ��Ĵ���
            /*$('.'+CONSTANTS.SINGER_AREA_VIEW_HTML_BTN, singer).live('click', function(){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            btnsHtml = self._getSingerBtnsHtml(el, 'view');

            self._setDefineCodeView(el, singer);
            singerBtnsUl.html(btnsHtml);
            });*/

            //Ѱ�ҡ���һ�㡱�����ڵ��߼��в�����֡���һ�㡱
            /*$('.'+CONSTANTS.SINGER_AREA_PREVIOUS_BTN, singer).live('click', function(e){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            target = el.parents('.'+CONSTANTS.ELEMENT_CLASS_PREFIX+'cell'),
            moduleClass = CONSTANTS.ELEMENT_CLASS_PREFIX+'module',
            container, parentContainer;

            if (!target.length){
            target = el.parents('.'+moduleClass);
            }
            self._finishEditLable(el, singerMain);
            //�������module����ȡmoduleԪ��
            container = target.eq(0);
            self._showSingerArea(container);
            });*/

            //�༭��ǩ
            $('.' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, singer).live('click', function(e) {
                //���cell�༭
                //self._finishEditArea(singer, $('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, singer),
                // CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_CELL_BTN,
                // CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME, '�༭�ؼ�');
                self.chooseLevel = 'module';
                self._startEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
            });
            //ѡ��ģ��
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_TOPIC_MODULE_BTN,singer).live('click',function(e){
            var _self = $(this),_topicModule=_self.data('target'),_topicObj=$('#other');
            console.log(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM).find('.'+_topicModule));
            D.showAttr(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM).find('.'+_topicModule));

            self._showTopicModule(_topicObj);
            });*/
            //��̬ģ��
            //������Դ����ģ���б��޾͵���ѡ������Դ
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN, singer).live('click', function(e) {
                var _oModule = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                D.bottomAttr.openDsTemplate();
                //D.showAttr(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM));
            });
            //������Դ����ʾ�޸İ�ť
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN, singer).live('mouseenter', function(e) {
                var _oModule = D.DropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                var _dsTemplate = _oModule.attr('data-dstemplate');
                if(_dsTemplate) {
                    var _showDs = _oModule.attr('data-showds');
                    // �������Ҫ��ʽ����Դ������ʾ��������ʽ,��ר����Ҫ��
                    if("false" != _showDs) {
                        $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).css('display', 'inline-block');
                    }
                }

            });
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).live('mouseleave', function(e) {
                $(this).hide();
                // $('.'+CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN+"-modify",singer).hide();
            });
            //�޸�����Դ
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).live('click', function(e) {
                D.bottomAttr.changeDsForDsTemplate();
            });
            $('.list-btns', singer).live('mouseleave', function(e) {
                $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).hide();
            });

            //��ɱ�ǩ�༭
            $('.' + CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, $('#crazy-box-cell-highlight', self.iframeDoc)).live('click', function(e) {
                self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '�༭');
            });
            /**
             *�༭΢�������
             */
            $('.micro-edit-finish', self.iframeDoc).live('click', function(e) {
                self.chooseLevel = 'module';

                self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '�༭');

            });
            /**
             *���� 2012-09-20 ������
             */
            $(singer).delegate('.' + D.DropInPage.defConfig.newCopyButton, 'click', function(event) {
                event.preventDefault();
                var target = self.currentElem;
		if (target.hasClass('crazy-box-module')){
			target = target.closest('.crazy-box-row');
		}		
                var $htmlcode = $(D.ManagePageDate.handleCopyHtml(target, '', target, self.chooseLevel));
                $htmlcode.removeClass('box-level-self');
                $htmlcode.find('.box-level-self').removeClass('box-level-self');
                $htmlcode.removeClass(self.config.currentSinger);
                $htmlcode.find(self.config.currentSinger).removeClass(self.config.currentSinger);

                var editInsertSteps = D.InsertHtml.init({
                    'html' : $htmlcode[0].outerHTML,
                    'container' : target,
                    'insertType' : 'after',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });

                D.BoxTools.setEdited({
                    'param' : editInsertSteps,
                    'callback' : null
                });
            });
            //��������Դ
            $(singer).delegate('.' + CONSTANTS.SINGER_AREA_ENTER_DS_BTN, 'click', function(event) {
                event.preventDefault();
                D.showAttr(self.currentElem);
                //չʾ��������Դ
                D.showDs();
            });
            //������
            $('.' + CONSTANTS.SINGER_AREA_EDIT_MODULE_BTN, singer).live('click', function(event) {
                event.preventDefault();
                self.chooseLevel = 'module';
                if(self.state === 'copy') {//ȡ������
                    self._cancelCopy();
                }
                D.showAttr(self.currentElem);

            });
            //΢����
            $('.' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN, singer).live('click', function(event) {
                event.preventDefault();
                self.chooseLevel = 'microlayout';
                self._startEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
                var boxMicrolayout = self.currentElem.find('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'microlayout');
                $('.crazy-box-microlayout', self.iframeBody).each(function(index, obj) {
                    $(obj).removeClass('current');
                });
                boxMicrolayout.addClass('current');
                self.table = boxMicrolayout[0];
                //΢����
                self.mircolayout = new D.Microlayout(self);
                self.mircolayout.load();

                // console.log(self.microHighLightEl);
                D.HighLight.showMicrolayoutLight(boxMicrolayout, self.microHighLightEl);
            });

            //cell �����ƶ�
            $(self.cellHighLightEl).delegate('.move-cell-bin', 'click', function(event) {
                event.preventDefault();
                var _$self = $(this);
                if(!_$self.parent().hasClass('disabled')) {
                    self._cellMoveUpOrDown(event, _$self);
                }

            });

            //�༭cell
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, singer).live('click', function(e){
            //��ɱ�ǩ�༭
            self._finishEditArea(singer, $('.'+CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, singer),
            CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN,
            CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '�༭����');

            self._startEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_CELL_BTN,
            CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);

            });*/

            //���cell�༭
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, singer).live('click', function(e){
            self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN,
            CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME,
            '�༭�ؼ�');
            });*/

            //�˳��༭״̬�����ڵ��߼�û�д˰�ť
            /*$('.'+CONSTANTS.SINGER_AREA_EXIT_EDIT_BTN, singer).live('click', function(e){
            self._hideSingerArea();
            this.currentElem = null;
            });*/

            //�����ģ���¼�
            self._selectedTagModuleList(singer);
        },
        /**
         *cell ���������ƶ�
         */
        _cellMoveUpOrDown : function(e, direction) {
            var self = this, target = $(e.target), cell = D.HighLight.getLightElemData(target.closest('.crazy-box-cell-target-current'));
            var _next = function(_cell) {
                var _nCell = _cell.next();
                if(_nCell && _nCell.hasClass('crazy-box-cell')) {
                    return _nCell
                } else {
                    return arguments.callee.call(this, _nCell);
                }
            }, _prev = function(_cell) {
                var _pCell = _cell.prev();
                if(_pCell && _pCell.hasClass('crazy-box-cell')) {
                    return _pCell
                } else {
                    return arguments.callee.call(this, _pCell);
                }
            }, tempCell = '';

            if(direction.hasClass('up')) {
                tempCell = _prev(cell);
                tempCell.before(cell);
                self._showCellLight(tempCell);
            }
            if(direction.hasClass('down')) {
                tempCell = _next(cell);
                tempCell.after(cell);
                self._showCellLight(tempCell);
            }

        },
        /**
         *���cell�Ƿ�������ƶ�
         */
        _checkCellMove : function(boxCell) {
            var self = this, cellParent = boxCell.parent()[0], len = cellParent.childNodes.length, childList = [];
            for(var i = 0; i < len; i++) {
                var node = cellParent.childNodes[i], $node = $(node);
                if(node.nodeType === 1 && $node.hasClass('crazy-box-cell')) {
                    childList.push(node);
                }
            }
            $('a.move-cell-bin', self.iframeDoc).each(function(index, obj) {
                var _$self = $(obj);
                _$self.parent().removeClass('disabled');
            });
            if(childList && childList.length > 1) {
                if(boxCell[0] === childList[0]) {
                    $('a.up', self.iframeDoc).parent().addClass('disabled');
                }
                if(boxCell[0] === childList[childList.length - 1]) {
                    $('a.down', self.iframeDoc).parent().addClass('disabled');
                }

            } else {
                //console.log( $('a.up').parent());
                $('a.up', self.iframeDoc).parent().addClass('disabled');
                $('a.down', self.iframeDoc).parent().addClass('disabled');
            }

        },

        /**
         * @methed �����ѡ��ģ���¼�
         * @param singer ��ʶ�������Ԫ�أ�jQuery����
         */
        _selectedTagModuleList : function(singer) {
            var CONSTANTS = D.DropInPage.CONSTANTS, self = this;
            $('.' + CONSTANTS.SINGER_AREA_EDIT_MODULE_TAG_BTN, singer).live('click', function(e) {
                var oDialog = $('div.dialog-module-tag'), _targetModuleObj = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                var moduleId;
                if(self.state === 'copy') {//ȡ������
                    self._cancelCopy();
                }
                moduleId = D.bottomAttr.queryLikeTagModule(_targetModuleObj, 1);
                var moduleList = $('.module-list', oDialog);
                if((moduleId === -1) || (moduleList && moduleList.length <= 0)) {
                    alert('û����ͬ��ǩ��ģ�棡');
                    return;
                }
                $.use('ui-dialog', function() {
                    oDialog.dialog({
                        modal : true,
                        shim : true,
                        center : true,
                        fadeOut : true
                    });
                });
            });
            //��ҳ�¼�
            $('div.module-page').delegate('a.elem', 'click', function(e) {
                e.preventDefault();
                var _self = $(this), _selfParent = _self.parent();
                if(!_selfParent.hasClass('disabled')) {
                    D.bottomAttr.queryLikeTagModule(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), _self.data('val'));
                }
            });
            //�����¼�
            $('div.module-body').delegate('div.module-list', 'mouseenter', function(e) {
                var _self = $(this);
                _self.addClass('module-high-light');
            });
            $('div.module-body').delegate('div.module-list', 'mouseleave', function(e) {
                var _self = $(this);
                _self.removeClass('module-high-light');
            });
            //����ģ���¼�
            $('div.module-body').delegate('div.module-list', 'click', function(e) {
                var _self = $(this), _elemHtml = _self.html(), _$elemHtml, _eleminfo = _self.data('eleminfo');
                var _targetModuleObj = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                var _targetParent = _targetModuleObj.parent();
                _elemHtml = self._setElemInfo(_elemHtml, _eleminfo);

                _targetModuleObj.removeClass('box-level-self');
                //
                D.InsertHtml.init({
                    'html' : _elemHtml,
                    'container' : _targetModuleObj,
                    'insertType' : 'replaceWith',
                    'doc' : self.iframeDoc,
                    'isEdit' : true
                });
                _$elemHtml = _targetParent.find('.' + CONSTANTS.ELEMENT_CLASS_PREFIX + CONSTANTS.ALL_WIDGET_TYPES[5]);
                _$elemHtml.addClass('box-level-self').addClass('cell-module-' + D.BoxTools.getUuid());

                self.moveTransport.data(CONSTANTS.ELEMENT_DATA_HTML_CODE, _$elemHtml);
                self._setCurrentElem(_$elemHtml, self.singerArea);
                //D.showAttr(_$elemHtml);

                //self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, _$elemHtml);
                $('.close-btn', 'div.dialog-module-tag').closest('div.dialog-module-tag').dialog('close');

            });
            $('.close-btn', 'div.dialog-module-tag').bind('click', function(e) {
                e.preventDefault();
                var _self = $(this);
                _self.closest('div.dialog-module-tag').dialog('close');
            });
        },
        /**
         * @methed _startEditArea ��ʼ�Ա༭������б༭���༭��ǩ��༭cell
         * @param singerArea jQuery���󣬱༭����
         * @param btn jQuery����ִ�а�ť
         * @param currentBtnClass ��ǰ��ť��class��
         * @param addBtnClass ��Ҫ�滻�ɵ�class��
         * @param stateClass ���༭����������ڱ�ʶ���ڱ༭��class��
         * @param text btn�е��İ�
         */
        _startEditArea : function(singerArea, btn, currentBtnClass, addBtnClass, stateClass, text) {
            var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(this.config.singerMain, singerArea), self = this;
            text = text || '���';
            //btn.text(text).removeClass(currentBtnClass)
            //.addClass(addBtnClass);
            el.addClass(stateClass);
            singerMain.hide();
            //add by pingchun.yupc 2012-08-08
            if(self.state === 'copy') {//ȡ������
                self._cancelCopy();
            }
            singerArea.hide();
            //end
        },
        /**
         * @methed _finishEditArea ��ɶԱ༭������б༭���༭��ǩ��༭cell
         * @param singerArea jQuery���󣬱༭����
         * @param btn jQuery����ִ�а�ť
         * @param currentBtnClass ��ǰ��ť��class��
         * @param addBtnClass ��Ҫ�滻�ɵ�class��
         * @param stateClass ���༭����������ڱ�ʶ���ڱ༭��class��
         * @param text btn�е��İ�
         */
        _finishEditArea : function(singerArea, btn, currentBtnClass, addBtnClass, stateClass, text) {
            if(singerArea && btn) {
                var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(this.config.singerMain, singerArea), moduleEl = el.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'module');
                // btn.text(text).removeClass(currentBtnClass)
                //.addClass(addBtnClass);
                //add by pingchun.yupc 2012-05-30
                this._hideCellLight(this.cellHighLightEl);
                this._hideCellLight(this.fixCellHighLightEl);

                //this._hideCellLightFix();
                //end
                //΢����
                this._hideMicro();
                //end
                this._setCurrentElem(moduleEl, singerArea);

                this._finishEditLable(el, singerMain, stateClass);
                singerArea.show();

            }
        },
        /**
         * @methed _setDefineCodeEdit ���Զ���ؼ�ת���ɱ༭״̬
         * @param target jQuery����Ŀ��Ԫ��
         * @param editTextarea jQuery����textarea�༭����
         */
        _setDefineCodeEdit : function(target, editTextarea) {
            var dsdynamic = $.trim(target.data('dsdynamic'));
            D.HighLight.showLight(editTextarea, target);
            if(dsdynamic) {
                editTextarea.find('[value=vm]').attr('checked', 'checked');
                $('textarea', editTextarea).val(dsdynamic);
            } else {
                editTextarea.find('[value=html]').attr('checked', 'checked');
                $('textarea', editTextarea).val($.trim(target.html()));
            }

        },
        /**
         * @methed _setDefineCodeView ���Զ���ת���ɿ��ӻ�״̬
         * @param target jQuery����Ŀ��Ԫ��
         */
        _setDefineCodeView : function(editTextarea) {
            var//singerMain = $(this.config.singerMain, singerArea),
            textarea = editTextarea.find('textarea'), codeType = editTextarea.find('[name=code-type]:checked').val();
            el = editTextarea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
            if(!el) {
                return;
            }
            if(textarea.length > 0 && editTextarea.css('display') !== 'none') {
                var nodeInfo = {}, textVal = textarea.val();

                if(codeType === 'vm') {

                    nodeInfo = D.EditContent.editContent({
                        elem : el,
                        key : 'data-dsdynamic',
                        value : textVal,
                        isEdit : true
                    });
                } else {
                    var editSteps = [];
                    nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                        'execEl' : textVal,
                        'relEl' : el,
                        'editType' : 'insert',
                        'doc' : this.iframeDoc,
                        'insertType' : 'html'
                    });
                    nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                        'execEl' : el.html(),
                        'relEl' : el,
                        'editType' : 'insert',
                        'doc' : this.iframeDoc,
                        'insertType' : 'html'
                    });
                    //TDP��̬λ�ñ༭���봦�� add by pingchun.yupc 2012-07-20
                    var dstemplateTdp = el.closest('.cell-dstemplate-tdp');
                    if(dstemplateTdp && dstemplateTdp.length > 0) {
                        dstemplateTdp.attr('data-' + el.attr('id'), textarea.val());
                    }
                    //end
                    D.InsertHtml.init(textarea.val(), el, 'html', this.iframeDoc);
                    editSteps.push(nodeInfo);

                    var nodeInfo1 = D.EditContent.editContent({
                        elem : el,
                        key : 'data-dsdynamic',
                        value : '',
                        isEdit : true,
                        isReturnInfo : true
                    });
                    editSteps.push(nodeInfo1);

                    //��¼�Ѿ������޸�
                    D.BoxTools.setEdited({
                        'param' : editSteps,
                        'callback' : null
                    });
                }

                editTextarea.hide();
                //singerMain.html('');
                textarea.val('');

            }
        },
        /**
         * @methed _finishEditLable ������ݱ༭
         * @param el jQuery����Ŀ��Ԫ��
         */
        _finishEditLable : function(el, singerMain, stateClass) {
            if(el && singerMain) {
                stateClass = stateClass || D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                el.removeClass(stateClass);
                this._hideHighLight();
                singerMain.show();
            }
        },
        /**
         * @methed _showSingerArea ��ʾ��ʶ�������
         * @param target jQuery����Ŀ��Ԫ��
         */
        _showSingerArea : function(target) {
            var config = this.config, singerArea = this.singerArea,
            //el = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM),
            //btnsHtml = this._getSingerBtnsHtml(target),�˶δ����������ûʲô��ϵ���ֽ������Ƶ���html-helper.js�ļ���
            btnsHtml = D.HtmlHelper.getSingerBtnsHtml(target, null, {
                'defineModule' : this.config.defineModule,
                'dsCodeEdit' : this.config.dsCodeEdit
            }), tempOffset = this._getAreaOffset(target), width = target.outerWidth(), height = target.outerHeight(), singerMain = $(config.singerMain, singerArea), singerBtnsUl = $(config.singerBtnsUl, singerArea), offset = {
                'top' : tempOffset.top - singerBtnsUl.height(),
                'left' : tempOffset.left
            };
            //�Ƚ�ǰһ�����ݱ༭���
            this._finishLastArea(singerArea);

            this._hideHighLight();
            singerArea.show();
            singerArea.offset(offset);
            singerArea.width(width);
            singerBtnsUl.html(btnsHtml);
            singerMain.height(height);
            singerMain.width(width);

            this._setCurrentElem(target, singerArea);

        },
        /**
         * @methed _setCurrentElem ���õ�ǰѡ��Ԫ��
         * @param currentElem jQuery���󣬵�ǰԪ��
         * @param lightEl jQuery���󣬸���Ԫ�أ���Ԫ��Data�н�ֵ��Ϊ��ǰԪ��
         */
        _setCurrentElem : function(currentElem, lightEl) {
            lightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);
            this.currentElem = currentElem;

            if(!(this.chooseLevel === 'module' || this.chooseLevel === 'layout' || this.chooseLevel === 'microlayout')) {
                D.showAttr(currentElem);
            }

        },
        /**
         * @methed _finishLastArea �����һ����ʶ����� ��ǩ�༭
         * @param singerArea jQuery���󣬱�ʶԪ��
         */
        _finishLastArea : function(singerArea) {
            var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(this.config.singerMain, singerArea);
            if(el) {
                var editClass;
                if(el.hasClass(D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME) === true) {
                    editClass = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                    this._lowAllLight(this.dropArea);
                } else {
                    editClass = D.DropInPage.CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME;
                }
                this._finishEditLable(el, singerMain, editClass);
            }
            //this._setDefineCodeView(self.editTextarea);
        },
        /**
         * @methed _hideSingerArea ���ر�ʶ�������
         */
        _hideSingerArea : function() {
            var singerArea = this.singerArea, el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(this.config.singerMain, singerArea);
            this._setDefineCodeView(this.editTextarea, el);
            this._finishEditLable(el, singerMain, D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME + ' ' + D.DropInPage.CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);
            singerArea.hide();
            //this.currentElem = null;
        },
        /*hideSingerArea: function(){
         this._hideSingerArea();
         },*/
        _setSingerAreaElem : function(el) {
            var target = el.closest('.' + D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
            if(target.length > 0) {
                this.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, target);
            }
        },
        /**
         * @methed _showHighLight ��ʾ��ѡ�еĸ���
         * @param isEditLabel �Ƿ�༭��ǩ
         */
        _showHighLight : function(target, isEditLabel) {
            var el;
            //this._hideSingerArea();
            if(this.chooseLevel === 'label' || isEditLabel === true) {
                el = target;
                this.fixHighLightEl.offset(this._getAreaOffset(el));
                this.fixHighLightEl.width(el.outerWidth());
                this.fixHighLightEl.height(el.outerHeight());
            } else {
                var style = target.attr('style');
                el = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);

                this.fixHighLightEl.attr('style', style);
                this.fixHighLightEl.css('zIndex', 99);

            }
            /*if (!(this.chooseLevel==='label'||isEditLabel===true)){
             el = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
             }*/
            this.fixHighLightEl.show();

            //�����JS��ʹJSʧЧ
            el = this.jsControl.add(el);
            this.currentElem = el;
            this.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, el);
            this._setSingerAreaElem(el);

            //չʾ��������е�����
            D.showAttr(el);

        },
        /**
         * @methed _hideHighLight ���ر�ѡ�еĸ���
         */
        _hideHighLight : function() {
            this.fixHighLightEl.hide();
            this.fixHighLightEl.attr('style', '');
            this.fixHighLightEl.removeData(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
            //this.currentElem = null;
        },
        /**
         * @methed _hideHighLight ���ر�ѡ�еĸ��� �ⲿ����
         * Ŀǰ�������޸����ԵĶԿ� �ر��¼�����
         */
        hideHighLight : function() {
            var self = this;
            self._hideHighLight();
        },
        /**
         * @methed _enterFixHightLight �������Ѿ���ѡ�е�Ԫ��
         */
        _enterFixHightLight : function() {
            var self = this;
            self.fixHighLightEl.bind('mouseenter', function(e) {
                var currentElem = self._getCurrentElem(), chooseLevel = D.ManagePageDate.getWidgetType(currentElem);
                //chooseLevel = self._getWidgetType(currentElem);

                if(chooseLevel !== 'label') {
                    self._showTransport(currentElem, self.moveTransport, 1000);
                    //'move'
                }
            });

            $(self.config.singerMain, self.singerArea).bind('mouseenter', function(e) {
                if(!$.trim($(this).html())) {
                    var el = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                    self._showTransport(el, self.moveTransport, 1002);
                    //'move'
                }
            });
        },
        /**
         * @methed _resizeFixHightLight ��window����resizeʱ�ı�fixHighLightEl��offset
         */
        _resizeFixHightLight : function() {
            var self = this;
            $(window).resize(function(e) {
                var currentElem = self.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM) || self.currentElem, offset = self._getAreaOffset(currentElem);
                self.fixHighLightEl.offset(offset);
            });
        },
        /**
         * @methed _showTransport ��ʾ��������
         * @param el ��Ҫ�������Ԫ��
         * @param transport ִ�����������Ԫ��
         * @param zIndex ��ѡ��CSS��ʽ��z-index������ֵ��Ĭ��Ϊ1000
         * @param isTimeout  ��ѡ���Ƿ����ӳٸ�Ӧ��Ĭ��Ϊtrue
         */
        _showTransport : function(el, transport, zIndex, isTimeout) {
            if(!(el && transport)) {
                return;
            }
            if($.type(zIndex) === 'boolean') {
                isTimeout = zIndex;
                zIndex = null;
            }
            zIndex = zIndex || 1000;
            var self = this;

            if(isTimeout === false) {
                self._execShowTransport(el, transport, zIndex);
            } else {
                this.transportTimeid = window.setTimeout(function() {
                    self._execShowTransport(el, transport, zIndex);
                }, 200);
            }
        },
        /**
         * @methed _showTransport ��ʾ��������
         * @param el ��Ҫ�������Ԫ��
         * @param transport ִ�����������Ԫ��
         * @param zIndex CSS��ʽ��z-index������ֵ��Ĭ��Ϊ1000
         */
        _execShowTransport : function(el, transport, zIndex) {
            var CONSTANTS = D.DropInPage.CONSTANTS, TRANSPORT_DATA_ELEM = CONSTANTS.TRANSPORT_DATA_ELEM,
            //TRANSPORT_DATA_MODE = CONSTANTS.TRANSPORT_DATA_MODE,
            offset = el.offset(),
            //transport = self.transport,
            //oldMode = transport.data(TRANSPORT_DATA_MODE),
            cloneEl = el.clone();
            /*if (mode==='move' && oldMode!==mode){
             transport.appendTo(self.iframeBody);
             } else if (mode==='dropin' && oldMode!==mode) {
             transport.appendTo($('body', document));
             }
             if (mode==='move'){
             offset = self._getAreaOffset(el);
             }*/
            transport.show();
            transport.offset(offset);
            transport.width(el.outerWidth());
            transport.height(el.outerHeight());
            transport.css('zIndex', zIndex);
            transport.data(TRANSPORT_DATA_ELEM, el);
            //transport.data(TRANSPORT_DATA_MODE, mode);
            //transport.html(cloneEl);
        },
        /**
         * @methed _hideDragenterhighLight ��ק�뿪Ŀ��Ԫ��ʱʧȥ����
         */
        /*_hideDragenterhighLight: function(){
        this.dragenterHighLightEl.hide();
        },*/
        /**
         * @methed _getAreaOffset ��ȡ�༭������Ԫ�ص�offsetֵ
         */
        _getAreaOffset : function(el) {
            if(!el) {
                return;
            }
            var elOffset = el.offset(), offset, marginTop = parseInt(el.css('margin-top')) || 0, marginLeft = parseInt(el.css('margin-left')) || 0;

            offset = {
                'top' : elOffset['top'], //+marginTop +this.iframeOffset['top']
                'left' : elOffset['left']     //+marginLeft +this.iframeOffset['left']
            }
            return offset;
        },
        /**
         * @methed _hideTransport ������������
         */
        _hideTransport : function(transport) {
            var CONSTANTS = D.DropInPage.CONSTANTS, TRANSPORT_DATA_ELEM = CONSTANTS.TRANSPORT_DATA_ELEM;
            //TRANSPORT_DATA_MODE = CONSTANTS.TRANSPORT_DATA_MODE,
            //transport = this.transport

            transport.hide();
            transport.attr('style', '');
            transport.removeData(TRANSPORT_DATA_ELEM);
            //transport.removeData(TRANSPORT_DATA_MODE);
            transport.html('');
        },
        /**
         * @methed _highLightCurrent ������ǰԪ��
         * @param el ��Ҫ������Ԫ��
         */
        _highLightCurrent : function(el) {
            //ʹ����Ӱ�ķ���
            el.addClass(this.config.currentTarget);
        },
        /**
         * @methed _lowLightCurrent �Ե�ǰԪ��ȥ������
         * @param el ��Ҫȥ��������Ԫ��
         */
        _lowLightCurrent : function(el) {
            el.removeClass(this.config.currentTarget);
        },
        /**
         * @methed _getCurrentWidgetClass ��ȡ��ǰԪ����class
         */
        _getCurrentWidgetClass : function() {
            return D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + this.chooseLevel;
        },
        /**
         * @methed _getMoveScope ��ȡ�ƶ���Χ
         * @param el ��ǰԪ�أ�jQuery����
         */
        _getMoveScope : function(el) {
            var scope;
            switch (this.chooseLevel) {
                case 'module':
                case 'cell':
                    scope = this.dropArea;
                    break;
                default:
                    scope = el.parent();
            }
            return scope;
        },
        /**
         * @methed _addDataTransfer ��dataTransfer setData Ԫ����HTML����
         * @param e �¼�����
         * @param elem Ԫ���ڡ�Ԫ�ؿ⡱��չʾ��Ԫ��
         * @param elemInfo Ԫ����Ϣ
         */
        _addDataTransfer : function(e, elem, elemInfo) {
            var CONSTANTS = D.DropInPage.CONSTANTS, ELEMENT_DATA_HTML_CODE = CONSTANTS.ELEMENT_DATA_HTML_CODE, TRANSPORT_DATA_MODE = CONSTANTS.TRANSPORT_DATA_MODE, transport = $(e.target), mode = transport.data(TRANSPORT_DATA_MODE), elemHtml, transfer;

            switch (mode) {
                case 'move':
                    transfer = 'move';
                    elemHtml = elem;
                    break;
                case 'dropin':
                    transfer = 'dropin';
                    elemHtml = elem.data(ELEMENT_DATA_HTML_CODE);
                    break;
            }

            e.dataTransfer.setData("text/plain", transfer);
            if(elemHtml) {
                //e.dataTransfer.setData("text/html", elemHtml);
                transport.data(CONSTANTS.ELEMENT_DATA_HTML_CODE, elemHtml);
            } else {
                var self = this;
                this._requestElemHTML(elemInfo, function(elemHtml) {
                    elemHtml = self._setElemInfo(elemHtml, elemInfo);
                    elem.data(ELEMENT_DATA_HTML_CODE, elemHtml);
                    if(self.loading) {
                        //var opts = self.loading.data(D.DropInPage.CONSTANTS.LOADING_DATA_HANDLE_INFO);
                        var opts = self.loading;
                        //elemHtml = self._handleStyle(elemHtml, opts, true);
                        elemHtml = D.ManagePageDate.handleStyle(elemHtml, opts, true);
                        //self.loading.replaceWith(elemHtml);

                        //$('#crazy-box-data-loading', self.iframeDoc).replaceWith(elemHtml);
                        D.InsertHtml.init(elemHtml, $('#crazy-box-data-loading', self.iframeDoc), 'replaceWith', self.iframeDoc);
                    } else {
                        //e.dataTransfer.setData("text/html", elemHtml);
                        transport.data(CONSTANTS.ELEMENT_DATA_HTML_CODE, elemHtml);
                    }
                });
            }
        },
        /**
         * @methed _requestElemHTML Ԫ��ԭ����HTML����
         * @param elemInfo Ԫ����Ϣ
         * @param fn �ص�������������ɺ�ִ�еĻص�����
         */
        _requestElemHTML : function(elemInfo, fn) {
            var self = this, url = D.domain + '/page/box/queryCellContentAjax.html', data = {};
            data['type'] = elemInfo['type'];
            data['rid'] = elemInfo['id'];
            data['versionId']=elemInfo['versionId'];
            $.ajax({
                url : url,
                data : data,
                type : 'POST',
                success : function(o) {
                    var htmlCode;
                    o = $.parseJSON(o);

                    if(o.data && o.msg === 'success') {
                        htmlCode = o.data;
                    } else {
                        htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">��ȡ����ʧ�ܣ������ԣ�</span>';
                    }

                    fn.call(this, htmlCode);
                },
                error : function(o) {
                    //������ʾ��Ϣ
                    if(self.loading) {
                        self.loading.html('���ݼ���ʧ�ܣ������ԣ�');
                    }
                }
            });
        },
        /**
         * @methed _setElemInfo ����Ԫ����elemInfo
         * @param elemHtml Ԫ����html����
         * @param elemInfo Ԫ����Ϣ
         * @return elemHtml
         */
        _setElemInfo : function(elemHtml, elemInfo) {
            var div = $('<div />'), widget;
            D.InsertHtml.init(elemHtml, div, 'html', false);

            widget = div.children().not('link,style,script');
            widget.attr('data-eleminfo', JSON.stringify(elemInfo));
            return div.html();
        },
        /**
         * @methed _isEnableDropIn �ж�elem�Ƿ��������,�жϱ�׼Ϊ��������
         * @param target Ŀ��Ԫ��
         * @param elemInfo Ԫ����Ϣ
         * @return {array} [����ʺ�, �Ƿ������Ԫ��(true:����), �������������]
         */
        _isEnableDropIn : function(target, elemInfo) {
            var CONSTANTS = D.DropInPage.CONSTANTS, TAG_DATA_BOX_OPTIONS = CONSTANTS.TAG_DATA_BOX_OPTIONS, boxOptions = target.data(TAG_DATA_BOX_OPTIONS), number = D.BoxTools.parseOptions(boxOptions, ['ability', 'container', 'number']) || 'n', length = target.children().length, width = target.innerWidth();
            if(elemInfo && elemInfo.isResponsive === 'N' && width < elemInfo.width) {
                return [false]
            }

            if(length === 0) {
                return [true, false];
            }

            if(number !== 'n' && number <= length) {
                return [true, false];
            }

            return [true, true, true];
        },
        /**
         * @methed _showSinger ��ʾ��������cell�ı�ʶ
         * @param target Ŀ��Ԫ��
         */
        _showSinger : function(target) {
            var CONSTANTS = D.DropInPage.CONSTANTS, ENABLE_BEFORE_CLASS_NAME = CONSTANTS.ENABLE_BEFORE_CLASS_NAME, ENABLE_AFTER_CLASS_NAME = CONSTANTS.ENABLE_AFTER_CLASS_NAME, prev = target.prev(), next = target.next();
            if(prev.hasClass(ENABLE_BEFORE_CLASS_NAME) === true) {

                prev.show();
            } else {
                target.before(this.config.beforeSingerHtml);
            }

            if(next.hasClass(ENABLE_AFTER_CLASS_NAME) === true) {
                next.show();
            } else {
                target.after(this.config.afterSingerHtml);
            }
        },
        /**
         * @methed _hideSinger ������������cell�ı�ʶ
         * @param target Ŀ��Ԫ��
         */
        _hideSinger : function(target) {
            if(target) {
                var prev = target.prevAll('.' + D.DropInPage.CONSTANTS.ENABLE_BEFORE_CLASS_NAME), next = target.nextAll('.' + D.DropInPage.CONSTANTS.ENABLE_AFTER_CLASS_NAME);
                prev.remove();
                next.remove();
            }
        },
        /**
         * @methed _emptySinger �������Ԫ���ı�ʶ
         * @param area �༭����
         */
        _emptySinger : function(area) {
            area.find('.' + D.DropInPage.CONSTANTS.ENABLE_BEFORE_CLASS_NAME + ', .' + D.DropInPage.CONSTANTS.ENABLE_AFTER_CLASS_NAME).remove();
        },
        /**
         * @methed _lowAllLight ���������className�����ı�ʶ
         * @param area �༭����
         */
        _lowAllLight : function(area) {
            this._lowLightCurrent(area.find('.' + this.config.currentTarget));
        },
        /**
         * @methed hideAllSingers �������б�ʶ���ṩ����������ʱʹ��
         */
        hideAllSingers : function() {
            this._hideHighLight();
            this._hideSingerArea();
            this._hideJsControl(this._getCurrentElem(), true);
            //D.BoxTools.hideCellLight(this.fixCellHighLightEl, true);
            this._hideCellLight(this.fixCellHighLightEl);

            D.bottomAttr.closeDialog();
        }
    };

    //����
    D.DropInPage.CONSTANTS = {
        //WIDGET_TYPE_CLASS_REG: '/^crazy-box-/',     //��ȡ��ʶԪ�����͵�class����������ʽ
        ENABLE_BEFORE_CLASS_NAME : 'crazy-box-before-singer',
        ENABLE_AFTER_CLASS_NAME : 'crazy-box-after-singer',
        TAG_DATA_BOX_OPTIONS : 'boxoptions',
        ELEMENT_DATA_HTML_CODE : 'htmlcode',
        ELEMENT_DATA_INFO : 'eleminfo',
        TRANSPORT_DATA_ELEM : 'elem', //��������ָ����������Զ�������data-elem
        TRANSPORT_DATA_MODE : 'mode', //����������קʱ��ģʽ
        ENABLE_CLASS_PREFIX : 'crazy-box-enable-', //��������class��ǰ׺
        ELEMENT_CLASS_PREFIX : 'crazy-box-',
        LOADING_DATA_HANDLE_INFO : 'handleinfo',
        ALL_WIDGET_TYPES : ['content', 'layout', 'grid', 'row', 'box', 'module', 'cell'],
        MODULE_CONTENT_CLASS_NAME : 'crazy-box-content',
        SINGER_AREA_EDIT_HTML_BTN : 'edit-html',
        SINGER_AREA_VIEW_HTML_BTN : 'view-html',
        SINGER_AREA_PREVIOUS_BTN : 'prev-container',
        SINGER_AREA_EDIT_MODULE_TAG_BTN : 'edit-module-tag',
        SINGER_AREA_EDIT_MODULE_BTN : 'edit-module',
        SINGER_AREA_EDIT_MICRO_LAYOUT_BTN : 'edit-micro-layout',
        SINGER_AREA_ADD_MODULE_BTN : 'add-module',
        SINGER_AREA_ENTER_DS_BTN : 'enter-datasource',
        SINGER_AREA_EDIT_LABEL_BTN : 'edit-label',
        SINGER_AREA_EDIT_DS_MODULE_BTN : 'edit-ds-module',
        SINGER_AREA_EDIT_TOPIC_MODULE_BTN : 'edit-topic-module',
        SINGER_AREA_EDIT_FINISH_BTN : 'edit-finish',
        SINGER_AREA_EDIT_CELL_FINISH_BTN : 'edit-cell-finish',
        //SINGER_AREA_EXIT_EDIT_BTN: 'exit-edit',
        SINGER_AREA_EDIT_CELL_BTN : 'edit-cell',
        ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area',
        ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell'
    };

    //Ĭ��������
    D.DropInPage.defConfig = {
        dropTransport : '#crazy-box-droptransport', //���ڴ�Ԫ�ؿ���������������϶����Ǹ�Ԫ�ص�selector
        moveTransport : '#crazy-box-movetransport', //����ҳ����Ԫ���ƶ����������������϶����Ǹ�Ԫ�ص�selector
        packageParent : '#dcms_box_modulebar', //�����ﹲͬ����Ԫ�ص�selector
        dragPackage : '.dcms-box-layoutcontent', //�������Ҫ�ŵ����������б������Ԫ�ص�selector  dcms-box-right-image
        dropArea : '.cell-page-main', //����ҳ����Ҫ�༭����  #content
        editArea : '.dcms-box-center', //�༭���򣬼����iframe��Ԫ��
        currentTarget : 'crazy-box-target-current',
        fixHighLight : '#crazy-box-highlight-fix', //ʾ��ѡ�к�ĸ���Ԫ��
        beforeSingerHtml : '<div class="crazy-box-before-singer">����ק����</div>', //�����б������ENABLE_BEFORE_CLASS_NAME class��
        afterSingerHtml : '<div class="crazy-box-after-singer">����ק����</div>', //�����б������ENABLE_AFTER_CLASS_NAME class��
        currentSinger : 'crazy-box-singer-current',
        levelParent : '.edit-ul', //�㼶ѡ��ĸ���Ԫ��
        chooseLevel : '.desc', //�㼶ѡ���selector
        copyButton : 'bar-a-copy', //�ɸ��ư�ť��className
        newCopyButton : 'new-copy', //�ɸ��ư�ť��className
        delButton : 'bar-a-delete', //��ɾ����ť��className
        pageUrl : D.domain + '/page/box/layout.html',
        singerArea : '#crazy-box-singer-area',
        singerBtnsUl : '.list-btns',
        singerMain : '.main',
        //defineModule: 'cell-module-define',   //�Զ���ģ��
        defineCell : 'cell-cell-define', //�Զ���ؼ�(cell)
        dsCodeEdit : 'ds-code-edit', //TDP�ɱ༭����
        editTextarea : '#crazy-box-edit-textarea', //���ر༭��ı༭����
        jsControlClass : 'crazy-box-control-current',
        jsControlInureBtn : '#crazy-box-control-btn',
        callback : null,
        cellHightLightCurrent : 'crazy-box-cell-current',
        topicModule : 'cell-topic-module',
        emptyModuleHtml : '<div data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;�ڱ߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;��߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;�߿�&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-module cell-module"><div data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-content crazy-box-enable-cell"></div></div>'
    };

})(dcms, FE.dcms);
