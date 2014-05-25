/**
 * @author springyu
 * @userfor  资源位控制面板初始化
 * @date  2014-1-2
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D, DS) {
	DS.Res = {
		init : function($target, isYunYing, siteId) {
			var dialog = $('.ext-width');
			this.isYunYing = isYunYing;
			this.siteId = siteId;
			this._insertHtml(dialog);
			this.$dsBody = $('.js-res-body', dialog);
			this.$Tab = $('.js-list-tab-ds', this.$dsBody);
			this.$TabCon = $('.tab-b-con-ds', this.$dsBody);
			this.initDataSource(dialog, this._getDsJson($target));
			initEvent.call(this, dialog);
		},
		_getDsJson : function($target) {
			var that = this, dsmoduleparam = '';
			if (( $target instanceof jQuery) || ( $target instanceof dcms)) {
				if (!$target || !$target.length) {
					return;
				}
				dsmoduleparam = $target.data('dsmoduleparam');
			} else {
				dsmoduleparam = $target;
			}

			if (dsmoduleparam) {
				if (!( dsmoduleparam instanceof Array)) {
					dsmoduleparam = [];
					dsmoduleparam.push($target.data('dsmoduleparam'));
				}
			}
			//idc
			var tempDs = that._getDsDefaultInfo(dsmoduleparam[0]);
			if (tempDs) {
				dsmoduleparam = tempDs;
			}
			return dsmoduleparam;
		},
		_insertHtml : function(dialog) {
			var $Elem = $('header h5 a.idc-datasource', dialog),$target= $('.js-idc-body', dialog);
			//join-datasource
			if(!($Elem &&$Elem.length>0)){
				$Elem = $('header h5 a.join-datasource', dialog);
				$target=$('.js-ds-body', dialog);
			}
			$Elem.after('<a class="res-datasource" href="#">资源位</a>');
			$target.after('<div class="ds-body js-res-body res-body"><div class="ds-nav fd-clr"><ul class="list-tab-ds js-list-tab-ds"></ul><a class="add-btn"></a></div><div class="tab-b-con-ds"></div></div></div>');
		},
		initDataSource : function(dialog, dsmoduleparam) {
			var that = this, defaultName = '默认区块';
			if (!(dsmoduleparam && dsmoduleparam.length)) {
				dsmoduleparam = [{
					name : defaultName
				}];
			}
			that._initTab();
			that._createTab(dsmoduleparam[0]);
			if (dsmoduleparam && dsmoduleparam.length >= 1) {
				for (var i = 1; i < dsmoduleparam.length; i++) {
					that._createTab(dsmoduleparam[i]);
				}
			}
			if (that.isYunYing) {
				$('i.icon-close', that.$dsBody).remove();
			}
		},
		_getTabNav : function(name, className, isClose) {
			var strClose = '<i class="icon-close"></i>';
			if (!className) {
				className = '';
			}
			if (!isClose) {
				strClose = '';
			}
			return '<li class="' + className + '"><span class="block" title="' + name + '">' + strClose + '<span class="title">' + name + '</span></span></li>';
		},
		//生成tab页
		_createTab : function(ds) {
			var that = this, $Tab = that.$Tab, num = $Tab.children().length;
			var defaultName = '区块' + num;

			if ($Tab.children().length >= 15) {
				alert('目前最多只支持15个区块!');
				return;
			}
			defaultName = ds && ds.name ? ds.name : ds && ds.note ? ds.note : defaultName;
			var strNav = that._getTabNav(defaultName, '', num >= 1), id = 'res_tab_' + $Tab.children().length;
			that.menuTab.createTab(id, strNav, that.getTabCon(defaultName, id));

			that._initTabData(ds);
		},
		/**
		 * idc获取数据源默认信息 {"type":",offer","querytype":"idc","queryid":"609"}
		 * http://cms.cn.alibaba-inc.com/admin/query_rule.html?id=609
		 */
		_getDsDefaultInfo : function(dsModuleParam, callback) {
			var dsModuleParamList = '';
			if (dsModuleParam) {
				if (dsModuleParam['querytype'] && dsModuleParam['querytype'] === 'idc') {
					$.ajax({
						url : D.domain + "/admin/query_rule.html?_input_charset=UTF-8&id=" + dsModuleParam['queryid'],
						async : false,
						cache : false,
						success : function(text) {
							var json = eval(text);
							if (json && json.result === 'success') {
								var queryRule = $.parseJSON(json.queryRuleDO);
								dsModuleParamList = ($.parseJSON(queryRule['query']));
							}
						}
					});
				}
			}
			if(dsModuleParamList){
				if(dsModuleParamList instanceof Array){
					for(var dsModule in dsModuleParamList){
						if(dsModuleParamList[dsModule]['note']){
						dsModuleParamList[dsModule]['note']=decodeURIComponent(dsModuleParamList[dsModule]['note']);
						}
					}
				} else {
					if(dsModuleParamList['note']){
						dsModuleParamList['note']=decodeURIComponent(dsModuleParamList['note']);
					}
					
				}
			}
			return dsModuleParamList;
		},
		/**
		 * 當前tab
		 */
		_getCurTab : function() {
			var that = this, currentTabDs = null;
			$('.tab-b-ds', that.$dsBody).each(function(index, obj) {
				var _$obj = $(obj);
				if (_$obj.css('display') === 'block') {
					currentTabDs = _$obj;
				}
			});
			return currentTabDs;
		},
		_initTabData : function(dsModuleParam) {
			var that = this, $target = that._getCurTab(), $note = $('input[name="note"]', $target);
			if (dsModuleParam && dsModuleParam.alias) {
				$('input[name="alias"]', $target).attr('value', dsModuleParam.alias);
			}
			if (dsModuleParam && dsModuleParam.note) {
				$note.attr('value', dsModuleParam.note);
				var _$txt = $('.js-list-tab-ds li.current span.title', that.$dsBody), _$title = $('.js-list-tab-ds li.current span.block', that.$dsBody);
				_$txt.html(dsModuleParam.note);
				_$title.attr('title', dsModuleParam.note);
				$note.data('dataSourceParam', dsModuleParam);
			}
			var sTab = new ScheduleTab(dsModuleParam, $target);
			sTab.init && sTab.init(that.$dsBody.data('options'));
			$('.js-add-schedule', $target).data('target', sTab);

		},
		/**
		 * 初始化tab页面
		 */
		_initTab : function() {
			var that = this, menuTab, $addBtn, $Tab = that.$Tab;
			that.menuTab = menuTab = new D.MenuTab({
				handlerCon : '.js-res-body .js-list-tab-ds',
				handlerEls : 'li',
				boxCon : '.js-res-body .tab-b-con-ds',
				boxEls : '.tab-b-ds',
				closeEls : '.js-res-body .js-list-tab-ds .icon-close'
			});
			$addBtn = $('.add-btn', that.$dsBody);
			if (that.isYunYing) {
				$addBtn.remove();
			} else {
				$addBtn.unbind();
				$addBtn.bind('click', function(event) {
					event.preventDefault();
					that._createTab();
				});
			}
		},
		getTabCon : function(name, tag) {
			var that = this, $dsInst = D.bottomAttr.getHtml('resDsInst'), dsDiv = $('<div/>'),
			//
			_options = that.loadDs(that.siteId), $btnSubmit = $('.btn-submit', '.js-dialog');
			if (_options) {
				//$('select[name=dataSource]', $dsInst).append(_options);
				$('input[name="note"]', $dsInst).attr('value', name);
				dsDiv.append($dsInst);
				if (that.isYunYing) {
					dsDiv.find('li.fd-left').each(function(index) {
						if (index > 0) {
							$(this).hide();
						}
					});
				}
				that.$dsBody.removeAttr('style');
				$btnSubmit.show();
				return '<div class="tab-b-ds ' + tag + '">' + dsDiv.html() + '</div>';

			} else {
				$btnSubmit.hide();
				that.$dsBody.css('height', 'auto');
				return '<div class="tab-b-ds" style="width:300px;margin:50px auto;">当前站点没有配置数据源，请<a target="_blank" href="' + D.domain + '/admin/manage_site.html?action=site_manager_action&event_submit_do_query_site_resource_4_view=true&type=ds">添加数据源</a>!</div>';
			}
		},
		//加载数据源信息
		loadDs : function(siteId) {
			var that = this, data = {
				action : "DsModuleAction",
				event_submit_do_showResDs : true,
				retMethod : 'json',
				pageNum : '100',
				site : 'site'
			}, _options = '';
			if (siteId) {
				data['siteId'] = siteId;
			}
			if (that.$dsBody.data('options')) {
				_options = that.$dsBody.data('options');
			} else {
				$.ajax({
					url : D.domain + '/page/box/json.html?_input_charset=UTF-8',
					type : "POST",
					data : data,
					async : false,
					success : function(text) {
						_options = processDsData.call(that, text);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log("连接超时请重试！");
					}
				});
			}
			return _options;
		}
	};
	/**
	 * 处理数据源信息
	 * @param {Object} text
	 */
	var processDsData = function(text) {
		var json = $.parseJSON(text), _options = '';
		if (json && json.datasourceList) {
			var dsList = json.datasourceList;
			for (var i = 0; i < dsList.length; i++) {
				_options += '<option data-param={"type":"' + dsList[i].type + '","url":"' + dsList[i].url + '","showType":"' + dsList[i].showType + '","sourceType":"' + dsList[i].sourceType + '","sourceParam":"' + dsList[i].sourceParam + '","resDsId":"' + dsList[i].id + '"} value="' + dsList[i].id + '">' + dsList[i].name + '</option>';
			}
			this.$dsBody.data('options', _options);
		} else {
			console.log("当站点没有对应数据源信息！");
			console.log(text);
			//return;
		}
		return _options;
	};
	var initEvent = function($dialog) {
		var that = this;
		//动态修改tab页的文案
		that.$dsBody.delegate('input[name=note]', 'input', function(event) {
			event.preventDefault();
			var _$self = $(this);
			if (_$self.val()) {
				var _$txt = $('.js-list-tab-ds li.current span.title', that.$dsBody), _$block = $('.js-list-tab-ds li.current span.block', that.$dsBody);
				_$txt.html(_$self.val());
				_$block.attr('title', _$self.val());

			}
		});
		//选择数据源，切换参数面板
		that.$dsBody.delegate('select[name=dataSource]', 'change', function(event) {

			var _that = this, _$select = $(this), $target = _$select.closest('.js-res-schedule');
			var $option = $('option:selected', _$select), panelParam = $option.data('param'), param = {}, dsModuleParam = {};
			dsModuleParam = _$select.data(dsModuleParam);
			param['resDsId'] = $option.attr('value');
			param['resId'] = dsModuleParam.resId;
			param['url'] = panelParam['url'];
			param['showType'] = panelParam['showType'];
			loadDataSourcePanel.call(that, param, $target);
		});
		/**
		 * 增加排期
		 */
		that.$dsBody.delegate('.js-add-schedule', 'click', function(event) {
			event.preventDefault();
			var _that = this, $self = $(_that), target = $self.data('target');
			target.createTab();

		});
	};
	/**
	 * 排期tab 工具类
	 */
	var ScheduleTab = function(dsModuleParam, $target) {
		var that = this, menuTab, $Tab = $('.js-list-tab-schedule', $target);
		that.$Tab = $Tab;
		that.resId = dsModuleParam && dsModuleParam.resId;
		that.target = $target;
		that.$con = $('.js-res-schedule-con', $target);
		that.menuTab = menuTab = new D.MenuTab({
			handlerCon : $Tab[0],
			handlerEls : 'li',
			boxCon : that.$con[0],
			boxEls : '.js-res-schedule',
			closeEls : '.icon-close'
		});
	};
	ScheduleTab.prototype = {
		constructor : ScheduleTab,
		/**
		 * 初始化 当前资源位排期信息
		 */
		init : function(options) {
			var that = this, resId = that.resId, data = {
				'action' : 'resIdcDsAction',
				'event_submit_do_get_schedule_list' : true,
				'resId' : resId
			};
			if (resId) {
				$.post(D.domain + '/page/json.html', data, function(text) {
					if (text) {
						var scheduleList = $.parseJSON(text);
						if (scheduleList && scheduleList.length) {
							var json = scheduleList[0];
							that.date($('input[name=startDate]', $('.js-res-schedule', that.$con)));
							that.initScheduleData.call(that, json, $('.js-res-schedule', that.$con), options);
							for (var i = 1; i < scheduleList.length; i++) {
								json = scheduleList[i];
								that.createTab(json);
							}
						}
					}
				});
			} else {
				that.date($('input[name=startDate]', $('.js-res-schedule', that.$con)));
				that.initScheduleData.call(that, '', $('.js-res-schedule', that.$con), options);
			}

		},
		initScheduleData : function(json, $target, options) {
			var that = this,
			//
			_$select = $('select[name=dataSource]', $target), param = {}, resId = that.resId;
			if (options) {
				_$select.append(options);
			}
			if (resId) {
				_$select.data('resId', resId);
				param['resId'] = resId;
			}
			if (json) {
				$('input[name=startDate]', $target).val(json.startDate);
				_$select.val(json['dataSourceId']);
				param['resDsId'] = json['dataSourceId'];
				param['scheduleId'] = json['scheduleId'];
				if (json['dataSourceId']) {
					var panelParam = $('option:selected', _$select).data('param');
					param['url'] = panelParam['url'];
					param['showType'] = panelParam['showType'];
					loadDataSourcePanel.call(that, param, $target);
				}
			}

		},
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
		/**
		 * 创建tab页面
		 */
		createTab : function(json) {
			var that = this, $Tab = that.$Tab, $childs = $Tab.children(), num = $Tab.children().length,
			//
			defaultName = '';
			if (num >= 1) {
				if (num > 4) {
					alert('一个区块最多只允许5个排期!');
					return;
				}
				num += 1;
				$childs.removeClass('current');
			} else {
				$Tab.append('<li id="js-res-schedule"><span class="block" title="排期1"><span class="title fd-left">排期1</span></span></li>');
				num = 2;
				$('.js-res-schedule-nav', that.target).show();
			}
			defaultName = '排期' + num;
			var strNav = that.getTabNav(defaultName, 'current', num >= 1), id = 'js-res-schedule-' + num;
			that.menuTab.createTab(id, strNav, that.getTabCon(id));
			var $startDate = $('input[name=startDate]', $('.' + id, that.$con));
			//创建tab时，显示排期日期
			var $tabDs = $startDate.closest('.tab-b-ds');
			$('.js-start-date', $tabDs).removeClass('start-date');

			that.date($startDate);
			if (json) {
				that.initScheduleData.call(that, json, $('.' + id, that.$con));
			}
			//that._initTabData(ds);
		},
		/**
		 * 添加时间控件
		 */
		date : function($target) {
			var nowDate = new Date().format('yyyy-MM-dd hh:mm:ss'), _val = $target.val();
			if (!_val) {
				$target.val(nowDate);
			}
			$.use('ui-datepicker-time, util-date', function() {
				$target.datepicker({
					zIndex : 3000,
					showTime : true,
					select : function(e, ui) {
						var date = ui.date.format('yyyy-MM-dd hh:mm:ss');
						$(this).val(date);
					},
					timeSelect : function(e, ui) {
						$(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss')).datepicker('hide');
					}
				});
			});

		},
		getTabCon : function(id) {
			var that = this, $con = that.$con, $resSchedules = $('.js-res-schedule', $con),
			//
			$schedule = $($resSchedules[0]).clone(), $oDiv = $('<div/>');
			$schedule.addClass(id);
			$('iframe', $schedule).attr('src', '');
			$oDiv.append($schedule);
			return $oDiv.html();
		}
	};
	var loadDataSourcePanel = function(param, $target) {
		var that = this;
		if (param && param.url) {
			switch(param.showType) {
				case 'AJAX':
				case 'ajax':
					break;
				default:
					iframeParam.call(that, function(text) {
						$('.js-param-info', $target).empty();
						$('.js-param-info', $target).append(text);
					}, param);
					break;
			}
		}

	};
	var iframeParam = function(callback, param) {
		var that = this, url = '', iframeUrl = '';
		iframeUrl = param.url;
		if (iframeUrl && iframeUrl.indexOf('http') === -1) {
			if (iframeUrl.indexOf('/') === 0) {
				iframeUrl = D.domain + iframeUrl;
			} else {
				iframeUrl = D.domain + '/' + iframeUrl;
			}
		}
		if (iframeUrl.indexOf('?') !== -1) {
			iframeUrl += '&';
		} else {
			iframeUrl += '?';
		}

		iframeUrl += 'scheduleId=' + param.scheduleId + '&resId=' + param.resId + '&resDsId=' + param.resDsId + '&v=' + (new Date).getMilliseconds();
		url = '<iframe class="iframe" scrolling="no" src="' + iframeUrl + '"></iframe>';
		callback && callback.call(that, url);

	};

})(dcms, FE.dcms, FE.dcms.box.datasource);
