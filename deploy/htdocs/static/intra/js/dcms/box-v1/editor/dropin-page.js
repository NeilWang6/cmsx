/**
 * @author hongss
 * @userfor ��קԪ����ҳ���У����������ƶ�������
 * @date  2012.02.14
 * "��module����Ϊrow����������Ҫ�����⴦��"���Դ˾�Ϊע��˵��������ҵ���Ӧ�ĸĶ�����
 */

;(function($, D, undefined) {
	function _init(config) {
		var self = this;

		/**
		 * ���Զ���
		 */
		self.config = null;
		//������
		self.dropTransport = null;
		//������ק��Ԫ�أ�jQuery����  transport-object
		self.moveTransport = null;
		//������ק��Ԫ�أ�jQuery����
		self.transportMod = null;
		//��¼����ģʽ��chrome���������Ҫ��ֵ
		self.dropArea = null;
		//����ҳ����Ҫ�༭����
		self.iframeName = 'dcms_box_main';
		self.state = null;
		//״̬��copy|null
		self.chooseLevel = 'module';
		//ѡ��㼶��layout|grid|row|box|module
		self.copyBtn = $('#crazy-box-copy');
		self.delBtn = $('#crazy-box-del');
		self.currentElem = null;
		//��ǰѡ�е�Ԫ��
		self.copyElem = null;
		//����Ԫ��
		self.iframeBody = null;
		self.iframeDoc = null;
		self.singerArea = null;
		//��ʶ���������jQuery����
		self.fixHighLightEl = null;
		self.loading = null;
		//�������ڼ�����
		self.widgetType = null;
		//��ǰԪ������
		self.enableClass = null;
		//��ǰ�������Ԫ�����͵�class��
		self.elemInfo = null;
		//��ǰԪ����Ϣ
		self.elemClass = null;
		//��ǰԪ�����͵�class��
		self.transportTimeid = null;
		//�ӳ�ִ��_showTransport������id
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
	 * @methed handleLoad ����iframe load�¼�
	 * @param el ����onload�¼���Ԫ��
	 */
	function handleLoad(el) {
		var self = this, doc = $(el.contentDocument.document || el.contentWindow.document);
		self.iframeDoc = doc;
		self.iframeBody = $('body', doc);
		//ִ�лص�����
		if(self.config.callback && $.isFunction(self.config.callback)) {
			self.config.callback.call(self, doc);
		}
		//��������CSS��ʽ�����ڿ��ӻ��༭
		//$('head', doc).append($('<link rel="stylesheet" href="css/empty.css" />'));

		this._insertSecondary(self.iframeBody, doc);
		this._insertEditarea(self.iframeBody);
        this.singerArea = $(this.config.singerArea, doc);
		this.moveTransport = $(this.config.moveTransport, doc);
        

		//����դ�� ����
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertGridHighLight && D.box.editor.HtmlHelper.insertGridHighLight(self);

		//self._insertCellHighLight();
		//����cell ����
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertCellHighLight && D.box.editor.HtmlHelper.insertCellHighLight(self);
		//����΢���� ����
		D.box.editor.HtmlHelper && D.box.editor.HtmlHelper.insertMicrolayoutHighLight && D.box.editor.HtmlHelper.insertMicrolayoutHighLight(self);

		D.BoxTools.setEdited();
		//Ϊcontainer�ı�ǩ�����������Ԫ������(crazy-box-enable-XXXX)�ı�ʶ
		self._addEnableClass(doc);

		//����Ԫ�ؿ⡱�е�Ԫ��mouseenterʱ
		self._enterPackage();

		self.getGlobalAttr(doc);
		//��ҳ�������еĵ�Ԫ��mouseenterʱ
		self._enterPagePackage();
		self._leavePagePackage();
		self._leaveCopyPackage();
		self._clickPagePackage();
		self._enterFixHightLight();
		self._resizeFixHightLight();
        
        //D.offerOverdue.initErrorMsgEvent(doc);
        D.box.editor.loadHandler.fire(doc, self);

		//��layout�Ĳ�������¼�
		//self._controlLayoutConfig(doc, self.singerArea);
		// $(document).trigger('grid_operation_event', [doc, self.singerArea]);
		D.box.editor.Grid && D.box.editor.Grid.gridBtnsListener && D.box.editor.Grid.gridBtnsListener(self, self.singerArea);
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

		//��ʼ��cell�¿��ظ���ǩ�������ơ����ơ����ƹ��� add by hongss on 2012.01.09
		FE.dcms.box.editor.LabelMoveCopy && FE.dcms.box.editor.LabelMoveCopy.init(doc);

		if($('#operate-undo').length === 0) {
			//ҳ����˲���
			D.PageOperateHistory && D.PageOperateHistory.init(self);
		}

		//��ʼ��D.uuid
		self._setInitUuid($('.crazy-box-layout, .crazy-box-row, .crazy-box-module', doc));
	};
	var DropInPage = function(config) {
		var self = this;

		_init.call(self, config);

		/**
		 * @methed _insertIframe ������ء�ҳ�桱���ݵ�iframe
		 */
		this.insertIframe = function() {
			//��onload�¼������Ե���ʽ���ڱ�ǩ����Ϊ�˱�֤chrome/IE��ÿ��ǿ��ˢ��ʱ���ܴ���onload�¼�
			var config = this.config, pageUrl = config.pageUrl, iframe = $('<iframe id="' + config.iframeName + '" class="dcms-box-main" src="' + pageUrl + '"/>');

			$(config.editArea, config.mainArea).html('').append(iframe);

			$('#' + config.iframeName).bind('load', function() {
				var that = this;

				handleLoad.call(self, that);

			});

		}
		/**
		 * @methed _levelListener �����㼶 layout|grid|row|box|module ��ť����¼�
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
					//�л����߼�ģʽ������SELECTAREA������
					iframe.find('.chagenTarget').hide();
					var select = new D.selectArea();
					select.closeMao(iframe.find('.chagenTarget'),false);
					//iframe.find('.position-conrainer').show();
				}
				//��Ӫ�༭��
				if(D.YunYing && D.YunYing.isYunYing) {
					if(chooseLevel === 'module') {
						$('.js-bottom-grid', self.iframeDoc).show();
					} else {
						$('.js-bottom-grid', self.iframeDoc).hide();
					}
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
					//���� grid
					D.box.editor.Grid && D.box.editor.Grid._hideGridHightLight && D.box.editor.Grid._hideGridHightLight(self.iframeDoc);
				}
			});
		}
		//�����㼶layout|grid|row|box|module ��ť����¼�
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
			//΢����
			self._hideMicro();

			//layout(grid)����
			D.box.editor.Grid && D.box.editor.Grid._hideGridHightLight && D.box.editor.Grid._hideGridHightLight(this.iframeDoc);

			//cell�ڿ��ƶ���ǩ����
			D.box.editor && D.box.editor.LabelMoveCopy && D.box.editor.LabelMoveCopy.hideMoveLigth();
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

		getGlobalAttr : function(doc) {
			//����ҳ����Ҫ�༭����
			//this.dropArea = $(this.config.dropArea, doc);
			//this.singerArea = $(this.config.singerArea, doc);
			//this.moveTransport = $(this.config.moveTransport, doc);
			//this._insertSecondary(doc);
			this.dropArea = $(this.config.dropArea, doc);
			if(!this.dropArea.length) {
				this.dropArea = $('.cell-page-main', doc);
			}

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
		_insertSecondary : function(body, doc) {
			/*this.fixHighLightEl = $(this.config.fixHighLight, doc);
			 if (this.fixHighLightEl.length===0){
			 this.fixHighLightEl = $('<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>');
			 this.iframeBody.append(this.fixHighLightEl);
			 }*/
			//����empty.css
            var EMPTY_CSS_URL = D.box.editor.config.STYLE_URL_HOST+'app/tools/css/dcms/module/box/empty.css';
            $('<link rel="stylesheet" href="'+EMPTY_CSS_URL+'" />').appendTo(doc.find('head'));
            
            //���浱ǰЧ��
            var controlJsHtml = '<div id="crazy-box-control-btn">\
                                    <button type="button" class="crazy-box-control">���浱ǰЧ��</button>\
                                </div>';
            body.append(controlJsHtml);
            var moveLightHtml = '<div id="crazy-box-move-light">\
                                    <ul class="list-ml">\
                                        <li class="ml-moveup">����</li>\
                                        <li class="ml-movedown">����</li>\
                                        <li class="ml-copy">����</li>\
                                    </ul>\
                                </div>';
            $(moveLightHtml).appendTo(body);
            
            var singerAreaHtml = '<div id="crazy-box-singer-area">\
                                    <ul class="list-btns">\
                                        <li>��һ��</li><li>�༭����</li>\
                                    </ul>\
                                    <div class="main"></div>\
                                </div>';
            body.append(singerAreaHtml);
            var transportHtml = '<div draggable="true" id="crazy-box-movetransport" data-mode="move" class="crazy-box-target-current"></div>';
            body.append(transportHtml);
            
            var html = '<div id="crazy-box-highlight-fix" class="crazy-box-target-current"></div>';
			this.fixHighLightEl = this._insertElem(this.config.fixHighLight, html, body);
			D.highLightEl = this.fixHighLightEl;
            
            //������Ϣչʾ����
            var conErrorMsg = '<div id="container-error-msg"></div>';
            body.append(conErrorMsg);
		},
		/**
		 * @methed _insertEditarea ����༭����iframeBody��
		 * @param body  �ĵ�body����
		 */
		_insertEditarea : function(body) {
			//var html = '<div id="crazy-box-edit-textarea"><textarea class="crazy-box-textarea" placeholder="��������ش���"></textarea></div>';
			var html = '<div id="crazy-box-edit-textarea">';
			if(D.YunYing) {
				html += '<ul class="fd-hide" >';
			} else {
				html += '<ul class="" >';
			}

			html += '<li><input type="radio" name="code-type" value="html" id="crazy-box-code-html" /><label for="crazy-box-code-html">HTML����</label></li><li><input type="radio" name="code-type" value="vm" checked="checked" id="crazy-box-code-vm" /><label for="crazy-box-code-vm">VM����</label></li></ul><textarea class="crazy-box-textarea" placeholder="��������ش���"></textarea></div>';
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
				var currentElem = self._getCurrentElem();
				deleteFn.call(this, currentElem);
			});
			$('.' + self.config.delButton).live('mousedown', function(e) {
				var currentElem = self._getCurrentElem();
				deleteFn.call(this, currentElem);
			});

			var deleteFn = function(currentElem) {
				var result = self._enableDelLevel(currentElem), elemInfo= currentElem.data('eleminfo'),delBtn = self.delBtn = $(this);
				if(self.state === 'copy') {//ȡ������
					self._cancelCopy();
				}
				if(elemInfo&&elemInfo.source==='public_block'){
					D.box.editor&&D.box.editor.publicBlock&&D.box.editor.publicBlock.deletePublicBlock(elemInfo);
				}
				//��module����Ϊrow����������Ҫ�����⴦��
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
			var type = 'module', $row = target.closest('.crazy-box-row')
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
			$(self.dropArea).live('click', function(e) {
				if(self.state === 'copy') {
					self._judgeDropIn(e, function(target) {
						self._lowLightCurrent(target);
						self._hideSinger(target);

						//var htmlcode = self._handleCopyHtml(self.copyElem, 'isReplace', target);
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'isReplace', target, self.chooseLevel, self.iframeDoc);
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
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'sibling', target, self.chooseLevel, self.iframeDoc);
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
						var htmlcode = D.ManagePageDate.handleCopyHtml(self.copyElem, 'container', target, self.chooseLevel, self.iframeDoc);
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
			});
		},

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
				//��Ƥ��������Դ��Ϣ����
				htmlcode = DropInPage.changeSkin(target, htmlcode);

				//��Ƥ�� end
				var replaceSteps = self._replaceHtml({
					'htmlcode' : htmlcode,
					'target' : target,
					'isEdit' : true
				});
				self._addEnableClass(parent);
				//���΢���ֺ�չʾ΢��������
				D.box.editor.Microlayout && D.box.editor.Microlayout.dropInDropMicro(self);

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
				//���΢���ֺ�չʾ΢��������
				D.box.editor.Microlayout.dropInDropMicro(self);
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
				//���΢���ֺ�չʾ΢��������
				D.box.editor.Microlayout.dropInDropMicro(self);
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
				//���޻������ԣ�δ�����ԣ�����ʱ����ز��ԣ����Ժ󽫴�ע��ɾ��
				D.box.editor.operate.moveToReplace(elem, target, self.chooseLevel, self.iframeDoc);
			}, function(target, elem) {
				//self._hideCellLightFix();
				self._hideCellLight(self.fixCellHighLightEl);
				//�����������
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

			//�������'edit-module'״̬ģʽ, ��module����Ϊrow����������Ҫ�����⴦��
			if(config.status !== 'edit-module') {
				widgetClasses = self._getModuleClassSpecial(widgetClasses);
			}

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
		 * @methed _enterPagePackage ��ҳ�������еĵ�Ԫ��mouseenterʱ
		 */
		_enterPagePackage : function() {
			var self = this;
			self.fixCellHighLightEl && self.fixCellHighLightEl.bind('mouseenter', function(e) {
				e.preventDefault();
				var target = $(e.target);
				var currentElem = target.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.currentElem = currentElem;
				//����϶��Ŀؼ���cell   ��������
				self.moveTransport.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, currentElem);

			});

			self.cellHighLightEl && self.cellHighLightEl.bind('mouseover', function(e) {
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
            
            //add by hongss for ��Ӫ�༭�������ģʽ��ʹ��hover״̬��ʾ�޸Ĳ˵�2013.07.05
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
		 *���� ΢���ָ���
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
			//self.cellHighLightEl.bind('mouseout', function(e) {
			//var cell = self.cellHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
			// self._delayHideCellLight(self.cellHighLightEl, cell);
			// });
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
			var selectArea = new D.selectArea();
            //�����������ʱ�������Զ���ؼ��༭
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
			self.fixMicroHighLightEl && self.fixMicroHighLightEl.bind('click', function(e) {
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
			var pretarget;
			self.dropArea.live('click', function(e) {
				e.preventDefault();
				/*start:zhuliqi��������������SELECTAREA�ؼ����ƣ���ô����E.TARGET��ָ��*/
				var target = selectArea.changeTarget(e.target);
				/*END:zhuliqi*/
				//label�㼶��ť��¶ʱ
				if(self.chooseLevel === 'label') {
					//window.setTimeout(function(){}, 50);

					if(D.YunYing && D.YunYing.isYunYing) {
						var ancestor=target.closest('.crazy-box-module');
						if(typeof ancestor.data('boxconfig') !=='undefined'){
							//ǰ��Դ������¼�����
							$(document).trigger('editContent.FDwidget',[ancestor]);
						}else{
							if((!target.data('dsoptions') && (target.is('img') || !target.children().length)) && target.closest('.' + self.config.defineCell).length === 0) {
								//self._lowLightCurrent(target);
								self._showHighLight(target);
								var doc = $('#dcms_box_main').contents();
								/*zhuliqi;��껬���½�A��ǩ�Ĺ��ܸ�����Ҫ���Ա�ʶ�ɲ���ͼƬ�Ĺ���*/
								// selectArea.setPreargue(self.dropArea)
								//����Ͷ�֮ǰ��TARGETɾ����ǰ��ǣ�������TARGET���ϵ�ǰ���
								selectArea.attrNow(target, pretarget);
								// ��������͹رձ༭ê�㹦��
								selectArea.editButton(pretarget, target);
								//����ͼƬ������ɿ�ʼִ��

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
									//message : '�˱�ǩ�������޸ģ�'
								//});
							}
						}
						pretarget = target;
						return;
					} else {
						self._lowLightCurrent(target);
						self._showHighLight(target);
						var doc = $('#dcms_box_main').contents();
						/*zhuliqi;��껬���½�A��ǩ�Ĺ��ܸ�����Ҫ���Ա�ʶ�ɲ���ͼƬ�Ĺ���*/
						// selectArea.setPreargue(self.dropArea)
						//����Ͷ�֮ǰ��TARGETɾ����ǰ��ǣ�������TARGET���ϵ�ǰ���
						selectArea.attrNow(target, pretarget);
						// ��������͹رձ༭ê�㹦��
						selectArea.editButton(pretarget, target);
						//������ص���ͼƬ��ʼִ��
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

				pretarget = target;
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
				D.box.datasource && D.box.datasource.YunYing && D.box.datasource.YunYing.checkIsWaiting(this.currentElem, self.singerArea);
				//this._handleLayoutConfig(this.currentElem, self.iframeDoc);
				// checkModuleMove ����Ƿ�������ƶ�
				//$(document).trigger('module_move_event', [this.currentElem.closest('.crazy-box-row'), self.singerArea]);
				D.box.editor.Module && D.box.editor.Module.checkModuleMove(this.currentElem.closest('.crazy-box-row'), self.singerArea);
				//չʾդ�������
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
				//�༭��ֺ� �༭�Զ������
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
				//����΢����
				//console.log(999);
				//console.log('microlayout');
			} else {

				this._showHighLight(el, true);
			}

		},

		//layout ��������ش��� end

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

			/**
			 * �����������¼�
			 */
			D.box.editor.Module && D.box.editor.Module.moduleBtnsListener(singer, self);

			//�༭cell
			$('.' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, $('#crazy-box-cell-highlight', self.iframeDoc)).live('click', function(event) {
				event.preventDefault();
				var target = self.currentElem, cWidth = target.outerWidth(true), cHeight = target.outerHeight(true), targetParent = target.closest('.crazy-box-module');
				self.iframeDoc.find('.current-edit-module').removeClass('current-edit-module');
				target.addClass('current-edit-module');
				//�޸�copy�ؼ�������ܶ� style BUG
				DropInPage.removeRepeatStyle(target);
				//end

				var htmlcode = D.ManagePageDate.handleCopyHtml(target, '', target, self.chooseLevel, self.iframeDoc);
				// console.log(htmlcode);
				var tempParent = targetParent.clone();
				tempParent.empty();
				tempParent.append(htmlcode);
				var cellStr = ($('<div/>').append(tempParent).html());
				$.get(D.domain + '/page/box/tab_derive_cell.html', function(text) {
					var tmp = $('<div/>'), tabStr = '<li data-val="label"><span class="block"><i class="icon-close"></i>�ؼ��༭</span></li>';
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
			//ѡ�� module ����༭�ؼ�
			$('.' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN, singer).live('click', function(e) {

				eidtModuleCell.apply(self, arguments);
			});
			//΢���ֽ���༭���
			$('#micro_add_cell').live('click', function(e) {
				self.chooseLevel = 'module';
				eidtModuleCell.apply(self, arguments);
			});

			//ѡ�� module ����༭�ؼ�
			var eidtModuleCell = function(e) {
				var _oModule = self.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				//D.ToolsPanel.addHtmlCell();
				//D.cellBase.init(1);
				_oModule.removeClass('crazy-box-edit-area');
				var htmlCode, mWidth = _oModule.css('width');

				//console.log(self.iframeDoc.find('.current-edit-module'));
				self.iframeDoc.find('.current-edit-module').removeClass('current-edit-module');
				//�޸�copy���������ܶ� style BUG
				DropInPage.removeRepeatStyle(_oModule);
				//end
				_oModule.addClass('current-edit-module');
				//�õ������html���룬style script.
				htmlCode = DropInPage.getElemHtml(_oModule);
				var tabData = {};
				if($('.cell-page-main', self.iframeDoc).length) {
					tabData['from'] = 'page'
				} else {
					tabData['from'] = 'module';
				}
				//console.log(tabData);
				$.get(D.domain + '/page/box/tab_create_module.html', tabData, function(text) {
					var tmp = $('<div/>'), tabStr = '<li data-val="cell"><span class="block"><i class="icon-close"></i>����༭</span></li>';
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
						//zhuliqi Ҫд�ڻص����Ȼ�߶ȼ�������
						D.loadModule({
							'width' : mWidth
						});
						// �ڰ��ֶ�ǰ��ʼ������Դschema
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
			btnsHtml = D.box.editor.HtmlHelper.getSingerBtnsHtml(target, {
				'status' : config.status
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

			if(!(this.chooseLevel === 'layout' || this.chooseLevel === 'microlayout')) {
				this._showAttr(currentElem, this.config.status);
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
				/*this.fixHighLightEl.offset(this._getAreaOffset(el));
				this.fixHighLightEl.width(el.outerWidth());
				this.fixHighLightEl.height(el.outerHeight());*/
				//modify by hongss on 2012.01.08 for cell�¿��ظ���ǩ�������ơ����ơ����ƹ���
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

			//�����JS��ʹJSʧЧ
			el = this.jsControl.add(el);
			this.currentElem = el;
			this.fixHighLightEl.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM, el);
			this._setSingerAreaElem(el);

			//չʾ��������е�����
			this._showAttr(el, this.config.status);

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
            
            if (this.chooseLevel === 'module' && D.YunYing && D.YunYing.isYunYing === true){
                this._chooseArea(transport, this.fixCellHighLightEl);
            }
		},
        /**
		 * @methed _chooseArea ѡ��ĳ������ (������module, cell, box, row, grid, layout)
		 * @param target Ŀ��Ԫ�أ������ʵ�� moveTransport
		 * @param fixCellHighLightEl ͬthis.fixCellHighLightElһ��
		 */
        _chooseArea : function(target, fixCellHighLightEl) {
            this._handleChooseHight(target, true);
            this._hideTransport(target);
            this._hideCellLight(fixCellHighLightEl);
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
			if(elemInfo['libraryType']) {//���Ҹ��˿������ؼ�
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
						htmlCode = '<span id="crazy-box-data-loading" data-eleminfo="' + JSON.stringify(elemInfo) + '">��ȡ����ʧ�ܣ������ԣ�</span>';
					}
					if(htmlCode)
					fn.call(this, htmlCode);
				},
				error : function(o) {
					alert('��ȡ����ʧ�ܣ������ԣ�');
					return;
					//������ʾ��Ϣ
					//if(self.loading) {
						//self.loading.html('���ݼ���ʧ�ܣ������ԣ�');
					//}
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

			D.bottomAttr && D.bottomAttr.closeDialog && D.bottomAttr.closeDialog();
		},
		/**
		 *@param $arg jQuery������Ҫչʾ�ĵ�ǰ����
		 *@param status
		 */
		_showAttr : function($arg, status) {
			$(document).trigger('box.panel.attribute.attr_handle_event', [$arg, status]);

		},
		/**
		 *�滻ѡ�е������ؼ�
		 */
		replaceElement : function(newContent, className, handleEl) {
			var self = this, oldContent = self.iframeDoc.find('.' + className), _elemHtml;
			var currentParent = oldContent.parent(), eleminfo = oldContent.data('eleminfo');
			var type = D.ManagePageDate.getWidgetType(oldContent);

			handleEl = handleEl || $('li.current', '#box_choose_level');
			oldContent.removeClass('box-level-self');
			//ɾ��ԭ����ʽ�ͽű�
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

			//��¼�Ѿ������޸�
			D.BoxTools.setEdited({
				'param' : replaceSteps,
				'callback' : null
			});
			D.menuTab.removeTab(handleEl);

		}
	};
	$.extend(DropInPage, {
		/**
		 * //�޸�copy���/�ؼ�������ܶ� style BUG
		 *  @param {elem} elemΪ module/cell�ȣ�jQuery����
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
		 * @methed ɾ��module/cell��style ����style script
		 * @param {elem} elemΪ module/cell�ȣ�jQuery����
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
		 * @methed �õ�module/cell��html���� ����style script
		 * @param {elem} elemΪ module/cell�ȣ�jQuery����
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
		 *����Դ��Ƥ�� ����Դ��ͬ �������ֲ��䣬��ͬ���滻
		 */
		changeSkin : function(target, htmlcode) {
			//��Ƥ��������Դ��Ϣ����
			//console.log(target);
			var tModule = target.find('.crazy-box-module'), oDiv = $('<div/>');
			//tmpDiv.append(htmlcode);
			D.InsertHtml.init(htmlcode, oDiv, 'html', false);
			var widget = oDiv.find('.crazy-box-module');

			/**
			 *����Դ��Ƥ�� ����Դ��ͬ �������ֲ��䣬��ͬ���滻
			 */
			D.box.editor.Module.changeDataSource(tModule, widget);

			return oDiv.html();
			//����Դ����ȣ���ֱ�ӷ���ԭhtmlcode

		},
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
		 * @methed _replaceHtml �滻html����
		 * @param opts {'htmlcode':htmlcode, 'target':target, 'isExecJs':true|false, 'isEdit':true|false}
		 * @param htmlcode ��Ҫ�滻��html����
		 * @param target ��Ҫ���滻��Ŀ��Ԫ��
		 * @param isExecJs �Ƿ�ִ��JS
		 * @param isEdit �Ƿ���б༭��������ҳ���ϵģ����ڼ�¼isEdited�͡��س�������
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
		ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area', //�Զ������
		ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell', //�Զ���ؼ�
		LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red'
	};

	//Ĭ��������
	D.DropInPage.defConfig = {
		dropTransport : '#crazy-box-droptransport', //���ڴ�Ԫ�ؿ���������������϶����Ǹ�Ԫ�ص�selector
		moveTransport : '#crazy-box-movetransport', //����ҳ����Ԫ���ƶ����������������϶����Ǹ�Ԫ�ص�selector
		packageParent : '.tools-panel', //�����ﹲͬ����Ԫ�ص�selector
		iframeName : 'dcms_box_main',
		dragPackage : '.dcms-box-layoutcontent', //�������Ҫ�ŵ����������б������Ԫ�ص�selector  dcms-box-right-image
		dropArea : '.cell-page-main', //����ҳ����Ҫ�༭����  #content .cell-page-main
		editArea : '.dcms-box-center', //�༭���򣬼����iframe��Ԫ��
		mainArea : '#main_design_page',
		currentTarget : 'crazy-box-target-current',
		fixHighLight : '#crazy-box-highlight-fix', //ʾ��ѡ�к�ĸ���Ԫ��
		beforeSingerHtml : '<div class="crazy-box-before-singer">����ק����</div>', //�����б������ENABLE_BEFORE_CLASS_NAME class��
		afterSingerHtml : '<div class="crazy-box-after-singer">����ק����</div>', //�����б������ENABLE_AFTER_CLASS_NAME class��
		currentSinger : 'crazy-box-singer-current',
		levelParent : '.js-box-level', //�㼶ѡ��ĸ���Ԫ��
		chooseLevel : 'li', //�㼶ѡ���selector
		copyButton : 'bar-a-copy', //�ɸ��ư�ť��className
		newCopyButton : 'new-copy', //�ɸ��ư�ť��className
		syncModuleButton : 'sync-module', //�������������ҳ��ķ��������� 0329 qiuxiaoquan
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
		status : null, //״̬ģʽ��Ŀǰֻ�����½����޸����(newcreatemodule.js)��ʹ�ô˲������á�edit-module����ʾ�༭���״̬
		emptyModuleHtml : '<div data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;�ڱ߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;��߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;�߿�&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-module cell-module"><div data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;},&quot;editAttr&quot;:[{&quot;key&quot;:&quot;id&quot;,&quot;name&quot;:&quot;ID&quot;}]}}" class="crazy-box-content crazy-box-enable-cell"></div></div>'
	};

})(dcms, FE.dcms);
