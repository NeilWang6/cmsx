/**
 * @author hongss
 * @userfor 拖拽元件到页面中，还包括了移动、复制
 * @date  2012.02.14
 * "将module升级为row，因需求需要做特殊处理"，以此句为注释说明，便可找到相应的改动代码
 */

;(function($, D, undefined) {
	function _init(config) {
		var self = this;

		/**
		 * 属性定义
		 */
		self.config = null;
		//配置项
		self.dropTransport = null;
		//用于拖拽的元素，jQuery变量  transport-object
		self.moveTransport = null;
		//用于拖拽的元素，jQuery变量
		self.transportMod = null;
		//记录运输模式，chrome浏览器中需要此值
		self.dropArea = null;
		//盒子页面主要编辑区域
		self.iframeName = 'dcms_box_main';
		self.state = null;
		//状态，copy|null
		self.chooseLevel = 'module';
		//选择层级，layout|grid|row|box|module
		self.copyBtn = $('#crazy-box-copy');
		self.delBtn = $('#crazy-box-del');
		self.currentElem = null;
		//当前选中的元素
		self.copyElem = null;
		//复制元素
		self.iframeBody = null;
		self.iframeDoc = null;
		self.singerArea = null;
		//标识高亮区域的jQuery对象
		self.fixHighLightEl = null;
		self.loading = null;
		//数据正在加载中
		self.widgetType = null;
		//当前元件类型
		self.enableClass = null;
		//当前允许放入元件类型的class名
		self.elemInfo = null;
		//当前元件信息
		self.elemClass = null;
		//当前元件类型的class名
		self.transportTimeid = null;
		//延迟执行_showTransport方法的id
		self.iframeIntervalId = null;

		self.config = $.extend({}, D.DropInPage.defConfig, config);
		var config = self.config;

		// transport-object start
		self.dropTransport = $(config.dropTransport);
		if(self.dropTransport.length === 0) {
			self.dropTransport = $('<div draggable="true" id="crazy-box-droptransport" data-mode="dropin" class="crazy-box-target-current"></div>').appendTo($('body', document));
		}

	};
	/**
	 * @methed handleLoad 处理iframe load事件
	 * @param el 触发onload事件的元素
	 */
	function handleLoad(el) {
		var self = this, doc = $(el.contentDocument.document || el.contentWindow.document);
		self.iframeDoc = doc;
		self.iframeBody = $('body', doc);
		//执行回调函数
		if(self.config.callback && $.isFunction(self.config.callback)) {
			self.config.callback.call(self, doc);
		}
		//插入额外的CSS样式表，用于可视化编辑
		//$('head', doc).append($('<link rel="stylesheet" href="css/empty.css" />'));

		this._insertSecondary(self.iframeBody, doc);
		this._insertEditarea(self.iframeBody);
        this.singerArea = $(this.config.singerArea, doc);
		this.moveTransport = $(this.config.moveTransport, doc);
        

		//增加栅格 高亮
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertGridHighLight && D.box.editor.HtmlHelper.insertGridHighLight(self);

		//self._insertCellHighLight();
		//增加cell 高亮
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertCellHighLight && D.box.editor.HtmlHelper.insertCellHighLight(self);
		//增加微布局 高亮
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertMicrolayoutHighLight && D.box.editor.HtmlHelper.insertMicrolayoutHighLight(self);

		D.BoxTools.setEdited();
		//为container的标签加上允许放入元件类型(crazy-box-enable-XXXX)的标识
		self._addEnableClass(doc);

		//当“元素库”中的元件mouseenter时
		self._enterPackage();

		self.getGlobalAttr(doc);
		//当页面中已有的的元件mouseenter时
		self._enterPagePackage();
		self._leavePagePackage();
		self._leaveCopyPackage();
		self._clickPagePackage();
		self._enterFixHightLight();
		self._resizeFixHightLight();
        
        //D.offerOverdue.initErrorMsgEvent(doc);
        D.box.editor.loadHandler.fire(doc, self);

		//给layout的操作项绑定事件
		//self._controlLayoutConfig(doc, self.singerArea);
		// $(document).trigger('grid_operation_event', [doc, self.singerArea]);
		D.box.editor.Grid && D.box.editor.Grid.gridBtnsListener && D.box.editor.Grid.gridBtnsListener(self, self.singerArea);
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

		//初始化cell下可重复标签允许上移、下移、复制功能 add by hongss on 2012.01.09
		FE.dcms.box.editor.LabelMoveCopy && FE.dcms.box.editor.LabelMoveCopy.init(doc);

		if($('#operate-undo').length === 0) {
			//页面回退操作
			D.PageOperateHistory && D.PageOperateHistory.init(self);
		}

		//初始化D.uuid
		self._setInitUuid($('.crazy-box-layout, .crazy-box-row, .crazy-box-module', doc));
	};
	var DropInPage = function(config) {
		var self = this;

		_init.call(self, config);

		/**
		 * @methed _insertIframe 插入承载“页面”内容的iframe
		 */
		this.insertIframe = function() {
			//将onload事件以属性的形式放在标签上是为了保证chrome/IE在每次强制刷新时都能触发onload事件
			var config = this.config, pageUrl = config.pageUrl, iframe = $('<iframe id="' + config.iframeName + '" class="dcms-box-main" src="' + pageUrl + '"/>');

			$(config.editArea, config.mainArea).html('').append(iframe);

			$('#' + config.iframeName).bind('load', function() {
				var that = this;

				handleLoad.call(self, that);

			});

		}
		/**
		 * @methed _levelListener 监听层级 layout|grid|row|box|module 按钮点击事件
		 */
		this._levelListener = function() {
			var self = this, config = this.config;
			var boxChooseLevel = $('li.current', '#box_choose_level');
			if(self.chooseLevel !== boxChooseLevel.data('val')) {
				self.chooseLevel = boxChooseLevel.data('val')
			}

			$(config.levelParent).delegate(config.chooseLevel, 'click', function(e) {
				var el = $(this), chooseLevel = el.data('val');
				el.siblings().removeClass('current');
				el.addClass('current');

				if(chooseLevel == 'module') {
					var iframe = $('#dcms_box_main').contents();
					//切换到高级模式下隐藏SELECTAREA的内容
					iframe.find('.chagenTarget').hide();
					var select = new D.selectArea();
					select.closeMao(iframe.find('.chagenTarget'),false);
					//iframe.find('.position-conrainer').show();
				}
				//运营编辑器
				if(D.YunYing && D.YunYing.isYunYing) {
					if(chooseLevel === 'module') {
						$('.js-bottom-grid', self.iframeDoc).show();
					} else {
						$('.js-bottom-grid', self.iframeDoc).hide();
					}
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
					//隐藏 grid
					D.box.editor.Grid && D.box.editor.Grid._hideGridHightLight && D.box.editor.Grid._hideGridHightLight(self.iframeDoc);
				}
			});
		}
		//监听层级layout|grid|row|box|module 按钮点击事件
		self._levelListener();
		self._docmentListener();
	};
	DropInPage.prototype = {
		constructor : DropInPage,
		_hideAll : function() {
			var self = this;
			self._hideHighLight();
			self._hideSingerArea();
			self._hideTransport(self.moveTransport);
			//self._hideCellLightFix();
			self._hideCellLight(self.fixCellHighLightEl);
			self._hideCellLight(self.cellHighLightEl);
			//微布局
			self._hideMicro();

			//layout(grid)高亮
			D.box.editor.Grid && D.box.editor.Grid._hideGridHightLight && D.box.editor.Grid._hideGridHightLight(this.iframeDoc);

			//cell内可移动标签高亮
			D.box.editor && D.box.editor.LabelMoveCopy && D.box.editor.LabelMoveCopy.hideMoveLigth();
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

		getGlobalAttr : function(doc) {
			//盒子页面主要编辑区域
			//this.dropArea = $(this.config.dropArea, doc);
			//this.singerArea = $(this.config.singerArea, doc);
			//this.moveTransport = $(this.config.moveTransport, doc);
			//this._insertSecondary(doc);
			this.dropArea = $(this.config.dropArea, doc);
			if(!this.dropArea.length) {
				this.dropArea = $('.cell-page-main', doc);
			}

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
		_insertSecondary : function(body, doc) {
			/*this.fixHighLightEl = $(this.config.fixHighLight, doc);
			 if (this.fixHighLightEl.length===0){
			 this.fixHighLightEl = $('<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>');
			 this.iframeBody.append(this.fixHighLightEl);
			 }*/
			//插入empty.css
            var EMPTY_CSS_URL = D.box.editor.config.STYLE_URL_HOST+'app/tools/css/dcms/module/box/empty.css';
            $('<link rel="stylesheet" href="'+EMPTY_CSS_URL+'" />').appendTo(doc.find('head'));
            
            //保存当前效果
            var controlJsHtml = '<div id="crazy-box-control-btn">\
                                    <button type="button" class="crazy-box-control">保存当前效果</button>\
                                </div>';
            body.append(controlJsHtml);
            var moveLightHtml = '<div id="crazy-box-move-light">\
                                    <ul class="list-ml">\
                                        <li class="ml-moveup">上移</li>\
                                        <li class="ml-movedown">下移</li>\
                                        <li class="ml-copy">复制</li>\
                                    </ul>\
                                </div>';
            $(moveLightHtml).appendTo(body);
            
            var singerAreaHtml = '<div id="crazy-box-singer-area">\
                                    <ul class="list-btns">\
                                        <li>上一层</li><li>编辑内容</li>\
                                    </ul>\
                                    <div class="main"></div>\
                                </div>';
            body.append(singerAreaHtml);
            var transportHtml = '<div draggable="true" id="crazy-box-movetransport" data-mode="move" class="crazy-box-target-current"></div>';
            body.append(transportHtml);
            
            var html = '<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>';
			this.fixHighLightEl = this._insertElem(this.config.fixHighLight, html, body);
			D.highLightEl = this.fixHighLightEl;
            
            //错误信息展示容器
            var conErrorMsg = '<div id="container-error-msg"></div>';
            body.append(conErrorMsg);
		},
		/**
		 * @methed _insertEditarea 插入编辑区域到iframeBody下
		 * @param body  文档body对象
		 */
		_insertEditarea : function(body) {
			//var html = '<div id="crazy-box-edit-textarea"><textarea class="crazy-box-textarea" placeholder="请输入相关代码"></textarea></div>';
			var html = '<div id="crazy-box-edit-textarea">';
			if(D.YunYing) {
				html += '<ul class="fd-hide" >';
			} else {
				html += '<ul class="" >';
			}

			html += '<li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" /><label for="crazy-box-code-html">HTML代码</label></li><li><input type="radio" name="code-type" value="vm" checked="checked" id="crazy-box-code-vm" /><label for="crazy-box-code-vm">VM代码</label></li></ul><textarea class="crazy-box-textarea" placeholder="请输入相关代码"></textarea></div>';
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
			D.DragAddDrop && D.DragAddDrop.init({
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
				var currentElem = self._getCurrentElem();
				deleteFn.call(this, currentElem);
			});
			$('.' + self.config.delButton).live('mousedown', function(e) {
				var currentElem = self._getCurrentElem();
				deleteFn.call(this, currentElem);
			});

			var deleteFn = function(currentElem) {
				var result = self._enableDelLevel(currentElem), elemInfo= currentElem.data('eleminfo'),delBtn = self.delBtn = $(this);
				if(self.state === 'copy') {//取消复制
					self._cancelCopy();
				}
				if(elemInfo&&elemInfo.source==='public_block'){
					D.box.editor&&D.box.editor.publicBlock&&D.box.editor.publicBlock.deletePublicBlock(elemInfo);
				}
				//将module升级为row，因需求需要做特殊处理
				if(result['type'] === 'row') {
					currentElem = currentElem.closest('.crazy-box-row');
				}
				if(D.YunYing && D.YunYing.isYunYing) {
					D.YunYing && D.YunYing.isVisualChange && D.YunYing.isVisualChange();
					if(!currentElem.siblings().length && (currentElem.closest('.crazy-box-banner')[0] || currentElem.closest('#crazy-box-banner')[0])) {
						var $banner = currentElem.closest('.crazy-box-banner');
						if(!$banner.length) {
							$banner = currentElem.closest('#crazy-box-banner')
						}
						var editDelSteps = D.EditContent.editDel({
							'elem' : $banner,
							'isEdit' : true
						});
						self.currentElem = null;
						D.BoxTools.setEdited({
							'param' : editDelSteps,
							'callback' : null
						});

						self._hideAll();
						return;
					}

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
			var type = 'module', $row = target.closest('.crazy-box-row')
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
			$(self.dropArea).live('click', function(e) {
				if(self.state === 'copy') {
					self._judgeDropIn(e, function(target) {
						self._lowLightCurrent(target);
						self._hideSinger(target);

						//var htmlcode = self._handleCopyHtml(self.copyElem, 'isReplace', target);
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'isReplace', target, self.chooseLevel, self.iframeDoc);
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
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'sibling', target, self.chooseLevel, self.iframeDoc);
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
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'container', target, self.chooseLevel, self.iframeDoc);
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
			});
		},

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
			this._hideTransport(this.moveTransport);
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
				//换皮肤，数据源信息保留
				htmlcode = DropInPage.changeSkin(target, htmlcode);

				//换皮肤 end
				var replaceSteps = self._replaceHtml({
					'htmlcode' : htmlcode,
					'target' : target,
					'isEdit' : true
				});
				self._addEnableClass(parent);
				//添加微布局后，展示微布局属性
				D.box.editor.Microlayout && D.box.editor.Microlayout.dropInDropMicro(self);

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
				//添加微布局后，展示微布局属性
				D.box.editor.Microlayout.dropInDropMicro(self);
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
				//添加微布局后，展示微布局属性
				D.box.editor.Microlayout.dropInDropMicro(self);
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
				//因无环境测试，未经测试，试用时请务必测试，测试后将此注释删除
				D.box.editor.operate.moveToReplace(elem, target, self.chooseLevel, self.iframeDoc);
			}, function(target, elem) {
				//self._hideCellLightFix();
				self._hideCellLight(self.fixCellHighLightEl);
				//如果移入容器
				var isEnable = self._isEnableDropIn(target, self.elemInfo);
				if(isEnable[0] === true && isEnable[1] === false) {
					//target.append(elem);
					//var elemHtmlcode = self._handleCopyHtml(elem, 'container', target),
					var elemHtmlcode = D.ManagePageDate.handleCopyHtml(elem, 'container', target, self.chooseLevel, self.iframeDoc), editDelSteps = D.EditContent.editDel({
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

			//如果不在'edit-module'状态模式, 将module升级为row，因需求需要做特殊处理
			if(config.status !== 'edit-module') {
				widgetClasses = self._getModuleClassSpecial(widgetClasses);
			}

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
				//console.log(el);
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
		 * @methed _enterPagePackage 当页面中已有的的元件mouseenter时
		 */
		_enterPagePackage : function() {
			var self = this;
			self.fixCellHighLightEl && self.fixCellHighLightEl.bind('mouseenter', function(e) {
				e.preventDefault();
				var target = $(e.target);
				var currentElem = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.currentElem = currentElem;
				//添加拖动的控件或cell   传输数据
				self.moveTransport.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);

			});

			self.cellHighLightEl && self.cellHighLightEl.bind('mouseover', function(e) {
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
					if(D.YunYing && D.YunYing.isYunYing) {
						if(!target.data('dsoptions') && (target.is('img') || !target.children().length)) {
							self._highLightCurrent(target);
						}
						return;
					} else {
						self._highLightCurrent(target);
					}

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
            
            //add by hongss for 运营编辑器在组件模式下使用hover状态显示修改菜单2013.07.05
            /*if(self.chooseLevel === 'module' && D.YunYing.isYunYing === true){
                self.moveTransport.bind('mouseenter', function(e){
                    e.stopImmediatePropagation();
                    var target = $(this);
                    self._handleChooseHight(target, true);
                    self._hideTransport(target);
                    self._hideCellLight(self.fixCellHighLightEl);
                });
            }*/

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
				//self._checkCellMove(_boxCell);
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
			if(D.box.editor.Microlayout) {
				D.box.editor.Microlayout.hideMicroHightlight(self.microHighLightEl, self.fixMicroHighLightEl);
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
			this._showAttr(currentElem);
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
			//self.cellHighLightEl.bind('mouseout', function(e) {
			//var cell = self.cellHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
			// self._delayHideCellLight(self.cellHighLightEl, cell);
			// });
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
			var selectArea = new D.selectArea();
            //点击其他区域时，结束自定义控件编辑
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
			self.fixMicroHighLightEl && self.fixMicroHighLightEl.bind('click', function(e) {
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
			self.fixCellHighLightE && self.fixCellHighLightEl.bind('click', function(e) {
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

				e.stopImmediatePropagation();
				/*if (self.chooseLevel==='module' && el.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX+'module')===true){
				 self._hideJsControl(el);
				 self._showSingerArea(el);
				 } else {
				 self._showHighLight(target);
				 }*/

				//self._handleChooseHight(target, true);
				//self._hideTransport(target);
				//add by pingchun.yupc
				//self._hideCellLightFix();
				//self._hideCellLight(self.fixCellHighLightEl);
                self._chooseArea(target, self.fixCellHighLightEl);
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
			var pretarget;
			self.dropArea.live('click', function(e) {
				e.preventDefault();
				/*start:zhuliqi，如果点击区域有SELECTAREA控件控制，那么调整E.TARGET的指向*/
				var target = selectArea.changeTarget(e.target);
				/*END:zhuliqi*/
				//label层级按钮暴露时
				if(self.chooseLevel === 'label') {
					//window.setTimeout(function(){}, 50);

					if(D.YunYing && D.YunYing.isYunYing) {
						var ancestor=target.closest('.crazy-box-module');
						if(typeof ancestor.data('boxconfig') !=='undefined'){
							//前端源码组件事件监听
							$(document).trigger('editContent.FDwidget',[ancestor]);
						}else{
							if((!target.data('dsoptions') && (target.is('img') || !target.children().length)) && target.closest('.' + self.config.defineCell).length === 0) {
								//self._lowLightCurrent(target);
								self._showHighLight(target);
								var doc = $('#dcms_box_main').contents();
								/*zhuliqi;鼠标滑动新建A标签的功能附加需要用以辨识可操作图片的工作*/
								// selectArea.setPreargue(self.dropArea)
								//点击就对之前的TARGET删除当前标记，对现在TARGET加上当前标记
								selectArea.attrNow(target, pretarget);
								// 发生点击就关闭编辑锚点功能
								selectArea.editButton(pretarget, target);
								//所有图片加载完成开始执行

								if(target && target[0].nodeName == "IMG") {
									selectArea.init({
										Dom : target,
										minWidth : '20',
										minHeight : '16',
										module : 'jianyi'
									});
									target.closest('.image-maps-conrainer').find('.position-conrainer').css('z-index', '1001');
								}
							} else {
								//D.Msg.error({
									//timeout : 5000,
									//message : '此标签不允许修改！'
								//});
							}
						}
						pretarget = target;
						return;
					} else {
						self._lowLightCurrent(target);
						self._showHighLight(target);
						var doc = $('#dcms_box_main').contents();
						/*zhuliqi;鼠标滑动新建A标签的功能附加需要用以辨识可操作图片的工作*/
						// selectArea.setPreargue(self.dropArea)
						//点击就对之前的TARGET删除当前标记，对现在TARGET加上当前标记
						selectArea.attrNow(target, pretarget);
						// 发生点击就关闭编辑锚点功能
						selectArea.editButton(pretarget, target);
						//如果加载的是图片则开始执行
						if(target && target[0].nodeName == "IMG") {
							selectArea.init({
								Dom : target,
								minWidth : '20',
								minHeight : '16',
								module : ''
							});
							target.closest('.image-maps-conrainer').find('.position-conrainer').css('z-index', '1001');
						}

					}
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

				pretarget = target;
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
				D.box.datasource && D.box.datasource.YunYing && D.box.datasource.YunYing.checkIsWaiting(this.currentElem, self.singerArea);
				//this._handleLayoutConfig(this.currentElem, self.iframeDoc);
				// checkModuleMove 检查是否可上下移动
				//$(document).trigger('module_move_event', [this.currentElem.closest('.crazy-box-row'), self.singerArea]);
				D.box.editor.Module && D.box.editor.Module.checkModuleMove(this.currentElem.closest('.crazy-box-row'), self.singerArea);
				//展示栅格操作项
				//$(document).trigger('grid_event', [this.currentElem, self.iframeDoc]);
				D.box.editor.Grid && D.box.editor.Grid.init && D.box.editor.Grid.init(this.currentElem, self.iframeDoc);
				//D.box.editor.Module&&D.box.editor.Module.setDefineCodeEdit&&D.box.editor.Module.setDefineCodeEdit(el,self);
			} else if(this.chooseLevel === 'layout') {
				this._showSingerArea(el);
				//self._handleLayoutConfig();
			} else if(this.chooseLevel === 'cell') {
				self._hideHighLight();
				//self._hideSingerArea();
				//self._hideTransport(self.moveTransport);
				//编辑拆分后 编辑自定义代码
				var $cellDefine = el.closest('.cell-cell-define');
				if($cellDefine && $cellDefine.length === 1) {
					self._setDefineCodeEdit($cellDefine, this.editTextarea);
					return;
				}
				self._showCellLight(el);
				self._hideCellLight(self.fixCellHighLightEl);
				self._showCellLightFix(el);
				this._setCurrentElem(el, self.cellHighLightEl);

			} else if(this.chooseLevel === 'microlayout') {
				//处理微布局
				//console.log(999);
				//console.log('microlayout');
			} else {

				this._showHighLight(el, true);
			}

		},

		//layout 操作项相关代码 end

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

			/**
			 * 触发组件相关事件
			 */
			D.box.editor.Module && D.box.editor.Module.moduleBtnsListener(singer, self);

			//编辑cell
			$('.' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, $('#crazy-box-cell-highlight', self.iframeDoc)).live('click', function(event) {
				event.preventDefault();
				var target = self.currentElem, cWidth = target.outerWidth(true), cHeight = target.outerHeight(true), targetParent = target.closest('.crazy-box-module');
				self.iframeDoc.find('.current-edit-module').removeClass('current-edit-module');
				target.addClass('current-edit-module');
				//修复copy控件后产生很多 style BUG
				DropInPage.removeRepeatStyle(target);
				//end

				var htmlcode = D.ManagePageDate.handleCopyHtml(target, '', target, self.chooseLevel, self.iframeDoc);
				// console.log(htmlcode);
				var tempParent = targetParent.clone();
				tempParent.empty();
				tempParent.append(htmlcode);
				var cellStr = ($('<div/>').append(tempParent).html());
				$.get(D.domain + '/page/box/tab_derive_cell.html', function(text) {
					var tmp = $('<div/>'), tabStr = '<li data-val="label"><span class="block"><i class="icon-close"></i>控件编辑</span></li>';
					tmp.append(text);

					var tabObj = $('<ul/>').append(tabStr);
					$('#cell_content', tmp).val(cellStr);
					try {
						D.menuTab.createTab('cell', tabObj.html(), '<div class="tab-b">' + tmp.html() + '</div>', function(handlerEl, boxEx) {
							boxEx.empty();
							boxEx.append(tmp.html());
						});
					} catch(e) {
						//console.log(e);
					}
					D.cellLoad({
						'width' : cWidth,
						'height' : cHeight
					});
					D.bottomAttr.resizeWindow();
					if( $('.toright')[0] ) {
						$('.dcms-box-body').css({width:'1400','margin-left':'16px'})
						// .addClass('move-marginleft16-500ms')
					}
				});
			});
			//选择 module 进入编辑控件
			$('.' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, singer).live('click', function(e) {

				eidtModuleCell.apply(self, arguments);
			});
			//微布局进入编辑组件
			$('#micro_add_cell').live('click', function(e) {
				self.chooseLevel = 'module';
				eidtModuleCell.apply(self, arguments);
			});

			//选择 module 进入编辑控件
			var eidtModuleCell = function(e) {
				var _oModule = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				//D.ToolsPanel.addHtmlCell();
				//D.cellBase.init(1);
				_oModule.removeClass('crazy-box-edit-area');
				var htmlCode, mWidth = _oModule.css('width');

				//console.log(self.iframeDoc.find('.current-edit-module'));
				self.iframeDoc.find('.current-edit-module').removeClass('current-edit-module');
				//修复copy组件后产生很多 style BUG
				DropInPage.removeRepeatStyle(_oModule);
				//end
				_oModule.addClass('current-edit-module');
				//得到组件的html代码，style script.
				htmlCode = DropInPage.getElemHtml(_oModule);
				var tabData = {};
				if($('.cell-page-main', self.iframeDoc).length) {
					tabData['from'] = 'page'
				} else {
					tabData['from'] = 'module';
				}
				//console.log(tabData);
				$.get(D.domain + '/page/box/tab_create_module.html', tabData, function(text) {
					var tmp = $('<div/>'), tabStr = '<li data-val="cell"><span class="block"><i class="icon-close"></i>组件编辑</span></li>';
					tmp.append(text);

					var tabObj = $('<ul/>').append(tabStr);

					$('#module-content', tmp).val(htmlCode);
					try {
						D.menuTab.createTab('module', tabObj.html(), '<div class="tab-b">' + tmp.html() + '</div>', function(handlerEl, boxEx) {
							boxEx.empty();
							boxEx.append(tmp.html());
							var tabCell = $('#cell', config.levelParent);
							if(tabCell.length > 0) {
								D.menuTab.removeTab(tabCell);
							}
						});
						//zhuliqi 要写在回调里，不然高度计算有误
						D.loadModule({
							'width' : mWidth
						});
						// 在绑定字段前初始化数据源schema
						D.bottomAttr.fetchDsModule(_oModule);
						D.bottomAttr.resizeWindow();
					} catch(e) {
						console.log(e);
					}


					//zhuliqi
					if( $('.toright')[0] ) {
						$('.dcms-box-body').css({width:'1400','margin-left':'16px'})
						// .addClass('move-marginleft16-500ms')
					}
				});

			};

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
			var dsdynamic = $.trim(target.attr('data-dsdynamic')), h = '100px';
			if(parseInt(target.children().css('height')) > 100) {
				h = target.children().css('height');
			}
			D.HighLight.showLight(editTextarea, target);
			editTextarea.css('height', h);
			var top = parseInt(editTextarea.css('top'));
			editTextarea.css('top', top + 20);
			if(D.YunYing && D.YunYing.isYunYing) {
				editTextarea.find('[value=vm]').attr('checked', 'checked');
				$('textarea', editTextarea).val(dsdynamic);
				return;
			}
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
			btnsHtml = D.box.editor.HtmlHelper.getSingerBtnsHtml(target, {
				'status' : config.status
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

			if(!(this.chooseLevel === 'layout' || this.chooseLevel === 'microlayout')) {
				this._showAttr(currentElem, this.config.status);
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
				/*this.fixHighLightEl.offset(this._getAreaOffset(el));
				this.fixHighLightEl.width(el.outerWidth());
				this.fixHighLightEl.height(el.outerHeight());*/
				//modify by hongss on 2012.01.08 for cell下可重复标签允许上移、下移、复制功能
				D.highLightEl = this.fixHighLightEl;
				D.box.editor && D.box.editor.LabelMoveCopy && D.box.editor.LabelMoveCopy.showMoveLight(el, this.iframeDoc);
				//$(document).trigger('box.editor.label_move_copy', [el, this.iframeDoc]);
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
			this._showAttr(el, this.config.status);

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
            
            if (this.chooseLevel === 'module' && D.YunYing && D.YunYing.isYunYing === true){
                this._chooseArea(transport, this.fixCellHighLightEl);
            }
		},
        /**
		 * @methed _chooseArea 选中某个区块 (可以是module, cell, box, row, grid, layout)
		 * @param target 目标元素，这边其实是 moveTransport
		 * @param fixCellHighLightEl 同this.fixCellHighLightEl一致
		 */
        _chooseArea : function(target, fixCellHighLightEl) {
            this._handleChooseHight(target, true);
            this._hideTransport(target);
            this._hideCellLight(fixCellHighLightEl);
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
			if(elemInfo['libraryType']) {//查找个人库组件或控件
				data['libraryType'] = elemInfo['libraryType'];
			}
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
						htmlCode = '<span id="crazy-box-data-loading" data-eleminfo="' + JSON.stringify(elemInfo) + '">获取数据失败，请重试！</span>';
					}
					if(htmlCode)
					fn.call(this, htmlCode);
				},
				error : function(o) {
					alert('获取数据失败，请重试！');
					return;
					//错误提示信息
					//if(self.loading) {
						//self.loading.html('数据加载失败，请重试！');
					//}
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
			var CONSTANTS = D.DropInPage.CONSTANTS, TAG_DATA_BOX_OPTIONS = CONSTANTS.TAG_DATA_BOX_OPTIONS, boxOptions = target.data(TAG_DATA_BOX_OPTIONS), number = D.BoxTools.parseOptions(boxOptions, ['ability', 'container', 'number']) || '1', length = target.children().length, width = target.innerWidth();

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

			D.bottomAttr && D.bottomAttr.closeDialog && D.bottomAttr.closeDialog();
		},
		/**
		 *@param $arg jQuery对象，需要展示的当前对象
		 *@param status
		 */
		_showAttr : function($arg, status) {
			$(document).trigger('box.panel.attribute.attr_handle_event', [$arg, status]);

		},
		/**
		 *替换选中的组件或控件
		 */
		replaceElement : function(newContent, className, handleEl) {
			var self = this, oldContent = self.iframeDoc.find('.' + className), _elemHtml;
			var currentParent = oldContent.parent(), eleminfo = oldContent.data('eleminfo');
			var type = D.ManagePageDate.getWidgetType(oldContent);

			handleEl = handleEl || $('li.current', '#box_choose_level');
			oldContent.removeClass('box-level-self');
			//删除原来样式和脚本
			DropInPage.removeElemStyle(oldContent);
			//console.log(newContent);
			var oDiv = $('<div/>');
			D.InsertHtml.init(newContent, oDiv, 'html', false);

			oDiv.find('.' + className).removeClass(className);

			_elemHtml = oDiv.html();

			var replaceSteps = self._replaceHtml({
				'htmlcode' : _elemHtml,
				'target' : oldContent,
				'isEdit' : true
			});
			self._addEnableClass(currentParent);

			//记录已经做了修改
			D.BoxTools.setEdited({
				'param' : replaceSteps,
				'callback' : null
			});
			D.menuTab.removeTab(handleEl);

		}
	};
	$.extend(DropInPage, {
		/**
		 * //修复copy组件/控件后产生很多 style BUG
		 *  @param {elem} elem为 module/cell等，jQuery对象
		 */
		removeRepeatStyle : function(elem) {
			var className, classReg = /^cell-/, type = D.ManagePageDate.getWidgetType(elem), parent = elem.closest('.crazy-box-module');
			if(type === 'cell') {
				classReg = /^cell-/;
				parent = elem.closest('.crazy-box-module');
			} else {
				//modify by hongss on 2012.02.23
				classReg = new RegExp('^(cell-' + type + '$)|(cell-' + type + '-\\d+$)');
				parent = elem.parent();
			}
			className = D.BoxTools.getClassName(elem, classReg);
			var temp = parent.find('style[data-for=' + className + ']');
			for(var i = 0; i < temp.length - 1; i++) {
				$(temp[i]).remove();
			}
			//end
		},
		/**
		 * @methed 删除module/cell的style 包含style script
		 * @param {elem} elem为 module/cell等，jQuery对象
		 */
		removeElemStyle : function(elem) {
			var classReg, htmlcode, className, type = D.ManagePageDate.getWidgetType(elem), parent = elem.parent();
			if(type === 'cell') {
				classReg = /^cell-/;
			} else {
				//modify by hongss on 2012.02.23
				classReg = new RegExp('^(cell-' + type + '$)|(cell-' + type + '-\\d+$)');
			}
			className = D.BoxTools.getClassName(elem, classReg);
			parent.find('style[data-for=' + className + ']').remove();
			parent.find('link[data-for=' + className + ']').remove();
			parent.find('script[data-for=' + className + ']').remove();
		},
		/**
		 * @methed 得到module/cell的html代码 包含style script
		 * @param {elem} elem为 module/cell等，jQuery对象
		 */
		getElemHtml : function(elem) {
			var classReg, htmlcode, className, type = D.ManagePageDate.getWidgetType(elem);
			if(type === 'cell') {
				classReg = /^cell-/;
			} else {
				//modify by hongss on 2012.02.23
				classReg = new RegExp('^(cell-' + type + '$)|(cell-' + type + '-\\d+$)');
			}
			className = D.BoxTools.getClassName(elem, classReg);
			htmlcode = D.ManagePageDate._getCopyHtml(elem, type, className);
			return htmlcode;
		},

		/**
		 *数据源换皮肤 数据源相同 参数保持不变，不同则替换
		 */
		changeSkin : function(target, htmlcode) {
			//换皮肤，数据源信息保留
			//console.log(target);
			var tModule = target.find('.crazy-box-module'), oDiv = $('<div/>');
			//tmpDiv.append(htmlcode);
			D.InsertHtml.init(htmlcode, oDiv, 'html', false);
			var widget = oDiv.find('.crazy-box-module');

			/**
			 *数据源换皮肤 数据源相同 参数保持不变，不同则替换
			 */
			D.box.editor.Module.changeDataSource(tModule, widget);

			return oDiv.html();
			//数据源不相等，就直接返回原htmlcode

		},
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
		 * @methed _replaceHtml 替换html代码
		 * @param opts {'htmlcode':htmlcode, 'target':target, 'isExecJs':true|false, 'isEdit':true|false}
		 * @param htmlcode 需要替换的html代码
		 * @param target 需要被替换的目标元素
		 * @param isExecJs 是否执行JS
		 * @param isEdit 是否进行编辑（体现在页面上的）用于记录isEdited和“回撤”数据
		 */
		_replaceHtml : function(opts) {
			var div, editAfterSteps;
			var iframeDoc = opts.doc;
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

				div = D.BoxTools.getElem(editAfterSteps[0]['undo']['node'], $('body', iframeDoc));
			} else {
				div = $('<div />');
				opts['target'].before(div);
			}

			var editInsertSteps = D.InsertHtml.init({
				'html' : opts['htmlcode'],
				'container' : div,
				'insertType' : 'replaceWith',
				'doc' : iframeDoc,
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
		}
	});
	D.DropInPage = DropInPage;
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
		ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area', //自定义组件
		ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell', //自定义控件
		LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red'
	};

	//默认配置项
	D.DropInPage.defConfig = {
		dropTransport : '#crazy-box-droptransport', //用于从元素库的运输容器，被拖动的那个元素的selector
		moveTransport : '#crazy-box-movetransport', //用于页面中元素移动的运输容器，被拖动的那个元素的selector
		packageParent : '.tools-panel', //运输物共同父级元素的selector
		iframeName : 'dcms_box_main',
		dragPackage : '.dcms-box-layoutcontent', //运输物，需要放到运输容器中被运输的元素的selector  dcms-box-right-image
		dropArea : '.cell-page-main', //盒子页面主要编辑区域  #content .cell-page-main
		editArea : '.dcms-box-center', //编辑区域，即存放iframe的元素
		mainArea : '#main_design_page',
		currentTarget : 'crazy-box-target-current',
		fixHighLight : '#crazy-box-highlight-fix', //示意选中后的高亮元素
		beforeSingerHtml : '<div class="crazy-box-before-singer">可拖拽区域</div>', //代码中必须存在ENABLE_BEFORE_CLASS_NAME class名
		afterSingerHtml : '<div class="crazy-box-after-singer">可拖拽区域</div>', //代码中必须存在ENABLE_AFTER_CLASS_NAME class名
		currentSinger : 'crazy-box-singer-current',
		levelParent : '.js-box-level', //层级选择的父级元素
		chooseLevel : 'li', //层级选择的selector
		copyButton : 'bar-a-copy', //可复制按钮的className
		newCopyButton : 'new-copy', //可复制按钮的className
		syncModuleButton : 'sync-module', //点击弹出关联的页面的发布浮动层 0329 qiuxiaoquan
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
		status : null, //状态模式；目前只有在新建、修改组件(newcreatemodule.js)中使用此参数，用‘edit-module’表示编辑组件状态
		emptyModuleHtml : '<div data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;背景设置&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;内边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;外边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;边框&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-module cell-module"><div data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-content crazy-box-enable-cell"></div></div>'
	};

})(dcms, FE.dcms);
