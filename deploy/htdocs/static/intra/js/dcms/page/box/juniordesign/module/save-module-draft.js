/**
 * @author pingchun.yupc
 * @userfor ��������ݸ�
 * @date  2013.09.23
 */

;(function($, D, ED, undefined) {
	/**
	 * @methed sendContent ��������ݸ�
	 * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
	 moduleIdInput:input(jQuery���󣬴��moduleId),
	 draftIdInput:input(jQuery���󣬴��draftId),
	 data: json(����������Ҫ�Ĳ�������pageId��draftId��content),
	 //isReview:boolean(�Ƿ���Ԥ��),
	 success:fn(����ɹ���Ļص�����),
	 error:fn(����ʧ�ܺ�Ļص�����),
	 complete: fn(�����ִ�У����δ�޸Ĺ�Ҳִ��)
	 //previewUrl:url
	 }
	 */
	D.sendContent = {
		/**
		 * @methed save ����
		 * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
		 *                    moduleIdInput:input(jQuery���󣬴��moduleId),
		 *                      draftIdInput:input(jQuery���󣬴��draftId),
		 *                        data:�ύ������
		 *                  }
		 */
		save : function(opts) {
			//console.log(opts);
			if (!(opts['container'] && opts['moduleIdInput'] && opts['draftIdInput'] && opts['data'])) {
				return;
			}
			this._requestSave(opts);

		},
		/**
		 * @methed save ����
		 * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
		 *                        pageIdInput:input(jQuery���󣬴��pageId),
		 *                          draftIdInput:input(jQuery���󣬴��draftId),
		 *                            content:input(jQuery���󣬴��content),
		 *                              form: form(jQuery����form��),
		 *                                previewUrl:url
		 *                     }
		 */
		review : function(opts) {
			if (!(opts['content'] && opts['pageIdInput'] && opts['container'] && opts['previewUrl'] && opts['draftIdInput'] && opts['form'])) {
				return;
			}

			var url = D.domain + opts['previewUrl'];
			//+'?draftId=' + opts['draftIdInput'].val()
			// opts['form'].attr('target', '_blank');
			opts['form'].attr('action', url);
			opts['content'].val(this.getContainerHtml(opts['container']));
			opts['form'].submit();
		},
		/**
		 * @methed _requestSave ���ͱ�������
		 * @param opts ������  ͬ��
		 */
		_requestSave : function(opts) {
			var self = this, url = D.domain + '/page/box/save_draft.htm?_input_charset=UTF-8',
			//data = {},
			moduleId = opts['moduleIdInput'].val(), draftId = opts['draftIdInput'].val();

			if (moduleId) {
				opts.data['resourceId'] = moduleId;
			}
			if (draftId) {
				opts.data['draftId'] = draftId;
			}
			opts.data['content'] = D.BoxTools.handleDynamic(self.getContainerHtml(opts.container));

			$.ajax({
				url : url,
				type : 'POST',
				data : opts.data,
				timeout : 15000, //��ʱʱ��
				async : false,
				success : function(o) {
					o = $.parseJSON(o);
					if (o.success === true) {
						var temp = draftId || o.draftId;
						
						if (!draftId && o.draftId) {
							opts['draftIdInput'].val(o.draftId);
						}
						if (!moduleId && o.moduleId) {
							opts['moduleIdInput'].val(o.moduleId);
						}

						if (opts['success'] && $.isFunction(opts['success']) === true) {
							opts['success'].call(this, o);
						}
						console.log(opts['complete']);
						if (opts['complete'] && $.isFunction(opts['complete']) === true) {
							opts['complete'].call(this, o);
						}
					} else {
						//���治�ɹ�ʱ�Ĵ���
						if (opts['error'] && $.isFunction(opts['error']) === true) {
							opts['error'].call(this, o);
						} else {
							//alert('ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���');
							D.Msg.error({
								timeout : 5000,
								message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
							});
						}
					}
				},
				error : function(o) {
					//���治�ɹ�ʱ�Ĵ���
					if (opts['error'] && $.isFunction(opts['error']) === true) {
						opts['error'].call(this, o);
					} else {
						D.Msg.error({
							timeout : 5000,
							message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
						});
					}
				}
			});
		},
		/**
		 * @methed getContainerHtml ��ȡ������HTML���룬��Ҫ�������޳�ϵͳ����ӵ�������class����
		 * @param container ָ������
		 */
		getContainerHtml : function(container) {
			var div = $('<div />'), CONSTANTS = D.sendContent.CONSTANTS, that = this;
			//div.html(container.html());
			D.InsertHtml.init(container.html(), div, 'html', false);
			//ȥ�����༭���ݡ�ʱ�ӵ�class��
			this._removeClassName(div, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
			//ȥ�����༭�ؼ���ʱ�ӵ�class��
			this._removeClassName(div, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);
			//ȥ������ǰԪ�ء�����ʱ�ӵ�class��
			this._removeClassName(div, CONSTANTS.TARGET_CURRENT_CLASS_NAME);
			this._removeClassName(div, CONSTANTS.LAYOUT_HIGHT_CLASS_NAME);
			this._removeClassName(div, D.box.editor.config.CLASS_LAYOUT_HIGHT_LIGHT);
			this._removeClassName(div, D.box.editor.config.CLASS_EDIT_HIGHT_LIGHT);
			//ȥ����JSʧЧ��ʱ�����ӵ�class��
			this._removeClassName(div, CONSTANTS.JS_CONTROL_CURRENT);
			//ɾ������ǰ�����ı�ʶ����
			this._removeElements(div, '.' + CONSTANTS.ENABLE_BEFORE_CLASS_NAME + ', .' + CONSTANTS.ENABLE_AFTER_CLASS_NAME);
			//ɾ��������Ϣ��ʾ
			this._removeElements(div, '.' + D.box.editor.config.CLASS_ERROR_MESSAGE);
			this._removeClassName(div, D.box.editor.config.CLASS_POSITION_RELATIVE);

			this._removeClassName(div, CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
			this._removeClassName(div, 'crazy-box-module-error');
			this._removeClassName(div, 'box-level-self');
			this._removeTarget(div);

			return div.html();
		},
		//ɾ����������Ϣ
		_removeTarget : function(container) {
			//ȡ������Ԫ�ص���ɫ����
			container.find('div.map-position').css({
				border : '0px'
			}).find('a.map-position-bg').attr({
				style : 'background:url(#);cursor:pointer;position:absolute;top:0;left:0;right:0;bottom:0;display:block;width:100%;height:100%;'
			}).siblings('span.delete').css({
				background : 'transparent'
			}).text('').siblings('span.resize').css({
				cursor : 'pointer',
				background : 'transparent'
			})
			//ɾ�����õ�Ԫ��
			container.find('div.map-position').find('span.delete').remove();
			container.find('div.map-position').find('span.resize').remove();
			container.find('.chagenTarget').remove();

			container.find('div.position-conrainer').each(function() {
				if ($(this).find('.map-position').size() == 0) {
					$(this).remove();
				}
			});

		},
		/**
		 * @methed _romveClassName �Ƴ�class��
		 * @param container ָ������
		 */
		_removeClassName : function(container, className) {
			container.find('.' + className).removeClass(className);
		},
		/**
		 * @methed _removeElements �Ƴ�Ԫ��
		 * @param container ָ������
		 */
		_removeElements : function(container, selector) {
			container.find(selector).remove();
		},
	}

	D.sendContent.CONSTANTS = {
		ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area', //���༭���ݡ�ʱ�ӵ�class��
		ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell', //���༭�ؼ���ʱ�ӵ�class��
		TARGET_CURRENT_CLASS_NAME : 'crazy-box-target-current', //����ǰԪ�ء�����ʱ�ӵ�class��
		ENABLE_BEFORE_CLASS_NAME : 'crazy-box-before-singer', //������ǰ��������ݵı�ʶclass��
		ENABLE_AFTER_CLASS_NAME : 'crazy-box-after-singer', //�����ں���������ݵı�ʶclass��
		JS_CONTROL_CURRENT : 'crazy-box-control-current', //��JSʧЧ��ʱ�����ӵ�class��
		LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red',
		HEIGHT_LIGHT_CELL_CURRENT : 'crazy-box-cell-current' //����ǰcell������ʱ�ӵ�class��

	}

})(dcms, FE.dcms, FE.dcms.box.editor);
