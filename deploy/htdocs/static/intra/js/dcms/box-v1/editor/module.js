/**
 * @author springyu
 * @userfor  ����༭��ز���������༭����񣬸��Ƶ�
 * @date  2012-12-19
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
(function($, D) {
	var editor = D.box.editor, root = this, _ = root._;
	var YunYing = D.box.datasource && D.box.datasource.YunYing;
	editor.Module = {
		/**
		 * �����ʼ���¼�
		 * @param singerArea ѡ�к�Ĳ����������
		 * @param dropInPage ��ǰ�༭������
		 */
		moduleBtnsListener : function(singerArea, dropInPage) {
			var self = this, CONSTANTS = D.DropInPage.CONSTANTS;

			//΢����
			$('.' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN, singerArea).live('click', function(event) {
				event.preventDefault();
				self._startEditArea(singerArea, $(this), CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
				editor.Microlayout.showMicro(dropInPage, dropInPage.currentElem);

			});
			//��������¼�
			singerArea.delegate('.' + D.DropInPage.defConfig.newCopyButton, 'click', function(event) {
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				if(target.hasClass('crazy-box-module')) {
					target = target.closest('.crazy-box-row');
				}
				editor.operate.copyElement(target, dropInPage);
			});
			//04-01 qiuxiaoquan ���"ͬ��",��������ҳ�渡����
			singerArea.delegate('.' + D.DropInPage.defConfig.syncModuleButton, 'click', function(event) {
				var _oModule = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				//������module��html style css
				var htmlCode = D.DropInPage.getElemHtml(_oModule);
				var data = {};
				data['content'] = htmlCode;
				var eleminfo = $(_oModule).data("eleminfo");
				data['moduleId'] = eleminfo.id;
				D.showSyncDialog(eleminfo.id, data);

			});

			//���������Դ
			singerArea.delegate('.js-datasource', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.linkSouce(target, singerArea);
			});

			//��������ƶ�
			singerArea.delegate('.js-move', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				var $self = $(this);
				target = target.closest('.crazy-box-row');

				//������������ƶ� ֻ�����ƶ�row
				self._moduleMoveUpOrDown(target, $self);
				dropInPage._hideAll();

			});
			//��Ӫ���� ��������Զ���Դ����
			singerArea.delegate('.js-yunying-src', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), that = this, $self = $(that);
				if($self.hasClass('edit')) {
					$self.removeClass('edit');
					$self.html('Դ����');
					if(dropInPage.editTextarea.css('display') !== 'none'
					//
					&& target.closest('.' + dropInPage.config.defineCell).length === 0
					//
					&& target.closest(dropInPage.config.editTextarea).length === 0) {
						dropInPage._setDefineCodeView(dropInPage.editTextarea);
					}
				} else {
					$self.addClass('edit');
					$self.html('��ɱ༭');
					dropInPage._setDefineCodeView(dropInPage.editTextarea);
					YunYing && YunYing.setDefineCodeEdit(target, dropInPage);
				}

				return;
			});
			//��Ӫ���� �������Դ
			singerArea.delegate('.js-yunying-ds', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				self.linkSouce(target, singerArea);
				// YunYing && YunYing.showModuleDs(target, singerArea);
			});

			//��Ӫ���� ����
			singerArea.delegate('.js-yunying-waiting', 'click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);

				YunYing && YunYing.showWaiting(target, singerArea);

			});
			//�����������
			singerArea.delegate('.js-attr-module', 'click', function(event) {
				event.preventDefault();
				var target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
				$(document).trigger('box.panel.attribute.attr_handle_event', [target, 'module']);
			});
			//��ӻ�������
			singerArea.delegate('.js-module', 'click', function(event) {
				event.preventDefault();
				var that = this, $self = $(that), elemInfo, elemAttr, method = 'add-r',
				//
				target = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);

				elemAttr = {
					'width' : parseInt(target.css('width'))
				};
				if($self.hasClass('add')) {//����
					elemInfo = elemAttr;
				} else {// ����
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
			//����Ϊ��������
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
            //add by wljray on 2013.08.05 for ����Դ���ܸ����û���ɫ����
            var isYunYing=$('#isYunYing').val(),siteId = $('#site_id').val();
            if(typeof isYunYing!=='undefined'&&isYunYing==='true'){
                isYunYing=true;
            }else{
                isYunYing=false;
            }
            D.box.datasource.Panel&&D.box.datasource.Panel.init(target,isYunYing,siteId);
             
        },
		/**
		 * ��������ƶ�����ʵ��
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
		 * @methed _startEditArea ��ʼ�Ա༭������б༭���༭��ǩ��༭cell
		 * @param singerArea jQuery���󣬱༭����
		 * @param btn jQuery����ִ�а�ť
		 * @param currentBtnClass ��ǰ��ť��class��
		 * @param addBtnClass ��Ҫ�滻�ɵ�class��
		 * @param stateClass ���༭����������ڱ�ʶ���ڱ༭��class��
		 */
		_startEditArea : function(singerArea, btn, currentBtnClass, addBtnClass, stateClass) {
			var el = singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM), singerMain = $(editor.Module.CONSTANTS.singerMain, singerArea), self = this;
			el.addClass(stateClass);
			singerMain.hide();
			singerArea.hide();
		},
		/**
		 *���module�Ƿ�������ƶ�
		 *  @param target ��ǰԪ�� (����ĸ��ڵ� crazy-box-row)
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
		 *�Զ���������Դ
		 *����Դ��Ƥ�� ����Դ��ͬ �������ֲ��䣬��ͬ���滻
		 * @param $target ��ǰҳ����ѡ�����
		 * @param $src  ������н�Ҫ����ҳ���е����
		 */
		changeDataSource : function($target, $src) {
			var tDataSources = [], sDataSources = [], tKeys = [], sKeys = [],
			//
			srcDS = $src.data('dsmoduleparam'), targetDS = $target.data('dsmoduleparam'), isSame = true;
			if(!targetDS || !srcDS) {
				return;
			}
			//����ǰҳ��ѡ��������������Դ
			if( targetDS instanceof Array) {
				tDataSources = (targetDS);
			} else {
				if(targetDS && targetDS.dataSource) {
					tDataSources.push(targetDS);
				}
			}
			//����������н�Ҫ����ҳ���е����
			if( srcDS instanceof Array) {
				sDataSources = (srcDS);
			} else {
				if(srcDS && srcDS.dataSource) {
					sDataSources.push(srcDS);
				}
			}
			//��ȡ����ԴID�б�
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

			//�ж��Ƿ���ͬ����Դ
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
