/**
 * @author hongss
 * @userfor �������ҳ������ģ���е����ݲ���
 * @date  2012.02.13
 */

;(function($, D, ED, undefined) {
	/**
	 * @methed sendContent �������ҳ������ģ���е����ݲ���
	 * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
	 pageIdInput:input(jQuery���󣬴��pageId),
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
		/*init: function(opts){
		if (!(opts['container']&&opts['pageIdInput']
		&&opts['draftIdInput']&&opts['data'])){ return; }

		if (D.BoxTools.getIsEdited()===true){
		this._requestSave(opts);
		} else {
		if (opts['isReview']===true){
		this._openReview(opts);
		}
		if (opts['aftersave'] && $.isFunction(opts['aftersave'])===true){
		opts['aftersave'].call(this);
		}
		}
		},*/
		/**
		 * @methed save ����
		 * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����),
		 *                    pageIdInput:input(jQuery���󣬴��pageId),
		 *                      draftIdInput:input(jQuery���󣬴��draftId),
		 *                        form: form(jQuery����form��)
		 *                  }
		 */
		save : function(opts) {
			if (!(opts['container'] && opts['pageIdInput'] && opts['draftIdInput'] && opts['data'])) {
				return;
			}
			if (D.BoxTools.getIsEdited() === true) {
				this._requestSave(opts);
			} else {
				if (opts['preType'] === 'template') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
					var draftId = opts['draftIdInput'].val();
					window.location = D.domain + '/page/box/preview_template.html?flag=' + opts['flag'] + ( draftId ? '&draftId=' + draftId : '') + (opts['templateId'] ? '&templateId=' + opts['templateId'] : '') + (opts['templateType'] ? '&templateType=' + opts['templateType'] : '');
					return;
				}
				if (opts['preType'] === 'page' || opts['preType'] === 'dynamicPage') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
					var draftId = opts['draftIdInput'].val();
					window.location = D.domain + '/page/box/preview_page.html?from=' + opts['from'] + ( draftId ? '&draftId=' + draftId : '') + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
					return;
				}
				//                if(opts['preType'] === 'dynamicPage') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
				//                    var draftId = opts['draftIdInput'].val();
				//                    window.location = D.domain + '/page/dynamic/view_page.html?action=dynamic_page_manager_action&event_submit_do_view_page=true'  + ( draftId ? '&draftId=' + draftId : '') + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
				//                    return;
				//                }
				if (opts['complete'] && $.isFunction(opts['complete']) === true) {
					opts['complete'].call(this);
				}
			}
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
			pageId = opts['pageIdInput'].val(), draftId = opts['draftIdInput'].val(), tempType, prototype;
			if (opts['templateTypeInput']) {
				tempType = opts['templateTypeInput'].val();
			}
			if (opts['prototypeInput']) {
				prototype = opts['prototypeInput'].val();
			}

			//data['action'] = 'BoxDraftAction';
			//data['event_submit_do_savePageDraft'] = 'true';
			if (pageId) {
				opts.data['resourceId'] = pageId;
			}
			if (draftId) {
				opts.data['draftId'] = draftId;
			}
			if (tempType) {
				opts.data['templateType'] = tempType;
			}
			if (prototype) {
				opts.data['prototype'] = prototype;
			}

			if (opts['flag']) {
				opts.data['isLib'] = opts['flag'];
			} else {
				opts.data['isLib'] = 'F';
			}

			opts.data['content'] = D.BoxTools.handleDynamic(self.getContainerHtml(opts.container, pageId, tempType));

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
						if (opts['preType'] === 'template') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
							window.location = D.domain + '/page/box/preview_template.html?draftId=' + temp + '&flag=' + opts['flag'] + (opts['templateId'] ? '&templateId=' + opts['templateId'] : '') + (opts['templateType'] ? '&templateType=' + opts['templateType'] : '');
							return;
						}
						if (opts['preType'] === 'page') {//Ԥ������Ϊ �ڵ�ǰҳ��Ԥ��
							window.location = D.domain + '/page/box/preview_page.html?draftId=' + temp + '&from=' + opts['from'] + (opts['pageId'] ? '&pageId=' + opts['pageId'] : '');
							return;
						}
						if (!draftId && o.draftId) {
							opts['draftIdInput'].val(o.draftId);
						}
						if (!pageId && o.pageId) {
							opts['pageIdInput'].val(o.pageId);
						}
						/*if (opts['isReview']===true){
						 self._openReview(opts);
						 }*/
						D.BoxTools.resetEdited();
						if (opts['success'] && $.isFunction(opts['success']) === true) {
							opts['success'].call(this, o);
						}

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
		getContainerHtml : function(container, resourceId, tempType) {
			var div = $('<div />'), CONSTANTS = D.sendContent.CONSTANTS, that = this, data = {}, safeJudge = 0;
			//div.html(container.html());
			D.InsertHtml.init(container.html(), div, 'html', false);
			if (tempType) {//ģ��
				that._remove(div, that);
				return div.html();
			} else {
				$.ajax({
					url : D.domain + '/admin/check_safe_judge.htm?resourceId=' + resourceId,
					dataType : 'json',
					async : false,
					success : function(json) {
						if (json && json.safeJudge) {
							safeJudge = 1;
						}
					}
				});
			}

			if (safeJudge === 1) {
				var pageDescribe = D.pageDescribeFile.parse(div);
				if (!pageDescribe) {
					that._remove(div, that);
					return div.html();
				} else {
					return pageDescribe;
				}
			} else {
				that._remove(div, that);
				return div.html();
			}

		},
		_remove : function(div, that) {
			var CONSTANTS = D.sendContent.CONSTANTS;
			//ȥ�����༭���ݡ�ʱ�ӵ�class��
			that._removeClassName(div, CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
			//ȥ�����༭�ؼ���ʱ�ӵ�class��
			that._removeClassName(div, CONSTANTS.ENABLE_EDIT_CELL_CLASS_NAME);
			//ȥ������ǰԪ�ء�����ʱ�ӵ�class��
			that._removeClassName(div, CONSTANTS.TARGET_CURRENT_CLASS_NAME);
			that._removeClassName(div, CONSTANTS.LAYOUT_HIGHT_CLASS_NAME);
			that._removeClassName(div, D.box.editor.config.CLASS_LAYOUT_HIGHT_LIGHT);
			that._removeClassName(div, D.box.editor.config.CLASS_EDIT_HIGHT_LIGHT);
			//ȥ����JSʧЧ��ʱ�����ӵ�class��
			that._removeClassName(div, CONSTANTS.JS_CONTROL_CURRENT);
			//ɾ������ǰ�����ı�ʶ����
			that._removeElements(div, '.' + CONSTANTS.ENABLE_BEFORE_CLASS_NAME + ', .' + CONSTANTS.ENABLE_AFTER_CLASS_NAME);
			//ɾ��������Ϣ��ʾ
			that._removeElements(div, '.' + D.box.editor.config.CLASS_ERROR_MESSAGE);
			that._removeClassName(div, D.box.editor.config.CLASS_POSITION_RELATIVE);

			that._removeClassName(div, CONSTANTS.HEIGHT_LIGHT_CELL_CURRENT);
			that._removeClassName(div, 'crazy-box-module-error');
			that._removeClassName(div, 'box-level-self');
			that._removeTarget(div);

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
			});
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
		/**
		 * @methed _openReview ��Ԥ��ҳ��
		 * @param opts ��������������ע��
		 */
		_openReview : function(opts) {
			var pageId = opts['pageIdInput'].val(), url = D.domain + opts['previewUrl'] + '?draftId=' + opts['draftIdInput'].val();
			if (pageId) {
				url += '&pageId=' + pageId;
			}
			window.open(url);
		}
	};

	D.sendContent.CONSTANTS = {
		ENABLE_EDIT_AREA_CLASS_NAME : 'crazy-box-edit-area', //���༭���ݡ�ʱ�ӵ�class��
		ENABLE_EDIT_CELL_CLASS_NAME : 'crazy-box-edit-cell', //���༭�ؼ���ʱ�ӵ�class��
		TARGET_CURRENT_CLASS_NAME : 'crazy-box-target-current', //����ǰԪ�ء�����ʱ�ӵ�class��
		ENABLE_BEFORE_CLASS_NAME : 'crazy-box-before-singer', //������ǰ��������ݵı�ʶclass��
		ENABLE_AFTER_CLASS_NAME : 'crazy-box-after-singer', //�����ں���������ݵı�ʶclass��
		JS_CONTROL_CURRENT : 'crazy-box-control-current', //��JSʧЧ��ʱ�����ӵ�class��
		LAYOUT_HIGHT_CLASS_NAME : 'hight-light-red',
		HEIGHT_LIGHT_CELL_CURRENT : 'crazy-box-cell-current' //����ǰcell������ʱ�ӵ�class��

	};

})(dcms, FE.dcms, FE.dcms.box.editor);
