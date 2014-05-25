/**
 * ҳ������չʾ����Ҫѡ��һ��ǩ
 * @author springyu
 * @date 2012-10-09
 */

;(function($, D, panel) {

	/**
	 * jQuery�������������������
	 */
	panel.attribute.AttrHandle = {
		/**
		 *���ͱ�ǩ����  ��Ӫ����
		 */
		yunYingHandle : function($arg, status) {
			//��������ڴ�����Ϣ��Ԫ�ز����Խ����޸�
            if ($arg.closest('.'+D.box.editor.config.CLASS_ERROR_MESSAGE)[0]){
                return;
            }
            
            var that = this, cf, elemHandles;
			if($arg.length <= 0 || $arg.hasClass('crazy-box-chagenTarget') 
			//
				|| ($arg.hasClass('crazy-box-module') && (!status||status==='edit-module')) || $arg.hasClass('crazy-box-content')) {
				return;
			}

			//�Ա�ǩ�����⴦��
			that._special($arg);
            //���ױ༭���¶�������������⴦�� add by hongss on 2013.08.12
            that._juniorSpecial($arg);
			/**
			 * �ж��Ƿ񲼾�Ԫ�� layout grid box row cell(module)
			 */
			cf = D.bottomAttr.checkFrame($arg);
			//����������
			elemHandles = that._handle($arg, cf && cf.isFrame);

			if(elemHandles && elemHandles.length) {
				that._yunYingPostHandle.call(that, elemHandles);
			}
		},
		/**
		 * չʾ����������   ��Ӫ����
		 */
		_yunYingPostHandle : function(elemHandles) {
			var that = this, attrList, elem;
			/**
			 * �ѿ��������Է���ҳ��ķ���
			 * @param {object} arr ���������� ����
			 * @param {object} selfParent �����Ԫ��
			 */
			var createAttrTab = function(arr, selfParent) {
				//console.log(selfParent);
				if(arr && arr.length > 0) {
					if(!arr.dsmoduleid) {

						for(var i = 0; i < arr.length; i++) {
							var _arr = arr[i];

							// console.log(i);
							var oDiv = $('<div class="attr-content"></div>');
							if(_arr) {
								for(var n = 0; n < _arr.length; n++) {
									var $attrType = $(_arr[n]);
									if($attrType.hasClass('font-attr')
									//
									|| $attrType.hasClass('link-attr')
									//
									|| $attrType.hasClass('image-attr')
									//
									|| $attrType.hasClass('background-attr') || $attrType.hasClass('select-attr')
									//
									|| ($attrType.hasClass('height-width-attr') && ($('input', $attrType).data(D.bottomAttr.ATTRIBUTE.EDITATTR) === 'id' || $('input', $attrType).data('key') === 'padding-top'))) {
										oDiv.append(_arr[n]);
									}
								}
							}
							selfParent.append(oDiv);
							//oDiv.prependTo();
						}
					}
				}
			};
			var $Dialog = $('.js-dialog'), title = '��������';
			$('footer', $Dialog).show();
			$('.btn-submit', $Dialog).show();
			$('.btn-cancel', $Dialog).hide();
			$('section', $Dialog).empty();

			if(elemHandles && elemHandles.length) {

				attrList = elemHandles[0];
				elem = attrList.elem;
				if(elem.hasClass(D.bottomAttr.CLASSATTR.main) || elem.hasClass(D.bottomAttr.CLASSATTR.gridsMain)) {
					title = 'ҳ�汳��';
				}
				
                var moduleNameHtml = '';
                if(elem.hasClass('crazy-box-module')) {
					title = '�������';
                    
                    //����������Ƶ���ʾ add by hongss on 2013.09.15
                    var moduleInfo = elem.data(D.box.editor.config.ELEMENT_DATA_INFO),
                        moduleName = moduleInfo.name, 
                        moduleId = moduleInfo.id, editModuleUrl,
                        isYunYing = $('#isYunYing').val();
                    switch (D.BoxTools.getModuleType(elem)){
                        case D.box.editor.config.MODULE_TYPE_OPTION :
                            editModuleUrl = 'create_code_module.html';
                            break;
                        case D.box.editor.config.MODULE_TYPE_LABELEDIT :
                            editModuleUrl = 'new_create_module.html';
                            break;
                    }
                    editModuleUrl = editModuleUrl + '?moduleId='+moduleId;
                    moduleNameHtml = '<div class="attr-type"><span class="height-attr">�������</span><a target="_blank" href="'+editModuleUrl+'">'+moduleName+'</a></div>';
                    
                    if (isYunYing==='true'){  //��Ӫ�༭Ȩ�޵���Ա������
                        moduleNameHtml = '<div class="attr-type"><span class="height-attr">�������</span><span>'+moduleName+'</span></div>';
                    }
                    
				}
                
                
				D.Msg['confirm']({
					'title' : title,
					'body' : '<div class="dcms-box-attr"><div class="attr">'+moduleNameHtml+'</div></div>',
                    'onlymsg':true
				});
				if(attrList) {
					var $attr = $('.attr', '.js-dialog');
					for(var title in attrList) {
						var arr = attrList[title];
						switch(title) {
							case D.bottomAttr.ATTR.text:

								createAttrTab(arr, $attr);
								break;
							case D.bottomAttr.ATTR.image:
								createAttrTab(arr, $attr);

								break;
							case D.bottomAttr.ATTR.connect:
								createAttrTab(arr, $attr);
								break;
							case D.bottomAttr.ATTR.background:
								if(elem.hasClass('crazy-box-module') || elem.hasClass('cell-page-main') || elem.hasClass('cell-page-grids-main')) {
									createAttrTab(arr, $attr);
								}
								break;
							case 'margin':
								if(elem.hasClass('crazy-box-module')) {
									createAttrTab(arr, $attr);
								}
								break;
							case D.bottomAttr.ATTR.other:
								createAttrTab(arr, $attr);
								break;
							default:
								break;
						}
					}

				}
				//���Ԫ�صĸ��ڵ���a��ǩ������ӪҲ���Ա༭
				var $elemParent = elem.parent();
				if($elemParent.is('a')) {
					D.BoxTools.addBoxOptions($elemParent, 'ability', {
						"editAttr" : [{
							"key" : "target",
							"name" : "target����",
							"type" : "select",
							"val" : {
								"_blank" : "�´���",
								"_self" : "��ǰҳ"
							}
						}]
					});
					attrList = that.execOption(null, $elemParent);
					if(attrList) {
						createAttrTab(attrList['connect'], $attr);
						createAttrTab(attrList['other'], $attr);
					}

				}
			}
			D.bottomAttr.bindAttr();
			//D.bottomAttr.bind.init();
			//console.log($('#attach'));
			$('#attach').css('margin', '0');
		},
		/**
		 *���ͱ�ǩ����
		 */
		handle : function($arg, status) {
			//��������ڴ�����Ϣ��Ԫ�ز����Խ����޸�
            if ($arg.closest('.'+D.box.editor.config.CLASS_ERROR_MESSAGE)[0]){
                return;
            }
            
            var that = this, cf, elemHandles;
			if($arg.length <= 0) {
				return;
			}

			//�Ա�ǩ�����⴦��
			that._special($arg);
			/**
			 * �ж��Ƿ񲼾�Ԫ�� layout grid box row cell(module)
			 */
			cf = D.bottomAttr.checkFrame($arg);
			//����������֮ǰ����ҵ���߼�
			that._preHandle($arg, status, cf && cf.isFrame);
			//����������
			elemHandles = that._handle($arg, cf && cf.isFrame);

			if(elemHandles && elemHandles.length) {
				that._postHandle.call(that, elemHandles);
			}

		},
        /**
         * �ڼ��ױ༭���¶���������⴦��ȥ������id�����������������
         *
        */
        _juniorSpecial: function($arg){
            //��������Ȼ������ʽ�޸�
            if ($arg.hasClass('crazy-box-module') && !$arg.closest('.crazy-box-banner')[0]){
                var boxOptions = $arg.data('boxoptions');
                boxOptions['css'] = [];
                $arg.data('boxoptions', boxOptions);
            }
        },
		/**
		 * ��ѡ�е�ǰԪ����һЩ���⴦���磺ͼƬ�Զ���ͼƬ�������a��ǩ��href�������.
		 */
		_special : function($arg) {
			var that = this, boxOptions = $arg.data('boxoptions'), boxParam = $arg.data('boxparam');
			;
			/**
			 * ����Ԫ�ؼ���
			 */
			D.bottomAttr.removeLevel($arg);
			D.bottomAttr.setLevel($arg, 'self');
			/**
			 * Ĭ���ı��Զ���������
			 */
			D.bottomAttr.handleImage($arg);
			/**
			 * Ĭ���ı��Զ���������
			 */
			D.bottomAttr.handleText($arg);
			if($arg.is('a')) {
				if(!$arg.attr('target')) {
					$arg.attr('target', '_self');
				}

				that._delEditAttr(boxOptions, 'target');

				D.BoxTools.addBoxOptions($arg, 'ability', {
					"editAttr" : [{
						"key" : "target",
						"name" : "target����",
						"type" : "select",
						"val" : {
							"_blank" : "�´���",
							"_self" : "��ǰҳ"
						}
					}]
				});
			}
			if($arg.hasClass('crazy-box-layout') && $arg.hasClass('layout-fixed-right')) {
				D.BoxTools.addBoxOptions($arg, 'ability', {
					"editAttr" : [{
						"key" : "data-postion.yOffset",
						"name" : "����ƫ��",
						"css" : JSON.parse('{"width":"30px"}')
					}, {
						"key" : "data-postion.xOffset",
						"name" : "����ƫ��",
						"css" : JSON.parse('{"width":"30px"}')
					}, {
						"key" : "data-postion.isAlwaysShow",
						"name" : "�Ƿ��ڸ�",
						"type" : 'select',
						"css" : JSON.parse('{"width":"60px"}'),
						"val" : JSON.parse('{"1":"�ڸ�","0":"����"}')
					}, {
						"key" : "data-postion.topLimitShow",
						"name" : "������Ϊ",
						"type" : 'select',
						"css" : JSON.parse('{"width":"60px"}'),
						"val" : JSON.parse('{"100":"Ĭ��","200":"200����","300":"300����","350":"350����","400":"400����","450":"450����","500":"500����","550":"550����","600":"600����"}')
					}]
				});
			}
			if($arg.hasClass('crazy-box-layout')) {
				D.BoxTools.addBoxOptions($arg, 'ability', {
					"editAttr" : [{
						"key" : "data-eleminfo.tag",
						"name" : "��ǩ"
					}]
				});
			}

			if($arg.hasClass('crazy-box-module')) {
				//ɾ������������е�ID������ͳһ���

				if(boxOptions) {
					that._delEditAttr(boxOptions, 'id');
				}
				D.BoxTools.addBoxOptions($arg, 'css', {
					"key" : "background",
					"name" : "����",
					"type" : "background"
				});

				D.BoxTools.addBoxOptions($arg, 'ability', {
					"editAttr" : [{
						"key" : "data-eleminfo.tag",
						"name" : "��ǩ"
					}]
				});

				D.BoxTools.addBoxOptions($arg, 'ability', {
					"editAttr" : [{
						"key" : "id",
						"name" : "¥��ID"
					}]
				});
				//
				if(boxParam) {
					if(boxParam.name) {
						D.BoxTools.addBoxOptions($arg, 'ability', {
							"editAttr" : [{
								"key" : "data-boxparam.name",
								"name" : '����'
							}]
						});
					}
					if(boxParam.keywords) {
						D.BoxTools.addBoxOptions($arg, 'ability', {
							"editAttr" : [{
								"key" : "data-boxparam.keywords",
								"name" : '�ؼ���'
							}]
						});
					}

					if(boxParam.config) {
						for(var key in boxParam.config) {
							if( typeof boxParam.config[key] === 'string') {
								if(key === 'name') {
									that._delEditAttr(boxOptions, 'data-boxparam.name');
								}
								if(key === 'keywords') {
									that._delEditAttr(boxOptions, 'data-boxparam.keywords');
								}
								D.BoxTools.addBoxOptions($arg, 'ability', {
									"editAttr" : [{
										"key" : "data-boxparam." + key,
										"name" : boxParam.config[key]
									}]
								});
							}
						}
					}

				}
				var $banner = !$arg.closest('.crazy-box-banner').length ?
				//
				$arg.closest('#crazy-box-banner') : $arg.closest('.crazy-box-banner');
				if($banner && $banner.length) {
					D.BoxTools.addBoxOptions($arg, 'css', {
						"key" : "height",
						"name" : "�߶�",
						"type" : "input"
					});
					D.BoxTools.addBoxOptions($arg, 'css', {
						"key" : "width",
						"name" : "���",
						"type" : "input"
					});
					//ͨ���е�����߶�Ϊ0���������޸����ڱ߾�
					!parseInt($arg.css('height')) && D.BoxTools.addBoxOptions($arg, 'css', {
						"key" : "padding-top",
						"name" : "����߶�",
						"type" : "input"
					});
				}
			}
		},
		/**
		 *ɾ���ɱ༭������ָ��������
		 */
		_delEditAttr : function(boxOptions, key) {
			if(boxOptions && boxOptions.ability && boxOptions.ability.editAttr) {
				var editAttr = boxOptions.ability.editAttr;
				for(var i = 0; i < editAttr.length; i++) {
					var attr = editAttr[i];
					if(attr && attr.key === key) {
						editAttr.splice(i, 1);
					}
				}
			}
		},

		//����������֮ǰ����ҵ���߼� �磺ѡ�б�ǩ������˵������仯
		_preHandle : function($arg, status, isFrame) {
			if(isFrame) {
				//���ݴ���Ԫ�أ�չʾ��ͬ�˵�
				if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {//module
					//��eidt-module��˵�����½���༭���ҳ���еĳ�ʼ״̬
					if(status && status === 'edit-module') {
						D.ToolsPanel.addHtmlEModule();
					} else if(status && status === 'edit-template-layout') {//�½����� ����չʾ
						D.ToolsPanel.addHtmlLayoutModule();
					} else if(status && status === 'edit-template') {//�½�ģ�� ����չʾ
						D.ToolsPanel.addHtmlTemplateModule();
						$('#change_background').parent().show();
						$('#change_template').parent().show();
						$('#change_page_grids').parent().show();
					} else if(status && status === 'edit-page') {//�½�ҳ�� ����չʾ
						D.ToolsPanel.addHtmlPageModule();
						$('#change_page_grids').parent().show();
					} else if(status && status === 'specialTools') {
						D.ToolsPanel.addHtmlPageToolsSpecail();
						$('#change_background').parent().show();
						$('#change_template').parent().show();
						$('#change_page_grids').parent().show();
					} else {
						D.ToolsPanel.addHtmlModule();
						$('#change_background').parent().show();
						$('#change_template').parent().show();
						//$('#change_page_grids').parent().show();

					}
					// ��ȡModule�Ĳ���(��tag)
					var param = $arg.data("eleminfo") || {};
					if(!param.tag) {
						param.tag = "";
					}
					if(param.width !== parseInt($arg.css('width'))) {
						param.width = parseInt($arg.css('width'));
					}

					panel.library.Module.init(param);

				}
				if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {//cell
					D.ToolsPanel.addHtmlCell();
					panel.library.Cell.init(1);
					var $navCellAttrEditParent = $('#nav_cell_attr_edit').parent(),
					//
					$siblings = $navCellAttrEditParent.siblings(), $cellLibraryParent = $('#cell_library').parent();
					$siblings.hide();
					$siblings.removeClass('current');
					$('.panel-cell-content').hide();
					$cellLibraryParent.show();

					$('.panel-edit-attr').show();
					$navCellAttrEditParent.addClass('current');
					$navCellAttrEditParent.show();
					$cellLibraryParent.show();

				}

			} else {
				D.ToolsPanel.addHtmlLabel();
			}

		},

		/**
		 * �����ǩ��������������б���
		 */
		_handle : function($arg, isFrame) {
			var self = this, labelList = [], attrList = {}, elemHandles = [], frame = '';

			if(isFrame) {
				//����Ԫ�� layout grid box row cell(module)
				frame = D.bottomAttr.CONSTANTS['frame'];
				if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {//cell����Ƕ�ף����ÿ��Ƕ�׵ı�ǩ
					labelList = D.bottomAttr.searchCellList($arg);
				} else {
					if($arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
						D.bottomAttr.setConfig($arg, 'config');
					}
					labelList.push($arg);
				}
			} else {
				//��ǩ
				/**
				 * ��ǰԪ�����и��ڵ�
				 */
				if(D.YunYing && D.YunYing.isYunYing) {//��Ӫ��������Ҫ�鸸�ڵ� ֻ������ǰ�ڵ�
					D.bottomAttr.setConfig($arg, 'config');
					labelList.push($arg);
				} else {
					labelList = self._searchBoxOption($arg);
				}

			}

			if(labelList && labelList.length) {
				for(var i = 0; i < labelList.length; i++) {
					var _self = $(labelList[i]);
					if(_self.data('config')) {
						//ÿ����ǩ�Ŀ�������
						attrList = self._execOption(frame, _self);
					} else {
						attrList = {};
					}
					attrList['elem'] = _self;
					elemHandles.push(attrList);

				}

			}
			return elemHandles;
		},

		/**
		 * չʾ����������
		 */
		_postHandle : function(elemHandles) {
			var layoutTab = $('div.attr-elem-layout'), attrList, elem, index = 0;
			if(elemHandles && elemHandles.length) {
				//��ǩǶ�ײ�layout
				layoutTab.empty();
				for(var i = 0; i < elemHandles.length; i++) {
					attrList = elemHandles[i];
					elem = attrList.elem;
					if(elem.hasClass(D.bottomAttr.CLASSATTR.main) || elem.hasClass(D.bottomAttr.CLASSATTR.gridsMain)) {
						D.bottomAttr.handleBackground(attrList, elem);
						return;
					}
					if(elem.data('level') !== 'self') {
						index++;
					}
					layoutTab.append(D.BoxAttr.createLevelElem(elem, attrList, index));
				}
			}
			//Ĭ����ʾ��ǰ��ǩ
			var curr = $('span.e-elem', 'div.attr-elem-layout div.current');
			//console.log(curr);
			D.BoxAttr.handleAttr(curr);

		},

		/**
		 * 1.���ұ�ǩ���ڵ㣬���������и��ڵ�[]
		 * return [];
		 * 2.�������ñ�ǩ�����ϱ��
		 *
		 * 3.���뱣���ǩ��module��cell��ǩ�ڵ��ӱ�ǩ
		 */
		_searchBoxOption : function($label) {
			var arr = arguments[1], selfParent;
			arr = arr || [];
			/**
			 * ����ͼƬ
			 */
			D.bottomAttr.handleImage($label);
			/**
			 * Ĭ���ı��Զ���������
			 */
			D.bottomAttr.handleText($label);

			//console.log($label.data(D.bottomAttr.CONSTANTS['boxOptions']));
			//&& !$label.is('a')
			if($label.data(D.bottomAttr.CONSTANTS['boxOptions']) || $label.is('a')) {
				//$label.data('config', 'config');
				//console.log($label);
				D.bottomAttr.setConfig($label, 'config');
			}
			arr.push($label);
			//���ڱ�ǩclassΪcell ����
			selfParent = $label.parent();

			//if((selfParent.hasClass(classAttr.module)) || ($label.hasClass(classAttr.cell) && !(selfParent.hasClass(classAttr.module)))) {
			if(selfParent.hasClass(D.bottomAttr.CLASSATTR.cell)) {
				return arr;
			} else {
				if(selfParent && selfParent.length > 0 && !D.bottomAttr.checkFrame(selfParent).isFrame) {
					return arguments.callee(selfParent, arr);
				}
			}
			//���ڵ㲻���ڻ򸸽ڵ�Ϊ����Ԫ�� �˳�
			return null;
		},
		//�ⲿʹ��
		execOption : function(execType, $arg) {
			return this._execOption(execType, $arg);
		},
		/**
		 * �ڲ�ʹ�ã�����boxoption
		 */
		_execOption : function(execType, $arg) {
			var boxOption = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), $html, dsModuleId;
			var ability, repeat, del, container, editAttr, cssObj, localStorage, attrAreaDs = [];
			var attrAreaText = [], attrAreaImage = [], attrAreaSize = [], attrAreaConnect = [], attrAreaBackground = [];
			var attrAreaBorder = [], attrAreaMargin = [], attrAreaRepeat = [], attrAreaDsmodel = [], attrAreaOther = [];
			var that = this;

			if(boxOption) {
				/**
				 * css
				 */
				cssObj = boxOption.css;
				//console.log(cssObj);
				if(cssObj) {
					for(var i = 0; i < cssObj.length; i++) {
						var val, self = cssObj[i], isDisable;
						if(self.type === D.bottomAttr.ATTRIBUTE.GINPUTS) {
							self.type = D.bottomAttr.ATTRIBUTE.GINPUT;
						}
						$html = D.bottomAttr.getHtml(self.type);
						$('.labelText', $html).html(self.name + D.bottomAttr.CONSTANTS.colon);
						val = self.val;
						$html.data(D.bottomAttr.CONSTANTS['extra'], {
							"obj" : $arg,
							"key" : self.key,
							"type" : self.type,
							"pseudo" : self.pseudo
						});
						D.bottomAttr.handleAutocratic(self, $arg, $html);
						//handle boxoptions
						switch(self.type) {
							case D.bottomAttr.ATTRIBUTE.COLOR:
								val = $arg.css(self.key).colorHex();
								var bVal;
								if(val === 'ransparent' || val === 'transparent') {
									bVal = 'transparent';
								} else {
									bVal = '#' + val;
								}
								$('span.color-preview', $html).css('background-color', bVal);
								$('input.color-box', $html).val(val);
								//console.log(self.key);
								if(self.key === 'background-color') {
									attrAreaBackground.push($html);
								} else if(self.key === 'border-color') {
									attrAreaBorder.push($html);
								} else {
									attrAreaConnect.push($html);
								}

								break;
							case D.bottomAttr.ATTRIBUTE.BACKGROUND:
								this._background($arg, $html);
								attrAreaBackground.push($html);
								break;
							case D.bottomAttr.ATTRIBUTE.BORDER:
								this._border($arg, $html);
								attrAreaBorder.push($html);
								break;
							case D.bottomAttr.ATTRIBUTE.GINPUT:
								this._ginput(self, $arg, $html);
								attrAreaMargin.push($html);
								break;
							case D.bottomAttr.ATTRIBUTE.GINPUTS:
								this._ginput(self, $arg, $html);
								attrAreaMargin.push($html);
								break;
							case 'select':
								var _$select = $('select[name=attr-select]', $html);
								this._select(self, $arg, $html);
								_$select.val($arg.css(self.key));
								attrAreaOther.push($html);
								break;
							case D.bottomAttr.ATTRIBUTE.INPUT:
								this._input(self, $arg, $html);
								var reg = /^(margin|padding|MARGIN|PADDING)/;

								if(reg.test(self.key)) {
									attrAreaMargin.push($html);
								} else {
									attrAreaSize.push($html);
								}
								break;
							case D.bottomAttr.ATTRIBUTE.IMAGE:
								dsModuleId = this._getDs($arg);

								if(dsModuleId && dsModuleId !== 0) {
									var $htmlDS = D.bottomAttr.getHtml('dsimage');
									$htmlDS.data(D.bottomAttr.CONSTANTS['extra'], {
										'obj' : $arg
									});
									var _select = $('select', $htmlDS);
									_select.each(function(index, obj) {
										var _self = $(obj);
										_self.data('dsmoduleid', dsModuleId);
										that._initSelector(_self, dsModuleId, that._getDsoptions($arg, _self.attr('name')));
									});

									$htmlDS.data('css', 'no');
									attrAreaDsmodel.push($htmlDS);
								}
								this._image($arg, $html);
								attrAreaImage.push($html);

								break;
							case D.bottomAttr.ATTRIBUTE.TEXT:
								dsModuleId = this._getDs($arg);

								if(dsModuleId && dsModuleId !== 0) {
									var $htmlDS = D.bottomAttr.getHtml('dstext');
									$htmlDS.data(D.bottomAttr.CONSTANTS['extra'], {
										'obj' : $arg
									});
									var _select = $('select', $htmlDS);
									_select.data('dsmoduleid', dsModuleId);
									var showValue = that._getDsoptions($arg, 'text');
									that._initSelector(_select, dsModuleId, showValue);
									//��ʼ��select
									var _input = $('input', $htmlDS);
									var length = that._getDsoptions($arg, 'length')
									if(_input && length) {
										_input.attr('value', length);
										//��ʼ��input  ֵ
									}
									$htmlDS.data('css', 'no');
									attrAreaDsmodel.push($htmlDS);
								}
								this._text($arg, $html);
								attrAreaText.push($html);
								break;
							default:

								break;

						}

						//console.log($html.data(D.bottomAttr.CONSTANTS['extra']));
						/**if(self.type === D.bottomAttr.ATTRIBUTE.TEXT) {
						 attrAreaContent['_text'] = $html;
						 } else if(self.type === D.bottomAttr.ATTRIBUTE.IMAGE) {
						 attrAreaContent['_image'] = $html;
						 } else {
						 attrAreaStyle.push($html);
						 }**/

					}
					//end each
				}
				//$arg Ϊ�ؼ� ���⴦�� �߼����£���$arg�ǿؼ������������ؼ�������ظ��˿ؼ�,
				// �ظ��ǰѵ�ǰ�ؼ��ŵ������ؼ���ȥ��Ȼ���ظ���ǰ�ؼ��ĸ��ڵ㣬
				//ʵ�ַ����Ǻ�ԭ������һ����ֻ�����ַ����ǳ�������ԭ�����˹�����
				if($arg.hasClass(D.bottomAttr.CLASSATTR.cell) && !$arg.hasClass('cell-ul-containter')) {
					var _$argParent = $arg.parent(), repeatNum = 1;
					//��ȡ�����ؼ���־
					var _cell = _$argParent.data(D.bottomAttr.CLASSATTR.containerCell);
					//�����ؼ���������
					var _boxOptionParent = _$argParent.data(D.bottomAttr.CONSTANTS['boxOptions']);
					var _ability = _boxOptionParent.ability, _repeat = '', _relative = '';
					//����������ؼ������ѯ�����ظ������ؼ�
					if(_cell === D.bottomAttr.CLASSATTR.containerCell) {
						//����������ؼ� �϶�����ability���ԣ�
						if(_ability) {
							_repeat = _ability.copy;
							//�ж��Ƿ���ظ� _repeat.enable === 'true'��ʾ���ظ�
							if(_repeat && _repeat.enable && _repeat.enable === 'true') {
								_relative = _repeat.relative;
								var editClassName = D.BoxTools.getClassName(_$argParent, D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG);
								repeatNum += _$argParent.siblings('.' + editClassName).length;

							}
						}
					}

					$html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.INPUT);
					$('.labelText', $html).html('�����ظ�' + D.bottomAttr.CONSTANTS.colon);
					//console.log(repeatNum);
					$('input', $html).val(repeatNum);
					//$('span.repeat-tip', $html).append('<a>OK</a>');
					dsModuleId = this._getDs($arg);
					$html.attr('data-dsmoduleid', dsModuleId);

					$html.data(D.bottomAttr.CONSTANTS['extra'], {
						"obj" : $arg, //��ǰԪ��
						"key" : "copy",
						"type" : D.bottomAttr.ATTRIBUTE.INPUT,
						"enableType" : 'cell', //���ظ��ؼ�
						"relative" : _relative
					});
					// console.log($arg)
					attrAreaRepeat.push($html);

				}
				/**
				 * �߼�����
				 */
				ability = boxOption.ability;

				if(ability) {
					//console.log(ability);
					var conCell = $arg.data(D.bottomAttr.CLASSATTR.containerCell);

					if(conCell === D.bottomAttr.CLASSATTR.containerCell || D.bottomAttr.CONSTANTS['frame'] !== execType) {
						repeat = ability.copy;

						if(repeat && repeat.enable && repeat.enable === 'true') {
							$html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.INPUT);
							/**
							 * ����Ҫר��cssѡ��
							 */
							$html.data('css', 'no');
							var editClassName = D.BoxTools.getClassName($arg, D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG);
							var siblings = $arg.parent().children('.' + editClassName).length;
							//for(var attr in repeat) {
							$('.labelText', $html).html('�����ظ�' + D.bottomAttr.CONSTANTS.colon);
							if(siblings) {
								$('input', $html).val(parseInt(siblings));
							} else {
								$('input', $html).val('');
							}

							// $('span.repeat-tip', $html).append('<a>OK</a>');
							dsModuleId = this._getDs($arg);
							$html.attr('data-dsmoduleid', dsModuleId);
							if(dsModuleId && dsModuleId !== 0) {
								var _module = $arg.closest('.crazy-box-module');
								$html.append('������Դ��ѯ�����ظ�<input type="checkbox" class="ds-box-repeat">');
								//console.log(_module.data('dsrepeatbyrow'));
								if(_module.data('dsrepeatbyrow')) {
									$('.ds-box-repeat', $html).attr('checked', 'checked');
								}

							}
							//}
							$html.data(D.bottomAttr.CONSTANTS['extra'], {
								"obj" : $arg,
								"key" : "copy",
								"type" : D.bottomAttr.ATTRIBUTE.INPUT,
								"relative" : repeat.relative
							});
							attrAreaRepeat.push($html);
						}
					}

					//container = ablity.container;
					editAttr = ability.editAttr;
					if(editAttr) {
						//$html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.INPUT);
						//$html.data(D.bottomAttr.CONSTANTS['extra'], {
						//	"obj" : $arg,
						//	"key" : D.bottomAttr.ATTRIBUTE.EDITATTR,
						//	"type" : D.bottomAttr.ATTRIBUTE.INPUT
						//});
						//$html.data('css', 'no');
						for(var p = 0; p < editAttr.length; p++) {
							var val, eAttr = editAttr[p], isDisable;
							if(!eAttr.type) {
								eAttr.type = D.bottomAttr.ATTRIBUTE.INPUT;
							}
							$html = D.bottomAttr.getHtml(eAttr.type);
							$('.labelText', $html).html(eAttr.name + D.bottomAttr.CONSTANTS.colon);
							val = eAttr.val;
							$html.data(D.bottomAttr.CONSTANTS['extra'], {
								"obj" : $arg,
								"key" : D.bottomAttr.ATTRIBUTE.EDITATTR,
								"type" : eAttr.type,
								"pseudo" : eAttr.pseudo
							});
							//D.bottomAttr.handleAutocratic(eAttr, $arg, $html);
							var realKey = eAttr.key, textValue = $arg.attr(realKey);
							if(!realKey.indexOf("data-")) {//�Զ������� ֧�������ռ��� data-eleminfo.tag (data-eleminfo={tag:'aaa})
								var keys = realKey.split('.'), object = {};
								realKey = keys[0];
								object = $arg.attr(realKey) ? JSON.parse($arg.attr(realKey)) : {};
								if(!$.isEmptyObject(object)) {
									for(var i = 1; i < keys.length; i++) {
										if(i === keys.length - 1) {
											textValue = object[keys[i]];
										} else {
											object = object[keys[i]];
										}
									};
								}
							} else if(realKey === 'class') {
								var _valObj = eAttr.val;
								for(var _name in _valObj) {
									if($arg.hasClass(_name)) {
										textValue = _name;
										break;
									}
								}
							}
							if(eAttr.type && eAttr.type == "select") {
								var _$select = $('select', $html);
								_$select.data(D.bottomAttr.ATTRIBUTE.EDITATTR, eAttr.key);
								this._select(eAttr, $arg, $html);
								_$select.val(textValue);
								attrAreaOther.push($html);
							} else {
								$('.labelText', $html).html(eAttr.name + D.bottomAttr.CONSTANTS.colon);
								var _$input = $('input', $html);
								_$input.data(D.bottomAttr.ATTRIBUTE.EDITATTR, eAttr.key);
								if(eAttr.css) {
									_$input.css(eAttr.css);
								} else if(eAttr.className) {
									_$input.addClass(eAttr.className);
								} else {
									_$input.addClass('edit-attr');
								}
								_$input.val(textValue);
								attrAreaOther.push($html);
							}
						}
					}
					del = ability["delete"];
					if(del && del.enable && del.enable === 'true') {
						//if(attrAreaStyle && attrAreaStyle.length === 0) {
						$html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.CHECK);
						$html.data('css', 'no');
						$html.data(D.bottomAttr.CONSTANTS['extra'], {
							"obj" : $arg,
							"key" : "delete",
							"type" : D.bottomAttr.ATTRIBUTE.CHECK,
							"relative" : del.relative
						});
						attrAreaOther.push($html);
					}
				}
			}
			this._moduleHandle($arg, attrAreaDs);
			// /����A��ǩ����Ҫ���A
			this._linkHandle($arg, attrAreaConnect);
			this._dslink($arg, attrAreaDsmodel);
			return {
				'text' : attrAreaText,
				'image' : attrAreaImage,
				'size' : attrAreaSize,
				'connect' : attrAreaConnect,
				'background' : attrAreaBackground,
				'border' : attrAreaBorder,
				'margin' : attrAreaMargin,
				'repeat' : attrAreaRepeat,
				'dsmodel' : attrAreaDsmodel,
				'datasource' : attrAreaDs,
				'other' : attrAreaOther
			};
		},
		_moduleHandle : function($arg, attrAreaDs) {
			if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {
				var _height = '454px';
				// chrome������߶ȵ��߲��ܸ��Ǻ��������
				if($.browser.safari) {
					_height = '534px';
				}
				// ��ʼ������Դ��ҳ���ܣ���iframe
				var _text = '<div class="attr-type dsmodule-attr">';
				_text += '<iframe id="dsModuleIframe" name="dsModuleIframe" frameborder="0" style="width:200px;height:' + _height + ';"  src="' + D.domain + '/page/ds/box/dsModule.html"' + '  ></iframe>';
				_text += '</div>';
				var $html = $(_text);
				//var dsmoduleid = $arg.data('dsmoduleid');
				$html.data(D.bottomAttr.CONSTANTS['extra'], {
					//'dsmoduleid' : dsmoduleid,
					'obj' : $arg
				});
				attrAreaDs.push($html);

			}
		},
		/**
		 * ��̬�󶨳���
		 */
		_dslink : function($arg, attrAreaDsmodel) {
			var that = this;
			if($arg.is('a')) {
				dsModuleId = this._getDs($arg);
				if(dsModuleId && dsModuleId !== 0) {
					var $html = D.bottomAttr.getHtml('dslink');
					$html.data('css', 'no');
					$html.data(D.bottomAttr.CONSTANTS['extra'], {
						'obj' : $arg
					});
					var _select = $('select', $html);
					_select.each(function(index, obj) {
						var _self = $(obj);
						_self.data('dsmoduleid', dsModuleId);
						that._initSelector(_self, dsModuleId, that._getDsoptions($arg, _self.attr('name')));
					});

					$html.data('css', 'no');
					attrAreaDsmodel.push($html);
				}

			}
		},
		//get tagName data model
		_getDsoptions : function($arg, type) {
			var dsoptions = $arg.data('dsoptions'), json;
			if(dsoptions) {
				switch(type) {
					case 'length':
						if(dsoptions.text) {
							json = dsoptions.text.length;
						}
						break;
					case 'text':
						if(dsoptions.text) {
							json = dsoptions.text.field;
						}
						break;
					case 'img-url':
						if(dsoptions.src) {
							json = dsoptions.src.field;
						}
						break;
					case 'img-alt':
						if(dsoptions.alt) {
							json = dsoptions.alt.field
						}
						break;
					case 'link-href':
						if(dsoptions.href) {
							json = dsoptions.href.field;
						}
						break;
					case 'link-title':
						if(dsoptions.title) {
							json = dsoptions.title.field
						}
						break;
					default:
						break;
				}

			}
			//console.log(json);
			return json;
		},
		/**
		 * ����A��ǩ����Ҫ���A
		 */
		_linkHandle : function($arg, attrAreaConnect) {
			var $html = D.bottomAttr.getHtml('connect');
			/**
			 * ��ǩ����
			 */
			if($arg.is('a')) {
				var _linkHref = $('#link-href', $html);
				var _linkTitle = $('#link-title', $html);

				_linkHref.val($arg.attr('href'));
				_linkHref.removeClass('readonly');
				_linkHref.removeAttr('readonly');
				_linkTitle.val($arg.attr('title'));
				_linkTitle.removeClass('readonly');
				_linkTitle.removeAttr('readonly');
				$('input[name=attr-link]', $html).attr('checked', true);

				$html.data(D.bottomAttr.CONSTANTS['extra'], {
					"obj" : $arg,
					"key" : "href",
					"type" : 'connect'
				});
				attrAreaConnect.push($html);
			}
			if(($arg.get(0).tagName === 'img' || $arg.get(0).tagName === 'IMG') && !$arg.parent().is('a')) {
				$html.data(D.bottomAttr.CONSTANTS['extra'], {
					"obj" : $arg,
					"key" : "href",
					"type" : 'connect'
				});
				attrAreaConnect.push($html);
			}
			if(D.bottomAttr.isHasText($arg) && !$arg.parent().is('a') && !($arg.is('img') || $arg.is('IMG') || $arg.is('a'))) {
				$html.data(D.bottomAttr.CONSTANTS['extra'], {
					"obj" : $arg,
					"key" : "href",
					"type" : 'connect'
				});
				attrAreaConnect.push($html);
			}
		},
		_image : function($arg, $html) {
			$('input[name=alt]', $html).val($arg.attr('alt'));
			$('div.uploads', $html).data('url', $arg.attr('src'));
		},
		_text : function($arg, $html) {
			var _color = $arg.css(D.bottomAttr.CSS.color).colorHex();
			var bVal;
			if(_color === 'ransparent' || _color === 'transparent') {
				bVal = 'transparent';
			} else {
				bVal = '#' + _color;
			}
			$('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bVal);
			$('input.color-box', $html).val(_color);
			$('select.font-size', $html).val($arg.css(D.bottomAttr.CSS.fontSize));
			var ff = $arg.css(D.bottomAttr.CSS.fontFamily);
			if(ff.indexOf(D.bottomAttr.CONSTANTS.song) !== -1) {
				$('select.font-family', $html).val(D.bottomAttr.CONSTANTS.song);
			}
			if(ff.indexOf(D.bottomAttr.CONSTANTS.microsoft) !== -1) {
				$('select.font-family', $html).val(D.bottomAttr.CONSTANTS.microsoft);
			}
			var fontBold = $arg.css(D.bottomAttr.CSS.fontBold);
			if(fontBold === 'bold') {
				$('span.font-bold', $html).data(D.bottomAttr.CONSTANTS.selected, D.bottomAttr.CONSTANTS.selected);
			}
			$('#box-bottom-text', $html).val($.trim($arg.html()));
		},
		_select : function(self, $arg, $html) {
			var _val = self.val, title, _options = '<option value="-1" selected>��ѡ��</option>';
			var _select = $('select[name=attr-select]', $html);
			_select.empty();
			if(_val) {
				for(title in _val) {
					_options += '<option value=' + title + '>' + _val[title] + '</option>'
				}
			}
			_select.append(_options);
			if(self.css) {
				_select.css(self.css);
			} else if(self.className) {
				_select.addClass(self.className);
			}
		},
		_input : function(self, $arg, $html) {
			var isDisable = self.disable, _$input = $('input[type=text]', $html);
			if(isDisable && isDisable === 'true') {
				_$input.attr('disabled', true);
			}
			_$input.data('key', self.key);
			var _val = parseInt($arg.css(self.key));
			if(!isNaN(_val)) {
				_$input.val(_val);
			}
			if(self.css) {
				_$input.css(self.css);
			} else if(self.className) {
				_$input.addClass(self.className);
			}

		},
		_ginput : function(self, $arg, $html) {
			var _top = '0px', _right = '0px', _bottom = '0px', _left = '0px';
			if(self.key === 'padding') {
				_top = $arg.css('padding-top');
				_right = $arg.css('padding-right');
				_bottom = $arg.css('padding-bottom');
				_left = $arg.css('padding-left');
			}
			if(self.key === 'margin') {
				_top = $arg.css('margin-top');
				_right = $arg.css('margin-right');
				_bottom = $arg.css('margin-bottom');
				_left = $arg.css('margin-left');
			}
			$('input[name=attr-margin-top]', $html).val(parseInt(_top));
			$('input[name=attr-margin-right]', $html).val(parseInt(_right));
			$('input[name=attr-margin-bottom]', $html).val(parseInt(_bottom));
			$('input[name=attr-margin-left]', $html).val(parseInt(_left));
		},
		/**
		 * ����Ĭ��border
		 */
		_border : function($arg, $html) {
			var val = D.rgbTo16($arg.css('border-top-color') || $arg.css('border-bottom-color') || $arg.css('border-left-color') || $arg.css('border-right-color'));
			var bVal;
			if(val === 'ransparent' || val === 'transparent') {
				bVal = 'transparent';
			} else {
				bVal = '#' + val;
			}
			$('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bVal);
			$('input.color-box', $html).val(val);
			var topWidth = parseInt($arg.css('border-top-width'));
			var rightWidth = parseInt($arg.css('border-right-width'));
			var bottomWidth = parseInt($arg.css('border-bottom-width'));
			var leftWidth = parseInt($arg.css('border-left-width'));
			var borderWidth = topWidth || rightWidth || bottomWidth || leftWidth || 1;

			var borderRadius = parseFloat($arg.css('border-top-left-radius'));
			//��Բ�ǣ���ѡ�в�disabled
			if(borderRadius > 0) {
				$('input[name=border-radius]', $html).val(borderRadius);
				$('li input[type=checkbox]', $html).each(function(index, val) {
					val.checked = true;
					val.disabled = true;
				});
				//add by hongss on 2012.11.23 for �����߿���
				$('input[name=border-width]', $html).val(borderWidth);
			} else {
				if(topWidth > 0) {
					$('input[name=border-top]', $html).prop('checked', true);
				}
				if(rightWidth > 0) {
					$('input[name=border-right]', $html).prop('checked', true);
				}
				if(bottomWidth > 0) {
					$('input[name=border-bottom]', $html).prop('checked', true);
				}
				if(leftWidth > 0) {
					$('input[name=border-left]', $html).prop('checked', true);
				}

				//add by hongss on 2012.11.23 for �����߿���
				$('input[name=border-width]', $html).val(borderWidth);
			}

		},
		/**
		 * ����Ĭ�ϱ���
		 */
		_background : function($arg, $html) {
			var val = $arg.css(D.bottomAttr.CSS.backgroundColor), bgVal;
			val = val.colorHex();
			var _url = $arg.css('background-image');
			_url = _url.replace(/(?:\(|\)|url|URL)*/g, "");
			if(val === 'ransparent' || val === 'transparent') {
				bgVal = 'transparent';
			} else {
				bgVal = '#' + val;
			}
			$('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bgVal);
			$('input.color-box', $html).val(val);
			$('div.uploads', $html).data('url', _url);
			$('div.uploads', $html).data('adboardid', $arg.attr('data-adboardid'));
			var repeat = $arg.css('background-repeat');
			if(repeat === 'no-repeat') {
				$('input[name=no-repeat]', $html).attr('checked', true);
				$('input[name=repeat-x]', $html).attr('checked', false);
				$('input[name=repeat-y]', $html).attr('checked', false);
			}
			if(repeat === 'repeat') {
				$('input[name=no-repeat]', $html).attr('checked', false);
				$('input[name=repeat-x]', $html).attr('checked', true);
				$('input[name=repeat-y]', $html).attr('checked', true);
			}
			if(repeat === 'repeat-x') {
				$('input[name=no-repeat]', $html).attr('checked', false);
				$('input[name=repeat-x]', $html).attr('checked', true);
				$('input[name=repeat-y]', $html).attr('checked', false);
			}
			if(repeat === 'repeat-y') {
				$('input[name=no-repeat]', $html).attr('checked', false);
				$('input[name=repeat-x]', $html).attr('checked', false);
				$('input[name=repeat-y]', $html).attr('checked', true);
			}
			//background position
			var position = $arg.css('background-position');
			if(position) {
				$('a.box-img', $html).each(function(index, obj) {
					var _self = $(obj), _position = _self.data('position');
					if(position === _position) {
						_self.parent().addClass('current');
						return;
					}
				});
			}

		},

		/**
		 *�жϱ�ǩ����module�Ƿ������Դ,�а󶨵Ļ�����������Դ-1���޷���0
		 */
		_getDs : function($arg) {
			var dsModuleId = 0;
			if($arg.length <= 0) {
				return;
			}
			if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {
				if($arg.data('dsmoduleparam')) {
					return -1;
				} else {
					return dsModuleId;
				}

			} else {
				return arguments.callee($arg.parent());
			}
		},
		_initSelector : function(element, dsid, showValue) {
			var $jsonDs = this._getDsByDsid(dsid);
			var selected;
			if(showValue) {
				selected = showValue
			}
			if($jsonDs) {
				for(var i = 0; i < $jsonDs.length; i++) {
					var item = new Option($jsonDs[i].cn_name, $jsonDs[i].name);
					if($jsonDs[i].name === selected) {
						item.selected = true;
					}
					element.append(item);
				}
			}
		},
		_getDsByDsid : function(dsid) {
			var dssJson = D.storage().getItem('dssJson');
			var $dj = dssJson && JSON.parse(dssJson).moduleSchemaMapList;
			if($dj) {
				for(var i = 0; i < $dj.length; i++) {
					if($dj[i].key === dsid) {
						return $dj[i].value;
					}
				}
			}
		}
	};
	//��������
	panel.attribute.AttrHandle.CONSTANTS = {
		////��������jQuery�����������Զ����¼�����
		DEF_ATTR_HANDLE_EVENT : 'box.panel.attribute.attr_handle_event'
	};
	//ע���Զ����¼�
	$(function() {
		//��������jQuery�����������¼��
		$(document).bind(panel.attribute.AttrHandle.CONSTANTS.DEF_ATTR_HANDLE_EVENT, function(event) {
			var args = Array.prototype.slice.call(arguments, 1);
			if(D.YunYing && D.YunYing.isYunYing) {//��Ӫ����
				panel.attribute.AttrHandle.yunYingHandle.apply(panel.attribute.AttrHandle, args);
			} else {//UED
				panel.attribute.AttrHandle.handle.apply(panel.attribute.AttrHandle, args);

			}
			return;
		});
	});

})(dcms, FE.dcms, FE.dcms.box.panel);
