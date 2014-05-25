/**
 * @author springyu
 * @userfor  组件编辑相关操作：进入编辑，表格，复制等
 * @date  2012-12-19
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
(function($, D) {
	var editor = D.box.editor, root = this, _ = root._;
	var YunYing = D.box.datasource && D.box.datasource.YunYing;
	editor.Module = {
		/**
		 * 组件初始化事件
		 * @param singerArea 选中后的操作区域高亮
		 * @param dropInPage 当前编辑器对象
		 */
		moduleBtnsListener : function(singerArea, dropInPage) {
			var self = this, CONSTANTS = D.DropInPage.CONSTANTS;

			//微布局
			$('.' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN, singerArea).live('click', function(event) {
				event.preventDefault();
				self._startEditArea(singerArea, $(this), CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
				editor.Microlayout.showMicro(dropInPage, dropInPage.currentElem);

			});
			//组件复制事件
			singerArea.delegate('.' + D.DropInPage.defConfig.newCopyButton, 'click', function(event) {
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				if(target.hasClass('crazy-box-module')) {
					target = target.closest('.crazy-box-row');
				}
				editor.operate.copyElement(target, dropInPage);
			});
			//04-01 qiuxiaoquan 点击"同步",弹出发布页面浮动层
			singerArea.delegate('.' + D.DropInPage.defConfig.syncModuleButton, 'click', function(event) {
				var _oModule = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				//包括了module的html style css
				var htmlCode = D.DropInPage.getElemHtml(_oModule);
				var data = {};
				data['content'] = htmlCode;
				var eleminfo = $(_oModule).data("eleminfo");
				data['moduleId'] = eleminfo.id;
				D.showSyncDialog(eleminfo.id, data);

			});

			//接入多数据源
			singerArea.delegate('.js-datasource', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.linkSouce(target, singerArea);
			});

			//组件上下移动
			singerArea.delegate('.js-move', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				var $self = $(this);
				target = target.closest('.crazy-box-row');

				//组件不能上下移动 只能是移动row
				self._moduleMoveUpOrDown(target, $self);
				dropInPage._hideAll();

			});
			//运营场景 盒子组件自定义源代码
			singerArea.delegate('.js-yunying-src', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), that = this, $self = $(that);
				if($self.hasClass('edit')) {
					$self.removeClass('edit');
					$self.html('源代码');
					if(dropInPage.editTextarea.css('display') !== 'none'
					//
					&& target.closest('.' + dropInPage.config.defineCell).length === 0
					//
					&& target.closest(dropInPage.config.editTextarea).length === 0) {
						dropInPage._setDefineCodeView(dropInPage.editTextarea);
					}
				} else {
					$self.addClass('edit');
					$self.html('完成编辑');
					dropInPage._setDefineCodeView(dropInPage.editTextarea);
					YunYing && YunYing.setDefineCodeEdit(target, dropInPage);
				}

				return;
			});
			//运营场景 组件数据源
			singerArea.delegate('.js-yunying-ds', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.linkSouce(target, singerArea);
				// YunYing && YunYing.showModuleDs(target, singerArea);
			});

			//运营场景 排期
			singerArea.delegate('.js-yunying-waiting', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);

				YunYing && YunYing.showWaiting(target, singerArea);

			});
			//设置组件属性
			singerArea.delegate('.js-attr-module', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				$(document).trigger('box.panel.attribute.attr_handle_event', [target, 'module']);
			});
			//添加或更换组件
			singerArea.delegate('.js-module', 'click', function(event) {
				event.preventDefault();
				var that = this, $self = $(that), elemInfo, elemAttr, method = 'add-r',
				//
				target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);

				elemAttr = {
					'width' : parseInt(target.css('width'))
				};
				if($self.hasClass('add')) {//新增
					elemInfo = elemAttr;
				} else {// 更换
					method = 'replace';
					elemInfo = target.data('eleminfo');
					if(elemInfo) {
						elemInfo = target.data('eleminfo');
						if(elemInfo.width !==elemAttr.width){
							elemInfo.width = elemAttr.width;
						}
					} else {
						elemInfo = elemAttr;
					}
				}
				D.YunYing.showModuleList.apply(D.YunYing, [elemInfo, target, dropInPage, method]);
			});
			//设置为公用区块
			singerArea.delegate('.js-set-public-block', 'click', function(event) {
				event.preventDefault();
				var that = this, $self = $(that), target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM),
				//
				elemInfo = target.data('eleminfo');
				D.box.editor.publicBlock&&D.box.editor.publicBlock.setPublicBlock(target,function(){
					dropInPage._hideAll();
				});
			});

		},
        linkSouce : function(target) {
            if(!target.hasClass('crazy-box-module')) {
                return;
            }
            //add by wljray on 2013.08.05 for 数据源功能根据用户角色区分
            var isYunYing=$('#isYunYing').val(),siteId = $('#site_id').val();
            if(typeof isYunYing!=='undefined'&&isYunYing==='true'){
                isYunYing=true;
            }else{
                isYunYing=false;
            }
            D.box.datasource.Panel&&D.box.datasource.Panel.init(target,isYunYing,siteId);
             
        },
		/**
		 * 组件上下移动方法实现
		 * @param target
		 */
		_moduleMoveUpOrDown : function(target, direction) {
			var _next = function(_module) {
				var _nModule = _module.next();
				if(_nModule && _nModule.hasClass('crazy-box-row')) {
					return _nModule;
				} else {
					return arguments.callee.call(this, _nModule);
				}
			}, _prev = function(_module) {
				var _pModule = _module.prev();
				if(_pModule && _pModule.hasClass('crazy-box-row')) {
					return _pModule;
				} else {
					return arguments.callee.call(this, _pModule);
				}
			}, tempModule = '';
			if(direction.hasClass('up')) {
				tempModule = _prev(target);
				tempModule.before(target);
			}
			if(direction.hasClass('down')) {
				tempModule = _next(target);
				tempModule.after(target);
			}
			D.BoxTools && D.BoxTools.setEdited && D.BoxTools.setEdited();
		},
		/**
		 * @methed _startEditArea 开始对编辑区域进行编辑，编辑标签或编辑cell
		 * @param singerArea jQuery对象，编辑区域
		 * @param btn jQuery对象，执行按钮
		 * @param currentBtnClass 当前按钮的class名
		 * @param addBtnClass 需要替换成的class名
		 * @param stateClass 给编辑区域加上用于标识正在编辑的class名
		 */
		_startEditArea : function(singerArea, btn, currentBtnClass, addBtnClass, stateClass) {
			var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(editor.Module.CONSTANTS.singerMain, singerArea), self = this;
			el.addClass(stateClass);
			singerMain.hide();
			singerArea.hide();
		},
		/**
		 *检测module是否可上下移动
		 *  @param target 当前元素 (组件的父节点 crazy-box-row)
		 */
		checkModuleMove : function(target, singerArea) {
			var self = this, moduleParent = target.parent(), $moduleList = moduleParent.find('.crazy-box-row');
			var index = $moduleList.index(target);

			if(index === 0) {
				$('.up', singerArea).hide();
			} else {
				$('.up', singerArea).show();
			}
			if(index === $moduleList.length - 1) {
				$('.down', singerArea).hide();
			} else {
				$('.down', singerArea).show();
			}

		},
		/**
		 *自动更换数据源
		 *数据源换皮肤 数据源相同 参数保持不变，不同则替换
		 * @param $target 当前页面中选中组件
		 * @param $src  组件库中将要放入页面中的组件
		 */
		changeDataSource : function($target, $src) {
			var tDataSources = [], sDataSources = [], tKeys = [], sKeys = [],
			//
			srcDS = $src.data('dsmoduleparam'), targetDS = $target.data('dsmoduleparam'), isSame = true;
			if(!targetDS || !srcDS) {
				return;
			}
			//处理当前页面选中组件对象的数据源
			if( targetDS instanceof Array) {
				tDataSources = (targetDS);
			} else {
				if(targetDS && targetDS.dataSource) {
					tDataSources.push(targetDS);
				}
			}
			//处理组件库中将要放入页面中的组件
			if( srcDS instanceof Array) {
				sDataSources = (srcDS);
			} else {
				if(srcDS && srcDS.dataSource) {
					sDataSources.push(srcDS);
				}
			}
			//获取数据源ID列表
			_.each(tDataSources, function(ds) {
				if(ds.dataSource) {
					tKeys.push(ds.dataSource);
				}

			});
			_.each(sDataSources, function(ds) {
				if(ds.dataSource) {
					sKeys.push(ds.dataSource);
				}

			});

			//判断是否相同数据源
			if(tKeys.length == sKeys.length && sKeys.length) {
				for(var i = 0; i < tKeys.length; i++) {
					if(!_.contains(sKeys, tKeys[i])) {
						isSame = false;
					}
				}

			} else {
				isSame = false;
			}
			//console.log(isSame);
			if(isSame) {
				$src.removeData('dsmoduleparam');
				$src.attr('data-dsmoduleparam', JSON.stringify(targetDS));

			}
		}
	};
	editor.Module.CONSTANTS = {
		singerMain : '.main'
	};

})(dcms, FE.dcms);
