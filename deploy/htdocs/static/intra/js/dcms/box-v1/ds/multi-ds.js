/**
 * @author springyu
 * @userfor  ������Դ��ز���
 * @date  2013-4-20
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D, DS) {

	DS.MultiDs = {
		//��������Դ��Ϣ
		loadDs : function(editDsId) {
			var data = {
				action : "DsModuleAction",
				event_submit_do_showDs : true,
				retMethod : 'json',
				pageNum : '100',
				site : 'site'
			}, _options = '', $dsBody = $('.js-ds-body', '.js-dialog');
			if ($dsBody.data('options')) {
				_options = $dsBody.data('options');
			} else {
				editDsId && (data.editDsId = editDsId);
				$.ajax({
					url : D.domain + '/page/box/json.html?_input_charset=UTF-8',
					type : "POST",
					data : data,
					async : false,
					success : function(text) {
						var self = this, json;
						json = $.parseJSON(text);
						if (json && json.datasourceList) {
							var dsList = json.datasourceList;
							for (var i = 0; i < dsList.length; i++) {
								_options += '<option value="' + dsList[i].id + '">' + dsList[i].cnName + '</option>';
							}
							$dsBody.data('options', _options);
						} else {
							//alert("��վ��û�ж�Ӧ����Դ��Ϣ��");
							//return;
						}
					},
					error : function(jqXHR, textStatus, errorThrown) {
						alert("���ӳ�ʱ�����ԣ�");
					}
				});
			}
			return _options;
		},
		/**
		 * ��ʼ��tabҳ��
		 */
		initTab : function(elem) {
			var self = this, menuTab, $addBtn, $Tab = self.$Tab;
			self.menuTab = menuTab = new D.MenuTab({
				handlerCon : '.js-ds-body .list-tab-ds',
				handlerEls : 'li',
				boxCon : '.js-ds-body .tab-b-con-ds',
				boxEls : '.tab-b-ds',
				closeEls : '.js-ds-body .icon-close'
			});
			$addBtn = $('.add-btn', '.js-ds-body');
			if (self.isYunYing) {
				$addBtn.remove();
			} else {
				$addBtn.unbind();
				$addBtn.bind('click', function(event) {
					event.preventDefault();
					self.createTab();
				});
			}
		},
		//����tabҳ
		createTab : function(ds) {
			var self = this, $Tab = self.$Tab;
			var defaultName = '����Դ' + $Tab.children().length, editDsId = ds && ds.dataSource ? ds.dataSource : null;

			if ($Tab.children().length >= 15) {
				alert('Ŀǰ���ֻ֧��15������Դ!');
				return;
			}
			defaultName = ds && ds.name ? ds.name : defaultName;
			var strNav = self.getTabNav(defaultName, '', true);
			self.menuTab.createTab('ds_tab_' + $Tab.children().length, strNav, self.getTabCon(defaultName, editDsId));
			var currentTabDs = null;
			$('.tab-b-ds', '.js-ds-body').each(function(index, obj) {
				var _$obj = $(obj);
				if (_$obj.css('display') === 'block') {
					currentTabDs = _$obj;
				}
			});
			self.initData(ds, currentTabDs);

		},
		//
		getTabNav : function(name, className, isClose) {
			var strClose = '<i class="icon-close"></i>';
			if (!className) {
				className = '';
			}
			if (!isClose) {
				strClose = '';
			}
			return '<li class="' + className + '"><span class="block" title="' + name + '">' + strClose + '<span class="title">' + name + '</span></span></li>';
		},
		getTabCon : function(name, editDsId) {
			var self = this, $dsInst = D.bottomAttr.getHtml('dsInst'), dsDiv = $('<div/>'), _options = self.loadDs(editDsId), $btnSubmit = $('.btn-submit', '.js-dialog');
			if (_options) {

				$('select[name=dataSource]', $dsInst).append(_options);
				$('input[name="note"]', $dsInst).attr('value', name);
				dsDiv.append($dsInst);
				if (self.isYunYing) {
					dsDiv.find('li.fd-left').each(function(index) {
						if (index > 0) {
							$(this).hide();
						}
					});
				}
				self.$dsBody.removeAttr('style');
				$btnSubmit.show();
				return '<div class="tab-b-ds"><div class="ds-info js-ds-info">' + dsDiv.html() + '</div><div class="in-info js-param-info"></div></div>';

			} else {
				$btnSubmit.hide();
				self.$dsBody.css('height', 'auto');
				return '<div class="tab-b-ds" style="width:300px;margin:50px auto;">��ǰվ��û����������Դ����<a target="_blank" href="' + D.domain + '/admin/manage_site.html?action=site_manager_action&event_submit_do_query_site_resource_4_view=true&type=ds">�������Դ</a>!</div>';
			}
		},
		/**
		 *
		 */
		initEvent : function() {
			//��̬�޸�tabҳ���İ�
			$('.js-ds-body').delegate('input[name=note]', 'input', function(event) {
				event.preventDefault();
				var _$self = $(this);
				if (_$self.val()) {
					var _$txt = $('.list-tab-ds li.current span.title', '.js-ds-body'), _$block = $('.list-tab-ds li.current span.block', '.js-ds-body');
					_$txt.html(_$self.val());
					_$block.attr('title', _$self.val());

				}
			});
			//���ڰ�ť�¼�ע��
			$('.js-ds-body').on('click', '.js-yunying-waiting', function(e) {
				var btn = $(this), dsmoduleparam = btn.data(D.box.editor.config.ATTR_DATA_DATA_SOURCE);

				DS.YunYing.showWaiting(dsmoduleparam);
			});

			$('.js-ds-body').on('change', 'select[name=blockId]', function(e) {
				var $select = $(this), boxEl = $select.closest('.tab-b-ds');
				//�ж��Ƿ�������ڰ�ť
				D.box.datasource.YunYing && D.box.datasource.YunYing.checkIsWaiting(boxEl);
			});
			//ѡ������Դ���л��������
			$('.js-ds-body').delegate('select[name=dataSource]', 'change', function(event) {
				var _$select = $(this), _selectedValue = _$select.val(), data = {}, dataSourceParam = _$select.data('dataSourceParam');

				if (_selectedValue && _selectedValue !== '0') {
					data['datasourceId'] = _selectedValue;
					data['action'] = 'DsModuleAction';
					data['event_submit_do_showDsParam'] = true;
					data['dsModuleParam'] = JSON.stringify(dataSourceParam);
					data['isMultiDs'] = 'true';
					var currentTabDs = null;
					$('.tab-b-ds', '.js-ds-body').each(function(index, obj) {
						var _$obj = $(obj);
						if (_$obj.css('display') === 'block') {
							currentTabDs = _$obj;
						}
					});
					switch(_selectedValue) {
						case '3':
							//offer
							$.post(D.domain + '/page/box/multids/detailOffer.html?_input_charset=UTF-8', data, function(text) {
								$('.js-param-info', currentTabDs).html(text);
								DS.initDsEvent(currentTabDs);
							});
							//�Ƴ����ڰ�ť
							D.box.datasource.YunYing.removeWaiting(currentTabDs);
							break;
						case '7':
							//��˾
							$.post(D.domain + '/page/box/multids/detailCompany.html?_input_charset=UTF-8', data, function(text) {
								$('.js-param-info', currentTabDs).html(text);
								DS.initDsEvent(currentTabDs);

							});
							//�Ƴ����ڰ�ť
							D.box.datasource.YunYing.removeWaiting(currentTabDs);
							break;
						case '5':
							//ר��Ʒ
							$.post(D.domain + '/page/box/multids/dsParamTopicPin.html?_input_charset=UTF-8', data, function(text) {
								$('.js-param-info', currentTabDs).html(text);
								DS.initDsEvent(currentTabDs);
								var $topicId = $('#topicId', currentTabDs), topicId = $topicId.val(), _$select = $('select[name=blockId]', currentTabDs);
								var blockId = _$select.data('value'), dsId = _$select.data('ds-id');
								var topicInfo = D.box.datasource.Topic.loadBlocks(topicId, blockId, dsId);
								if (topicInfo && topicInfo.options) {
									_$select.append(topicInfo.options);
								}
								var topicLink = '<a href="javascript:void(0)" target="_blank" class="btn-basic btn-blue" id="topic-link">ר������</a>';
								$(topicLink).appendTo($('#topicId', currentTabDs).parent());
								//.append();

								setTopicLink(currentTabDs, topicId);
								_$select.trigger('change');
								$topicId.bind('input', function(event) {
									var _$self = $(this), topicVal = _$self.val();
									var topicInfo = D.box.datasource.Topic.loadBlocks(topicVal, blockId, dsId);
									_$select.empty();
									if (topicInfo && topicInfo.options) {
										_$select.append(topicInfo.options);
									}
									_$select.trigger('change');
								});
								//addTopicManage($topicId);
							});
							break;
						case '6':
							//ר����
							$.post(D.domain + '/page/box/multids/dsParamTopicShang.html?_input_charset=UTF-8', data, function(text) {
								$('.js-param-info', currentTabDs).html(text);
								DS.initDsEvent(currentTabDs);
								var $topicId = $('#topicId', currentTabDs), topicId = $topicId.val(), _$select = $('select[name=blockId]', currentTabDs);
								var blockId = _$select.data('value'), dsId = _$select.data('ds-id');
								var topicInfo = D.box.datasource.Topic.loadBlocks(topicId, blockId, dsId);

								if (topicInfo && topicInfo.options) {
									_$select.append(topicInfo.options);
								}
								var topicLink = '<a href="javascript:void(0)" target="_blank" class="btn-basic btn-blue" id="topic-link">ר������</a>';
								$(topicLink).appendTo($('#topicId', currentTabDs).parent());
								setTopicLink(currentTabDs, topicId);
								_$select.val(blockId);
								_$select.trigger('change');
								$topicId.bind('input', function(event) {
									var _$self = $(this), topicVal = _$self.val();
									var topicInfo = D.box.datasource.Topic.loadBlocks(topicVal, blockId, dsId);
									_$select.empty();
									if (topicInfo && topicInfo.options) {
										_$select.append(topicInfo.options);
									}
									_$select.trigger('change');
								});
								//addTopicManage($topicId);
							});

							break;
						default:
							$.post(D.domain + '/page/box/multids/detailCommonDs.html?_input_charset=UTF-8', data, function(text) {
								$('.js-param-info', currentTabDs).html(text);
								DS.initDsEvent(currentTabDs);
							});

							//�Ƴ����ڰ�ť
							D.box.datasource.YunYing.removeWaiting(currentTabDs);
							break;
					}

				}
			});
			var addTopicManage = function($topicId) {
				$topicId.after('<a href="#" target="_blank" class="js-topic-manage" style="margin:0 8px;">ר������</a>');
				$('.js-topic-manage', '.js-multi-ds').bind('click', function(event) {
					//event.preventDefault();
					var $self = $(this), domain = D.domain;
					if (domain.indexOf('http://cms.cn.alibaba-inc.com') != -1) {
						domain = 'http://elf.b2b.alibaba-inc.com';
					} else {
						domain = 'http://elf-test.china.alibaba-inc.com:41100';
					}
					domain += '/enroll/v2012/arrange_block.htm?topicId=' + $topicId.val();
					$self.attr('href', domain);
				});
			};
			//�л������������
			$('.js-ds-body').delegate('.js-toolbar', 'click', function(event) {
				event.preventDefault();
				var _$self = $(this), _$a = $('a.description', _$self), _$multiDs = _$self.closest('.js-multi-ds');
				$('a.description', _$multiDs).removeClass('selected');
				$('.attr', _$multiDs).addClass('dcms-box-hide');
				_$a.addClass('selected');
				$('#' + _$a.data('boptions'), _$multiDs).removeClass('dcms-box-hide');

			});

		},
		//��ʼ��������ԴTabҳ
		initDataSource : function($target, isYunYing) {
			var self = this, defaultName = 'Ĭ������Դ', defaultTabNav = self.getTabNav(defaultName, 'current', false), $dsBody = $('.js-ds-body', '.js-dialog'),
			//
			$Tab = $('.list-tab-ds', $dsBody), $TabCon = $('.tab-b-con-ds', $dsBody), dsmoduleparam = '';
			self.isYunYing = isYunYing;
			if (( $target instanceof jQuery) || ( $target instanceof dcms)) {
				if (!$target || !$target.length) {
					return;
				}
				dsmoduleparam = $target.data('dsmoduleparam');
			} else {
				dsmoduleparam = $target;
			}
			if(dsmoduleparam) {
				if(!( dsmoduleparam instanceof Array)) {
					dsmoduleparam = [];
					dsmoduleparam.push($target.data('dsmoduleparam'));
				}
			}
			// �༭������Դid
			var editDsId = '';
			if (dsmoduleparam instanceof Array && dsmoduleparam.length) {
				for(var i = 0; i < dsmoduleparam.length; i++){
					if (i >0 ) editDsId+=',';
					editDsId += dsmoduleparam[i].dataSource ? dsmoduleparam[i].dataSource : '';
				}
			}

			self.$dsBody = $dsBody;
			self.$Tab = $Tab;
			self.$TabCon = $TabCon;
			$Tab.append(defaultTabNav);
			$TabCon.append(self.getTabCon(defaultName, editDsId));
			self.initTab($target);
			//��ʼ���¼�
			self.initEvent();
			if (dsmoduleparam) {
				if (!(dsmoduleparam[0]['queryType'] || dsmoduleparam[0]['querytype'])) {
					//ҳ����Ĭ�ϵ�tabҳ��
					self.initData(dsmoduleparam[0], '.tab-b-ds');
					for (var i = 1; i < dsmoduleparam.length; i++) {
						self.createTab(dsmoduleparam[i]);
					}
				}
			}

		},
		initData : function(dsModuleParam, target) {
			if (dsModuleParam && dsModuleParam.alias) {
				$('input[name="alias"]', target).attr('value', dsModuleParam.alias);
			}
			if (dsModuleParam && dsModuleParam.note) {
				$('input[name="note"]', target).attr('value', dsModuleParam.note);
				var _$txt = $('.list-tab-ds li.current span.title', '.js-ds-body'), _$title = $('.list-tab-ds li.current span.block', '.js-ds-body');
				_$txt.html(dsModuleParam.note);
				_$title.attr('title', dsModuleParam.note);
			}
			var _$select = $('select[name="dataSource"]', target);
			_$select.data('dataSourceParam', dsModuleParam);
			dsModuleParam && _$select.val(dsModuleParam.dataSource);
			_$select.trigger('change');
		}
	};
	function setTopicLink(currentTabDs, topicId) {
		var $topicLink = $('#topic-link', currentTabDs);
		//var $dsTopicLinkDiv = $('#ds-topic-link-div', currentTabDs);

		//��Ϊר������ҳ��������ajax����ģ�����޷�����id��λ
		var domain = D.domain;
		if (domain.indexOf('http://cms.cn.alibaba-inc.com') != -1) {
			domain = 'http://elf.b2b.alibaba-inc.com';
		} else {
			domain = 'http://elf-test.china.alibaba-inc.com:41100';
		}
		//�ж��Ƿ����topicId
		if (topicId == "" || topicId == "undefined") {
			domain += '/enroll/v2012/search.htm';
		} else {
			domain += '/enroll/v2012/arrange_block.htm?topicId=' + topicId;
		}
		//����һ����ת��ר��������
		//$dsTopicLinkDiv.addClass("ds-param-div");
		$topicLink.removeClass("fd-hide");
		$topicLink.attr("href", domain);
	};

	//��������
	DS.MultiDs.CONSTANTS = {
		//��ʼ��������Դtabҳ�Զ����¼�����
		INIT_DATASOURCE_EVENT : 'box.datasource.MultiDs.init_datasource_event'

	};
	//ע���Զ����¼�
	$(function() {
		//��ʼ��������Դtabҳ�¼��
		$(document).bind(DS.MultiDs.CONSTANTS.INIT_DATASOURCE_EVENT, function(event) {
			var args = Array.prototype.slice.call(arguments, 1), isYunYing = Array.prototype.slice.call(arguments, 2);
			DS.MultiDs.initDataSource.apply(DS.MultiDs, args, isYunYing);
		});
	});

})(dcms, FE.dcms, FE.dcms.box.datasource);
