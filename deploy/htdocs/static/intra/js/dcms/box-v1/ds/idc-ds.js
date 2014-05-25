/**
 * @author huangxt
 * @userfor  数据中心数据源
 * @date  2013-9-24
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

/**
	2. 数据中心数据源tab页上，别名重复校验
 */

;(function($, D, DS){
	var idcDomain = '',
		idcAjaxUrl = '', //idc异步请求地址
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
			//begin---没有引用tab页时专用
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
                //modify by hongss on 2013.11.19 for 把tab的顺序依赖改为class的依赖
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
			//end---没有引用tab页时专用
			
			**/
			//新建组件入口进入时，第1个参数是null；修改页面入口第2个为null
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
				
				//如果没有第三个tab页
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
				
                $('header h5 a', dialog).after('<a class="idc-datasource" href="#">数据中心数据源</a>');
				$('.js-ds-body', dialog).after('<div class="ds-body js-idc-body"></div>');
			},
			setDsModuleParam: function(dialog, callback){  //点击浮层的确认按钮时
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
					// 验证
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
				
				// 验证提醒
				if (validateMsg.length) {
					alert(validateMsg[0]);
					return;
				}
				
				if(!array || array.length == 0) {
					alert('条件不能为空！');
					return;
				}
				
				var fanchouData = makeFcParam(array);
				if(!fanchouData['vmContent']) {
					if(_editor) {
						//如果是源码新建组件时，先绑定数据源，那么可以先不反抽，因为点击确定的时候还是会重新反抽的
						fanchouData['vmContent'] = "a123";
					} else {
						alert('未编写组件代码！');
						return;
					}
				}
				
				//反抽 
				$.ajax({
					url: D.domain + "/admin/display_field_extract.html",
					data: fanchouData,
					cache: false,
					type:'POST'
				}).fail(
					function() {
						alert("系统繁忙，请稍后重试！！");
					}
				).done(
					function(text) {
						var data = makeCrParam(text, array);
						
						//判断是否需要更换queryId
						var paramInfo = getParamInfo();
						if(paramInfo) {
							var paramInfoJson = JSON.parse(paramInfo)[0] || {},
								queryid = paramInfoJson['queryid'];
							
							//处理新数据源组件在制作页面时，相互影响的问题，通过增加一个标识来解决---begin
							var useNewId = paramInfoJson['useNewId'] && paramInfoJson['useNewId'] === 'true';
							var hasOperate = false;
							if(useNewId && getFromType() !== 2) {
								hasOperate = true;
							}
							
							//公共组件始终使用新的id：因为公共组件有版本控制，每次版本升级都要保留原query串
							var isPublicBlock = false;
							if(isFromPublicBlockPage()){
								isPublicBlock = true;
							}
							//处理新数据源组件在制作页面时，相互影响的问题，通过增加一个标识来解决---end
							
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
									
									//处理新数据源组件在制作页面时，相互影响的问题，通过增加一个标识来解决---begin
									if(getFromType() === 2) {
										wData['useNewId'] = 'true';
									}
									if(hasOperate) {
										wData['useNewId'] = 'false';
									}
									//处理新数据源组件在制作页面时，相互影响的问题，通过增加一个标识来解决---end
									
									wData['type'] = data['type'];
									wData['querytype'] = 'idc';
									wData['queryid'] = text['id'];
									writeArray.push(wData);
									
									writeParamInfo(writeArray);
									
									idcDataArray = array;
									
									callback && callback.call(D.box.datasource, writeArray);
								} else {
									alert('保存失败，请稍后重试！');
								}
							}
						).fail(
							function() {
								alert("系统繁忙，请稍后重试！");
							}
						);
					}
				);
            },
            //供外部调用的更新反抽数据的函数
            upFcDataForNewModule: function(editor) {
				_editor = editor;
				var paramInfo = getParamInfo();
            	
            	if(!paramInfo) {
            		console && console.log("组件未绑定数据源，不需要反抽！");
            		return;
            	}
            	
				var paramJson = JSON.parse(paramInfo)[0] || {};
				if(!paramJson['querytype'] || paramJson['querytype'] != 'idc') {
					console && console.log("组件未绑定IDC数据源，不需要反抽！");
            		return;
				}
				
				//如果没有数组对象的话，从远程取一下
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
										
										//处理乱码问题
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
					//构造反抽入参
					var fanchouData = makeFcParam(idcDataArray);
					if(!fanchouData['vmContent']) {
						console && console.log("未编写组件源码！");
						return;
					}
            	
					//反抽 
					$.ajax({
						url: D.domain + "/admin/display_field_extract.html",
						data: fanchouData,
						cache: false,
						type:'POST',
						async :false
					}).fail(
						function() {
							alert("反抽失败！");
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
										alert("规则创建失败，后台错误！");
									}
								}
							).fail(
								function() {
									alert("规则创建失败，系统错误！");
								}
							);
						}
					);
				} catch(e) {
					console && console.log(e);
				}
            },
			someBind: function() {  //定制字段浮层的many绑定
				$.use('ui-dialog', function(){
					newFieldsDialog();
					
					$(".js-idc-body").delegate(".btn-show-fields", "click", function(){
						var parent = getCurrentTab(), fieldsHTML = parent.data(FIELD_HTML);
						if (!fieldsHTML) {
							 fieldsHTML =  $('.all-fields-container', parent).html();
							 parent.data(FIELD_HTML, fieldsHTML);
						}
						if (!fieldsHTML) {
							alert('请选择数据源！');
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
					//点击文本框 
					$(".selectFieldDialog").delegate(".code textarea", "focus", function(){
						$(this).select();
					});
					// 点击全选
					$(".selectFieldDialog").delegate(".allTag", "click", function(){
						var checked = $(this).attr('checked');
						$(".selectFieldDialog .searchable-field").each(function(){
							var elm = $(this), 
								li = elm.closest('li');
							// 已经选中的标签
							if(checked && elm.attr('checked')) 
								return;
							if (li.css('display') != 'none' && li.closest('.fields').css('display') != 'none') {
								elm.attr('checked', checked ? true : false);
							}
						});
						checkField();
					});
					
					// 点击标签
					$(".selectFieldDialog").delegate(".tag", "click", function(){
						var _this=this, tagId = $(this).data('val'), check = !$(this).hasClass('current');
						$(this).parent().find('.tag').each(function(){ 
							this == _this ? $(this).toggleClass('current') :  $(this).removeClass('current');
						});
						$(".selectFieldDialog .allTag").attr('checked', false);
						// 调用数据中心标签
						D.idatacenter.searchByTag(tagId, check, searchByTagId);
						return false;
					});
					// 点击搜索
					$(".selectFieldDialog").delegate(".search-btn", "click", function(){
						searchByKeyword();
					});
					// 回车搜索
					$(".selectFieldDialog").delegate(".keywords", "keydown", function(e){
						if (e.which == 13) {
							searchByKeyword();
						}
					});
					// 点击字段
					$(".selectFieldDialog").delegate(".searchable-field", "click", function(){
						checkField();
					});   	
					// 预览Query
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
				
				// 测试数据
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
						// 预览Query
						fields && (query += ('&idcFields=' + fields));
						form.attr('action', domain + '/home/preview_datasource.html');
						$('input[name="queryString"]', form).val(query);
						$('input[name="combineId"]', form).val(combineId);
						form[0].submit();
					} else {
						alert('请设置至少一个查询条件！');
					}
				});
			}
        };
    
	
	//封装---begin
	//判断来源，1表示简易编辑器、2表示源码新建组件
	function getFromType() {
		if(_target_ && !_editor) {
			return 1;
		} else if(!_target_ && _editor) {
			return 2;
		}
		
		return 0;
	}
	//判断是否是从编辑公共区块页面来的
	function isFromPublicBlockPage() {
		var result = $('input[name="designModuleType"][type="hidden"]').val();
		if( (typeof result !== 'undefined') && (result === 'public_block') ){
			return true;
		}
		return false;
	}
	//判断是否是运营角色
	function isYunying() {
		var isYunYing = false;
		if( typeof $('#isYunYing').val() !== 'undefined' && $('#isYunYing').val() === 'true' ){
			isYunYing = true;
		}
		return isYunYing;
	}
	//判断是否是从预览组件页面来的
	function isFromPreviewDesignPage() {
		var result = $('input[name="pageFlag"][type="hidden"]').val();
		if( (typeof result !== 'undefined') && (result === 'previewDesign') ){
			return true;
		}
		return false;
	}
	//判断:是否有第三个tab页，如：新建组件页面的入口、运营角色、公共区块管理、源码新建组件预览页面等
	function notHasLastTab() {
		if(!_target_ || isYunying() || isFromPublicBlockPage() || isFromPreviewDesignPage()) {
			return true;
		} else {
			return false;
		}
	}
	//获取大段源代码
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
	//获取页面埋入的json数据
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
	//将新的json数据写回
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
	//封装---end
	
	//函数封装
	//构造反抽异步请求入参
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
	
	//构造create rule 异步请求入参
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
				
				//一二级对应关系json结构：{"105offerList":107}
				var subFields = tabData['subFields'],
					sonInfosStr = $('.js-son-infos').val();
				if(subFields && sonInfosStr && sonInfosStr !='') {
					var sonInfos = JSON.parse(sonInfosStr);
					
					//会员维度二级节点
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
					
					//offer维度二级节点
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
	//函数封装end
	
	function firstInitHtml(_data, dialog) {
		//获取有权限的站点id的列表
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
					
					// 初始化Tab
					menuTab = new D.MenuTab({
						handlerCon : '.js-idc-body .idc-tab-head',
						handlerEls : 'li',
						boxCon : '.js-idc-body .idc-tab-body',						
						boxEls : '.tab-b-ds',
						closeEls : '.js-idc-body .icon-close'
					});
					// 添加数据源
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
								alert('专场ID不能为空!');
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
								alert('专场ID不能为空!');
								return;
							}
					});
					
					//浮层里标签事件的监听
					$(".js-idc-body").delegate(".js-filter-tag", "click", function(){
						var tagId = $(this).data("tagid");
						
						$('li.js-filter-item').each(function(){
							$(this).removeClass("fd-hide");
							
							if(tagId != "-1" && $(this).data("config").tags.indexOf(tagId) < 1) {
								$(this).addClass("fd-hide");
							}
						});
					});
					
					// 切换一个数据源
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
					
					//添加mlr
					$(".js-idc-body").delegate(".field-multline .add", "click", function(){
						if(!itemHtmlMlr) {
							itemHtmlMlr = $(".field-multline .item")[0] ? $(".field-multline .item").eq(0).html().replace('add','delete').replace(/<label style=".+">.+<\/label>/im,'<label></label>'):'';
						}
						$(this).parents('.field-multline').append('<div class="item">' + itemHtmlMlr + '</div>');
						
						return false;
					});
					//添加排序
					$(".js-idc-body").delegate(".sort-rows .add", "click", function(){
						if(!itemHtml) {
							itemHtml = $(".sort-rows")[0] ? $(".sort-rows").html().replace('add','delete').replace(/<label>.+<\/label>/im,'<label></label>'):'';
						}
						$(".sort-rows").append(itemHtml);
						return false;
					});
					// 删除排序
					$(".js-idc-body").delegate(".sort-rows .delete, .js-filter-item .delete", "click", function(){
						$(this).parent('.item').remove();
						return false;
					});
					
					//回填DCMS专有的字段：别名和中文名
					if(_data['query']) {
						var _dataQuery= JSON.parse(decodeURIComponent(_data['query']));
						$('.js-idc-body .tab-b-ds', dialog).each(function(index, tab) {
							_dataQuery[index]['alias'] && $('input[name="alias"]', tab).val(_dataQuery[index]['alias']);
							_dataQuery[index]['note'] && $('input[name="note"]', tab).val(decodeURIComponent(_dataQuery[index]['note']));
						});
					}
					
					changeTabTitle(dialog);
					
					//如果站外用户，对一些组件做隐藏处理
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
	
	//更新每一个tab页的标签文案
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
	
	//专场品数据源添加根据专场id动态切换区块列表的逻辑
	function changePinBlockByTid() {
		//循环idc里的每一个tab页
		$('.tab-b-ds', '.js-idc-body').each(function(index, obj) {
			var _$obj = $(obj),
				$topicId = $('input[name="topicId"]', _$obj),
				$blockId = $('select[name="blockId"]', _$obj),
				$topicIdSh = $('input[name="topicIdSh"]', _$obj),
				$blockIdSh = $('select[name="blockIdSh"]', _$obj);
			
			//如果是专场品数据源
			if($topicId[0] && $blockId[0]) {
				//如果是初始化浮层时就已经是该数据源，则这里处理回填
				var oldBlockId = $blockId.data('value');
				if(oldBlockId && oldBlockId != '') {
					$blockId.empty();
					var topicInfo = D.box.datasource.Topic.loadBlocks($topicId.val(), oldBlockId, '5');
					if(topicInfo && topicInfo.options) {
						$blockId.append(topicInfo.options);
					}
				}
				
				//这里处理当tid输入框值变化时的逻辑
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
			
			//如果是专场商数据源
			if($topicIdSh[0] && $blockIdSh[0]) {
				//如果是初始化浮层时就已经是该数据源，则这里处理回填
				var oldBlockId = $blockIdSh.data('value');
				if(oldBlockId && oldBlockId != '') {
					$blockIdSh.empty();
					var shTopicInfo = D.box.datasource.Topic.loadBlocks($topicIdSh.val(), oldBlockId, '6');
					if(shTopicInfo && shTopicInfo.options) {
						$blockIdSh.append(shTopicInfo.options);
					}
				}
				
				//这里处理当tid输入框值变化时的逻辑
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
	 * 显示数据源信息
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
                '<header><a href="#" class="close">关闭</a><h5>数据源示例代码</h5></header>' +
                '<section></section>' +
                '<footer><button type="button" class="btn-basic btn-gray btn-cancel">关 闭</button><a href="'+
				idcDomain +
				'/home/open/query.json" target="_blank" class="btn-basic btn-gray open-query" style="display:none">预览Query数据</a></footer>' +
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
		
		// 高度
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
				lineCode = '  【'+ config.displayName+' 限定名】：$!' + rowName + '.getFieldValue("'+ config.dsAliasName + '.' + config.fieldName + '")<br/>',
				lineAlias = '  【'+ config.displayName+' 别名】：$!' + rowName + '.getFieldValue("'+ (config.fieldAlias || config.fieldName) + '")<br/>',
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
	
	//生成tab页
	function createTab(ds) {
		var self = this, $Tab = $('.list-tab-ds', '.idc-tab');
		var defaultName = '数据源' + $Tab.children().length;

		if($Tab.children().length >= 15) {
			alert('目前最多只支持15个数据源!');
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
	 * 拼装url
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
	 * 生成查询query
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
	 * 初始化预览查询串
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
	 * 获取字段值
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
