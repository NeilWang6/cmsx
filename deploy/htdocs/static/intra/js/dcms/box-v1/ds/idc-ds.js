/**
 * @author huangxt
 * @userfor  ������������Դ
 * @date  2013-9-24
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

/**
	2. ������������Դtabҳ�ϣ������ظ�У��
 */

;(function($, D, DS){
	var idcDomain = '',
		idcAjaxUrl = '', //idc�첽�����ַ
		FIELD_HTML='fieldHTML',
		dcmsTagId = 3,
		menuTab = null,
		selectFieldDialog = null,
		itemHtml = null,
		itemHtmlMlr = null,
		_target_ = null,
		_editor = null, 
		scriptExp = "<script type=\"text\/dcms-ds\">\\\s*(.*)\\\s*<\/script>(\n*)",
		idcDataArray = null;
		
    var view = {
    	/**
			//begin---û������tabҳʱר��
			showBox: function(i, dialog){
                var focus = $('header h5 a', dialog),
                    boxes = $('.ds-body', dialog),
                    focusEl = focus.eq(i);
                focus.removeClass('current');
                focusEl.addClass('current');
			
				boxes.hide();
                boxes.eq(i).show();
                
                this._setSubmitType(focusEl, dialog);
            },
			_setSubmitType: function(focusEl, dialog){
                var submitEl = $('footer .btn-submit', dialog);
                //modify by hongss on 2013.11.19 for ��tab��˳��������Ϊclass������
                if (focusEl.hasClass('join-datasource')){
                    submitEl.data('type', 'join');
                }else if(focusEl.hasClass('idc-datasource')) {
					submitEl.data('type', 'idc');
				}
            },
			eventTabs: function(dialog){
                var focus = $('header h5 a', dialog);
                focus.bind('click', function(){
                    var el = $(this),
                        i = focus.index(el);
                    view.showBox(i, dialog);
                });
            },
			_initModDs: function(dialog){
                var idcType = null,
					paramInfo = getParamInfo();
				if(paramInfo) {
					idcType = (JSON.parse(paramInfo)[0]||{})['querytype'];
				}
				
				if( idcType && idcType == 'idc' ) {
					this.showBox(1, dialog);
				} else {
                    this.showBox(0, dialog);
                }
            },
			//end---û������tabҳʱר��
			
			**/
			//�½������ڽ���ʱ����1��������null���޸�ҳ����ڵ�2��Ϊnull
            init: function(target, editor) {
				if(target) {
					_target_ = target;
				} else if(editor) {
					_editor = editor;
				}
				
				if(D.domain.indexOf('cms-test.cn.alibaba-inc.com:') != -1) {
					idcDomain = 'http://idatacenter-test.alibaba-inc.com:10100';
					idcAjaxUrl =  idcDomain + '/home/open/showdatasource.jsonp';
				} else {
					idcDomain = 'http://idatacenter.alibaba-inc.com';
					idcAjaxUrl = D.domain + '/idc/home/open/showdatasource.json';
				}
				
                var dialog = $('.ext-width');
                this._insertHtml(dialog);
				this.someBind();
				
				//���û�е�����tabҳ
				//if(notHasLastTab()) {
					//this._initModDs(dialog);
					//this.eventTabs(dialog);
				//}
            },
            _insertHtml: function(dialog){
				var data = {};
				data['tagId'] = dcmsTagId;
				data['creator'] = $('input[name="loginUserId"][type="hidden"]').val();
				
				var idcInfo,
					paramInfo = getParamInfo();
				if(paramInfo) {
					idcInfo = JSON.parse(paramInfo)[0] || {};
					if(idcInfo['querytype'] && idcInfo['querytype'] == 'idc') {
						$.ajax({
							url: D.domain + "/admin/query_rule.html?id=" + idcInfo['queryid'],
							data: {},
							cache: false,
							dataType:'jsonp'
						}).done(
							function(text) {
								if(text['result'] == 'success') {
									data['query'] = encodeURIComponent(JSON.parse(text['queryRuleDO'])['query']);
								}
								firstInitHtml(data, dialog);
							}
						);
					} else {
						firstInitHtml(data, dialog);
					}
				} else {
					firstInitHtml(data, dialog);
				}
				
                $('header h5 a', dialog).after('<a class="idc-datasource" href="#">������������Դ</a>');
				$('.js-ds-body', dialog).after('<div class="ds-body js-idc-body"></div>');
			},
			setDsModuleParam: function(dialog, callback){  //��������ȷ�ϰ�ťʱ
				var hasMoreThanOneTab = $('.js-idc-body .tab-b-ds', dialog).length > 1;
				
				var array = [], validateMsg = [];
				$('.js-idc-body .tab-b-ds', dialog).each(function(index, tab) {
					var combineId = $('select[name="dataSource"]', tab).val(),
					alias = $('input[name="alias"]', tab).val(),
					note = $('input[name="note"]', tab).val(),
					bizType = $('input[name="bizType"]', tab).val();
					
					if(!alias) {
						if(hasMoreThanOneTab) {
							alias = 'dataTable' + index;
						} else {
							alias = 'dataTable';
						}
					}
					// ��֤
					var validResult = D.idatacenter.validateQuery(tab, true);
					if (validResult) {
						for(var p in validResult){
							validResult[p] && validateMsg.push(validResult[p]);
						}
					}
					
					var data = {query: D.idatacenter.buildQuery(tab), combineId:combineId};
					data.alias = alias;
					note && (data.note = encodeURIComponent(note));
					bizType && (data.type = bizType);
					
					array.push(data);
				});
				
				// ��֤����
				if (validateMsg.length) {
					alert(validateMsg[0]);
					return;
				}
				
				if(!array || array.length == 0) {
					alert('��������Ϊ�գ�');
					return;
				}
				
				var fanchouData = makeFcParam(array);
				if(!fanchouData['vmContent']) {
					if(_editor) {
						//�����Դ���½����ʱ���Ȱ�����Դ����ô�����Ȳ����飬��Ϊ���ȷ����ʱ���ǻ����·����
						fanchouData['vmContent'] = "a123";
					} else {
						alert('δ��д������룡');
						return;
					}
				}
				
				//���� 
				$.ajax({
					url: D.domain + "/admin/display_field_extract.html",
					data: fanchouData,
					cache: false,
					type:'POST'
				}).fail(
					function() {
						alert("ϵͳ��æ�����Ժ����ԣ���");
					}
				).done(
					function(text) {
						var data = makeCrParam(text, array);
						
						//�ж��Ƿ���Ҫ����queryId
						var paramInfo = getParamInfo();
						if(paramInfo) {
							var paramInfoJson = JSON.parse(paramInfo)[0] || {},
								queryid = paramInfoJson['queryid'];
							
							//����������Դ���������ҳ��ʱ���໥Ӱ������⣬ͨ������һ����ʶ�����---begin
							var useNewId = paramInfoJson['useNewId'] && paramInfoJson['useNewId'] === 'true';
							var hasOperate = false;
							if(useNewId && getFromType() !== 2) {
								hasOperate = true;
							}
							
							//�������ʼ��ʹ���µ�id����Ϊ��������а汾���ƣ�ÿ�ΰ汾������Ҫ����ԭquery��
							var isPublicBlock = false;
							if(isFromPublicBlockPage()){
								isPublicBlock = true;
							}
							//����������Դ���������ҳ��ʱ���໥Ӱ������⣬ͨ������һ����ʶ�����---end
							
							if(queryid && parseInt(queryid) > 0 && (!useNewId || getFromType() === 2) && !isPublicBlock) {
								data['id'] = queryid;
							}
						}
						
						$.ajax({
							url: D.domain + "/admin/create_rule.html",
							data: data,
							cache: false,
							type:'POST',
							async :false
						}).done(
							function(text) {
								text = eval(text);
								if(text['result'] == 'success' && text['id'] && text['id'] != '') {
									var writeArray = [],
										wData = {};
									
									//����������Դ���������ҳ��ʱ���໥Ӱ������⣬ͨ������һ����ʶ�����---begin
									if(getFromType() === 2) {
										wData['useNewId'] = 'true';
									}
									if(hasOperate) {
										wData['useNewId'] = 'false';
									}
									//����������Դ���������ҳ��ʱ���໥Ӱ������⣬ͨ������һ����ʶ�����---end
									
									wData['type'] = data['type'];
									wData['querytype'] = 'idc';
									wData['queryid'] = text['id'];
									writeArray.push(wData);
									
									writeParamInfo(writeArray);
									
									idcDataArray = array;
									
									callback && callback.call(D.box.datasource, writeArray);
								} else {
									alert('����ʧ�ܣ����Ժ����ԣ�');
								}
							}
						).fail(
							function() {
								alert("ϵͳ��æ�����Ժ����ԣ�");
							}
						);
					}
				);
            },
            //���ⲿ���õĸ��·������ݵĺ���
            upFcDataForNewModule: function(editor) {
				_editor = editor;
				var paramInfo = getParamInfo();
            	
            	if(!paramInfo) {
            		console && console.log("���δ������Դ������Ҫ���飡");
            		return;
            	}
            	
				var paramJson = JSON.parse(paramInfo)[0] || {};
				if(!paramJson['querytype'] || paramJson['querytype'] != 'idc') {
					console && console.log("���δ��IDC����Դ������Ҫ���飡");
            		return;
				}
				
				//���û���������Ļ�����Զ��ȡһ��
				if(!idcDataArray) {
					$.ajax({
						url: D.domain + "/admin/query_rule.html?id=" + paramJson['queryid'],
						data: {},
						type:'POST',
						async :false
					}).done(
						function(text) {
							try {
								text = eval(text);
								if(text['result'] == 'success') {
									var query = JSON.parse(text['queryRuleDO'])['query'],
										queryArray = JSON.parse(query);
									
									for(var i=0; i<queryArray.length; i++) {
										var queryStr = queryArray[i]['query'],
											newStr = queryStr.replace(/(^|&)idcFields=[^&=]*/ig,'');
										
										if(newStr.charAt(0) === '&') {
											newStr = newStr.substring(1, newStr.length);
										}
										
										queryArray[i]['query'] = newStr;
										
										//������������
										//queryArray[i]['query'] = encodeURIComponent(newStr);
										//if(queryArray[i]['note']) {
										//	queryArray[i]['note'] = encodeURIComponent(queryArray[i]['note']);
										//}
									}
									
									idcDataArray = queryArray;
								} else {
									return;
								}
							} catch(e) {
								console && console.log(e);
								return;
							}
						}
					);
				}
				
				try {
					//���췴�����
					var fanchouData = makeFcParam(idcDataArray);
					if(!fanchouData['vmContent']) {
						console && console.log("δ��д���Դ�룡");
						return;
					}
            	
					//���� 
					$.ajax({
						url: D.domain + "/admin/display_field_extract.html",
						data: fanchouData,
						cache: false,
						type:'POST',
						async :false
					}).fail(
						function() {
							alert("����ʧ�ܣ�");
						}
					).done(
						function(text) {
							var data = makeCrParam(text, idcDataArray);
							data['id'] = paramJson['queryid'];
							
							$.ajax({
								url: D.domain + "/admin/create_rule.html?_input_charset=UTF-8",
								data: data,
								cache: false,
								type:'POST',
								async :false
							}).done(
								function(text) {
									text = eval(text);
									if(!text || text['result'] != 'success' || !text['id'] || text['id'] == '') {
										alert("���򴴽�ʧ�ܣ���̨����");
									}
								}
							).fail(
								function() {
									alert("���򴴽�ʧ�ܣ�ϵͳ����");
								}
							);
						}
					);
				} catch(e) {
					console && console.log(e);
				}
            },
			someBind: function() {  //�����ֶθ����many��
				$.use('ui-dialog', function(){
					newFieldsDialog();
					
					$(".js-idc-body").delegate(".btn-show-fields", "click", function(){
						var parent = getCurrentTab(), fieldsHTML = parent.data(FIELD_HTML);
						if (!fieldsHTML) {
							 fieldsHTML =  $('.all-fields-container', parent).html();
							 parent.data(FIELD_HTML, fieldsHTML);
						}
						if (!fieldsHTML) {
							alert('��ѡ������Դ��');
							return;
						}
						$('.selectFieldDialog section').html(fieldsHTML || '');
						selectFieldDialog = $('.selectFieldDialog').dialog({
							center: true,
							fixed:true
						});
						initPreviewQuery();
					});
					
					$('.selectFieldDialog .btn-cancel, .selectFieldDialog .close').click(function(){
						selectFieldDialog.dialog('close');
					});   
					//����ı��� 
					$(".selectFieldDialog").delegate(".code textarea", "focus", function(){
						$(this).select();
					});
					// ���ȫѡ
					$(".selectFieldDialog").delegate(".allTag", "click", function(){
						var checked = $(this).attr('checked');
						$(".selectFieldDialog .searchable-field").each(function(){
							var elm = $(this), 
								li = elm.closest('li');
							// �Ѿ�ѡ�еı�ǩ
							if(checked && elm.attr('checked')) 
								return;
							if (li.css('display') != 'none' && li.closest('.fields').css('display') != 'none') {
								elm.attr('checked', checked ? true : false);
							}
						});
						checkField();
					});
					
					// �����ǩ
					$(".selectFieldDialog").delegate(".tag", "click", function(){
						var _this=this, tagId = $(this).data('val'), check = !$(this).hasClass('current');
						$(this).parent().find('.tag').each(function(){ 
							this == _this ? $(this).toggleClass('current') :  $(this).removeClass('current');
						});
						$(".selectFieldDialog .allTag").attr('checked', false);
						// �����������ı�ǩ
						D.idatacenter.searchByTag(tagId, check, searchByTagId);
						return false;
					});
					// �������
					$(".selectFieldDialog").delegate(".search-btn", "click", function(){
						searchByKeyword();
					});
					// �س�����
					$(".selectFieldDialog").delegate(".keywords", "keydown", function(e){
						if (e.which == 13) {
							searchByKeyword();
						}
					});
					// ����ֶ�
					$(".selectFieldDialog").delegate(".searchable-field", "click", function(){
						checkField();
					});   	
					// Ԥ��Query
					$(".selectFieldDialog").delegate(".open-query", "click", function(e){
						var link = $(this);
						if (link.hasClass('btn-disabled')){
							e.preventDefault();
							return false;
						}
						var fields = getSelectFields(), queryString = buildQueryWithFields(fields);
						if (queryString) queryString += "&app=DCMS";
						setHref(false, link, queryString);
						return true;
					});
				});
				
				// ��������
				$(".js-idc-body").delegate(".btn-test", "click", function(){
					var domain = '';
					if(D.domain.indexOf('cms-test.cn.alibaba-inc.com:') != -1) {
						domain = 'http://idatacenter-test.alibaba-inc.com:10100';
					} else {
						domain = 'http://idatacenter.alibaba-inc.com';
					}
				
					var tab = getCurrentTab(), 
					queryParams = D.idatacenter.getValue(tab) || {}, 
					query = $.param(queryParams), 
					form=$('#previewForm', tab), 
					combineId = $('select[name="dataSource"]', tab).val(), 
					fields = getSelectFields();
					
					if (query) {
						// Ԥ��Query
						fields && (query += ('&idcFields=' + fields));
						form.attr('action', domain + '/home/preview_datasource.html');
						$('input[name="queryString"]', form).val(query);
						$('input[name="combineId"]', form).val(combineId);
						form[0].submit();
					} else {
						alert('����������һ����ѯ������');
					}
				});
			}
        };
    
	
	//��װ---begin
	//�ж���Դ��1��ʾ���ױ༭����2��ʾԴ���½����
	function getFromType() {
		if(_target_ && !_editor) {
			return 1;
		} else if(!_target_ && _editor) {
			return 2;
		}
		
		return 0;
	}
	//�ж��Ƿ��Ǵӱ༭��������ҳ������
	function isFromPublicBlockPage() {
		var result = $('input[name="designModuleType"][type="hidden"]').val();
		if( (typeof result !== 'undefined') && (result === 'public_block') ){
			return true;
		}
		return false;
	}
	//�ж��Ƿ�����Ӫ��ɫ
	function isYunying() {
		var isYunYing = false;
		if( typeof $('#isYunYing').val() !== 'undefined' && $('#isYunYing').val() === 'true' ){
			isYunYing = true;
		}
		return isYunYing;
	}
	//�ж��Ƿ��Ǵ�Ԥ�����ҳ������
	function isFromPreviewDesignPage() {
		var result = $('input[name="pageFlag"][type="hidden"]').val();
		if( (typeof result !== 'undefined') && (result === 'previewDesign') ){
			return true;
		}
		return false;
	}
	//�ж�:�Ƿ��е�����tabҳ���磺�½����ҳ�����ڡ���Ӫ��ɫ�������������Դ���½����Ԥ��ҳ���
	function notHasLastTab() {
		if(!_target_ || isYunying() || isFromPublicBlockPage() || isFromPreviewDesignPage()) {
			return true;
		} else {
			return false;
		}
	}
	//��ȡ���Դ����
	function getContent() {
		if(_target_) {
			if(_target_.attr('data-dsdynamic')) {
				return _target_.attr('data-dsdynamic');
			} else if($('[data-dsdynamic]', _target_) && $('[data-dsdynamic]', _target_).attr('data-dsdynamic')) {
				return $('[data-dsdynamic]', _target_).attr('data-dsdynamic');
			}
		} else if(_editor) {
			var content = _editor.getValue(),
				_dsExce =  new RegExp(scriptExp, 'ig');
			
			content = content.replace(_dsExce,'');
			
			return content;
		}
		
		return null;
	}
	//��ȡҳ�������json����
	function getParamInfo() {
		if(_target_) {
			return _target_.attr('data-dsmoduleparam');
		} else if(_editor) {
			var dsmoduleParam = null,
				_dsExce =  new RegExp(scriptExp, 'ig'),
				dataList = _dsExce.exec(_editor.getValue());
			
			if(dataList){
				dsmoduleParam = dataList[1];
			}
			
			return dsmoduleParam;
		}
		
		return null;
	}
	//���µ�json����д��
	function writeParamInfo(writeArray) {
		if(_target_) {
			_target_.attr('data-dsmoduleparam', JSON.stringify(writeArray));
		} else if(_editor) {
			var content = _editor.getValue();
			
			var str ='',
				_dsExce =  new RegExp(scriptExp, 'ig');
			
			content = content.replace(_dsExce,'');
			
			if(writeArray && writeArray.length>0) {
				str +='<script type="text\/dcms-ds">\n';
				str +=JSON.stringify(writeArray);
				str +='\n<\/script>\n';
			}
			str+=content;
			_editor.setValue(str);
		}
	}
	//��װ---end
	
	//������װ
	//���췴���첽�������
	function makeFcParam(array) {
		var fanchouDataCombineMap = {};
		for(var k = 0; k < array.length; k++) {
			fanchouDataCombineMap[array[k]['alias'].toString()] = array[k]['combineId'];
		}
		
		var fanchouData = {};
		fanchouData['combineMap'] = JSON.stringify(fanchouDataCombineMap);
		var content = getContent();
		fanchouData['vmContent'] = content ? encodeURIComponent(content) : content;
		
		return fanchouData;
	}
	
	//����create rule �첽�������
	function makeCrParam(text, array) {
		var _array = array.concat();
		
		//{"dataTable":{"combineId":"51","displayFieldList":["subject","price","offerId","viewName"]}}
		//{dataTable={combineId=105, subFields={memberList=[cName, address], offerList=[TITLE, PUREPRICE]}, displayFieldList=[viewName, blockId]}}
		var textJson = JSON.parse(text);
		for(var m=0; m<_array.length; m++) {
			_array[m] = $.extend({}, _array[m]);
			
			var tabData = textJson[_array[m]['alias']];
			if(tabData) {
				var dispFields = tabData['displayFieldList'];
				if(dispFields && dispFields.length > 0) {
					var idcFields = "";
					for(var n=0; n<dispFields.length; n++) {
						idcFields = idcFields + "," + dispFields[n];
					}
					_array[m]['query'] = _array[m]['query'] + "&idcFields=" + encodeURIComponent(idcFields);
				}
				
				//һ������Ӧ��ϵjson�ṹ��{"105offerList":107}
				var subFields = tabData['subFields'],
					sonInfosStr = $('.js-son-infos').val();
				if(subFields && sonInfosStr && sonInfosStr !='') {
					var sonInfos = JSON.parse(sonInfosStr);
					
					//��Աά�ȶ����ڵ�
					var memberListFields = subFields['memberList'],
						memberSonId = sonInfos[tabData['combineId'] + "memberList"];
					if(memberListFields && memberListFields.length > 0 && memberSonId) {
						var key = "&idcFields-" + memberSonId.toString() + "=";
						
						var memberFields = "";
						for(var n=0; n<memberListFields.length; n++) {
							memberFields = memberFields + "," + memberListFields[n];
						}
						
						_array[m]['query'] = _array[m]['query'] + key + encodeURIComponent(memberFields);
					}
					
					//offerά�ȶ����ڵ�
					var offerListFields = subFields['offerList'],
						offerSonId = sonInfos[tabData['combineId'] + "offerList"];
					if(offerListFields && offerListFields.length > 0 && offerSonId) {
						var key = "&idcFields-" + offerSonId.toString() + "=";
						
						var offerFields = "";
						for(var n=0; n<offerListFields.length; n++) {
							offerFields = offerFields + "," + offerListFields[n];
						}
						
						_array[m]['query'] = _array[m]['query'] + key + encodeURIComponent(offerFields);
					}
				}
			}
		}
		
		var bizType = '';
		for(var i=0; i<_array.length; i++) {
			if(bizType.indexOf(_array[i]['type']) == -1) {
				bizType = bizType + ',' +_array[i]['type'];
			}
		}
		
		var data = {};
		data['query'] = JSON.stringify(_array);
		data['queryType'] = 'idc';
		data['type'] = bizType;
		
		return data;
	}
	//������װend
	
	function firstInitHtml(_data, dialog) {
		//��ȡ��Ȩ�޵�վ��id���б�
		$.ajax({
			url: D.domain + "/page/idcDsList.html",
			data: {},
			type:'POST',
			async :false
		}).done(
			function(text) {
				try {
					text = eval(text);
					if(text['result'] == 'success') {
						_data['idsHasPerm'] = text['ids'];
					} else {
						console && console.log(text);
						return;
					}
				} catch(e) {
					console && console.log(e);
					return;
				}
			}
		);
		
		$.ajax({
			url:idcAjaxUrl,
			data: _data,
			cache: false,
			type: 'POST',
			dataType: (idcAjaxUrl.indexOf('http://idatacenter-test.alibaba-inc.com:') != -1) ? 'jsonp' : 'json'
		}).done(
			function(text) {
				if(!text.hasError) {
					$('.js-idc-body', dialog).html(text.content);
					changePinBlockByTid();
					
					// ��ʼ��Tab
					menuTab = new D.MenuTab({
						handlerCon : '.js-idc-body .idc-tab-head',
						handlerEls : 'li',
						boxCon : '.js-idc-body .idc-tab-body',						
						boxEls : '.tab-b-ds',
						closeEls : '.js-idc-body .icon-close'
					});
					// �������Դ
					$addBtn = $('.add-btn', '.js-idc-body');
					$addBtn.unbind();
					$addBtn.bind('click', function(e) {
						e.preventDefault();
						createTab();
					});
					$(".js-idc-body").delegate(".topic-link", "click", function(event){
							event.stopImmediatePropagation();
							var that = this,$self = $(that),$parent=$self.closest('.js-filter-item'),$topicId=$('input.topicId',$parent);
							$self.attr('target','_blank');
							if($topicId.val()){//335201
								var cmsDomain = D.domain,elfDomain='http://elf.b2b.alibaba-inc.com';
								if(cmsDomain.indexOf('cms-test.cn.alibaba-inc.com:')!==-1){
									elfDomain = 'http://elf-test.china.alibaba-inc.com:41100';
								}
								$self.attr('href',elfDomain+"/enroll/v2012/arrange_block.htm?topicId="+$topicId.val());
							} else {
								event.preventDefault();
								alert('ר��ID����Ϊ��!');
								return;
							}
					});
						$(".js-idc-body").delegate(".topic-arrange", "click", function(event){
							event.stopImmediatePropagation();
							var that = this,$self = $(that),$parent=$self.closest('.case'),$topicId=$('input.topicId',$parent);
							$self.attr('target','_blank');
							if($topicId.val()){//335201
								var cmsDomain = D.domain,elfDomain='http://elf.b2b.alibaba-inc.com';
								if(cmsDomain.indexOf('cms-test.cn.alibaba-inc.com:')!==-1){
									elfDomain = 'http://elf-test.china.alibaba-inc.com:41100';
								}
								$self.attr('href',elfDomain+"/enroll/v2012/arrange_block.htm?topicId="+$topicId.val());
							} else {
								event.preventDefault();
								alert('ר��ID����Ϊ��!');
								return;
							}
					});
					
					//�������ǩ�¼��ļ���
					$(".js-idc-body").delegate(".js-filter-tag", "click", function(){
						var tagId = $(this).data("tagid");
						
						$('li.js-filter-item').each(function(){
							$(this).removeClass("fd-hide");
							
							if(tagId != "-1" && $(this).data("config").tags.indexOf(tagId) < 1) {
								$(this).addClass("fd-hide");
							}
						});
					});
					
					// �л�һ������Դ
					$(".js-idc-body").delegate(".ds-select", "change", function(){
						var elm=$(this), tab=elm.closest('.tab-b-ds'), fieldsElm = tab.find('.ds-fields'), selCombineId = elm.val() || 0;
						var data = { id:selCombineId, showField:true};
						data.tagId = dcmsTagId;
						data.creator = $('input[name="loginUserId"][type="hidden"]').val();
						selCombineId > 0 && showDatasourceInfo(data, function(data){
							if (!data.hasError) {
								tab.removeData(FIELD_HTML);
								fieldsElm.html(data.content);
								changePinBlockByTid();
							}
						});
					});
					
					//���mlr
					$(".js-idc-body").delegate(".field-multline .add", "click", function(){
						if(!itemHtmlMlr) {
							itemHtmlMlr = $(".field-multline .item")[0] ? $(".field-multline .item").eq(0).html().replace('add','delete').replace(/<label style=".+">.+<\/label>/im,'<label></label>'):'';
						}
						$(this).parents('.field-multline').append('<div class="item">' + itemHtmlMlr + '</div>');
						
						return false;
					});
					//�������
					$(".js-idc-body").delegate(".sort-rows .add", "click", function(){
						if(!itemHtml) {
							itemHtml = $(".sort-rows")[0] ? $(".sort-rows").html().replace('add','delete').replace(/<label>.+<\/label>/im,'<label></label>'):'';
						}
						$(".sort-rows").append(itemHtml);
						return false;
					});
					// ɾ������
					$(".js-idc-body").delegate(".sort-rows .delete, .js-filter-item .delete", "click", function(){
						$(this).parent('.item').remove();
						return false;
					});
					
					//����DCMSר�е��ֶΣ�������������
					if(_data['query']) {
						var _dataQuery= JSON.parse(decodeURIComponent(_data['query']));
						$('.js-idc-body .tab-b-ds', dialog).each(function(index, tab) {
							_dataQuery[index]['alias'] && $('input[name="alias"]', tab).val(_dataQuery[index]['alias']);
							_dataQuery[index]['note'] && $('input[name="note"]', tab).val(decodeURIComponent(_dataQuery[index]['note']));
						});
					}
					
					changeTabTitle(dialog);
					
					//���վ���û�����һЩ��������ش���
					$.use('util-cookie', function(){
						var isOut = $.util.cookie('__dcms_');
						if(isOut) {
							$('li.view-data').css('display', 'none');
						}
					});
				}
			}
		);
	}
	
	//����ÿһ��tabҳ�ı�ǩ�İ�
	function changeTabTitle(dialog) {
		var $texts = $('.list-tab-ds li span.title', '.js-idc-body'), 
			$titles = $('.list-tab-ds li span.block', '.js-idc-body');
		
		$('.js-idc-body .tab-b-ds', dialog).each(function(index, tab) {
			var tabTitle = $('input[name="note"]', tab).val();
			if(tabTitle && tabTitle !='') {
				$($texts[index]).html(tabTitle);
				$($titles[index]).attr('title', tabTitle);
			}
		});
	}
	
	//ר��Ʒ����Դ��Ӹ���ר��id��̬�л������б���߼�
	function changePinBlockByTid() {
		//ѭ��idc���ÿһ��tabҳ
		$('.tab-b-ds', '.js-idc-body').each(function(index, obj) {
			var _$obj = $(obj),
				$topicId = $('input[name="topicId"]', _$obj),
				$blockId = $('select[name="blockId"]', _$obj),
				$topicIdSh = $('input[name="topicIdSh"]', _$obj),
				$blockIdSh = $('select[name="blockIdSh"]', _$obj);
			
			//�����ר��Ʒ����Դ
			if($topicId[0] && $blockId[0]) {
				//����ǳ�ʼ������ʱ���Ѿ��Ǹ�����Դ�������ﴦ�����
				var oldBlockId = $blockId.data('value');
				if(oldBlockId && oldBlockId != '') {
					$blockId.empty();
					var topicInfo = D.box.datasource.Topic.loadBlocks($topicId.val(), oldBlockId, '5');
					if(topicInfo && topicInfo.options) {
						$blockId.append(topicInfo.options);
					}
				}
				
				//���ﴦ��tid�����ֵ�仯ʱ���߼�
				$topicId.bind('input', function(event) {
					var _$self = $(this),
						topicVal = _$self.val(),
						topicInfo = D.box.datasource.Topic.loadBlocks(topicVal, null, '5');
					
					$blockId.empty();
					if(topicInfo && topicInfo.options) {
						$blockId.append(topicInfo.options);
					}
				});
			}
			
			//�����ר��������Դ
			if($topicIdSh[0] && $blockIdSh[0]) {
				//����ǳ�ʼ������ʱ���Ѿ��Ǹ�����Դ�������ﴦ�����
				var oldBlockId = $blockIdSh.data('value');
				if(oldBlockId && oldBlockId != '') {
					$blockIdSh.empty();
					var shTopicInfo = D.box.datasource.Topic.loadBlocks($topicIdSh.val(), oldBlockId, '6');
					if(shTopicInfo && shTopicInfo.options) {
						$blockIdSh.append(shTopicInfo.options);
					}
				}
				
				//���ﴦ��tid�����ֵ�仯ʱ���߼�
				$topicIdSh.bind('input', function(event) {
					var _$self = $(this),
						topicVal = _$self.val(),
						topicInfo = D.box.datasource.Topic.loadBlocks(topicVal, null, '6');
					
					$blockIdSh.empty();
					if(topicInfo && topicInfo.options) {
						$blockIdSh.append(topicInfo.options);
					}
				});
			}
		});
	}
	
	/**
	 * ��ʾ����Դ��Ϣ
	 */ 
	function showDatasourceInfo(data, callback) {
		$.ajax({
			url:idcAjaxUrl,
			data: data,
			cache: false,
			type: 'POST',
			dataType: (idcAjaxUrl.indexOf('http://idatacenter-test.alibaba-inc.com:') != -1) ? 'jsonp' : 'json'
		}).done(callback);	
	}
	
	D.idatacenter.getCurrentTab = getCurrentTab;
	D.idatacenter.getSelectFields = getSelectFields;
	
	function newFieldsDialog(callback) {
		if($('.js-idc-selectFieldDialog')[0]) {
			return;
		}
		
		var selectDialogHtml = '<div class="dialog-basic selectFieldDialog js-idc-selectFieldDialog" >' + 
            '<div class="dialog-b">' +
                '<header><a href="#" class="close">�ر�</a><h5>����Դʾ������</h5></header>' +
                '<section></section>' +
                '<footer><button type="button" class="btn-basic btn-gray btn-cancel">�� ��</button><a href="'+
				idcDomain +
				'/home/open/query.json" target="_blank" class="btn-basic btn-gray open-query" style="display:none">Ԥ��Query����</a></footer>' +
            '</div>' +
        '</div>';
		$(selectDialogHtml).appendTo($('.js-dialog').parent());
	}
	
	function searchByKeyword() {
		var keyword = $('.selectFieldDialog .keywords').val();
		D.idatacenter.searchByKeyword(keyword, function(elm, clear){
			var selectElm = $(elm).next('em');
			if (clear) {
				selectElm.removeClass('highlight-search-field');
			} else {
				selectElm.addClass('highlight-search-field');
			}
		});
	}
	
	function searchByTagId(elm, eventType) {
		var selectElm = $(elm).next('em'), li;
		
		// �߶�
		if (D.idatacenter.OPER_TYPE_HIGH_SHOW == eventType) {
			selectElm.addClass('highlight-field');
			li = $(elm).closest('li');
			li.css('display','');
			li.closest('.fields').css('display','');
		} else if(D.idatacenter.OPER_TYPE_HIDE == eventType){
			selectElm.removeClass('highlight-field');
			$(elm).closest('li').css('display','none');
			var show = false;
			$(elm).closest('ul').find('li').each(function(){
				show = show || $(this).css('display') != 'none';
			});
			if (!show) $(elm).closest('.fields').css('display','none');
				
		}else if(D.idatacenter.OPER_TYPE_SHOW == eventType){
			selectElm.removeClass('highlight-field');
			li = $(elm).closest('li');
			li.css('display','');
			li.closest('.fields').css('display','');
		}	
	}
	
	function checkField() {
		var codeArea =  $('.selectFieldDialog .code textarea'),
			map = {};
		
		$(".selectFieldDialog .searchable-field").each(function(){
			var ele = $(this),
				config = ele.data('ds-cfg-info'),
				rowName =  config.subModelKey ? config.subModelKey.replace('List','') : 'row',
				lineCode = '  ��'+ config.displayName+' �޶�������$!' + rowName + '.getFieldValue("'+ config.dsAliasName + '.' + config.fieldName + '")<br/>',
				lineAlias = '  ��'+ config.displayName+' ��������$!' + rowName + '.getFieldValue("'+ (config.fieldAlias || config.fieldName) + '")<br/>',
				subModelKey = config.subModelKey || 'dataTable',
				combineId = config.combineId;
			
			if(ele.attr('checked') && config) {
				var list = map[combineId];
				if (list == null) {
					if (subModelKey != 'dataTable') {
						subModelKey = 'row.getFieldValue("' + subModelKey + '")';
					}
					map[combineId] = {forName: subModelKey, 'rowName': rowName, fields:[], fieldsAlias:[]};
				}
				map[combineId].fields.push(lineCode);
				map[combineId].fieldsAlias.push(lineAlias);
			}
		});
		
		var text = '';
		for(var key in map) {
			text += '#foreach($' + map[key].rowName + ' in $' + map[key].forName + ')\n';
			text +=  map[key].fieldsAlias.join('\n');
			text +=  '\n#end\n\n';
			
			text += '#foreach($' + map[key].rowName + ' in $' + map[key].forName + ')\n';
			text +=  map[key].fields.join('\n');
			text +=  '\n#end\n\n';
		}
		
		codeArea.val(text);
	}
	
	//����tabҳ
	function createTab(ds) {
		var self = this, $Tab = $('.list-tab-ds', '.idc-tab');
		var defaultName = '����Դ' + $Tab.children().length;

		if($Tab.children().length >= 15) {
			alert('Ŀǰ���ֻ֧��15������Դ!');
			return;
		}
		defaultName = ds && ds.name ? ds.name : defaultName;
		var strNav = getTabNav(defaultName, '', true);
		menuTab.createTab('idcds_tab_' + ($Tab.children().length + 1), strNav, getTabCon(defaultName));
		var currentTabDs = getCurrentTab();
		currentTabDs.find('select[name="dataSource"]').val("0");
	}	
	
	function getTabNav(name, className, isClose) {
		var strClose = '<i class="icon-close"></i>';
		if(!className) {
			className = '';
		}
		if(!isClose) {
			strClose = '';
		}
		return '<li class="' + className + '"><span class="block" title="' + name + '">' + strClose + '<span class="title">' + name + '</span></span></li>';
	}
	
	function getTabCon() {
		var html = $(".idc-tab-body .tab-b-ds:first").html(), dsDiv = $('<div/>');
		dsDiv.append(html);
		dsDiv.find('.ds-fields').html('');
		return '<div class="tab-b-ds">' + dsDiv.html() + "</div>";
	}
	
	function getCurrentTab() {
		var currentTabDs = null;
		$('.tab-b-ds', '.idc-tab-body').each(function(index, obj) {
			var _$obj = $(obj);
			if(_$obj.css('display') === 'block') {
				currentTabDs = _$obj;
			}
		});
		return currentTabDs;
	}
	
	/**
	 * ƴװurl
	 */
	function setHref(append, link, queryString) {
		var href = link.attr('href');
		if (append) {
			href += '&' + queryString;
		} else {
			var i = href.indexOf('?');
			if (i != -1) href = href.substring(0, i);
			href += "?" + queryString;
		}
		link.attr('href', href);
	}
	
	/**
	 * ���ɲ�ѯquery
	 */
	function buildQueryWithFields(fields) {
		var tab = getCurrentTab(), params = D.idatacenter.getQueryValue(tab);
		fields && (params.idcFields= fields);
		var query = '';
		for (var key in params) {
			if (params[key]) {
				var type = (typeof params[key]);
				if (type == 'string' || type == 'number') {
					query += (query ? '&'  : '') + (key + '=' + params[key]); 
				}
			}
		}
		return query;
	}
	
	/**
	 * ��ʼ��Ԥ����ѯ��
	 */
	function initPreviewQuery() {
    	var link = $('.selectFieldDialog .open-query'), queryString = buildQueryWithFields();
    	if (queryString) {
    		setHref(false, link, queryString + "&app=DCMS");
			link.removeClass('btn-disabled').show();
    	} else {
    		link.addClass('btn-disabled').show();
    	}
	}
	
	/**
	 * ��ȡ�ֶ�ֵ
	 */
	function getSelectFields() {
		var fields = [];
		$('.all-fields .searchable-field').each(function(){
			if($(this).attr('checked')) {
				fields.push($(this).val());
			}
		});
		return fields.length ? fields.join(',') : '';
	}
	
    DS.idcDs = view;
})(dcms, FE.dcms, FE.dcms.box.datasource);
