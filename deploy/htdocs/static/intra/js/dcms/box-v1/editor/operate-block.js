/**
 * @author springyu
 * @userfor  �������ҵ���߼������������ƣ����ƣ�ɾ����
 * @date  2012-12-19
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
(function($, D) {
	var editor = D.box.editor;
	editor.operate = {
		/**
		 * @methed _enableDelStyle �Ƿ�����ɾ��sytle
		 * @param target jQuery����Ŀ��Ԫ��
		 * @param elem jQuery���󣬵�ǰԪ��
		 */
		enableDelStyle : function(target, elem) {
			var moduleClass = '.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'module', targetMel = target.closest(moduleClass)[0], elemMel = elem.closest(moduleClass)[0], enableDelStyle;
			if (targetMel === elemMel) {
				enableDelStyle = false;
			} else {
				enableDelStyle = true;
			}
			return enableDelStyle;
		},
		/**
		 * @methed �滻�ƶ��ķ��� -- add by hongss on 2012.12.05
		 * @param elem ��ѡ����Ҫ�ƶ�Ԫ��
		 * @param target ��ѡ��ͬ��Ҫ�ƶ���Ԫ�ؽ���λ�õ�Ԫ��
		 * @param level ��ѡ���㼶��layout|module|cell
		 * @param iframeDoc ��ѡ����ǰ�ĵ�
		 */
		moveToReplace : function(elem, target, level, iframeDoc) {
			var self = this, targetHtmlcode = D.ManagePageDate.handleCopyHtml(target, 'replace', elem, level, iframeDoc), elemHtmlcode = D.ManagePageDate.handleCopyHtml(elem, 'replace', target, level, iframeDoc), targetEl, elemEl, editAllSteps, editAfterSteps1, editDelStesp1, editAfterSteps2, editDelStesp2, enableDelStyle = self.enableDelStyle(target, elem), iframeBody = $('body', iframeDoc);

			editAfterSteps1 = D.InsertHtml.init({
				'html' : '<div></div>',
				'container' : elem,
				'insertType' : 'before',
				'doc' : iframeDoc,
				'isEdit' : true
			});
			elemEl = D.BoxTools.getElem(editAfterSteps1[0]['undo']['node'], iframeBody);
			editDelStesp1 = D.EditContent.editDel({
				'elem' : elem,
				'isEdit' : true
			});
			//target.after(targetEl);
			editAfterSteps2 = D.InsertHtml.init({
				'html' : '<div></div>',
				'container' : target,
				'insertType' : 'before',
				'doc' : iframeDoc,
				'isEdit' : true
			});
			targetEl = D.BoxTools.getElem(editAfterSteps2[0]['undo']['node'], iframeBody);
			editDelStesp2 = D.EditContent.editDel({
				'elem' : target,
				'isEdit' : true
			});

			//D.InsertHtml.init(this._getObjHtml(el), elem, 'replaceWith', self.iframeDoc);
			var editInsertSteps1 = D.InsertHtml.init({
				'html' : targetHtmlcode,
				'container' : elemEl,
				'insertType' : 'replaceWith',
				'doc' : iframeDoc,
				'isEdit' : true
			}),
			//target.replaceWith(elem);
			editInsertSteps2 = D.InsertHtml.init({
				'html' : elemHtmlcode,
				'container' : targetEl,
				'insertType' : 'replaceWith',
				'doc' : iframeDoc,
				'isEdit' : true
			});

			editAllSteps = editAfterSteps1.concat(editDelStesp1, editAfterSteps2, editDelStesp2, editInsertSteps1, editInsertSteps2);

			D.BoxTools.setEdited({
				'param' : editAllSteps,
				'callback' : null
			});
		},
		/**
		 * @methed copyToNext ����������һ���ֵܽڵ� add by hongss on 2013.01.09
		 * @param [elem] ��ѡ����Ҫ���Ƶ�Ԫ��
		 * @param [iframeDoc] ��ѡ����ǰ�ĵ�
		 */
		copyToNext : function(elem, iframeDoc) {
			var htmlcode = D.ManagePageDate.handleCopyHtml(elem, 'sibling', elem, 'layout', iframeDoc),
			 oDiv = $('<div/>'),$htmlcode=$(htmlcode),that = this;
			 that.copyElemInitDs($('div.crazy-box-module[data-dsmoduleparam]', $htmlcode));
			var _htmlCode = oDiv.append($htmlcode).html();
			//��HTML������ڱ�ʶ֮��
			editInsertSteps = D.InsertHtml.init({
				'html' : _htmlCode,
				'container' : elem,
				'insertType' : 'after',
				'doc' : iframeDoc,
				'isEdit' : true
			});
			D.BoxTools.setEdited({
				'param' : editInsertSteps,
				'callback' : null
			});
		},
		/**
		 * ���������layout ������Դ��ʼ��
		 */
		copyElemInitDs : function($dataList) {
			$dataList.each(function(index, obj) {
				var _$self = $(obj), dsmoduleparam = _$self.data('dsmoduleparam');

				if ( dsmoduleparam instanceof Array && dsmoduleparam.length) {
					for (var i = 0; i < dsmoduleparam.length; i++) {
						var param = dsmoduleparam[i];
						//������������Դ
						if (param['querytype'] && param['querytype'] === 'idc') {
							if (!$.isEmptyObject(param)
							//
							&& (!param['useNewId'] || param['useNewId'] === 'false')) {
								param['useNewId'] = "true";
							}
						}
						//��Դλ����Դ
						if (param['queryType'] && param['queryType'] === 'res') {
							if (!$.isEmptyObject(param)
							//
							&& (!param['isInit'] || param['isInit'] === 'true')) {
								param['isInit'] = "false";
							}
						}
					}
				} else {
					if (param['querytype'] && param['querytype'] === 'idc') {
						if (dsmoduleparam && !$.isEmptyObject(dsmoduleparam)
						//
						&& (!dsmoduleparam['useNewId'] || dsmoduleparam['useNewId'] === 'false')) {
							dsmoduleparam['useNewId'] = "true";
						}
					}

					//��Դλ����Դ
					if (dsmoduleparam && dsmoduleparam['queryType'] && dsmoduleparam['queryType'] === 'res') {
						if (!$.isEmptyObject(dsmoduleparam)
						//
						&& (!dsmoduleparam['isInit'] || dsmoduleparam['isInit'] === 'true')) {
							dsmoduleparam['isInit'] = "false";
						}
					}
				}
				_$self.removeData('dsmoduleparam');
				_$self.attr('data-dsmoduleparam', JSON.stringify(dsmoduleparam));
			});
		},
		/**
		 * ����һ��Ԫ�ط��ڴ�Ԫ������:Ŀǰ��moduleʹ�ô˷���
		 * @param {Object} target ��ѡ�� Ŀ��Ԫ��
		 * @param {Object} dropInPage ��ѡ����ǰ�༭������
		 */
		copyElement : function(target, dropInPage) {
			var that = this, $htmlcode = $(D.ManagePageDate.handleCopyHtml(target, '', target, dropInPage.chooseLevel, dropInPage.iframeDoc));
			$htmlcode.removeClass('box-level-self');
			$htmlcode.find('.box-level-self').removeClass('box-level-self');
			$htmlcode.removeClass(dropInPage.config.currentSinger);
			$htmlcode.find(dropInPage.config.currentSinger).removeClass(dropInPage.config.currentSinger);
			//springyu// D.InsertHtml.init(elemHtml, div, 'html', false);
			that.copyElemInitDs($('div.crazy-box-module[data-dsmoduleparam]', $htmlcode));

			var oDiv = $('<div/>');
			var _htmlCode = oDiv.append($htmlcode).html();
			var editInsertSteps = D.InsertHtml.init({
				'html' : _htmlCode,
				'container' : target,
				'insertType' : 'after',
				'doc' : dropInPage.iframeDoc,
				'isEdit' : true
			});

			D.BoxTools.setEdited({
				'param' : editInsertSteps,
				'callback' : null
			});
		}
	};

})(dcms, FE.dcms);
