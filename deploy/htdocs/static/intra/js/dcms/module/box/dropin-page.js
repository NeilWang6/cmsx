/**
 * @author hongss
 * @userfor 拖拽元件到页面中，还包括了移动、复制
 * @date  2012.02.14
 * "将module升级为row，因需求需要做特殊处理"，以此句为注释说明，便可找到相应的改动代码
 */

;(function($, D, undefined) {
    D.DropInPage = {
        /**
         * 属性定义
         */
        config : null, //配置项
        dropTransport : null, //用于拖拽的元素，jQuery变量  transport-object
        moveTransport : null, //用于拖拽的元素，jQuery变量
        transportMod : null, //记录运输模式，chrome浏览器中需要此值
        dropArea : null, //盒子页面主要编辑区域
        state : null, //状态，copy|null
        chooseLevel : 'module', //选择层级，layout|grid|row|box|module
        copyBtn : $('#crazy-box-copy'),
        delBtn : $('#crazy-box-del'),
        currentElem : null, //当前选中的元素
        copyElem : null, //复制元素
        iframeBody : null,
        iframeDoc : null,
        singerArea : null, //标识高亮区域的jQuery对象
        fixHighLightEl : null,
        loading : null, //数据正在加载中
        widgetType : null, //当前元件类型
        enableClass : null, //当前允许放入元件类型的class名
        elemInfo : null, //当前元件信息
        elemClass : null, //当前元件类型的class名
        transportTimeid : null, //延迟执行_showTransport方法的id
        iframeIntervalId : null,
        /**
         * @methed _init 初始化
         * @param config 配置项
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
            //插入iframe并触发onload事件
            self._insertIframe();

            //监听层级layout|grid|row|box|module 按钮点击事件
            self._levelListener();
            self._docmentListener();
        },
        /**
         * @methed _insertIframe 插入承载“页面”内容的iframe
         */
        _insertIframe : function() {
            //将onload事件以属性的形式放在标签上是为了保证chrome/IE在每次强制刷新时都能触发onload事件
            var config = this.config, pageUrl = config.pageUrl, iframe = $('<iframe id="dcms_box_main" class="dcms-box-main" src="' + pageUrl + '" onload="FE.dcms.DropInPage.handleLoad(this)" />');

            $(config.editArea).html('').append(iframe);
        },
        /**
         * @methed _levelListener 监听层级 layout|grid|row|box|module 按钮点击事件
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

                //按钮样式的改变在options.js文件中执行

                //给self.chooseLevel赋值
                if(self.chooseLevel !== chooseLevel) {
                    self.chooseLevel = chooseLevel;
                    self._hideHighLight();
                    self._hideSingerArea();
                    self._hideTransport(self.moveTransport);
                    //self._hideCellLightFix();
                    self._hideCellLight(self.fixCellHighLightEl);
                    //微布局
                    self._hideMicro();

                    //通过class名控制复制按钮是否可点
                    /*if (self._enableCopyLevel()===true){
                    self._replaceClass(self.copyBtn, 'disable', self.config.copyButton);
                    } else {
                    self._replaceClass(self.copyBtn, self.config.copyButton, 'disable');
                    }*/

                    //通过class名控制删除按钮是否可点
                    /*if (self._enableCopyLevel()===true){
                     self._replaceClass(self.delBtn, 'disable', self.config.delButton);
                     } else {
                     self._replaceClass(self.delBtn, self.config.delButton, 'disable');
                     }*/
                }
            });
        },
        /**
         * @methed _docmentListener 监听外部文档事件
         */
        _docmentListener : function() {
            var self = this, doc = $(document);

            doc.bind('click', function(e) {
                var target = $(e.target);
                //当state为copy时，任何不在编辑区域内的点击都结束复制操作
                if(self.state === 'copy') {
                    if(target.closest(self.iframeBody).length === 0 && target.hasClass(self.config.copyButton) !== true) {
                        self._cancelCopy(self.copyBtn);
                    }
                }

                //如果为非自定代码区块，便使自定义代码处于可视化状态
                /*if (self.editTextarea && self.editTextarea.css('display')!=='none'
                 && target.closest('.'+self.config.defineCell).length===0){
                 self._setDefineCodeView(self.editTextarea);
                 }*/
            });

        },
        /**
         * @methed _enableCopy 判断是否允许复制
         * @return true(允许复制) | false
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
         * @methed _enableCopy 判断是否允许删除
         * @return true(允许删除) | false
         */
        _enableDelLevel : function(elem) {
            var result = {},
            //type = this._getWidgetType(elem) || this.chooseLevel,
            type = D.ManagePageDate.getWidgetType(elem) || this.chooseLevel, currentElem = elem || this.currentElem;
            //将module升级为row，因需求需要做特殊处理
            if(type === 'module') {
                type = 'row';
                currentElem = currentElem.closest('.crazy-box-row');
            }

            if(type === 'layout' || type === 'row' || type === 'cell') {// || type==='module'
                if(currentElem && (type === 'row' && currentElem.siblings('.crazy-box-row').length <= 0 || type === 'layout' && currentElem.siblings('.crazy-box-layout').length <= 0)) {
                    result['enable'] = false;
                    result['msg'] = '最后一个' + type + '不允许删除！';
                    //将module升级为row，因需求需要做特殊处理
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
                    result['msg'] = '此标签不允许删除！';
                }
            } else if(type === 'module') {
                result['enable'] = false;
                result['msg'] = 'module';
            } else {
                result['enable'] = false;
                result['msg'] = '此元素不允许删除！';
            }
            return result;
        },
        /**
         * @methed _replaceClass 替换class
         * @param el 需要执行替换class的元素，jQuery对象
         * @param oldClass 替换前的class名
         * @param newClass 替换后的class名
         */
        _replaceClass : function(el, oldClass, newClass) {
            el.removeClass(oldClass);
            el.addClass(newClass);
        },
        /**
         * @methed handleLoad 处理iframe load事件
         * @param el 触发onload事件的元素
         */
        handleLoad : function(el) {
            var self = this, doc = $(el.contentWindow.document);
            self.iframeDoc = doc;
            self.iframeBody = $('body', doc);
            //执行回调函数
            if(self.config.callback && $.isFunction(self.config.callback)) {
                self.config.callback.call(self, doc);
            }
            //插入额外的CSS样式表，用于可视化编辑
            //$('head', doc).append($('<link rel="stylesheet" href="css/empty.css" />'));

            this.singerArea = $(this.config.singerArea, doc);
            this.moveTransport = $(this.config.moveTransport, doc);
            this._insertSecondary(self.iframeBody);
            this._insertEditarea(self.iframeBody);

            D.BoxTools.setEdited();
            //为container的标签加上允许放入元件类型(crazy-box-enable-XXXX)的标识
            self._addEnableClass(doc);

            //当“元素库”中的元件mouseenter时
            self._enterPackage();

            //self._insertCellHighLight();
            //增加cell 高亮
            D.HtmlHelper.insertCellHighLight(self);
            //增加微布局 高亮
            D.HtmlHelper.insertMicrolayoutHighLight(self);

            self.getGlobalAttr(doc);
            //当页面中已有的的元件mouseenter时
            self._enterPagePackage();
            self._leavePagePackage();
            self._leaveCopyPackage();
            self._clickPagePackage();
            self._enterFixHightLight();
            self._resizeFixHightLight();

            //self._elemDragDrop();
            //copy时需要执行的相关操作和事件监听
            self._copyBtnListener();
            self._delBtnListener();

            self._singerBtnsListener(self.singerArea);

            //监听是否需要JS失效
            self.jsControl = new D.JsControl({
                inureBtn : $(self.config.jsControlInureBtn, doc),
                iframeDoc : doc
            });

            //页面回退操作
            D.PageOperateHistory.init();
            //初始化D.uuid
            self._setInitUuid($('.crazy-box-layout, .crazy-box-row, .crazy-box-module', doc));
        },

        getGlobalAttr : function(doc) {
            //盒子页面主要编辑区域
            //this.dropArea = $(this.config.dropArea, doc);
            //this.singerArea = $(this.config.singerArea, doc);
            //this.moveTransport = $(this.config.moveTransport, doc);
            //this._insertSecondary(doc);
            this.dropArea = $(this.config.dropArea, doc);

            //拖拽事件绑定
            this._elemDragDrop();

            this._copyListener();
        },
        _setInitUuid : function(els) {
            var self = this, nameIds = [];
            //初始化D.uuid
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
         * @methed _insertSecondary 插入选中高亮时用的元素
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
         * @methed _insertEditarea 插入编辑区域到iframeBody下
         * @param body  文档body对象
         */
        _insertEditarea : function(body) {
            //var html = '<div id="crazy-box-edit-textarea"><textarea class="crazy-box-textarea" placeholder="请输入相关代码"></textarea></div>';
            var html = '<div id="crazy-box-edit-textarea"><ul><li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" /><label for="crazy-box-code-html">HTML代码</label></li><li><input type="radio" name="code-type" value="vm" id="crazy-box-code-vm" /><label for="crazy-box-code-vm">VM代码</label></li></ul><textarea class="crazy-box-textarea" placeholder="请输入相关代码"></textarea></div>';
            this.editTextarea = this._insertElem(this.config.editTextarea, html, body);
        },
        /**
         * @methed _insertElem 插入标识元素到iframeBody下
         * @param selector 能找到此元素的选择器
         * @param html  需要插入的html代码elem元素
         * @param body  文档body对象
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
         * @methed _elemDropIn 拖放动画效果
         */
        _elemDragDrop : function() {
            var self = this, CONSTANTS = D.DropInPage.CONSTANTS, transports = self.dropTransport.add(self.moveTransport).add(self.fixCellHighLightEl).add(self.cellHighLightEl);

            //阻止firefox中drop后触发的浏览器事件
            /*D.DragAddDrop.init({
            dragEls: transports,
            dropEls: $(document),
            drop: function(e){
            }
            });*/

            //拖放效果
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
                dragenter : function(e) {//示意可以拖入的区域
                    //self.iframeIntervalId&&clearInterval(self.iframeIntervalId);
                    self.enableClass = CONSTANTS.ENABLE_CLASS_PREFIX + self.widgetType;
                    self.elemClass = CONSTANTS.ELEMENT_CLASS_PREFIX + self.widgetType;
                    self._dropEvent(e, 'Enter');
                },
                dragover : self._dropInOver,
                dragleave : function(e) {//去除标识
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
                    //清空所有临时数据
                    self._setTempDataNull();
                }
            });
        },
        /**
         * @methed _copyBtnListener 监听复制按钮事件
         */
        _copyBtnListener : function() {
            var self = this, copyBtn = this.config.copyButton;

            $('.' + copyBtn, self.iframeDoc).live('mousedown', function(e) {
                var btn = self.copyBtn = $(this), copyElem = self.copyElem = self._getCopyElem(self.currentElem);

                if(copyElem && self._enableCopyLevel() === true) {
                    if(self.state === 'copy') {//取消复制
                        self._cancelCopy();
                    } else {
                        self.state = 'copy';
                        //加上“粘贴”并更改按钮的样式
                        //$('span', btn).text('取消复制');
                        btn.text('取消复制');

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
                    //提示“选择元素后才能复制”
                    alert('请选择需要复制的内容！');
                } else if(self._enableCopyLevel() !== true) {
                    alert('此元素不能被复制！');
                }
                btn.closest('.mousedown').removeClass('mousedown');
            });
        },
        /**
         * @methed _getCopyElem 获取copy元素，如果elem是标签则取其所在的module
         * @param elem 当前元素，jQuery对象
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
         * @methed _copyBtnListener 监听删除按钮事件
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
                if(self.state === 'copy') {//取消复制
                    self._cancelCopy();
                }
                //将module升级为row，因需求需要做特殊处理
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
                    alert('请选择需要删除的内容！');
                } else if(result['enable'] !== true) {
                    alert(result['msg']);
                }
                delBtn.closest('.mousedown').removeClass('mousedown');

            };
        },
        /**
         * @methed _emptyModule 清空module，包括module的所有样式
         */
        _emptyModule : function(target) {
            var type = 'module',$row = target.closest('.crazy-box-row');
            //如果一个grid中有多个module，删除一个，则module标签也同时删除，跟cell一样 删除module就是删除row
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
            //记录已经做了修改
            D.BoxTools.setEdited({
                'param' : replaceSteps,
                'callback' : null
            });
        },
        /**
         * @methed _getCurrentElem 获取当前元素，jQuery对象
         */
        _getCurrentElem : function() {
            var currentElem = this.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM) || this.currentElem;
            return currentElem;
        },
        /**
         * @methed _cancelCopy 取消复制
         */
        _cancelCopy : function(btn) {
            this.state = null;
            //this._setTempDataNull();
            //$('span', this.copyBtn).text('复制');
            this.copyBtn.text('复制');
            //去除“粘贴”并更改按钮的样式
            //<!-- 没写完 -->

            this._emptySinger(this.dropArea);
            this._lowAllLight(this.dropArea);
        },
        /**
         * @methed _copyListener 监听copy事件是否有执行
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
                            //替换HTML
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
                            //将HTML代码插在标识之后
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
                            //将HTML代码插入容器中
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
                        //复制一次后结束复制
                        //self._cancelCopy();
                    }
                }, true);
            }
        },
        /**
         * @methed _handleCopyHtml 处理copy需要用的html代码
         * @param el 被拷贝的元素，jQuery对象
         * @param mod container|replace|sibling，进行拷贝时的模式
         * @param target 触点元素
         * @return 处理后的htmlcode
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
         * @methed _getCopyHtml 获取需要复制的html代码
         * @param el 需要复制的元素，jQuery对象
         * @param type 元件类型，layout|grid|row|box|module|cell
         * @return 返回需要复制的html代码，包括style和script
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

        //去除cell高亮的class名
        div.find('.'+this.config.cellHightLightCurrent).removeClass(this.config.cellHightLightCurrent);

        return div.html();
        },*/
        /**
         * @methed _setScriptAttr 设置script标签的type属性值
         * @param scripts script标签集，jQuery对象
         * @param type type值
         */
        /*_setScriptAttr: function(scripts, type){
        scripts.each(function(i, el){
        $(el).attr('type', type);
        });
        },*/
        /**
         * @methed _dropEvent 拖放事件处理
         * @param e 事件对象
         * @param type 事件类型
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
         * @methed _dragStart 开始拖拽
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
            //chrome中需要使用此值
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

            //往dataTransfer上加值，如果无合适的数据则发送请求获取HTML
            this._addDataTransfer(e, elem, elemInfo);
        },
        /**
         * 新增栅格后会出现layoutH990/layoutQ990这样的类型，add by hongss on 2012.08.06
         */
        _setWidgetType : function(type) {
            if(type.indexOf('layout') !== -1) {
                return 'layout';
            } else {
                return type;
            }
        },
        /**
         * @methed _setTempDataNull 将在拖拽过程中产生的临时数据设置为null
         */
        _setTempDataNull : function() {
            this.widgetType = this.enableClass = this.elemInfo = this.elemClass = this.currentElem = null;
        },
        /**
         * @methed _dropInEnter 当dropin时，当拖拽进入目标元素时
         * @param e 事件对象
         */
        _dropInEnter : function(e) {
            var self = this, elemInfo = this.elemInfo;
            this._judgeDropIn(e, function(els) {//如果是同类元素
                els.each(function(i, el) {
                    var target = $(el), isEnable = self._isEnableDropIn(target.parent(), elemInfo);
                    if(isEnable[0] === true) {//如果宽度适合
                        //self._showDragenterhighLight(target);
                        if(isEnable[2] === true) {//如果还允许加元件
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
            }, function(target, el) {//如果是前后新增标识
                setTimeout(function() {
                    self._clearTimeoutId(el);
                    self._showSinger(el);
                    //**
                    self._lowLightCurrent(el);
                    //**
                }, 1);
                target.addClass(self.config.currentSinger);
            }, function(target) {//如果是容器元素
                var isEnable = self._isEnableDropIn(target, elemInfo);
                if(isEnable[0] === true && isEnable[1] === false) {
                    self._highLightCurrent(target);
                    //self._showDragenterhighLight(target);
                }
            });
        },
        /**
         * @methed _adjustCursorOffset 调整光标便宜（目前事实上调整的是滚动条的位置）
         * @param beforeOffset 插入新内容前的偏移量
         * @param afterOffset 插入新内容后的偏移量
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
         * @methed _moveEnter 当move时，当拖拽离开目标元素时
         * @param e 事件对象
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
         * @methed _dropInLeave 当dropin时，当拖拽离开目标元素时
         * @param e 事件对象
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
         * @methed _setTimeoutId 在元素el上加上timeid值
         * @param el 需要加timeid的元素，jQuery对象
         * @param timeId timeid值
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
         * @methed _clearTimeoutId 清除在元素el上的timeid值
         * @param el 需要清除timeid值的元素，jQuery对象
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
         * @methed _moveLeave 当move时，当拖拽拖放到目标元素时
         * @param e 事件对象
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
         * @methed _dropInDrop 当dropin时，当拖拽拖放到目标元素时
         * @param e 事件对象
         */
        _dropInDrop : function(e) {
            var self = this;
            this._judgeDropIn(e, function(els) {
                var target = els.eq(0);
                self._lowLightCurrent(target);
                //self._hideDragenterhighLight();
                self._hideSinger(target);
                //替换HTML
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

                //记录已经做了修改
                D.BoxTools.setEdited({
                    'param' : replaceSteps,
                    'callback' : null
                });
            }, function(target, el) {
                if(!self.elemInfo) {
                    return;
                }
                //将HTML代码插在标识之后
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
                //记录已经做了修改
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

                //将HTML代码插入容器中
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

                //记录已经做了修改
                D.BoxTools.setEdited({
                    'param' : editInsertSteps,
                    'callback' : null
                });
            }, true);
            //self._emptySinger(self.dropArea);
        },
        /**
         * @methed _dataLoading 数据加载
         * @param htmlcode 加载并需要处理的数据
         * @return opts 配置项 {'mod':'container|replace|sibling', 'target':target(), 'type':类型(layout|grid...)}
         */
        _dataLoading : function(htmlcode, opts) {
            if(!htmlcode) {
                htmlcode = '<div id="crazy-box-data-loading">数据正在加载中，请稍等……</div>';
                //htmlcode.data(D.DropInPage.CONSTANTS.LOADING_DATA_HANDLE_INFO, opts);
                this.loading = opts;
            } else {
                //htmlcode = this._handleStyle(htmlcode, opts, true);
                htmlcode = D.ManagePageDate.handleStyle(htmlcode, opts, true);
            }
            return htmlcode;
        },
        /**
         * @methed _handleStyle 处理style的相关内容
         * @param htmlcode 加载并需要处理的数据
         * @param opts 配置项 {'mod':'container|replace|sibling', 'target':target(), 'classname':className, 'type':类型(layout|grid...)}
         * @param isNew 是否为新增
         * @param oldModuleClass 可选，module的class名，只有当opts['type']==='cell'并isNew===false才有
         * @param newModuleClass 可选，module的class名，只有当opts['type']==='cell'并isNew===false才有
         * @return 处理后的htmlcode
         */
        /*_handleStyle: function(htmlcode, opts, isNew, oldModuleClass, newModuleClass){
        if ($.type(isNew)!=='boolean'){
        newModuleClass = oldModuleClass;
        oldModuleClass = isNew;
        isNew = null;
        }
        //将module升级为row，因需求需要做特殊处理
        if (opts['type']==='module' && (isNew===true||this.state==='copy')){
        htmlcode = '<div class="crazy-box-row cell-row" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"}],"ability":{"copy":{"enable":"true"}}}\'>\
        <div class="crazy-box-box box-100" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"width","name":"宽度","type":"input","disable":"true"}],"ability":{"container":{"enableType":"module","number":"1"}}}\'>'
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
         * @methed _delStyle 处理元件中的style
         * @param htmlcode 需要处理的html代码
         * @param target 触点元素，jQuery对象
         * @param isReplace 是否替换，true|false
         * @return 返回处理后的htmlcode
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
         * @methed _handleReplaceClass 处理替换class名
         * @param htmlcode 需要处理的html代码
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @param oldModuleClass 可选，老的module class名
         * @param newModuleClass 可选，新的module class名
         * @return 返回处理后的htmlcode
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
         * @methed _handleReplace 处理替换
         * @param div jQuery对象
         * @param htmlcode 需要处理的html字符串
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @return 返回处理后的htmlcode
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
         * @methed _replaceHtml 替换html代码
         * @param opts {'htmlcode':htmlcode, 'target':target, 'isExecJs':true|false, 'isEdit':true|false}
         * @param htmlcode 需要替换的html代码
         * @param target 需要被替换的目标元素
         * @param isExecJs 是否执行JS
         * @param isEdit 是否进行编辑（体现在页面上的）用于记录isEdited和“回撤”数据
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
         * @methed _replaceNewClass 替换成新的class名
         * @param htmlcode 需要处理的html代码
         * @param htmlNode 需要替换的节点
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @param oldClass 可选，原来老的class名
         * @return 返回处理后的htmlcode
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
         * @methed _addFixpreClass 增加前缀class名
         * @param htmlcode 需要处理的html代码
         * @param target 触点元素
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @return 返回处理后的htmlcode
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
         * @methed _getParentType 获取上一级类型
         * @param type 本级类型
         * @return 返回上一级类型
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
         * @methed _moveDrop 当move时，当拖拽拖放到目标元素时
         * @param e 事件对象
         */
        _moveDrop : function(e) {
            var self = this;
            this._judgeMove(e, function(target, elem) {
                //去除移动进入(_moveEnter)时产生的高亮
                self._lowLightCurrent(target);
                //self._hideCellLightFix();
                self._hideCellLight(self.fixCellHighLightEl);
                //如果是同类元素，这边没有考虑宽度不合适的情况
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
                //如果移入容器
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
         * @methed _enableDelStyle 是否允许删除sytle
         * @param target jQuery对象，目标元素
         * @param elem jQuery对象，当前元素
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
         * @methed _getObjHtml 获取对象的HTML代码
         * @param els jQuery对象集
         */
        /*_getObjHtml: function(elem){
        var div = $('<div />');
        this._setScriptAttr(els.find('script'), 'text/plain');
        div.html(els);
        return div.html();
        },*/
        /**
         * @methed _judgeDropIn 当dropin时，判断目标元素的情况，并执行相应的回调
         * @param e 事件对象
         * @param fn1 如果是同类元素时执行的回调
         * @param fn2 如果是前后新增标识时执行的回调
         * @param fn3 如果是容器元素时执行的回调
         * @param elem 用于获取widget信息的元素，jQuery对象，在copy时需要传此参数
         * @param isReturn 不继续往下判断，当cell嵌套时会出现这样的问题
         * @param judgeChild 不判断其子元素，_dropInLeave/_moveLeave时需要使用此参数,传false
         */
        _judgeDropIn : function(e, fn1, fn2, fn3, elem, isReturn) {
            if($.type(elem) === 'boolean') {
                isReturn = elem;
                elem = null;
            }

            var self = this, CONSTANTS = D.DropInPage.CONSTANTS, config = self.config, target = $(e.target), widget, before, after, elem = elem || this.currentElem,
            //widgetClasses = this._getWidgetClasses(elem);
            widgetClasses = D.ManagePageDate.getWidgetClasses(elem, this.elemClass, this.enableClass);

            //将module升级为row，因需求需要做特殊处理
            widgetClasses = self._getModuleClassSpecial(widgetClasses);

            //如果是容器元素
            if(target.hasClass(widgetClasses['enableClass']) === true) {
                e.stopPropagation();
                //回调fn3
                if(fn3 && $.isFunction(fn3) === true) {
                    fn3.call(this, target);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

            //如果是前后新增标识
            if(( before = target.hasClass(CONSTANTS.ENABLE_BEFORE_CLASS_NAME)) === true || ( after = target.hasClass(CONSTANTS.ENABLE_AFTER_CLASS_NAME)) === true) {
                e.stopPropagation();
                var el = before ? target.next() : target.prev();
                //回调fn2
                if(fn2 && $.isFunction(fn2) === true) {
                    fn2.call(this, target, el);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

            //如果是同类元素
            if(target.hasClass(widgetClasses['elemClass']) === true || ( widget = target.parents('.' + widgetClasses['elemClass'])).length > 0) {
                e.stopPropagation();
                var els = (widget && widget.length) ? widget : target;
                //回调fn1
                if(fn1 && $.isFunction(fn1) === true) {
                    fn1.call(this, els);
                }
                if(isReturn && isReturn === true) {
                    return;
                }
            }

        },
        /**
         * @methed _judgeMove 当move时，判断目标元素的情况，并执行相应的回调
         * @param e 事件对象
         * @param fn1 如果是同类元素时执行的回调
         * @param fn3 如果是容器元素时执行的回调
         */
        _judgeMove : function(e, fn1, fn2, isReturn) {
            var CONSTANTS = D.DropInPage.CONSTANTS, TRANSPORT_DATA_ELEM = CONSTANTS.TRANSPORT_DATA_ELEM, target = $(e.target), widget, elem = this.moveTransport.data(TRANSPORT_DATA_ELEM), scope = this._getMoveScope(elem),
            //widgetClasses = this._getWidgetClasses(elem);
            widgetClasses = D.ManagePageDate.getWidgetClasses(elem, this.elemClass, this.enableClass);

            if(target.closest(scope).length > 0) {
                //如果是容器元素
                if(target.hasClass(widgetClasses['enableClass']) === true) {
                    e.stopPropagation();
                    if(fn2 && $.isFunction(fn2) === true) {
                        fn2.call(this, target, elem);
                    }
                    if(isReturn === true) {
                        return;
                    }
                }

                //如果是同类元素，这边没有考虑宽度不合适的情况
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

                //如果是前后新增标识
                /*if ((before=target.hasClass(CONSTANTS.ENABLE_BEFORE_CLASS_NAME))===true
                 || (after=target.hasClass(CONSTANTS.ENABLE_AFTER_CLASS_NAME))===true){
                 e.stopPropagation();
                 var el = before ? target.next() : target.prev();
                 //回调fn2
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
         * @methed _getModuleClassSpecial 因layout内允许多个moudle的需求的特殊需要(前台无row操作)
         * @param classObj 跟 _getWidgetClasses 返回的数据格式一样
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
         * @methed _getWidgetClasses 获取元件(widget)的相关class名，elemClass和enableClass
         * @param elem 元件元素，jQuery对象
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
         * @methed _getWidgetType 获取元件的类型
         * @param elem 元件元素，jQuery对象
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
         * @methed _addEnableClass 为container的标签加上允许放入元件类型(crazy-box-enable-XXXX)的标识
         * @param {element} root 添加范围，jQuery对象，提供给InsertHtml使用
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
         * @methed _enterPackage 当元件mouseenter时
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
         * @methed _highPackage 高亮元素库中的元素
         * el 需要高亮的元素
         */
        /*_highPackage: function(el){
        el.parent().addClass('dcms-box-layoutcontent-high');
        },*/
        /**
         * @methed _highPackage 取消高亮元素库中的元素
         * el 需要取消高亮的元素
         */
        /*_lowPackage: function(el){
        el.parent().removeClass('dcms-box-layoutcontent-high');
        },*/
        /**
         * @methed _enterPagePackage 当页面中已有的的元件mouseenter时
         */
        _enterPagePackage : function() {
            var self = this;
            self.fixCellHighLightEl.bind('mouseenter', function(e) {
                e.preventDefault();
                var target = $(e.target);
                var currentElem = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                self.currentElem = currentElem;
                //添加拖动的控件或cell   传输数据
                self.moveTransport.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);

            });

            self.cellHighLightEl.bind('mouseover', function(e) {
                var cell = D.HighLight.getLightElemData(self.cellHighLightEl);
                self._showCellLight(cell);
                //添加拖动的控件或cell   传输数据
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
                    //处理微布局
                    var _boxMicroTd = target.closest('.crazy-table-containter-td');
                    D.HighLight.showMicroLightFix(_boxMicroTd, self.fixMicroHighLightEl);

                } else {
                    self.enableClass = D.DropInPage.CONSTANTS.ENABLE_CLASS_PREFIX + self.chooseLevel;

                    if(self.state === 'copy') {//如果在复制状态
                        self._dropInEnter(e);
                    } else {//如果在非复制状态
                        //编辑某个module中的标签时
                        var ENABLE_EDIT_AREA_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME;
                        if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                            self._highLightCurrent(target);
                            //add by pingchun.yupc 2012-05-30
                            self._showCellLight(target);
                            //end
                            return;
                        }

                        //编辑某个module中的Cell时
                        // var ENABLE_EDIT_CELL_CLASS_NAME = D.DropInPage.CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME;
                        // if (target.hasClass(ENABLE_EDIT_CELL_CLASS_NAME)===true
                        //  || target.closest('.'+ENABLE_EDIT_CELL_CLASS_NAME).length>0){
                        // var cellWidget = target.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'cell');

                        // self._showTransport(cellWidget, self.moveTransport); //'move'
                        // return;
                        // }

                        //选中某个区块时
                        if(target.hasClass(className) === true || ( target = target.closest('.' + className)).length > 0) {
                            e.stopPropagation();

                            //显示运输容器
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
         *隐藏 微布局高亮
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
         * @methed _leaveCopyPackage 当页面中已有的的元件mouseenter时
         */
        _leaveCopyPackage : function() {
            var self = this;

            $(self.dropArea).live('mouseout', function(e) {
                var target = $(e.target);

                if(self.state === 'copy') {//如果在复制状态
                    self._dropInLeave(e);
                }

            });
        },
        /**
         * @methed _leavePagePackage 当页面中已有的的元件mouseleave时
         */
        _leavePagePackage : function() {
            var self = this;

            // transport-object start
            /*self.transport.bind('mouseout', function(e){
             var target = $(this),
             mode = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_MODE);

             if (mode==='dropin'){   //如果处于‘dropin’状态，失去元素的高亮
             self._lowPackage(target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM));
             }

             if (!(self.state==='copy' && mode==='move')) {   //如果不是在复制状态
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
                //label层级按钮暴露时
                if(self.chooseLevel === 'label') {
                    self._lowLightCurrent(target);
                } else if(self.chooseLevel === 'microlayout') {
                    //处理微布局

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

                //编辑内容 被触发后
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
         * @methed _clickPagePackage 单击页面中的元件后选中元件
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
             *单击 微布局的单元格
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
                //检查是否可以合并
                self.mircolayout.showIsMerge(_elem[0]);
                //保存选中的单元格
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
            //这里必须不能使用click事件，否则会在chrome中快速点击时无法触发(原因不明)
            self.dropArea.live('mousedown', function(e) {
                e.preventDefault();
                var target = $(e.target), defineModule = self.config.defineModule, className = self.elemClass = self._getCurrentWidgetClass();

                //label层级按钮暴露时
                /*if (self.chooseLevel==='label'){
                //window.setTimeout(function(){}, 50);
                self._showHighLight(target);
                }*/

                //编辑内容 被触发后
                if(target.hasClass(ENABLE_EDIT_AREA_CLASS_NAME) === true || (target.closest('.' + ENABLE_EDIT_AREA_CLASS_NAME)).length > 0) {
                    //self._showHighLight(target, true);
                    return;
                } else if(target.hasClass(ENABLE_EDIT_CELL_CLASS_NAME) === true || target.closest('.' + ENABLE_EDIT_CELL_CLASS_NAME).length > 0) {//当快速点击（运输元素还为出现前）选中某个cell时
                    e.stopPropagation();
                    var cellWidget = target.closest('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'cell');
                    self._handleChooseHight(cellWidget);

                } else if((self.state !== 'copy' && (target.hasClass(className) === true//当快速点击（运输元素还为出现前）选中某个区块时
                || ( target = target.closest('.' + className)).length > 0)) || ( target = target.closest('.' + defineModule)).length > 0) {//如果点击了自定义模块
                    e.stopPropagation();
                    self._handleChooseHight(target);
                    self._hideCellLight(self.fixCellHighLightEl);
                }

                //如果点击了自定义模块
                /*if ((target=target.closest('.'+defineModule)).length>0){
                self._hideJsControl(target);
                self._showSingerArea(target);
                }*/
                //如果为非自定代码区块，便使自定义代码处于可视化状态

            });

            //这里必须使用click事件，否则会使tab切换中的click事件无效
            self.dropArea.live('click', function(e) {
                e.preventDefault();
                var target = $(e.target);

                //label层级按钮暴露时
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

                    //modify by hongss on 2012.06.07 for 代码自定义控件
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
         * @methed _handleChooseHight 处理选择后的高亮
         * @param target 目标元素，jQuery对象
         * @param isTransport 目标元素是否为运输元素
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
                //处理微布局
                //console.log(999);
                //console.log('microlayout');
            } else {
                this._showHighLight(el, true);
            }

        },
        /**
         *处理layout 底边距
         */
        _handleLayoutConfig : function() {
            var self = this,
            //layout 底边距
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
                        alert('亲，输入非法,请重新输入！');
                        return;
                    }
                    /**
                     *修复 firefox ie 的 margin-top/bottom的bug
                     * 有两个嵌套关系的div，如果外层div的父元素padding值为0，那么内层div的margin-top或者margin-bottom的值会“转移”给外层div。
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
         * @methed _hideJsControl 清除JS失效高亮
         * @param el 目标元素，jQuery对象
         * @param unCurrent 是否是对当前元素消除，此参数在复制时使用和start
         */
        _hideJsControl : function(el, unCurrent) {
            if(this.iframeDoc.find('.' + this.config.jsControlClass).length > 0 && (unCurrent || el.closest('.' + this.config.jsControlClass).length === 0)) {
                this.jsControl.jsValid();
            }
        },
        /**
         * @methed _singerBtnsListener 监听标识区域高亮内的按钮
         * @param target 标识区域高亮元素，jQuery对象
         */
        _singerBtnsListener : function(singer) {
            var config = this.config, self = this, CONSTANTS = D.DropInPage.CONSTANTS, singerMain = $(config.singerMain, singer), singerBtnsUl = $(config.singerBtnsUl, singer);

            /*//自定义模块的编辑代码
            $('.'+CONSTANTS.SINGER_AREA_EDIT_HTML_BTN, singer).live('click', function(e){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            textarea = $('<textarea placeholder="请输入相关代码"></textarea>'),
            btnsHtml = self._getSingerBtnsHtml(el, 'coding');
            //textarea.attr('style', singerMain.attr('style'));
            textarea.width(singerMain.width()-2);
            textarea.height(singerMain.height()-2);
            textarea.text($.trim(el.html()));
            singerMain.html(textarea);
            singerBtnsUl.html(btnsHtml);
            self._hideHighLight();
            });*/

            //预览自定义模块的代码
            /*$('.'+CONSTANTS.SINGER_AREA_VIEW_HTML_BTN, singer).live('click', function(){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            btnsHtml = self._getSingerBtnsHtml(el, 'view');

            self._setDefineCodeView(el, singer);
            singerBtnsUl.html(btnsHtml);
            });*/

            //寻找“上一层”，现在的逻辑中不会出现“上一层”
            /*$('.'+CONSTANTS.SINGER_AREA_PREVIOUS_BTN, singer).live('click', function(e){
            var el = singer.data(CONSTANTS.TRANSPORT_DATA_ELEM),
            target = el.parents('.'+CONSTANTS.ELEMENT_CLASS_PREFIX+'cell'),
            moduleClass = CONSTANTS.ELEMENT_CLASS_PREFIX+'module',
            container, parentContainer;

            if (!target.length){
            target = el.parents('.'+moduleClass);
            }
            self._finishEditLable(el, singerMain);
            //如果遇到module，便取module元素
            container = target.eq(0);
            self._showSingerArea(container);
            });*/

            //编辑标签
            $('.' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, singer).live('click', function(e) {
                //完成cell编辑
                //self._finishEditArea(singer, $('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, singer),
                // CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_CELL_BTN,
                // CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME, '编辑控件');
                self.chooseLevel = 'module';
                self._startEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
            });
            //选中模块
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_TOPIC_MODULE_BTN,singer).live('click',function(e){
            var _self = $(this),_topicModule=_self.data('target'),_topicObj=$('#other');
            console.log(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM).find('.'+_topicModule));
            D.showAttr(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM).find('.'+_topicModule));

            self._showTopicModule(_topicObj);
            });*/
            //动态模版
            //有数据源弹出模版列表，无就弹出选择数据源
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN, singer).live('click', function(e) {
                var _oModule = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                D.bottomAttr.openDsTemplate();
                //D.showAttr(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM));
            });
            //有数据源，提示修改按钮
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN, singer).live('mouseenter', function(e) {
                var _oModule = D.DropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                var _dsTemplate = _oModule.attr('data-dstemplate');
                if(_dsTemplate) {
                    var _showDs = _oModule.attr('data-showds');
                    // 如果不需要显式数据源，则不显示，否则显式,在专场中要求。
                    if("false" != _showDs) {
                        $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).css('display', 'inline-block');
                    }
                }

            });
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).live('mouseleave', function(e) {
                $(this).hide();
                // $('.'+CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN+"-modify",singer).hide();
            });
            //修改数据源
            $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).live('click', function(e) {
                D.bottomAttr.changeDsForDsTemplate();
            });
            $('.list-btns', singer).live('mouseleave', function(e) {
                $('.' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + "-modify", singer).hide();
            });

            //完成标签编辑
            $('.' + CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, $('#crazy-box-cell-highlight', self.iframeDoc)).live('click', function(e) {
                self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '编辑');
            });
            /**
             *编辑微布局完成
             */
            $('.micro-edit-finish', self.iframeDoc).live('click', function(e) {
                self.chooseLevel = 'module';

                self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '编辑');

            });
            /**
             *复制 2012-09-20 新增加
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
            //接入数据源
            $(singer).delegate('.' + CONSTANTS.SINGER_AREA_ENTER_DS_BTN, 'click', function(event) {
                event.preventDefault();
                D.showAttr(self.currentElem);
                //展示接入数据源
                D.showDs();
            });
            //组属性
            $('.' + CONSTANTS.SINGER_AREA_EDIT_MODULE_BTN, singer).live('click', function(event) {
                event.preventDefault();
                self.chooseLevel = 'module';
                if(self.state === 'copy') {//取消复制
                    self._cancelCopy();
                }
                D.showAttr(self.currentElem);

            });
            //微布局
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
                //微布局
                self.mircolayout = new D.Microlayout(self);
                self.mircolayout.load();

                // console.log(self.microHighLightEl);
                D.HighLight.showMicrolayoutLight(boxMicrolayout, self.microHighLightEl);
            });

            //cell 上下移动
            $(self.cellHighLightEl).delegate('.move-cell-bin', 'click', function(event) {
                event.preventDefault();
                var _$self = $(this);
                if(!_$self.parent().hasClass('disabled')) {
                    self._cellMoveUpOrDown(event, _$self);
                }

            });

            //编辑cell
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, singer).live('click', function(e){
            //完成标签编辑
            self._finishEditArea(singer, $('.'+CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, singer),
            CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN,
            CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '编辑内容');

            self._startEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_CELL_BTN,
            CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);

            });*/

            //完成cell编辑
            /*$('.'+CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN, singer).live('click', function(e){
            self._finishEditArea(singer, $(this), CONSTANTS.SINGER_AREA_EDIT_CELL_FINISH_BTN,
            CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME,
            '编辑控件');
            });*/

            //退出编辑状态，现在的逻辑没有此按钮
            /*$('.'+CONSTANTS.SINGER_AREA_EXIT_EDIT_BTN, singer).live('click', function(e){
            self._hideSingerArea();
            this.currentElem = null;
            });*/

            //邦定单击模版事件
            self._selectedTagModuleList(singer);
        },
        /**
         *cell 向上向下移动
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
         *检测cell是否可上下移动
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
         * @methed 邦定单击选中模版事件
         * @param singer 标识区域高亮元素，jQuery对象
         */
        _selectedTagModuleList : function(singer) {
            var CONSTANTS = D.DropInPage.CONSTANTS, self = this;
            $('.' + CONSTANTS.SINGER_AREA_EDIT_MODULE_TAG_BTN, singer).live('click', function(e) {
                var oDialog = $('div.dialog-module-tag'), _targetModuleObj = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
                var moduleId;
                if(self.state === 'copy') {//取消复制
                    self._cancelCopy();
                }
                moduleId = D.bottomAttr.queryLikeTagModule(_targetModuleObj, 1);
                var moduleList = $('.module-list', oDialog);
                if((moduleId === -1) || (moduleList && moduleList.length <= 0)) {
                    alert('没有相同标签的模版！');
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
            //分页事件
            $('div.module-page').delegate('a.elem', 'click', function(e) {
                e.preventDefault();
                var _self = $(this), _selfParent = _self.parent();
                if(!_selfParent.hasClass('disabled')) {
                    D.bottomAttr.queryLikeTagModule(self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), _self.data('val'));
                }
            });
            //高亮事件
            $('div.module-body').delegate('div.module-list', 'mouseenter', function(e) {
                var _self = $(this);
                _self.addClass('module-high-light');
            });
            $('div.module-body').delegate('div.module-list', 'mouseleave', function(e) {
                var _self = $(this);
                _self.removeClass('module-high-light');
            });
            //单击模版事件
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
         * @methed _startEditArea 开始对编辑区域进行编辑，编辑标签或编辑cell
         * @param singerArea jQuery对象，编辑区域
         * @param btn jQuery对象，执行按钮
         * @param currentBtnClass 当前按钮的class名
         * @param addBtnClass 需要替换成的class名
         * @param stateClass 给编辑区域加上用于标识正在编辑的class名
         * @param text btn中的文案
         */
        _startEditArea : function(singerArea, btn, currentBtnClass, addBtnClass, stateClass, text) {
            var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(this.config.singerMain, singerArea), self = this;
            text = text || '完成';
            //btn.text(text).removeClass(currentBtnClass)
            //.addClass(addBtnClass);
            el.addClass(stateClass);
            singerMain.hide();
            //add by pingchun.yupc 2012-08-08
            if(self.state === 'copy') {//取消复制
                self._cancelCopy();
            }
            singerArea.hide();
            //end
        },
        /**
         * @methed _finishEditArea 完成对编辑区域进行编辑，编辑标签或编辑cell
         * @param singerArea jQuery对象，编辑区域
         * @param btn jQuery对象，执行按钮
         * @param currentBtnClass 当前按钮的class名
         * @param addBtnClass 需要替换成的class名
         * @param stateClass 给编辑区域加上用于标识正在编辑的class名
         * @param text btn中的文案
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
                //微布局
                this._hideMicro();
                //end
                this._setCurrentElem(moduleEl, singerArea);

                this._finishEditLable(el, singerMain, stateClass);
                singerArea.show();

            }
        },
        /**
         * @methed _setDefineCodeEdit 将自定义控件转换成编辑状态
         * @param target jQuery对象，目标元素
         * @param editTextarea jQuery对象，textarea编辑区域
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
         * @methed _setDefineCodeView 将自定义转换成可视化状态
         * @param target jQuery对象，目标元素
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
                    //TDP静态位置编辑代码处理 add by pingchun.yupc 2012-07-20
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

                    //记录已经做了修改
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
         * @methed _finishEditLable 完成内容编辑
         * @param el jQuery对象，目标元素
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
         * @methed _showSingerArea 显示标识区域高亮
         * @param target jQuery对象，目标元素
         */
        _showSingerArea : function(target) {
            var config = this.config, singerArea = this.singerArea,
            //el = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM),
            //btnsHtml = this._getSingerBtnsHtml(target),此段代码和上下文没什么联系，现将代码移到到html-helper.js文件中
            btnsHtml = D.HtmlHelper.getSingerBtnsHtml(target, null, {
                'defineModule' : this.config.defineModule,
                'dsCodeEdit' : this.config.dsCodeEdit
            }), tempOffset = this._getAreaOffset(target), width = target.outerWidth(), height = target.outerHeight(), singerMain = $(config.singerMain, singerArea), singerBtnsUl = $(config.singerBtnsUl, singerArea), offset = {
                'top' : tempOffset.top - singerBtnsUl.height(),
                'left' : tempOffset.left
            };
            //先将前一个内容编辑完成
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
         * @methed _setCurrentElem 设置当前选中元素
         * @param currentElem jQuery对象，当前元素
         * @param lightEl jQuery对象，高亮元素，在元素Data中将值改为当前元素
         */
        _setCurrentElem : function(currentElem, lightEl) {
            lightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);
            this.currentElem = currentElem;

            if(!(this.chooseLevel === 'module' || this.chooseLevel === 'layout' || this.chooseLevel === 'microlayout')) {
                D.showAttr(currentElem);
            }

        },
        /**
         * @methed _finishLastArea 完成上一个标识区域的 标签编辑
         * @param singerArea jQuery对象，标识元素
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
         * @methed _hideSingerArea 隐藏标识区域高亮
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
         * @methed _showHighLight 显示被选中的高亮
         * @param isEditLabel 是否编辑标签
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

            //如果有JS，使JS失效
            el = this.jsControl.add(el);
            this.currentElem = el;
            this.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, el);
            this._setSingerAreaElem(el);

            //展示属性面板中的内容
            D.showAttr(el);

        },
        /**
         * @methed _hideHighLight 隐藏被选中的高亮
         */
        _hideHighLight : function() {
            this.fixHighLightEl.hide();
            this.fixHighLightEl.attr('style', '');
            this.fixHighLightEl.removeData(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
            //this.currentElem = null;
        },
        /**
         * @methed _hideHighLight 隐藏被选中的高亮 外部调用
         * 目前被弹出修改属性的对框 关闭事件调用
         */
        hideHighLight : function() {
            var self = this;
            self._hideHighLight();
        },
        /**
         * @methed _enterFixHightLight 鼠标出入已经被选中的元件
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
         * @methed _resizeFixHightLight 当window触发resize时改变fixHighLightEl的offset
         */
        _resizeFixHightLight : function() {
            var self = this;
            $(window).resize(function(e) {
                var currentElem = self.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM) || self.currentElem, offset = self._getAreaOffset(currentElem);
                self.fixHighLightEl.offset(offset);
            });
        },
        /**
         * @methed _showTransport 显示运输容器
         * @param el 需要被运输的元素
         * @param transport 执行运输任务的元素
         * @param zIndex 可选，CSS样式中z-index的属性值，默认为1000
         * @param isTimeout  可选，是否做延迟感应，默认为true
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
         * @methed _showTransport 显示运输容器
         * @param el 需要被运输的元素
         * @param transport 执行运输任务的元素
         * @param zIndex CSS样式中z-index的属性值，默认为1000
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
         * @methed _hideDragenterhighLight 拖拽离开目标元素时失去高亮
         */
        /*_hideDragenterhighLight: function(){
        this.dragenterHighLightEl.hide();
        },*/
        /**
         * @methed _getAreaOffset 获取编辑区域内元素的offset值
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
         * @methed _hideTransport 隐藏运输容器
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
         * @methed _highLightCurrent 高亮当前元素
         * @param el 需要高亮的元素
         */
        _highLightCurrent : function(el) {
            //使用阴影的方法
            el.addClass(this.config.currentTarget);
        },
        /**
         * @methed _lowLightCurrent 对当前元素去除高亮
         * @param el 需要去除高亮的元素
         */
        _lowLightCurrent : function(el) {
            el.removeClass(this.config.currentTarget);
        },
        /**
         * @methed _getCurrentWidgetClass 获取当前元件的class
         */
        _getCurrentWidgetClass : function() {
            return D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + this.chooseLevel;
        },
        /**
         * @methed _getMoveScope 获取移动范围
         * @param el 当前元素，jQuery对象
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
         * @methed _addDataTransfer 给dataTransfer setData 元件的HTML代码
         * @param e 事件对象
         * @param elem 元件在“元素库”中展示的元素
         * @param elemInfo 元件信息
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
         * @methed _requestElemHTML 元件原件的HTML代码
         * @param elemInfo 元件信息
         * @param fn 回调函数，请求完成后执行的回调函数
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
                        htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">获取数据失败，请重试！</span>';
                    }

                    fn.call(this, htmlCode);
                },
                error : function(o) {
                    //错误提示信息
                    if(self.loading) {
                        self.loading.html('数据加载失败，请重试！');
                    }
                }
            });
        },
        /**
         * @methed _setElemInfo 设置元件的elemInfo
         * @param elemHtml 元件的html代码
         * @param elemInfo 元件信息
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
         * @methed _isEnableDropIn 判断elem是否允许放入,判断标准为数量与宽度
         * @param target 目标元素
         * @param elemInfo 元件信息
         * @return {array} [宽度适合, 是否存在子元件(true:存在), 还允许继续增加]
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
         * @methed _showSinger 显示允许新增cell的标识
         * @param target 目标元素
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
         * @methed _hideSinger 隐藏允许新增cell的标识
         * @param target 目标元素
         */
        _hideSinger : function(target) {
            if(target) {
                var prev = target.prevAll('.' + D.DropInPage.CONSTANTS.ENABLE_BEFORE_CLASS_NAME), next = target.nextAll('.' + D.DropInPage.CONSTANTS.ENABLE_AFTER_CLASS_NAME);
                prev.remove();
                next.remove();
            }
        },
        /**
         * @methed _emptySinger 清空新增元件的标识
         * @param area 编辑区域
         */
        _emptySinger : function(area) {
            area.find('.' + D.DropInPage.CONSTANTS.ENABLE_BEFORE_CLASS_NAME + ', .' + D.DropInPage.CONSTANTS.ENABLE_AFTER_CLASS_NAME).remove();
        },
        /**
         * @methed _lowAllLight 清空所有用className高亮的标识
         * @param area 编辑区域
         */
        _lowAllLight : function(area) {
            this._lowLightCurrent(area.find('.' + this.config.currentTarget));
        },
        /**
         * @methed hideAllSingers 隐藏所有标识，提供给“撤销”时使用
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

    //常量
    D.DropInPage.CONSTANTS = {
        //WIDGET_TYPE_CLASS_REG: '/^crazy-box-/',     //获取标识元件类型的class名的正则表达式
        ENABLE_BEFORE_CLASS_NAME : 'crazy-box-before-singer',
        ENABLE_AFTER_CLASS_NAME : 'crazy-box-after-singer',
        TAG_DATA_BOX_OPTIONS : 'boxoptions',
        ELEMENT_DATA_HTML_CODE : 'htmlcode',
        ELEMENT_DATA_INFO : 'eleminfo',
        TRANSPORT_DATA_ELEM : 'elem', //运输容器指定运输物的自定义属性data-elem
        TRANSPORT_DATA_MODE : 'mode', //运输容器拖拽时的模式
        ENABLE_CLASS_PREFIX : 'crazy-box-enable-', //允许放入的class名前缀
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

    //默认配置项
    D.DropInPage.defConfig = {
        dropTransport : '#crazy-box-droptransport', //用于从元素库的运输容器，被拖动的那个元素的selector
        moveTransport : '#crazy-box-movetransport', //用于页面中元素移动的运输容器，被拖动的那个元素的selector
        packageParent : '#dcms_box_modulebar', //运输物共同父级元素的selector
        dragPackage : '.dcms-box-layoutcontent', //运输物，需要放到运输容器中被运输的元素的selector  dcms-box-right-image
        dropArea : '.cell-page-main', //盒子页面主要编辑区域  #content
        editArea : '.dcms-box-center', //编辑区域，即存放iframe的元素
        currentTarget : 'crazy-box-target-current',
        fixHighLight : '#crazy-box-highlight-fix', //示意选中后的高亮元素
        beforeSingerHtml : '<div class="crazy-box-before-singer">可拖拽区域</div>', //代码中必须存在ENABLE_BEFORE_CLASS_NAME class名
        afterSingerHtml : '<div class="crazy-box-after-singer">可拖拽区域</div>', //代码中必须存在ENABLE_AFTER_CLASS_NAME class名
        currentSinger : 'crazy-box-singer-current',
        levelParent : '.edit-ul', //层级选择的父级元素
        chooseLevel : '.desc', //层级选择的selector
        copyButton : 'bar-a-copy', //可复制按钮的className
        newCopyButton : 'new-copy', //可复制按钮的className
        delButton : 'bar-a-delete', //可删除按钮的className
        pageUrl : D.domain + '/page/box/layout.html',
        singerArea : '#crazy-box-singer-area',
        singerBtnsUl : '.list-btns',
        singerMain : '.main',
        //defineModule: 'cell-module-define',   //自定义模块
        defineCell : 'cell-cell-define', //自定义控件(cell)
        dsCodeEdit : 'ds-code-edit', //TDP可编辑代码
        editTextarea : '#crazy-box-edit-textarea', //承载编辑框的编辑区域
        jsControlClass : 'crazy-box-control-current',
        jsControlInureBtn : '#crazy-box-control-btn',
        callback : null,
        cellHightLightCurrent : 'crazy-box-cell-current',
        topicModule : 'cell-topic-module',
        emptyModuleHtml : '<div data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;背景设置&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;内边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;外边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;边框&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-module cell-module"><div data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-content crazy-box-enable-cell"></div></div>'
    };

})(dcms, FE.dcms);
