/**
 * @author shanshan.hongss
 * @userfor  引用数据源
 * @date  2013-7-18
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, DS) {
	var view = {
		init : function(target, isYunYing) {
			var dialog = $('.ext-width'), floorSelect;
			this.target = target;
			if (!isYunYing) {
				//页面和模版才需要引用数据源，其它情况下不需要
				var $pageId = $('#pageId'), $templateId = $('#templateId');
				if (($pageId && $pageId.length) || ($templateId && $templateId.length)) {
					this._insertHtml(dialog);
					this._getModsDs(target);
					this._insertModDsHtml();
					
					floorSelect = $('#ds-quote-floor .floor-ids');
					controller.eventChooseFloor(floorSelect);
				}
			}
			controller.eventTabs(dialog);
			this._initModDs(target, dialog, floorSelect);
		},
		_insertHtml : function(dialog) {
			var qBodyHtml = '<div class="ds-body js-quote-body"><dl class="in-info">' + '<dt id="ds-quote-floor" class="fd-left"></dt><dd id="ds-quote-alias"></dd>' + '</dl></div>';
			$('header h5', dialog).append('<a class="quote-datasource" href="#">引用数据源</a>');
			$('section', dialog).append(qBodyHtml);
		},
		showBox : function(i, dialog) {
			var focus = $('header h5 a', dialog), boxes = $('.ds-body', dialog), focusEl = focus.eq(i);
			focus.removeClass('current');
			focusEl.addClass('current');
			boxes.hide();
			boxes.eq(i).show();

			this._setSubmitType(focusEl, dialog);
		},
		_setSubmitType : function(focusEl, dialog) {
			var submitEl = $('footer .btn-submit', dialog);
			if (focusEl.hasClass('join-datasource')) {
				submitEl.data('type', 'join');
			} else if (focusEl.hasClass('idc-datasource')) {
				submitEl.data('type', 'idc');
			} else if (focusEl.hasClass('quote-datasource')) {
				submitEl.data('type', 'quote');
			} else if (focusEl.hasClass('res-datasource')) {
				submitEl.data('type', 'res');
			}
			submitEl.show();
			submitEl.parent().show();
		},
		setDsModuleParam : function(dialog) {
			var dsModuleParam = this._getNewAlias(dialog), strDsModuleParam = JSON.stringify(dsModuleParam);
			this.target.data('dsmoduleparam', dsModuleParam);
			this.target.attr('data-dsmoduleparam', strDsModuleParam);
		},
		_getModsDs : function(target) {
			var body = target.parents('body');
			controller.filterModDs(body.find('.crazy-box-module[id]'), target);
		},
		_insertModDsHtml : function() {
			$('#ds-quote-floor').html(model.getModDsHtml());
		},
		insertAliasHtml : function(floorId) {
			var aliasHtml = model.getAliasHtml(floorId);
			$('#ds-quote-alias').html(aliasHtml);
		},
		_isQueryObject : function($target) {
			var isQueryObject = false;
			if (( $target instanceof jQuery) || ( $target instanceof dcms)) {
				isQueryObject = true;
			}
			return isQueryObject;
		},
		_initModDs : function(target, dialog, floorSelect) {
			var that = this, dsModuleParam, idcType = '';
			if (that._isQueryObject(target)) {
				dsModuleParam = model.getDsModuleParam(target);

				if (this.target.attr('data-dsmoduleparam')) {
					idcType = (JSON.parse(this.target.attr('data-dsmoduleparam'))[0]||{})['querytype'];
					if (!idcType) {
						idcType = (JSON.parse(this.target.attr('data-dsmoduleparam'))[0]||{})['queryType'];
					}
				}
			} else {
				dsModuleParam = target;
				if (dsModuleParam) {
					idcType = (dsModuleParam[0]||{})['querytype'];
					if (!idcType) {
						//queryType
						idcType = (dsModuleParam[0]||{})['queryType'];
					}
				}
			}

			if (dsModuleParam && typeof dsModuleParam['dsRef'] !== 'undefined') {
				this.showBox(3, dialog);
				floorSelect.val(dsModuleParam['dsRef']);
				floorSelect.trigger('change');

				for (var p in dsModuleParam) {
					if (p !== 'dsRef') {
						$('#' + dsModuleParam['dsRef'] + '-' + p).val(dsModuleParam[p]);
					}
				}
			} else if (idcType && idcType === 'idc') {
				this.showBox(1, dialog);
			} else if (idcType && idcType === 'res') {
				this.showBox(2, dialog);
			} else {
				this.showBox(0, dialog);
			}
		},
		_getNewAlias : function(dialog) {
			var newAlias = {};
			newAlias['dsRef'] = $('#ds-quote-floor .floor-ids').val();
			$('#ds-quote-alias input').each(function() {
				var input = $(this), newAlia = input.val();
				if (newAlia) {
					var oldAlia = input.prevAll('label').text();
					newAlias[oldAlia] = newAlia;
				}
			});
			return newAlias;
		}
	}, controller = {
		filterModDs : function(mods, target) {
			model.setDsList({});

			mods.each(function() {
				var mod = $(this), dsModuleParam = model.getDsModuleParam(mod);

				if (dsModuleParam && target[0].id !== mod[0].id) {
					model.addAlias(mod[0].id, dsModuleParam);
				}
			});
		},
		eventTabs : function(dialog) {
			var focus = $('header h5 a', dialog);
			focus.bind('click', function() {
				var el = $(this), i = focus.index(el);
				view.showBox(i, dialog);
			});
		},
		eventChooseFloor : function(floorSelect) {
			//var floorSelect = $('#ds-quote-floor .floor-ids');
			floorSelect.bind('change', function() {
				var floorId = $(this).val();
				view.insertAliasHtml(floorId);
			});
			floorSelect.trigger('change');
		}
	}, model = {
		_dsList : {},
		setDsList : function(dsList) {
			this._dsList = dsList;
		},
		getDsList : function() {
			return this._dsList;
		},
		getDsModuleParam : function(el) {
			return el.data('dsmoduleparam');
		},
		addAlias : function(id, dsModuleParam) {
			if (!dsModuleParam || typeof dsModuleParam['dsRef'] !== 'undefined') {
				return;
			}
			this._dsList[id] = [];
			add(dsModuleParam);

			function add(dsModuleParam, i) {
				var type = $.type(dsModuleParam);

				if (type === 'array') {
					for (var i = 0, l = dsModuleParam.length; i < l; i++) {
						add(dsModuleParam[i], i);
					}
				} else if (type === 'object') {
					//if (typeof dsModuleParam['dsRef']==='undefined'){
					var alias = model._getOldAlias(dsModuleParam['alias'], i);
					model._dsList[id].push({
						'alias' : alias
					});
					//}
				}
			}

		},
		_getOldAlias : function(oldAlias, i) {
			if (oldAlias) {
				return oldAlias;
			} else {
				if ($.type(i) === 'number') {
					return 'dataTable' + i;
				} else {
					return 'dataTable';
				}
			}
		},
		getModDsHtml : function() {
			var dsList = this._dsList, floorHtml = '<span class="txt">选择楼层：</span><select class="floor-ids">' + '<option value="">请选择楼层</option>';
			for (var p in dsList) {
				floorHtml += '<option value="' + p + '">' + p + '</option>';
			}
			floorHtml += '</select>';
			return floorHtml;
		},
		getAliasHtml : function(floorId) {
			if (!floorId) {
				return '';
			}
			var alias = this._dsList[floorId], aliasHtml = '<ul>';

			for (var i = 0, l = alias.length; i < l; i++) {
				var oldAlias = alias[i]['alias'];
				aliasHtml += '<li><span class="txt">原别名：</span>' + '<label for="' + floorId + '-' + oldAlias + '">' + oldAlias + '</label> ' + '<span class="txt">新别名：</span><input type="text" id="' + floorId + '-' + oldAlias + '" /></li>';

			}
			aliasHtml += '</ul>';
			return aliasHtml;
		}
	};

	DS.quoteDs = view;
})(dcms, FE.dcms, FE.dcms.box.datasource);
