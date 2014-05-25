/**
 * 属性展示公共方法
 * @author springyu
 */
;(function($, D) {
	D.bottomAttr = {
		insertText : function($target, val) {
			var self = $target[0];
			if(document.selection) {
				self.focus();
				var sel = document.selection.createRange();
				sel.text = val;
				self.focus();
			} else if(self.selectionStart || self.selectionStart === '0') {
				var startPos = self.selectionStart;
				var endPos = self.selectionEnd;
				var scrollTop = self.scrollTop;
				self.value = self.value.substring(0, startPos) + val + self.value.substring(endPos, self.value.length);
				self.focus();
				self.selectionStart = startPos + val.length;
				self.selectionEnd = startPos + val.length;
				self.scrollTop = scrollTop;
			} else {
				self.value += val;
				self.focus();
			}
		},
		/**
		 * 查找cell列表
		 */
		searchCellList : function($cell) {
			//var arr = arguments[1];
			//arr = arr || [];
			if(!$cell || $cell.length <= 0) {
				return null;
			}
			//if($cell.hasClass(D.bottomAttr.CLASSATTR.cell)) {
			// arr.push($cell);
			//}
			/*if($cell.hasClass(D.bottomAttr.CLASSATTR.module) || $cell.hasClass(D.bottomAttr.CLASSATTR.mcontent)) {
			 return arr;
			 } else {
			 if($cell.data(D.bottomAttr.CONSTANTS['boxOptions']) || $cell.is('a')) {
			 $cell.data(D.bottomAttr.CLASSATTR.containerCell, D.bottomAttr.CLASSATTR.containerCell);
			 D.bottomAttr.setConfig($cell, 'config');
			 }
			 //var className = $cell.attr('class');
			 //if(className.indexOf(D.bottomAttr.CLASSATTR.cell) !== -1) {
			 arr.push($cell);
			 //}

			 return arguments.callee($cell.parent(), arr);
			 }*/
			var cellArr = [];
			if($cell.closest('.' + D.bottomAttr.CLASSATTR.mcontent).length > 0) {
				cellArr = this._getCellParents($cell, '.' + D.bottomAttr.CLASSATTR.mcontent);
				//return cellArr;
			} else if($cell.closest('.' + D.bottomAttr.CLASSATTR.module).length > 0) {
				cellArr = this._getCellParents($cell, '.' + D.bottomAttr.CLASSATTR.module);
			}

			this._addCellConfig($cell);
			cellArr.unshift($cell);
			return cellArr;

		},
		/**
		 * @methed _getCellParents 获得cell一定范围内的父级元素，add by hongss on 2012.06.08
		 * @param $cell cell元素对象，jQuery对象
		 * @param selector 截至的元素选择器
		 */
		_getCellParents : function($cell, selector) {
			var cells = $cell.parentsUntil(selector), len = cells.length, cellArr = [], self = this;

			cells.each(function(i, cell) {
				cell = $(cell);
				self._addCellConfig(cell);
				cellArr.push(cell);
			});
			return cellArr;
		},
		/**
		 * @methed _addCellConfig 给cell标签添加额外的config，hongss提取 2012.06.08
		 */
		_addCellConfig : function(cell) {
			var _boxOptions, isCopy = function(obj) {
				if(obj && obj.ability && obj.ability.copy && obj.ability.copy.enable && obj.ability.copy.enable === 'true') {
					return true;
				} else {
					return false;
				}
			}, isConCell = function(obj) {
				if(obj && obj.ability && obj.ability.container && obj.ability.container.enableType && obj.ability.container.enableType === 'cell') {
					return true;
				} else {
					return false;
				}
			};
			if(cell.data(D.bottomAttr.CONSTANTS['boxOptions']) || cell.is('a')) {
				_boxOptions = cell.data(D.bottomAttr.CONSTANTS['boxOptions']);
				if(isCopy(_boxOptions) && isConCell(_boxOptions)) {
					cell.attr('data-' + D.bottomAttr.CLASSATTR.containerCell, D.bottomAttr.CLASSATTR.containerCell);
				}

				D.bottomAttr.setConfig(cell, 'config');
			}
		},
		/**
		 * 通过标签查找cell
		 */
		searchCell : function($arg) {
			if(!$arg || $arg.length <= 0) {
				return null;
			}
			if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {
				return $arg;
			} else {
				return arguments.callee($arg.parent());
			}

		},
		/**
		 * 特殊处理整个页面背景
		 */
		handleBackground : function(attrList, $label) {
			var _arrBackground = attrList['background'];
			if(_arrBackground && _arrBackground.length === 1) {
				var _background = _arrBackground[0];
				if($label.hasClass(D.bottomAttr.CLASSATTR.main) || $label.hasClass(D.bottomAttr.CLASSATTR.gridsMain)) {
					$('#attr_content').empty();
					var position = '<div class="fd-left" style="padding:4px;width:150px;height:20px;">';
					if($label.hasClass(D.bottomAttr.CLASSATTR.main)) {
						position += '<input name="boxPageBg" type="radio" value="' + D.bottomAttr.CLASSATTR.main + '" checked="checked" style="margin:2px;" class="js-bg">全屏背景';
						position += '<input value="' + D.bottomAttr.CLASSATTR.gridsMain + '" name="boxPageBg" type="radio" class="js-bg" style="margin:2px;" class="">栅格背景';
					}
					if($label.hasClass(D.bottomAttr.CLASSATTR.gridsMain)) {
						position += '<input name="boxPageBg" type="radio" value="' + D.bottomAttr.CLASSATTR.main + '" style="margin:2px;" class="js-bg">全屏背景';
						position += '<input value="' + D.bottomAttr.CLASSATTR.gridsMain + '" name="boxPageBg" type="radio" checked="checked" class="js-bg" style="margin:2px;" class="">栅格背景';
					}

					position += '</div>';
					_background.find('.bg-position').append(position);
					$('#attr_content').append(_background);
					$('#attr_content').show();
					D.bottomAttr.bindAttr();

				}

			}
		},

		/**
		 * 检查是否布局元素
		 */
		checkFrame : function($arg) {
			if(!$arg) {
				return {
					"isFrame" : false,
					"className" : null
				};
			}
			var className = $arg.attr('class'), contentId = $arg.attr('id');
			if(contentId && contentId === D.bottomAttr.CLASSATTR.content) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.content
				};
			}
			if(!className) {
				return {
					"isFrame" : false,
					"className" : null
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.gridsMain) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.gridsMain
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.main) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.main
				};
			}

			if(className.indexOf(D.bottomAttr.CLASSATTR.layout) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.layout
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.grid) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.grid
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.row) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.row
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.box) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.box
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.module) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.module
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.cell) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.cell
				};
			}
			if(className.indexOf(D.bottomAttr.CLASSATTR.mcontent) !== -1) {
				return {
					"isFrame" : true,
					"className" : D.bottomAttr.CLASSATTR.mcontent
				};
			}

			return {
				"isFrame" : false,
				"className" : null
			};
		},
		resizeWindow : function() {
			/**
			 * window窗口
			 */
			var $win = $(window), winHeight = $win.height(), winWidth = $win.width();
			var $header = $('.dcms-header'), headerHeight = $header.outerHeight(true);
			var $section = $('.page-content'), sectionHeight = $section.outerHeight(true);
			//工具面板属性
			var $panel = $('.tools-panel'), panelHeight = $panel.outerHeight(true), panelWidth = $panel.width();
			//具面板高度
			$panel.css('height', winHeight - headerHeight - sectionHeight);

			//第一导航属性
			var $panelNav = $('#panel_nav'), panelNavHeight = $panelNav.outerHeight(true);
			//
			var $tabNav = $('.tab-nav'), tabNavHeight = $tabNav.outerHeight(true);

			var $tSearch = $('.template-search'), tSearchHeight = $tSearch.outerHeight(true);
			var $tPage = $('.template-page'), tPageHeight = $tPage.outerHeight(true);

			var _height = winHeight - panelNavHeight - tabNavHeight - tSearchHeight - tPageHeight - headerHeight - sectionHeight;
			$('.template-body').css('height', _height);
			$('.panel-template-content').css('height', winHeight - panelNavHeight - tabNavHeight - headerHeight - sectionHeight);

			var module_page_height = $("div.dcms-box-page").outerHeight(true) || 0;
			//分页高度
			$('.edit-content').css('height', _height - 31);
			//分页高度
			$('.panel-edit-attr').css('height', _height);

			$('.panel-tab').css('height', _height);
			//console.log(winHeight-headerHeight-sectionHeight- tabNavHeight- 88);
			//console.log(winHeight-headerHeight-sectionHeight);
			$('.list-module-width').css('height', winHeight - headerHeight - sectionHeight - tabNavHeight - 100);
			//新建组件，去除“分列表格”区块
			$('.panel-cell-content').css('height', _height - $('.dcms-box-page').outerHeight(true));
			// $('.panel-cell-content').css('height', _height - $('.dcms-box-page').outerHeight(true));
			//console.log('winHeight:'+winHeight);
			//新建布局和模版左则高度计算
			var $micro = $('.edit-micro-layout', $panel), microHeight = $micro.outerHeight(true);
			var $floatLayout = $('.edit-float-layout', $panel), floatHeight = $floatLayout.outerHeight(true);
			var $bottomLine = $('.bottom-line', $panel), bottomLineHeight = $bottomLine.outerHeight(true);
			var $topLine = $('.top-line', $panel), topLineHeight = $topLine.outerHeight(true);
			$('.edit-layout', $panel).css('height', winHeight - tabNavHeight - headerHeight - sectionHeight - microHeight - floatHeight - bottomLineHeight - topLineHeight - 30);

			//iframe 高度和宽度
			//如果是LEFTMENU缩进状态改变宽度计算方法
			if($('.move-moveend--182')[0]) {
				$('div.dcms-box-body').css('width', winWidth - 19 - 2);
			}else{
				$('div.dcms-box-body').css('width', winWidth - panelWidth - 2);
			}
			
			$('iframe.dcms-box-main').css('height', winHeight - headerHeight - sectionHeight - $('.body-header').eq(-1).outerHeight(true) - 3);

		},
		addPx : function(val) {
			if(val) {
				return val.indexOf('px') > -1 ? val : (val + 'px');
			}
			return '1px';
		},
		removeLevel : function($label) {
			var oBody = $label.closest('body');
			oBody.find('.box-level-self').each(function(index, obj) {
				var _self = $(obj);
				_self.removeData('level');
				_self.removeClass('box-level-self');
			});
		},
		setLevel : function($label, level) {
			$label.data('level', level);
			$label.addClass('box-level-self');
		},
		setConfig : function($label, config) {
			$label.data('config', config);
			//$label.addClass('box-config');
		},

		/**
		 * 对话框是否展示删除按钮
		 *
		 */
		showIsDelete : function($target) {
			var cf = D.bottomAttr.checkFrame($target);

			//console.log($target);
			//console.log(cf && !cf.isFrame && D.bottomAttr.checkIsDelete($target));
			//if((cf && cf.isFrame && cf.className === D.bottomAttr.CLASSATTR.cell) || (cf && !cf.isFrame && D.bottomAttr.checkIsDelete($target))) {
			if(cf && !cf.isFrame && D.bottomAttr.checkIsDelete($target)) {
				//console.log(  $('.delete-elem'));
				$('.delete-elem').show();
			} else {
				$('.delete-elem').hide();
			}
		},

		/**
		 * 检查标签是否可删除
		 *  true 可删除 false 不能删除
		 */
		checkIsDelete : function($arg) {
			if(!$arg) {
				return false;
			}
			var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']);
			if(_boxOptions && _boxOptions.ability) {
				var del = _boxOptions.ability["delete"];
				if(del && del.enable && del.enable === 'true') {
					return true;
				}
			}
			return false;
		},

		/**
		 * 控制 该属性只对当前控件有效
		 */
		onlyCurrentValid : function(_target) {
			var attrType = $('div.attr-type', '#' + _target);
			//console.log(attrType);
			attrType.each(function(index, obj) {
				var _attrType = $(obj);
				var autocratic = _attrType.data('autocratic');
				//console.log(autocratic);
				if(autocratic) {
					document.getElementById('autocratic').checked = true;
				}
				var attrTab = $('ul.attr-tab', 'div.dcms-box-attr');

				if(_attrType.data('css')) {
					attrTab.hide();
				} else {
					attrTab.show();
				}
				// console.log(attrTab);
			});
		},

		/**
		 * 清除工具条选中状态
		 */
		clearToolBarCheck : function() {
			/**
			 * 工具条选中处理
			 */
			$('.toolbar', '.toolbar-more').each(function(index, obj) {
				var _self = $(obj);

				if(_self.hasClass('selected')) {
					_self.removeClass('selected');
				}
			});
			$('#datasource').each(function(index, obj) {
				var _self = $(obj), _selfParent = _self.parent();
				if(_selfParent.hasClass('current')) {
					_selfParent.removeClass('current');
				}
			});
		},
		/**
		 * 关闭对话框
		 */
		closeDialog : function() {
			$('a.close-btn', 'div.dialog').closest('div.dialog').dialog('close');
			D.bottomAttr.clearToolBarCheck();
			if(D.editPage && D.editPage.hideHighLight) {
				D.editPage.hideHighLight();
			}

		},
		/**
		 * 展示对话框
		 */
		//showDialog : function(self, obj) {
		//jQuery.ui.dialog.zIndex = 100;
		// var oDialog = $('div.dialog'), attr, attrTab;
		// if(obj) {
		// $('.tip', oDialog).html(obj.name);
		//} else {
		//     attr = self.data('boptions');
		/// attrTab = $('ul.attr-tab', '#' + attr);
		//$('.tip', oDialog).html(self.attr('title'));

		//}

		//$.use('ui-dialog', function() {
		//oDialog.dialog({
		//modal : false,
		//shim : true,
		//center : true,
		// fadeOut : true
		//});
		//});
		//D.bottomAttr.bindAttr();
		// },
		/**
		 * 处理仅对当前控件有效元素
		 */
		handleAutocratic : function(configItem, $arg, $html) {
			if(configItem) {
				var self = $arg[0].style, val, _key = '', ss, strKey = configItem.key;
				if(strKey === 'text' || strKey === 'href' || strKey === 'image') {
					// return;
				}
				ss = strKey.split('-');
				if(ss.length > 1) {
					_key += ss[0];
					for(var j = 1; j < ss.length; j++) {
						_key += ss[j].substring(0, 1).toUpperCase() + ss[j].substring(1);
					}
				} else {
					_key += ss[0];
				}
				//console.log(_key);
				val = self[_key];

				if(val) {
					// console.log($arg);
					// console.log(val);
					$html.data('autocratic', 'autocratic');
					//console.log($html);
				}

			}

		},
		/**
		 * 属性控制面板事件绑定
		 */
		bindAttr : function() {
			D.Attribute.init();
			// D.bottomAttr.bind.init();
		},
		resetAttr : function() {
			/**
			 * 清除当前选中样式
			 */
			D.bottomAttr.clearAttr();
			$('div.attr-elem-layout').empty();
			$('span.elem-name', 'div.favorit-attr').html('');
		},
		/**
		 * 清空属性控制面板
		 */
		clearAttr : function() {
			$('div.attr', 'div.dialog').each(function(index, obj) {
				var _self = $(obj);
				_self.empty();
				_self.hide();
			});
			// D.bottomAttr.closeDialog();
			D.bottomAttr.hideToolBar();

		},
		/**
		 * 隐藏所有属性
		 */
		hideAttr : function() {
			document.getElementById('autocratic').checked = false;
			$('div.attr', 'div.attr-elem-layout').each(function(index, obj) {
				var _self = $(obj);
				_self.hide();
			});
		},
		/**
		 * 隐藏所有工具条
		 */
		hideToolBar : function() {
			$('a.description', 'div.attr-toolbar').each(function(index, obj) {
				var _self = $(obj);
				_self.hide();
			});
			$('div.toolbar-comm').hide();
		},
		/**
		 * 查找class有attr-type的jQuery对象
		 */
		findDataExtra : function($arg) {
			if($arg.length > 0) {
				if($arg.hasClass('attr-type')) {
					return $arg;
				} else {
					if($arg.parent()) {
						return arguments.callee($arg.parent());
					} else {
						return;
					}

				}
			} else {
				return;
			}
		},
		/* 保存数据源参数触发，将参数设置到所选择的dsmodule中*/
		setDsModuleParam : function(dsModuleParam) {
			$('div.dsmodule-attr').each(function(index, obj) {
				var self = $(obj), $html;
				var extra = self.data(D.bottomAttr.CONSTANTS['extra']);
				if(extra && extra.obj) {
					$html = $(extra.obj);
					if(dsModuleParam) {
						//查询结果按数据源查出条数展示 true 按数据源展示，false 按界面展示
						$html.attr('data-dsrepeatbyrow', true);
						$html.attr('data-dsmoduleparam', dsModuleParam);
					} else {
						// 清除data-dsmoduleparam
						$html.removeAttr('data-dsmoduleparam');
						//$html.removeAttr('data-dsrepeatbyrow');
					}
				}

			});
		},
		saveDsModule : function(dsModuleId, obj) {
			var name = 'dsModuleId' + dsModuleId;
			D.storage().setItem(name, JSON.stringify(obj));
		},
		getDsModule : function(dsModuleId) {
			return D.storage().getItem('dsModuleId' + dsModuleId);
		},
		/*
		 * 清空数据源相关的所有属性和样式
		 */
		removeDsModuleClass : function() {
			var _self = D.editPage.currentElem;
			$('.ds-box-module', _self).removeClass('ds-box-module');
			_self.removeAttr('data-dsmoduleparam');
			_self.removeAttr('data-dsrepeatbyrow');
			$('[data-dsoptions]', _self).removeAttr('data-dsoptions');
			$('[data-dsrepeat]', _self).removeAttr('data-dsrepeat');

		},
		/**
		 * 获取属性面版HTML代码 返回JQUERY对象
		 */
		getHtml : function(arg) {
			var strHtml = D.storage().getItem(arg), data, retJson;
			var url = D.domain + '/page/box/box_page_attr.html', data = {
				cate : 'attribute'
			};
			if(!strHtml) {//从数据库中获取
				D.storage().load(url, function(retJson) {
					if(retJson && retJson.status === 'success') {
						retJson = retJson.data;
						for(var name in retJson) {
							D.storage().setItem(name, retJson[name]);
						}
					} else {
						alert(retJson.msg);
						return;
					}
				}, data);
				strHtml = D.storage().getItem(arg);
			}
			return $(strHtml);
		},
		/**
		 * 设置元素颜色
		 */
		editColorCss : function(extra, val) {
			if(extra.pseudo) {
				// D.EditContent.editCss({
				// 'elem' : extra.obj,
				//'key' : extra.key,
				//'value' : '#' + val,
				// 'pseudo' : extra.pseudo
				// });
				D.bottomAttr.editCss(extra.obj, extra.key, val, extra.pseudo);
			} else {
				D.bottomAttr.editCss(extra.obj, extra.key, val);
				//D.EditContent.editCss({
				// 'elem' : extra.obj,
				//'key' : extra.key,
				// 'value' : '#' + val
				//});
			}
		},
		/**
		 * 编辑样式 属性通用方法
		 */
		editCss : function(obj, key, value, pseudo) {
			var isEditClass = true;
			var autocratic = document.getElementById('autocratic');
			if(autocratic && autocratic.checked) {
				isEditClass = false;
			}
			//console.log('isEditClass==' + isEditClass);
			D.EditContent.editCss({
				'elem' : obj,
				'key' : key,
				'value' : value,
				'pseudo' : pseudo,
				'isEditClass' : isEditClass
			});
			//check show hight element
			//D.BoxTools.showHighLight(obj);
			//modify by hongss on 2012.01.08 for cell下可重复标签允许上移、下移、复制功能
			$(document).trigger('box.editor.label_move_copy', [obj]);
		},
		/**
		 * 取色板颜色改变触发事件
		 */
		colorBoxChange : function($arg, val) {
			var selfParent = D.bottomAttr.findDataExtra($arg);
			var extra = selfParent.data(D.bottomAttr.CONSTANTS.extra);

			if(extra) {
				if(extra.type) {
					if(val === 'ransparent' || val === 'transparent') {
						val = 'transparent';
					} else {
						val = '#' + val;
					}
					if(extra.type === D.bottomAttr.ATTRIBUTE.COLOR) {
						D.bottomAttr.editColorCss(extra, val);
						return;
					}
					if(extra.type === D.bottomAttr.ATTRIBUTE.TEXT) {
						D.bottomAttr.editCss(extra.obj, 'color', val, extra.pseudo);
						// D.EditContent.editCss({
						//  'elem' : extra.obj,
						//'key' : 'color',
						// 'value' : '#' + val
						//});
						return;
					}
					if(extra.type === D.bottomAttr.ATTRIBUTE.BORDER) {
						D.bottomAttr.editCss(extra.obj, 'border-color', val, extra.pseudo);
						return;
					}
					if(extra.type === D.bottomAttr.ATTRIBUTE.BACKGROUND) {
						D.bottomAttr.editCss(extra.obj, 'background-color', val, extra.pseudo);
						return;
					}
				}

			}

		},
		/**
		 * 增加可配置项
		 */
		addBoxOptions : function($arg, type, o) {
			if($arg && $arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
				var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), cssObj = _boxOptions.css;
				if(type === 'css') {
					this._addCssBoxOptions($arg, o);
				}
			} else if($arg && !$arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
				$arg.data(D.bottomAttr.CONSTANTS['boxOptions'], {
					"css" : [o]
				});
			}
		},
		_addCssBoxOptions : function($arg, o) {
			var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), cssObj = _boxOptions.css, isEx = false;
			if(cssObj) {
				for(var i = 0; i < cssObj.length; i++) {
					var obj = cssObj[i];
					if(obj.key === o.key) {
						isEx = true;
						break;
					}
				}
				if(!isEx) {
					_boxOptions.css.push(o);
				}

			} else {
				_boxOptions['css'] = [o];
			}
			//$arg.data(D.bottomAttr.CONSTANTS['boxOptions'], _boxOptions);
		},
		/**
		 * 检测标签内是否只含有文本
		 */
		isHasText : function($label) {
			var label = $label[0], first;
			var len = label.childNodes.length;
			if(len === 1) {
				first = label.childNodes[0];
				if(first && first.nodeType === Node.TEXT_NODE) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 默认处理文本标签
		 */
		handleText : function($arg) {
			if(D.bottomAttr.isHasText($arg) && !($arg.is('img') || $arg.is('IMG'))) {
				this.addBoxOptions($arg, 'css', {
					"key" : "text",
					"type" : D.bottomAttr.ATTRIBUTE.TEXT,
					"name" : "文本"
				});
			}
		},
		/**
		 * 处理图片标签
		 */
		handleImage : function($arg) {
			if($arg.get(0).tagName === 'img' || $arg.get(0).tagName === 'IMG') {
				this.addBoxOptions($arg, 'css', {
					"key" : "image",
					"type" : D.bottomAttr.ATTRIBUTE.IMAGE,
					"name" : "图片"
				});
			}
		},

		loadModuleCatalog : function(value, callback) {
			var url = D.domain + '/page/box/query_module_catalog.html', _value;
			if($.type(value) === 'object') {
				_value = $.param(value);
			} else {
				_value = value;
			}
			$.ajax({
				url : url,
				type : "POST",
				data : _value,
				async : false,
				success : function(_data) {
					var self = this, json;
					json = $.parseJSON(_data);
					if(callback && $.isFunction(callback)) {
						callback.call(self, json);
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("连接超时请重试！");
				}
			});
		},
		// edit content load cell or module catalog
		loadCellModuleCatalog : function() {
			var url = D.domain + '/page/box/box_module_catalog.html', data = '';
			D.storage().load(url, function(retJson) {
				if(retJson && retJson.status === 'success') {
					retJson = retJson.data;
					D.storage().setItem('moduleCatalog', JSON.stringify(retJson));
				} else {
					alert(retJson.msg);
					return;
				}
			}, data);
		},
		requestAjax : function(url, value, callback) {
			var _url = D.domain + url, _value;
			if($.type(value) === 'object') {
				_value = $.param(value);
			} else {
				_value = value;
			}
			$.ajax({
				url : _url,
				type : "POST",
				data : _value,
				async : false,
				success : function(_data) {
					var self = this, json;
					json = $.parseJSON(_data);
					if(callback && $.isFunction(callback)) {
						callback.call(self, json);
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("连接超时请重试！");
				}
			});
		},
		//查询和传入ID有相同标签的module
		queryLikeTagModule : function(_targetModuleObj, currentPage) {
			var moduleId, type, _eleminfo, _moduleTagList = $('#module_tag_list'), _modulePage = $('.module-page', _moduleTagList), _moduleBody = $('.module-body', _moduleTagList);

			if(_targetModuleObj) {
				_eleminfo = _targetModuleObj.data('eleminfo');
				_moduleBody.empty();
				_modulePage.empty();
				if(_eleminfo) {
					moduleId = _eleminfo.id;
					type = _eleminfo.type;

					D.bottomAttr.requestAjax('/page/box/query_box_module.html', {
						'moduleId' : moduleId,
						'currentPageSize' : currentPage
					}, function(_data) {

						if(_data && _data.data) {
							var _value = _data.data;
							if(_value.dataList) {
								var _dataList = _value.dataList;
								//console.log(_dataList);
								for(var i = 0, len = _dataList.length; i < len; i++) {
									var _moduleList = $('<div class="module-list"></div>');
									_moduleList.attr('data-eleminfo', JSON.stringify(_dataList[i].eleminfo));
									_moduleList.append(_dataList[i].content);
									_moduleBody.append(_moduleList);
									//_moduleBody.append('<div class="module-list" data-eleminfo='+JSON.stringify(_dataList[i].eleminfo)+'>' + _dataList[i].content + '</div>');
								}
							}
							var current = parseInt(_value.currentPage), sumPage = parseInt(_value.pageSize);
							if(_value && sumPage && sumPage > 1) {
								var pageHtml = '<div class="dcms-box_clear"><ul>';
								if(current !== 1) {
									pageHtml += '<li><a class="elem" data-val="1">首页</a></li>';
									pageHtml += '<li><a class="elem" data-val="' + (current - 1) + '">上一页</a></li>';
								} else {
									pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">首页</a></li>';
									pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">上一页</a></li>';
								}
								if(current !== sumPage) {
									pageHtml += '<li><a class="elem" data-val="' + (current + 1) + '">下一页</a></li>';
									pageHtml += '<li><a class="elem" data-val="' + sumPage + '">尾页</a></li>';
								} else {
									pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">下一页</a></li>';
									pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">尾页</a></li>';
								}

								pageHtml += '<li><a class="desc">第' + _value.currentPage + '页/共' + _value.pageSize + '页</a></li>';
								pageHtml += '</ul></div>';
								_modulePage.append(pageHtml);
							}

						}

					});
				} else {
					return -1;
				}
			}
		},
		//编辑内容查找控件 ued规范控件选中事件bind
		bindCellCatalogEvent : function() {
			$('#baseCell').bind('click', function(e) {
				var self = $(this), selfParent = self.parent(), cellTag = $('#cellTag');
				if(selfParent.hasClass('selected')) {
					selfParent.removeClass('selected');
					cellTag.val('');
				} else {
					selfParent.addClass('selected');
					cellTag.val(self.data('cell'));
				}
			});
			$('a.module-catalog', 'div.cell-catalog').bind('click', function(e) {
				var self = $(this), that = this, selfParent = self.parent(), catalogIds = '', $catalogId = $('#catalogIds');
				var selfOption = self.data('cellcatalog');

				if(selfOption === -1) {
					$('li.selected', 'div.cell-catalog').each(function(index, obj) {
						$(obj).removeClass('selected');
					});
					selfParent.addClass('selected');
				} else {
					if(selfParent.hasClass('selected')) {
						selfParent.removeClass('selected');
					} else {
						selfParent.addClass('selected');
						$('li.selected a.module-catalog', 'div.cell-catalog').each(function(index, obj) {
							var $self = $(obj), $selfParent = $self.parent();
							if($self.data('cellcatalog') === -1) {
								if($selfParent.hasClass('selected')) {
									$selfParent.removeClass('selected');
								}
							}
						});
					}
				}
				$('li.selected a', 'div.cell-catalog').each(function(index, obj) {
					var _self = $(obj);
					catalogIds += _self.data('cellcatalog') + ';';
				});
				$catalogId.val(catalogIds);

			});
		},
		//编辑内容查找模块 类别 色系 选中事件bind
		bindModuleCatalogColor : function() {
			$('a.module-catalog', 'div.cmodule-catalog').bind('click', function(e) {
				var self = $(this), that = this, selfParent = self.parent(), _selfParent, catalog = $('#catalog'), cval = '';
				if(self.html() === '全部') {
					$('li.selected', 'div.cmodule-catalog').each(function(index, obj) {
						$(obj).removeClass('selected');
					});
					selfParent.addClass('selected');
				} else {
					if(selfParent.hasClass('selected')) {
						selfParent.removeClass('selected');
					} else {
						selfParent.addClass('selected');
						$('li.selected a.module-catalog', 'div.cmodule-catalog').each(function(index, obj) {
							var $self = $(obj), $selfParent = $self.parent();
							if($self.html() === '全部') {
								if($selfParent.hasClass('selected')) {
									$selfParent.removeClass('selected');
								}
							}
						});
					}
				}
				$('li.selected a', 'div.cmodule-catalog').each(function(index, obj) {
					var _self = $(obj);
					cval += _self.html() + ';';
				});
				catalog.val(cval);

			});
			// 色系
			var pageColor = $('span.page-color', 'div.cmodule-color');
			pageColor.children('span').each(function(index, obj) {
				var _self = $(obj);
				if(_self.hasClass('selected')) {
					_self.removeClass('selected');
				} else {
					//self.addClass('selected');
				}

			});
			$('a.module-catalog', 'div.cmodule-color').bind('click', function(e) {
				$(this).addClass('selected');
				$('span.selected', 'span.page-color').each(function(index, obj) {
					$(obj).removeClass('selected');
				});
			});
			$('span', pageColor).bind('click', function(e) {
				var _self = $(this), moduleColor = $('#moduleColor'), colorVal = '';
				$('a.module-catalog', 'div.cmodule-color').removeClass('selected');
				if(!_self.hasClass('selected')) {
					_self.addClass('selected');

				}
				$('span.selected', 'span.page-color').each(function(index, obj) {
					var selfColor = $(obj);
					colorVal += selfColor.data('color') + ';';
				});
				moduleColor.val(colorVal);
			});
		}
	};
	D.bottomAttr.CSS = {
		fontBold : 'font-weight',
		fontSize : 'font-size',
		backgroundColor : 'background-color',
		color : 'color',
		fontFamily : 'font-family'
	};

	D.bottomAttr.CLASSATTR = {
		"layout" : "crazy-box-layout",
		"grid" : "crazy-box-grid",
		"row" : "crazy-box-row",
		"box" : "crazy-box-box",
		"module" : "crazy-box-module",
		"cell" : "crazy-box-cell",
		"mcontent" : "crazy-box-content",
		"content" : "content",
		"main" : "cell-page-main",
		'containerCell' : 'container-cell',
		'gridsMain' : 'cell-page-grids-main'
	};
	D.bottomAttr.ATTR = {
		'text' : 'text',
		'cn_text' : '编辑文字',
		'image' : 'image',
		'cn_image' : '编辑图片',
		'size' : 'size',
		'cn_size' : '修改尺寸',
		'connect' : 'connect',
		'cn_connect' : '设置连接',
		'background' : 'background',
		'cn_background' : '设置背景',
		'border' : 'border',
		'cn_border' : '设置边框',
		'margin' : 'margin',
		'cn_margin' : '设置边框',
		'repeat' : 'repeat',
		'cn_repeat' : '设置重复',
		'dsmodel' : 'dsmodel',
		'cn_dsmodel' : '',
		'other' : 'other',
		'cn_other' : '其它'
	};
	D.bottomAttr.CONSTANTS = {
		'self' : 'self',
		'parent' : 'parent',
		'frame' : 'frame',
		'other' : 'other',
		'boxOptions' : 'boxoptions',
		'extra' : 'extra',
		'colon' : '：',
		'selected' : 'selected',
		'song' : '宋体',
		'microsoft' : '微软雅黑'

	};
	D.bottomAttr.ATTRIBUTE = {
		BORDER : 'border',
		INPUT : 'input',
		GINPUT : 'ginput',
		GINPUTS : 'ginputs',
		TEXT : 'text',
		COLOR : 'color',
		IMAGE : 'image',
		BACKGROUND : 'background',
		CHECK : 'check',
		DELETE : 'delete',
		COPY : 'copy',
		EDITATTR : 'editAttr'
	};
	D.bottomAttr.CATALOG = [{
		'name' : '所有',
		'code' : ''
	}, {
		'name' : '专题页面',
		'code' : '专题页面'
	}, {
		'name' : '专场页面',
		'code' : '专场页面'
	}, {
		'name' : '频道页',
		'code' : '频道页'
	}];
	D.bottomAttr.INDUSTRY = [{
		'name' : '全部',
		'code' : ''
	}, {
		'name' : '塑化',
		'code' : '塑化'
	}, {
		'name' : '纺织',
		'code' : '纺织'
	}, {
		'name' : '电子',
		'code' : '电子'
	}, {
		'name' : 'MRO',
		'code' : 'MRO'
	}, {
		'name' : '服装',
		'code' : ''
	}, {
		'name' : '小商品',
		'code' : '小商品'
	}, {
		'name' : '百货',
		'code' : '百货'
	}, {
		'name' : '生活家电',
		'code' : '生活家电'
	}, {
		'name' : '美容母婴',
		'code' : '美容母婴'
	}, {
		'name' : '食品农业',
		'code' : '食品农业'
	}, {
		'name' : '包装',
		'code' : '包装'
	}, {
		'name' : '社区',
		'code' : '社区'
	}, {
		'name' : '商业产品',
		'code' : '商业产品'
	}, {
		'name' : '其它',
		'code' : '其它'
	}];
	var readyFun = [
	function() {
		/**
		 * 初始化页面属性
		 */
		var url = D.domain + '/page/box/box_page_attr.html', data = {
			cate : 'attribute'
		}, currentDate = D.storage().getItem('currentDate'), d = new Date(), dFormat = d.format('yyyy-MM-dd');
		/**
		 * 本地存储中的日期和当前日期不同，从DB中获取
		 */
		if(dFormat !== currentDate) {
			D.storage().setItem('currentDate', dFormat);

			D.storage().load(url, function(retJson) {
				if(retJson && retJson.status === 'success') {
					retJson = retJson.data;
					for(var name in retJson) {
						D.storage().setItem(name, retJson[name]);
					}
				} else {
					alert(retJson.msg);
					return;
				}
			}, data);
		}
	}];

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}

	});
})(dcms, FE.dcms);
