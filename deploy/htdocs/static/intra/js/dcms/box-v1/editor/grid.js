/**
 * @author springyu
 * @userfor  դ��༭����¼������������ƣ����Ƶ�
 * @date  2012-12-19
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
(function($, D) {
	var editor = D.box.editor,
	// add by hongss on 2012.08.01 for getGridsContent
	q952 = {
		'className' : 'w968',
		'class' : 'dcms-crazy-box-q952',
		'layoutType' : 'layout',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-float.css'
	}, q990 = {
		'className' : 'screen',
		'class' : 'dcms-crazy-box-q990',
		'layoutType' : 'layoutQ990',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-wide.css'
	}, h990 = {
		'className' : 'screen',
		'class' : 'dcms-crazy-box-h990',
		'layoutType' : 'layoutH990',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-op.css'
	};
	editor.Grid = {
		init : function(elem, iframeDoc) {
			var $layout = elem.closest('.crazy-box-layout'),
			//
			$layouts = $('.crazy-box-layout', iframeDoc),
			//
			operateEl = $('#crazy-box-operate-layout', iframeDoc),
			//
			LAYOUT_HIGHT_CLASS_NAME = editor.Grid.CONSTANTS.LAYOUT_HIGHT_CLASS_NAME;
			//ͨ�������޸�
			// if (!$layout[0]){
			//$layout =elem.closest('#crazy-box-banner');
			// }
			if($layout[0]) {
				D.HighLight.removeLightClassName($layouts, LAYOUT_HIGHT_CLASS_NAME);
				D.HighLight.addLightClassName($layout, LAYOUT_HIGHT_CLASS_NAME);
				D.HighLight.showLeft(operateEl, $layout, {
					'offsetTop' : 2
				});
				this._viewMoveStyle($layout, $layouts, operateEl);
			} else {
				operateEl.hide();
				iframeDoc.find('.' + LAYOUT_HIGHT_CLASS_NAME).removeClass(LAYOUT_HIGHT_CLASS_NAME);
			}

		},
		/**
		 * @methed �����й�layout(grid)�ĸ��� -- add by hongss on 2012.12.26
		 * @param iframeDoc ��ѡ����ǰ�ĵ�
         * 
		 */
		_hideGridHightLight : function(iframeDoc) {
			var operateEl = $('#crazy-box-operate-layout', iframeDoc), LIGHT_DATA_ELEMENT = editor.Grid.CONSTANTS.LIGHT_DATA_ELEMENT, LAYOUT_HIGHT_CLASS_NAME = editor.Grid.CONSTANTS.LAYOUT_HIGHT_CLASS_NAME, currentLayoutEl = operateEl.data(LIGHT_DATA_ELEMENT);

			D.HighLight.hideLight(operateEl);
			D.HighLight.removeLightClassName(currentLayoutEl, LAYOUT_HIGHT_CLASS_NAME);
		},
		/**
		 * @methed �����ϡ����ƶ��Ƿ���� -- add by hongss on 2012.12.06
		 * @param iframeDoc ��ѡ����ǰ�ĵ�
		 * @param singerArea ��ѡ��ѡ�к�Ĳ�������(��layout��)
         * 
		 */
		_viewMoveStyle : function(currentLayout, layouts, operateEl) {
			//else {
			$('.layout-movedown', operateEl).removeClass('disabled');
			$('.layout-moveup', operateEl).removeClass('disabled');
			$('.layout-copy', operateEl).removeClass('disabled');
			var index = layouts.index(currentLayout);
			//console.log(layouts.length);
			if(layouts.length === 1) {
				$('.layout-delect', operateEl).addClass('disabled');
			} else {
				$('.layout-delect', operateEl).removeClass('disabled');
			}
			if(index === 0) {
				$('.layout-moveup', operateEl).addClass('disabled');

			} else {
				$('.layout-moveup', operateEl).removeClass('disabled');
			}
			if(index === layouts.length - 1) {
				$('.layout-movedown', operateEl).addClass('disabled');
			} else {
				$('.layout-movedown', operateEl).removeClass('disabled');
			}
			//}

			//�������ܸ��ƺ��ƶ�
			if(currentLayout.hasClass('layout-fixed-right') || currentLayout.hasClass('layout-fixed-top') || currentLayout.hasClass('layout-fixed-bottom')) {
				//$('.layout-movedown', operateEl).addClass('disabled');
				//$('.layout-moveup', operateEl).addClass('disabled');
				$('.layout-copy', operateEl).addClass('disabled');
			}
		},
		/**
		 * @methed ��layout��������¼� -- add by hongss on 2012.12.04
		 * @param iframeDoc ��ѡ����ǰ�ĵ�
		 * @param singerArea ��ѡ��ѡ�к�Ĳ�������(��layout��)
		 */
		gridBtnsListener : function(dropInPage, singerArea) {
			var that = this, iframeDoc = dropInPage.iframeDoc, operateEl = $('#crazy-box-operate-layout', iframeDoc), LIGHT_DATA_ELEMENT = editor.Grid.CONSTANTS.LIGHT_DATA_ELEMENT, LAYOUT_HIGHT_CLASS_NAME = editor.Grid.CONSTANTS.LAYOUT_HIGHT_CLASS_NAME, self = this;
			//ɾ��
			operateEl.delegate('.layout-delect', 'click', function(e) {
				var delegateTarget = $(e.delegateTarget), $self = $(this), elem = delegateTarget.data(LIGHT_DATA_ELEMENT);
				if(!$self.hasClass('disabled')) {
					//ȥ�������class
					D.HighLight.removeLightClassName(elem, LAYOUT_HIGHT_CLASS_NAME);

					var editDelSteps = D.EditContent.editDel({
						'elem' : elem,
						'isEdit' : true
					});
					self.currentElem = null;
					D.BoxTools.setEdited({
						'param' : editDelSteps,
						'callback' : null
					});
					D.YunYing && D.YunYing.isVisualChange && D.YunYing.isVisualChange();
					//���ظ����������Ԫ��
					D.HighLight.hideLight(singerArea);
					D.HighLight.hideLight(delegateTarget);
				}

			});
			//����
			operateEl.delegate('.layout-copy', 'click', function(e) {
				var elem = $(e.delegateTarget).data(LIGHT_DATA_ELEMENT),$self = $(this);
				if(!$self.hasClass('disabled')) {
				D.HighLight.removeLightClassName(elem, LAYOUT_HIGHT_CLASS_NAME);

				D.box.editor.operate.copyToNext(elem, iframeDoc);

				D.HighLight.addLightClassName(elem, LAYOUT_HIGHT_CLASS_NAME);
				}
			});
			//����
			operateEl.delegate('.layout-moveup', 'click', function(e) {
				var $self = $(this);
				if(!$self.hasClass('disabled')) {
					self._moveUpOrDownActive('prev', e.delegateTarget, singerArea, iframeDoc);
				}
			});
			//����
			operateEl.delegate('.layout-movedown', 'click', function(e) {
				var $self = $(this);
				if(!$self.hasClass('disabled')) {
					self._moveUpOrDownActive('next', e.delegateTarget, singerArea, iframeDoc);
				}
			});
			//ѡ��
			operateEl.delegate('.layout-choose', 'click', function(e) {
				var elem = $(e.delegateTarget).data(LIGHT_DATA_ELEMENT);
				D.HighLight.hideLight(singerArea);
				D.ToolsPanel && D.ToolsPanel.addHtmlLayouAttr();
				//D.showAttr(elem);
				$(document).trigger('box.panel.attribute.attr_handle_event', [elem]);
			});
			//���դ��
			operateEl.delegate('.layout-add', 'click', function(event) {
				var elem = $(event.delegateTarget).data(LIGHT_DATA_ELEMENT),
                    gridType = D.box.editor.getGridType();
				D.YunYing.getGrids.apply(D.YunYing, [gridType, elem, dropInPage]);
			});
			/*$('.js-bottom-grid', iframeDoc).delegate('.js-btn-grid', 'click', function(event) {
				var elem, $layouts = $('.crazy-box-layout', iframeDoc), elem = $($layouts[$layouts.length - 1]);
				D.YunYing.getGrids.apply(D.YunYing, ['layoutH990', elem, dropInPage]);
			});*/
            $('#dcms_box_page_layout').bind('click', function(){
                var elem, $layouts = $('.crazy-box-layout', iframeDoc), elem = $($layouts[$layouts.length - 1]),
                    gridType = D.box.editor.getGridType();
				D.YunYing.getGrids.apply(D.YunYing, [gridType, elem, dropInPage]);
            });
		},
		/**
		 * @methed ���ơ����Ʒ��� -- add by hongss on 2012.12.05
		 * @param active ��ѡ������(prev)|����(next)
		 * @param operateEl ��ѡ��layout������Ԫ��
		 * @param singerArea ��ѡ��ѡ�к�Ĳ�������(��layout��)
		 * @param iframeDoc ��ѡ����ǰ�ĵ�
		 */
		_moveUpOrDownActive : function(active, operateEl, singerArea, iframeDoc) {
			var operateEl = $(operateEl), LIGHT_DATA_ELEMENT = editor.Grid.CONSTANTS.LIGHT_DATA_ELEMENT, elem = operateEl.data(LIGHT_DATA_ELEMENT), target = elem[active+'All']('.crazy-box-layout').eq(0), LAYOUT_HIGHT_CLASS_NAME = editor.Grid.CONSTANTS.LAYOUT_HIGHT_CLASS_NAME;

			//ȡ�����и���
			D.HighLight.hideLight(singerArea);
			D.HighLight.removeLightClassName(elem, LAYOUT_HIGHT_CLASS_NAME);
			D.HighLight.hideLight(operateEl);

			if(target[0]) {
				D.box.editor.operate.moveToReplace(elem, target, 'layout', iframeDoc);
			}

		},
		//��ȡ��ǰ��ʹ�õ�դ��
		getGridsContent : function(layoutType) {
			var grids = {};
			switch (layoutType) {
				case q952['layoutType']:
					grids = q952;
					break;
				case q990['layoutType']:
					grids = q990;
					break;
				case h990['layoutType']:
					grids = h990;
					break;
			}
			return grids;
		},
		// ��ʼ����ǰҳ��ѡ��������դ��
		initCurrentGrids : function(doc) {
			var elem = $('#content', doc), link = $('#crazy-box-fdev', doc), select = $('#layout-type');
			//��Ϊǰ����content�����������߾࣬����Ŀǰ����Ҫ���ᵼ���п���
			elem.css('margin-top', 0);
			elem.css('margin-bottom', 0);

			//��Ϊǰ����content�����������߾࣬����Ŀǰ����Ҫ���ᵼ���п���
			elem.css('margin-top', 0);
			elem.css('margin-bottom', 0);
			if(elem.hasClass(q952['class'])) {
				select.val(q952['layoutType']);
				select.trigger('change');
				link.attr('href', q952['link']);
				return;
			}
			if(elem.hasClass(q990['class'])) {
				select.val(q990['layoutType']);
				select.trigger('change');
				link.attr('href', q990['link']);
				return;
			}
			if(elem.hasClass(h990['class'])) {
				select.val(h990['layoutType']);
				select.trigger('change');
				link.attr('href', h990['link']);
				return;
			}

			select.val(h990['layoutType']);
			select.trigger('change');
			link.attr('href', h990['link']);
			return;

		},
		// ��ʼ��������ͨ���������Ƿ��
		initBannerNav : function(doc) {
			if($('#crazy-box-banner', doc).length > 0) {
				$('#nav-banner').attr('checked', 'checked');
			}
			if($('#crazy_box_footer', doc).length > 0) {
				$('#nav_footer').attr('checked', 'checked');

			}
			return;
		}
	};
	// ��ʼ����ǰҳ��ѡ��������դ��
	D.initCurrentGrids = editor.Grid.initCurrentGrids;
	D.initBannerNav = editor.Grid.initBannerNav;
	D.getGridsContent = editor.Grid.getGridsContent;
	//��������
	editor.Grid.CONSTANTS = {
		LIGHT_DATA_ELEMENT : 'elem', //�����ĵ�ǰԪ��
		LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red', //����layout��class��
		DEF_GRID_EVENT : 'grid_event', //չʾդ����������Զ����¼�����
		DEF_GRID_OPERATION_EVENT : 'grid_operation_event' //դ����������¼�� �Զ����¼�����
	};

})(dcms, FE.dcms);
