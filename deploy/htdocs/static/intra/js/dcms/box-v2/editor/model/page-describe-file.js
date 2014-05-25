/**
 * 生成页面描述性文件
 * @author pingchun.yupc
 */

;(function($, D) {
	var classReg = new RegExp('^(cell-module$)|(cell-module-\\d+$)'),
	//
	classLayoutReg = new RegExp('^(cell-layout$)|(cell-layout-\\d+$)'),
	//
	classRowReg = new RegExp('^(cell-row$)|(cell-row-\\d+$)'),
	//
	classReg1 = new RegExp('^crazy-box-(\\w+)$'),
	/**
	 * 取得第一个分组
	 */
	getType = function(className, req) {
		var dataList = req.exec(className);
		if (dataList) {
			return dataList[1];
		}
	},

	/**
	 * 获取组件或区块属性
	 * 1.VM代码组件  提交属性到后台
	 * 2.可视化组件 把组件源代码提交到后台
	 */
	getModuleAttr = function($module) {
		var module = {}, className = D.BoxTools.getClassName($module, classReg);

		var dsdynamic = $module.data('dsdynamic'), skinconfig = $module.data('skinconfig'),
		//
		boxconfig = $module.data('boxconfig'), dsmoduleparam = $module.data('dsmoduleparam'),
		//
		elemInfo = $module.data('eleminfo'), spm = $module.data('spm');

		if (dsdynamic) {
			module['dsdynamic'] = dsdynamic;

			if (skinconfig) {
				module['skinconfig'] = skinconfig;
			}
			if (boxconfig) {
				module['boxconfig'] = boxconfig;
			}
			if (dsmoduleparam) {
				module['dsmoduleparam'] = dsmoduleparam;
			}
			if ($module.attr('id')) {
				module['attrId'] = $module.attr('id');
			}
			if (spm) {
				module['spm'] = spm;
			}
			module['guid'] = className;
			if (elemInfo) {
				if (elemInfo.id) {
					module['moduleId'] = elemInfo.id;
				}
				if (elemInfo.type) {
					module['type'] = elemInfo.type;
				}
				if (elemInfo.versionId) {
					module['versionId'] = elemInfo.versionId;
				}
			}
		} else {//可视化组件
			module['html'] = D.ManagePageDate._getCopyHtml($module, 'module', className);
		}
		return module;
	}, MODULE_RATE = 0.8;

	D.pageDescribeFile = {
		/**
		 * 分析页面结构，生成描述文件
		 * @param {Object} dom
		 */
		parse : function(dom) {
			var that = this, layout = {}, page = {}, $gridType = $('#gridType'),
			//
			contents = $('.cell-page-content', dom);
			if (that._checkIsHasLayoutId(dom)) {
				var rate = that._getDynamicModuleRate(dom);
				if (rate >= MODULE_RATE) {
					page['gridType'] = $gridType.val();
					that._specailHandle(dom, page);

					that._handle(contents, layout);
					page['content'] = layout;

					page['ids'] = that._getIds(dom);
					//console.log(JSON.stringify(page));
					return JSON.stringify(page);
				}
			}
		},
		/**
		 * 检查页面栅格是否有data-eleminfo属性
		 */
		_checkIsHasLayoutId : function(dom) {
			var isHasId = false, isTopBannerId = false, isBottomId = false, isLayoutId = false,
			//
			$allLayout = $('.crazy-box-layout', dom),
			//
			$elemInfoLayout = $('.crazy-box-layout[data-eleminfo]', dom),
			//
			$topBanner = $('#crazy-box-banner', dom), $bottomBanner = $('#crazy_box_footer', dom);
			if ($allLayout.length === $elemInfoLayout.length) {
				isLayoutId = true;
			}
			if ($topBanner && $topBanner.length) {
				var elemInfo = $topBanner.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					isTopBannerId = true;
				}
			} else {
				isTopBannerId = true;
			}
			if ($bottomBanner && $bottomBanner.length) {
				var elemInfo = $bottomBanner.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					isBottomId = true;
				}
			} else {
				isBottomId = true;
			}
			return isLayoutId && isTopBannerId && isBottomId;
		},
		//页面结构特殊处理 顶/底通栏，背景
		_specailHandle : function(dom, page) {
			var that = this, top = {}, elemInfo = '', footer = {}, $top = $('#crazy-box-banner', dom), $footer = $('#crazy_box_footer', dom);
			that._handle($top, top);
			if (top) {
				elemInfo = $top.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					top['layoutId'] = elemInfo.id;
				}
				page['top_banner'] = top;
			}

			that._handle($footer, footer);
			if (footer) {
				elemInfo = $footer.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					footer['layoutId'] = elemInfo.id;
				}

				page['footer_banner'] = footer;
			}

			page['style'] = that._handleBackground(dom);
			var config = that._handleGlobalParam(dom);
			if (config) {
				page['config'] = config;
			}

		},
		//获取全局参数
		_handleGlobalParam : function(dom) {
			var $boxDoc = $('#box_doc', dom);
			if ($boxDoc.attr('data-config')) {
				return $boxDoc.attr('data-config');
			}
		},
		//页面背景
		_handleBackground : function(dom) {
			var oDiv = $('<div/>');
			oDiv.append($('style[data-for="cell-page-main"]', dom));
			return oDiv.html();
		},
		//获取dsdynamic组件页面中组件的占比
		_getDynamicModuleRate : function(dom) {
			var $modules = $('.crazy-box-module', dom), $mDynamics = $('.crazy-box-module[data-dsdynamic]', dom),
			//
			moduleNum = $modules.length, mDynamicNum = $mDynamics.length;
			return parseFloat(mDynamicNum / moduleNum);
		},
		/**
		 * 获得页面中栅格和组件的ID集合
		 */
		_getIds : function(dom) {
			var layoutIds = [], moduleIds = [], $contents = $('.cell-page-content', dom),
			//
			$banner = $('.crazy-box-banner', dom), $modules = $('.crazy-box-module', dom);
			$contents.children('div').each(function(index, obj) {
				var $self = $(obj), elemInfo = $self.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					layoutIds.push(elemInfo.id);
				}
			});
			$banner.each(function(index, obj) {
				var $self = $(obj), elemInfo = $self.data('eleminfo');
				if (elemInfo && elemInfo.id) {
					layoutIds.push(elemInfo.id);
				}
			});
			$modules.each(function(index, obj) {
				var $self = $(obj), elemInfo = $self.data('eleminfo'), config = $self.attr('data-config'),
				//
				dsdynamic = $self.data('dsdynamic'), object = {};
				if (dsdynamic) {
					object['dsdynamic'] = dsdynamic;
				}
				if (config) {
					object['config'] = config;
				}
				if (elemInfo) {
					if (elemInfo.id) {
						object['id'] = elemInfo.id;
					}
					if (elemInfo.versionId) {
						object['versionId'] = elemInfo.versionId;
					}
					if (elemInfo.type) {
						object['type'] = elemInfo.type;
					}
				}
				moduleIds.push(object);
			});
			return {
				layoutIds : layoutIds,
				moduleIds : moduleIds
			};
		},
		/**
		 * 循环遍历DOM节点，构造页面描述文件
		 * @param {Object} content
		 */
		_handle : function(content) {
			var fun = arguments.callee, that = this, json = arguments[1] || {}, childrens = content.children('div');
			if (childrens && childrens.length) {
				var _child = json['children'] = [];

				var $module = content.children('.crazy-box-module');
				if ($module && $module.length) {
					json['type'] = 'module';
					$module.each(function(index, obj) {
						_child.push(getModuleAttr($(obj)));
					});
				} else {
					var className = D.BoxTools.getClassName($(childrens[0]), classReg1),
					//
					type = getType(className, classReg1);
					json['type'] = type;
					for (var i = 0; i < childrens.length; i++) {
						var $child = $(childrens[i]), object = {}, elemInfo = $child.data('eleminfo');
						var guid = D.BoxTools.getClassName($child, classLayoutReg), config = $child.attr('data-config');
						if (!guid) {
							guid = D.BoxTools.getClassName($child, classRowReg);
						}
						if (guid) {
							object['guid'] = guid;
						}
						if (elemInfo && elemInfo.id) {
							object[type + 'Id'] = elemInfo.id;
						}
						if (config) {
							object['config'] = config;
						}
						_child.push(object);
						fun($child, object);
					}
				}
			}
		}
	};

})(dcms, FE.dcms);
