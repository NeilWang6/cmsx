/**
 * @author springyu
 * @desc
 */

;(function($, D) {

	var yunYing = {
		//加载栅格列表
		getGrids : function(type, target, dropInPage) {
			var that = this, iframeDoc = dropInPage.iframeDoc;
			$.ajax({
				url : D.domain + '/page/box/queryLayoutAjax.html',
				dataType : "jsonp",
				data : {
					type : type,
					id : '529'
				},
				success : function(o) {
					$.use('web-sweet,util-json', function() {
						var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
						template += '<div class="dcms-box-layoutcontent vertical-img" data-eleminfo="<%=$data[i].eleminfo%>">';
						template += ' <a class="box-img"><img class="dcms-box-right-image" src="<%= $data[i].image300Url%>" draggable="false"></a>';
						//template += ' <br><span><%= $data[i].name%></span>';
						template += '  </div>';
						template += '  <% } %>';
						var data = o['dataList'],fixedList = o['fixedList'], html = FE.util.sweet(template).applyData(data), jsLayoutElem, oDiv = $('<div/>');
						$('footer,button', '.js-dialog').show();
						$('.js-dialog').addClass('ext-width');
						jsLayoutElem = $('<div class="js-layout-elem layout-elem"><div>可选布局</div><div class="layout-grids"></div>可选浮窗和通栏<div class="layout-float"></div></div>');
						var $grids = $('.layout-grids', jsLayoutElem), $float = $('.layout-float', jsLayoutElem);
						$grids.empty();
						$float.empty();
						var fixed ='';
						if(fixedList){
							for(var i=0;i<fixedList.length;i++){
								fixed += '<div data-eleminfo="'+fixedList[i].eleminfo+'" class="dcms-box-layoutcontent float-grids"> <img draggable="false" src="'+fixedList[i].imageUrl+'" class="dcms-box-right-image"> </div>';
							}
						}
						 
						$float.html(fixed);
						$grids.html(html);
						oDiv.append(jsLayoutElem);

						D.Msg['confirm']({
							'title' : '添加布局',
							'body' : oDiv.html(),
							'noclose' : true,
                            'dbClickSelector' : 'div.dcms-box-layoutcontent',
							'success' : function(evt) {
                                var $selectLayout = $('.current', '.js-dialog'), elemInfo = $selectLayout.data('eleminfo');
								if($selectLayout[0] && $selectLayout.length) {
									if(elemInfo && (elemInfo.type === 'top_banner'||elemInfo.type === 'bottom_banner')) {
										that._addBanner(dropInPage, evt,elemInfo);
									} else {
										that._requestLayoutElemHTML.apply(that, [elemInfo, target, dropInPage, evt]);
									}

								} else {
									D.Msg.error({
										timeout : 5000,
										message : '请选择需要添加的栅格！'
									});
									return;
								}

							}
						},{
                            'close':function(e){
                                $(e.target).removeClass('ext-width');
                            }
                        });

					});
				},
				error : function() {
					target.html("连接超时请重试！");
				}
			});
			$('.dcms-box-layoutcontent').off('click');
			$('.js-dialog').delegate('.dcms-box-layoutcontent', 'click', function(event) {
				var _$self = $(this);
				$('.dcms-box-layoutcontent', '.js-dialog').removeClass('current');
				_$self.addClass('current');

			});
		},
		_addBanner : function(dropInPage, evt,elemInfo) {
			/**
			 * 增加通栏导航
			 */
			var doc = dropInPage.iframeDoc, $doc = $('#box_doc', doc),$banner,
			//
			url = D.domain + '/page/box/queryCellContentAjax.html',data = {};
			data['type'] = 'layout';
			data['rid'] = elemInfo['id'];
			$.ajax({
				url : url,
				data : data,
				type : 'POST',
				success : function(o) {
					var htmlCode,bannerHtml,widget,oDiv;
					o = $.parseJSON(o);
					if(o.data && o.msg === 'success') {
						bannerHtml = o.data,oDiv = $('<div/>');
						D.InsertHtml.init(bannerHtml, oDiv, 'html', false);
						widget = oDiv.children().not('link,style,script');
						widget.attr('data-eleminfo', JSON.stringify(elemInfo));
						bannerHtml = oDiv.html();
			$doc = !$doc.length ? $('.cell-page-grids-main', doc) : $doc;
			if(elemInfo&&elemInfo.type === 'top_banner'){
				 $banner = $('#crazy-box-banner', doc);
				if(!$banner[0] || !$banner.length) {
					$doc.prepend(bannerHtml);
					evt.data.dialog.dialog('close');
					dropInPage._hideAll();
					D.YunYing.isVisualChange();
				} else {
					D.Msg.error({
						timeout : 3000,
						message : '页面中已有顶部通栏！'
					});
					return;
				}
			}
			if(elemInfo&&elemInfo.type === 'bottom_banner'){
				 $banner = null;
				 $banner = $('#crazy_box_footer', $doc);
				 if(!$banner[0] || !$banner.length) {
				 		var $temp = $(bannerHtml);
				 		$temp.removeAttr('id');
						$temp.attr('id','crazy_box_footer');
						$doc.append($temp);
						//$doc.prepend(bannerHtml);
						evt.data.dialog.dialog('close');
						dropInPage._hideAll();
				} else {
					D.Msg.error({
						timeout : 3000,
						message : '页面中已有底部通栏！'
					});
					return;
				}
			}
			}
			}
			});

		},
		//把选中的栅格添加到页面中
		_requestLayoutElemHTML : function(elemInfo, target, dropInPage, evt) {
			var self = this, url = D.domain + '/page/box/queryCellContentAjax.html', data = {}, iframeDoc = dropInPage.iframeDoc;
			data['type'] = 'layout';
			data['rid'] = elemInfo['id'];

			$.ajax({
				url : url,
				data : data,
				type : 'POST',
				success : function(o) {
					var htmlCode,widget,oDiv;
					o = $.parseJSON(o);

					if(o.data && o.msg === 'success') {
						htmlCode = o.data,oDiv = $('<div/>');
						D.InsertHtml.init(htmlCode, oDiv, 'html', false);
						widget = oDiv.children().not('link,style,script');
						widget.attr('data-eleminfo', JSON.stringify(elemInfo));
						htmlCode = oDiv.html();
						htmlCode = D.ManagePageDate.handleStyle(htmlCode, {
							'mod' : 'sibling',
							'type' : 'layout',
							'target' : target
						}, true);
                        htmlCode = D.ManagePageDate.handleFixedLayoutWidth(htmlCode);
						var fixedTop = iframeDoc.find('.layout-fixed-top'), fixedRight = iframeDoc.find('.layout-fixed-right');
						//layout-fixed-right
						var $layout = $('<div>' + htmlCode + '</div>');
						if(fixedTop.length) {
							if($layout.find('.layout-fixed-top').length) {
								D.Msg.error({
									timeout : 3000,
									message : '页面中已有上浮窗！'
								});
								return;
							}
						}
						if(fixedRight.length) {
							if($layout.find('.layout-fixed-right').length) {
								D.Msg.error({
									timeout : 3000,
									message : '页面中已有右浮窗！'
								});
								return;
							}
						}

						var editInsertSteps = D.InsertHtml.init({
							'html' : htmlCode,
							'container' : target,
							'insertType' : 'after',
							'doc' : iframeDoc,
							'isEdit' : true
						});
						//记录已经做了修改
						D.BoxTools.setEdited({
							'param' : editInsertSteps,
							'callback' : null
						});
						dropInPage._hideAll();
						//D.YunYing.isVisualChange();
						evt.data.dialog.dialog('close');
					} else {
						//htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">获取数据失败，请重试！</span>';
						alert('数据加载失败，请重试！');
						return;
					}

				},
				error : function(o) {
					//错误提示信息
					//if(self.loading) {
					//self.loading.html('数据加载失败，请重试！');
					//}
					alert('数据加载失败，请重试！');
					return;
				}
			});
		},
		//查询组件列表
		_queryModuleList : function(query, callBack, isCate) {
			var applyDevice='pc';
			if($("#applyDevice")[0]){
				  applyDevice=$("#applyDevice").val();
			}
			var pageId = $("#pageId").val();

			var that = this, $self = $(that),
			url = D.domain + '/page/box/queryModuleAjax.html?_input_charset=UTF8',
			// 扩展别的属性，如标签
			data = $.extend({
				pageSize : 8,
				libraryType : 'library',
				resourceType : "pl_module",
				type : 'find',
				applyDevice:applyDevice,
				pageId:pageId
			}, query || {}), $options = $('#catalog_id option', '.js-dialog'), $catalogId = $('.catalog-content li.current', '.js-dialog').data('val'), catalogIds = '', pnum = 1;
			
            /*if($catalogId.val() === '二级类目' || !$catalogId.val()) {

				$options.each(function(index, obj) {
					var _$self = $(obj);
					if(_$self.val()) {
						catalogIds += _$self.val() + ',';
					}
				});
				if(catalogIds) {
					data['catalogIds'] = catalogIds;
				}

			} else {
				data['catalogIds'] = $catalogId.val();
			}*/

			//console.log($('#catalog_id','.js-dialog')[0]);
			/*var $keyword = $('#moduleKeyWords', '.js-dialog');
			if($keyword.val()) {
				data['keyword'] = $keyword.val();
			}*/
            var $keyword = $('#moduleKeyWords', '.js-dialog');
            if ($catalogId && isCate===true){
                data['catalogId']  = $catalogId;
                $keyword.val('');
            } else {
                $('.js-dialog').find('.catalog-content li').removeClass('current');
                
                if($keyword.val()) {
                    data['keyword'] = $keyword.val();
                }
            }
			if(data.currentPageSize) {
				pnum = data.currentPageSize;
			}
			if(data.source && data.source === 'public_block') {
				url = D.domain + '/page/box/queryPublicBlockAjax.html?_input_charset=UTF8';
                $('.catalog-content', '.js-dialog').hide();
			}else if(data.source && data.source === 'fav-module') {              
                //
                data.libraryType='favorit';
                data.type='fav-module';
                $('.catalog-content', '.js-dialog').show();
                
            }else {
                $('.catalog-content', '.js-dialog').show();
            }
    
			$.ajax({
				url : url,
				type : "POST",
				data : data,
				success : function(text) {
					var json = $.parseJSON(text), html = '';
					//console.log(json);
					$.use('web-sweet', function() {
						var template = '<ul class="fd-clr"><% for ( var i = 0; i < $data.length; i++ ) { %>';
						template += '<li class="list" data-eleminfo="<%=$data[i].eleminfo%>"><dl class="cell-product-2nd"><dt>';
						template += '<div class="vertical-img" >';
						template += ' <a class="box-img"  href="javascript:void(0);"><img class="img" src="<%= $data[i].imageUrl%>" draggable="false"  /></a>';
						template += '</div>';

						template += '</dt><dd class="title"><a target="_blank" href="' + D.domain + '/page/box/view.html?id=<%=$data[i].id%>&type=module" title="<%=$data[i].name%>"><%=$data[i].name%></a></dd>';
                        if (data.source && data.source === 'public_block'){
                            template += '<dd class="whole-cover">\
                                            <div class="cover-cover"></div>\
                                            <div class="tag"><span class="label" title="<%=$data[i].name%>">名称：<%=$data[i].name%></span></div>\
                                            <div class="tag"><span class="label">创建时间：<%=$data[i].gmtModified%></span></div>\
                                            <div class="opt-btns"><a target="_blank" href="/page/box/view.html?id=<%=$data[i].id%>&type=public_block" class="btn-basic btn-gray">预览</a>\
                                            </div></dd>';
                        } else {
                            template += '<dd class="whole-cover">\
                                            <div class="cover-cover"></div>\
                                            <div class="tag"><span class="label" title="<%=$data[i].name%>">名称：<%=$data[i].name%></span></div>\
                                            <div class="tag"><span class="label">UED：<%=$data[i].ued%></span></div>\
                                            <div class="tag"><span class="label">前端：<%=$data[i].frontend%></span></div>\
                                            <div class="tag"><span class="label">创建时间：<%=$data[i].gmtModified%></span></div>\
                                            <div class="opt-btns"><a target="_blank" href="/page/box/view.html?id=<%=$data[i].id%>&type=module" class="btn-basic btn-gray">预览</a>\
                                            <% if($data[i].favorite===true){ %>\
                                            <a href="#" data-type="BM" data-custom-id="<%=$data[i].id%>" class="btn-basic btn-yellow on-made">取消收藏</a><% } else { %>\
                                            <a href="#" data-type="BM" data-custom-id="<%=$data[i].id%>" class="btn-basic btn-yellow off-made">收藏</a><% }%>\
                                            </div></dd>';
                        }
						
						template += '</dl></li>';
						template += '<% } %></ul>';
						var dataList = json['dataList'];

						if(dataList) {
							html += FE.util.sweet(template).applyData(dataList);

						}
						var paginator = json['paginator'];
						if(paginator) {
							var pageHtml = '<div style="padding-top:5px;"><ul style="width:500px;margin:4px auto;" class="paging-t fd-clr">';
							pageHtml += '<li class="pagination">';
							if(paginator.page === 1) {
								pageHtml += '<span class="prev-disabled">上一页</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.previousPage + '" class="prev js-page">上一页</a>';
							}
							//<!-- 当前状态 -->

							if(paginator.slider) {
								for(var i = 0; i < paginator.slider.length; i++) {
									var slider = paginator.slider[i];
									if(slider === paginator.page) {
										pageHtml += '<span class="current">' + slider + '</span>';
									} else {
										pageHtml += '<a class="js-page" data-page="' + slider + '" href="javascript:void(0);">' + slider + '</a>';
									}
								}
								if(paginator.slider.length >= 7) {
									pageHtml += '<span class="omit">...</span>';
								}
							}
							if(paginator.page === paginator.pages) {
								pageHtml += '<span class="next-disabled">下一页</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.nextPage + '" class="next js-page">下一页</a>';
							}
							pageHtml += ' </li>';
							pageHtml += '<li>共<em>' + paginator.pages + '</em>页 到<input class="pnum" maxlength="4" autocomplete="off" value="' + pnum + '" type="text">页</li>';
							pageHtml += '<li><button type="button" class="btn-basic btn-gray js-page">跳转</button></li>';
							pageHtml += '</ul></div>';
							if(paginator.pages > 1) {
								html += pageHtml;
							}
						}
						callBack && typeof callBack === 'function' ? callBack.apply(that, [html]) : '';
					});

				}
			});
		},
		_requestModuleElemHTML : function(elemInfo, target, dropInPage, evt, method) {
            var self = this, url = D.domain + '/page/box/queryCellContentAjax.html', data = {},targetParent=target.parent();
			data['type'] = elemInfo['type'];
			data['rid'] = elemInfo['id'];
			data['versionId']=elemInfo['versionId'];
			$.ajax({
				url : url,
				data : data,
				type : 'POST',
				success : function(o) {
                    var htmlCode, widget, oDiv;
					o = $.parseJSON(o);
					if(o.data && o.msg === 'success') {
                        htmlCode = o.data, oDiv = $('<div/>');
						D.InsertHtml.init(htmlCode, oDiv, 'html', false);
						widget = oDiv.children().not('link,style,script');
						widget.attr('data-eleminfo', JSON.stringify(elemInfo));
						/**
						 *数据源换皮肤 数据源相同 参数保持不变，不同则替换
						 */
						//D.box.editor.Module.changeDataSource(target, widget);

						htmlCode = oDiv.html();
						var opts = {
							'mod' : 'replace',
							'target' : target,
                            'className' : 'cell-module',
							'type' : 'module'
						},
                            insertConfig = {
							'html' : htmlCode,
							'container' : target,
							'insertType' : 'replaceWith',
							'doc' : dropInPage.iframeDoc,
							'isEdit' : true
						}, isNew = false;
                        
                        if (method==='add'){  //sibling
                            opts['mod'] = 'sibling';
                            insertConfig['insertType'] = 'after';
                            insertConfig['container'] = target.closest('.crazy-box-row');
                            isNew = true;
                        }
                        
						htmlCode = D.ManagePageDate.handleStyle(htmlCode, opts, isNew);
						insertConfig['html'] = htmlCode;
                        
                        var editInsertSteps = D.InsertHtml.init(insertConfig);

						//记录已经做了修改
						D.BoxTools.setEdited({
							'param' : editInsertSteps,
							'callback' : null
						});
						dropInPage._hideAll();
						D.YunYing.isVisualChange();
						$(document).trigger('refreshContent',[targetParent]);
						evt.data.dialog.dialog('close');
					} else {
						//htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">获取数据失败，请重试！</span>';
						alert('数据加载失败，请重试！');
						return;
					}

				},
				error : function(o) {
					//错误提示信息
					//if(self.loading) {
					//self.loading.html('数据加载失败，请重试！');
					//}
					alert('数据加载失败，请重试！');
					return;
				}
			});

		},
		//查询组件相关事件绑定
		_queryModules : function(that, elemInfo, source) {  //, catalogfn
			var $Dialog = $('.js-dialog'), appendHtml = function(html) {
				var $list = $('.module-list', $Dialog);
				$list.empty();
				$list.append(html);

			};

			$Dialog.undelegate('a.js-search-module', 'click');
			$Dialog.undelegate('.js-page', 'click');
			$('.module-list').undelegate('.list', 'click');
			//页面事件：先中组件，分页等
			$('.module-list').delegate('.list', 'click', function(event) {
				var _$self = $(this);
				$('.list', '.js-dialog').removeClass('current');
				_$self.addClass('current');
			});
			$Dialog.delegate('a.js-search-module', 'click', function(event) {
				that._queryModuleList.apply(that, [{
					width : elemInfo.width,
					source : source,
					currentPageSize : 1
				}, appendHtml]);
			});
			$Dialog.delegate('.js-page', 'click', function(event) {
				var _$self = $(this), page = 1;
				if(_$self.is('a')) {
					page = _$self.data('page');
				} else {
					page = $('.pnum', '.js-dialog').val();
				}
				that._queryModuleList.apply(that, [{
					width : elemInfo.width,
					source : source,
					currentPageSize : page
				}, appendHtml, true]);
			});
            
            var cateCon = $('.con-category', $Dialog);
            
            /*cateCon.delegate('li', 'click', function(e){
                var li = $(this);
                cateCon.find('li').removeClass('current');
                li.addClass('current');
                that._queryModuleList.apply(that, [{
					width : elemInfo.width,
					currentPageSize : 1
				}, appendHtml, true]);
            });*/

			if(source == 'module') {
				var applyDevice='pc';
				if($("#applyDevice")[0]){
					  applyDevice=$("#applyDevice").val();
				}
				var pageId = $("#pageId").val();
				//加载类目
				//catalogfn && catalogfn();
                var url = D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8',
                    param = {
                        type : 'module',
                        catalogId : '0',
                        width: elemInfo.width,
                        applyDevice:applyDevice,
                        pageId:pageId
                    };
                this._allCategory(url, param, cateCon);
				$('select',$Dialog).show();
				$('.find-bar',$Dialog).show();
			} else if(source == 'fav-module'){
				//隐藏分类和搜索框
				$('.find-bar',$Dialog).hide();
			}else{
				$('select',$Dialog).empty();
				$('select',$Dialog).hide();
				$('.find-bar',$Dialog).show();
			}

			//执行查询
			that._queryModuleList.apply(that, [{
				width : elemInfo.width,
				source : source,
				currentPageSize : 1
			}, appendHtml]);

		},
		//展示运营查询组件列表
		showModuleList : function(elemInfo, target, dropInPage, method) {
            var that = this, $self = $(that),
            /**
			 * 类目加载
			 */
			/*_catalogInit = function() {
				var url = D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8';
				cascadeModule = new D.CascadeSelect(url, {
					params : {
						type : 'module',
						catalogId : '0'
					},
					container : 'module_catalog',
					htmlCode : '',
					parentPlaceHolder : '请选择类目'
				});
				cascadeModule.init();
			},*/ $Dialog = $('.js-dialog'), title = '添加组件',
			//
			html = '<div class="module-content"><div class="find-bar fd-clr"><div class="find-row con-category"></div><div class="find-row"><input type="text" placeHolder="请输入关键字查询" id="moduleKeyWords" value=""><a href="#" class="js-search-module search-btn btn-basic btn-gray">搜索</a></div></div>';
			$Dialog.addClass('ext-width');
			$('footer', $Dialog).show();
			$('.btn-submit', $Dialog).show();
			$('section', $Dialog).empty();
            if(method == 'replace') {
				title = "更换组件";
			} else if (method === 'add'){
                title = "添加组件";
            } else if (method === 'add-r'){
                title = "添加组件";
                method = 'replace';
            }
            
            var tabTriHtml = '';
			if(dropInPage&&dropInPage.config&&!dropInPage.config.status){
				tabTriHtml='<div class="tab-trigger"><a href="#" class="js-module-source current" data-source="module">' + title + '</a><a href="#" data-source="public_block" class="js-module-source">公用区块</a><a href="#" data-source="fav-module" class="js-module-source">我的收藏</a></div>';
			} else {
                tabTriHtml='<div class="tab-trigger"><a href="#" class="js-module-source current" data-source="module">' + title + '</a><a href="#" data-source="fav-module" class="js-module-source">我的收藏</a></div>';
            }
			D.Msg['confirm']({
				'title' : title,
				'body' : tabTriHtml + html + '<div class="module-list"></div></div>',
				'noclose' : true,
                'dbClickSelector': 'div.module-list li.list',
				'success' : function(evt) {
					var $selectModule = $('.module-list li.current', '.js-dialog'), elemInfo = $selectModule.data('eleminfo');
					if($selectModule[0] && $selectModule.length) {
                        that._requestModuleElemHTML.apply(that, [elemInfo, target, dropInPage, evt, method]);
					} else {
						D.Msg.error({
							timeout : 3000,
							message : '请选择需要添加的组件！'
						});
						return;
					}

				}
			}, {
                'close' : function(evt) {
                    $(evt.target).removeClass('ext-width');
				}
            });
			$Dialog.undelegate('.js-module-source', 'click');
			$Dialog.delegate('.js-module-source', 'click', function(event) {
				event.preventDefault();
                var $self = $(this), source = $self.data('source');
				$('.js-module-source', $Dialog).removeClass('current');
				$self.addClass('current');
				that._queryModules(that, elemInfo, source);
			});
            
            var cateCon = $('.con-category', $Dialog);
            
            cateCon.delegate('li', 'click', function(e){
                var li = $(this);
                cateCon.find('li').removeClass('current');
                li.addClass('current');
                that._queryModuleList.apply(that, [{
					width : elemInfo.width,
					currentPageSize : 1
				}, function(html) {
                    var $list = $('.module-list', $Dialog);
                    $list.empty();
                    $list.append(html);

                }, true]);
            });
            
			that._queryModules(that, elemInfo, 'module');

		},
		/**
		 * 触发分析处理是否视觉发生变化
		 */
		isVisualChange : function() {
			//var obj = $.unparam(location.href, '&'), pageId = obj.pageId || obj.page_id || $('pageId').val();
			//
			//draftId = obj.draftId || obj.draft_id || $('draftId').val();
			//$(D.YunYing).trigger(D.YunYing.CONSTANTS.DEF_VISUAL_CHANGE_EVENT, [pageId]);
		},
		_requestTemplateElemHTML : function(elemInfo, target, dropInPage, evt, callback) {
			//关联页面和模板，刷新编辑器为新模板
			var templateid = elemInfo;
			if(callback) {
				callback(templateid);
			}
			evt.data.dialog.dialog('close');
		},
		//展示运营查询模板列表
		showTemplateList : function(elemInfo, target, dropInPage, callback) {
			var that = this, $self = $(that),
			/**
			 * 类目加载
			 */
			/*_catalogInit = function() {
				var url = D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8',
				cascadeTemplate = new D.CascadeSelect(url, {
					params : {
						type : 'template',
						catalogId : '0'
					},
					container : 'template_catalog',
					htmlCode : '',
					parentPlaceHolder : '一级类目'
				});
				cascadeTemplate.init();
			}, */
            $Dialog = $('.js-dialog'), title = '选择模板', 
            appendHtml = function(html) {
				var $list = $('.template-list', $Dialog);
				$list.empty();
				$list.append(html);
			},
			//
			html = '<div class="find-bar fd-clr"><div class="find-row con-category"></div><div class="find-row"><input type="text" placeHolder="请输入关键字查询" id="templateKeyWords" name="keyword" value=""><a href="#" class="js-search search-btn btn-basic btn-gray" id="searchTemplate">搜索</a></div></div>';
			$Dialog.addClass('ext-width');
			$('footer', $Dialog).show();
			$('.btn-submit', $Dialog).show();
			$('section', $Dialog).empty();

			D.Msg['confirm']({
				'title' : title,
				'body' : html + '<div class="template-list"></div>',
				'noclose' : true,
				'success' : function(evt) {
					var $selectTemplate = $('.template-list .current', '.js-dialog'), elemInfo = $selectTemplate.data('eleminfo');
					
                    if($selectTemplate[0] && $selectTemplate.length) {
						that._requestTemplateElemHTML.apply(that, [elemInfo, target, dropInPage, evt, callback]);
					} else {
						D.Msg.error({
							timeout : 5000,
							message : '请选择需要的模板！'
						});
						return;
					}
				},
				'close' : function(evt) {
					$('.js-dialog').removeClass('ext-width');
				}
			});
			//先删除事件
			$('.js-dialog').undelegate('a.js-search', 'click');
			$('.js-dialog').undelegate('.js-page', 'click');
			$('.template-list').undelegate('.list', 'click');

			//页面事件：选择模板，分页等
			$('.template-list').delegate('.list', 'click', function(event) {
				var _$self = $(this);
				$('.list', '.js-dialog').removeClass('current');
				_$self.addClass('current');
			});
			$('.js-dialog').delegate('a.js-search', 'click', function(event) {
				that._queryTemplateList.apply(that, [{
					width : elemInfo.width,
					currentPageSize : 1
				}, appendHtml]);
			});
			$('.js-dialog').delegate('.js-page', 'click', function(event) {
				var _$self = $(this), page = 1;
				if(_$self.is('a')) {
					page = _$self.data('page');
				} else {
					page = $('.pnum', '.js-dialog').val();
				}
				that._queryTemplateList.apply(that, [{
					width : elemInfo.width,
					currentPageSize : page
				}, appendHtml, true]);
			});
			var applyDevice='pc';
				if($("#applyDevice")[0]){
					  applyDevice=$("#applyDevice").val();
				}
			var url = D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8',
                cateCon = $('.con-category', $Dialog),
                gridType = D.box.editor.getGridType(),
                param = {
                    type : 'template',
                    catalogId : '0',
                    gridType : gridType,
                    applyDevice:applyDevice
                };
            cateCon.delegate('li', 'click', function(e){
                var li = $(this);
                cateCon.find('li').removeClass('current');
                li.addClass('current');
                that._queryTemplateList.apply(that, [{
					width : elemInfo.width,
					currentPageSize : 1
				}, appendHtml, true]);
            });
            //加载类目
			//_catalogInit();
            this._allCategory(url, param, cateCon);
			//执行查询
			that._queryTemplateList.apply(that, [{
				width : elemInfo.width,
				currentPageSize : 1
			}, appendHtml]);
		},
        //类目 add by hongss on 2013.08.06
        _allCategory: function(url, param, container){
            $.ajax({
                url: url,
                data: param,
                dataType: 'jsonp',
                success: function(o){
                    if (o.status==='success' && o.data[0]){
                        var data = o.data,
                            categoryHtmlObj = {},
                            categoryHtml = '';
                        for(var i=0, l=data.length; i<l; i++){
                            if (data[i].level==='1'){
                                if (!categoryHtmlObj[data[i].code]){
                                    categoryHtmlObj[data[i].code] = {};
                                }
                                if (data[i].count){
                                    categoryHtmlObj[data[i].code]['dt'] = '<dt>'+data[i].name+':</dt><dd><ul><li data-val="'+data[i].code+'"><em>全部</em><i class="num">('+data[i].count+')</i></li>';
                                }
                                
                            } else if(data[i].level==='2') {
                                if (!categoryHtmlObj[data[i].parentCode]){
                                    categoryHtmlObj[data[i].parentCode] = {};
                                }
                                if (!categoryHtmlObj[data[i].parentCode]['dd']){
                                    categoryHtmlObj[data[i].parentCode]['dd'] = '';
                                }
                                if (data[i].count){
                                    categoryHtmlObj[data[i].parentCode]['dd'] += '<li data-val="'+data[i].code+'"><em>'+data[i].name+'</em><i class="num">('+data[i].count+')</i></li>';
                                }
                                
                            }
                        }
                        
                        for(p in categoryHtmlObj){
                            var ddHtml = '';
                            if (!categoryHtmlObj[p]['dt']){
                                continue;
                            }
                            
                            if (categoryHtmlObj[p]['dd']){
                                ddHtml = categoryHtmlObj[p]['dd'];
                            }
                            categoryHtml += '<dl class="category-item">'
                                         + categoryHtmlObj[p]['dt'] + ddHtml
                                         + '</ul></dd></dl>';
                            
                        }
                        if (categoryHtml){
                            categoryHtml = '<div class="catalog-content">' + categoryHtml + '</div>';
                            container.html(categoryHtml);
                        } 
                        
                    }
                }
            });
            
        },
		//查询模板列表
		_queryTemplateList : function(query, callBack, isCate) {
			var that = this, $self = $(that),
            gridType = D.box.editor.getGridType(),
            applyDevice='pc';
			if($("#applyDevice")[0]){
				  applyDevice=$("#applyDevice").val();
			}
			var url = D.domain + '/page/box/queryTemplateAjax.html?_input_charset=UTF8',
			// 扩展别的属性，如标签
			data = $.extend({
				pageSize : 7,
				libraryType : 'library',
				resourceType : "pl_template",
				template_type : "box",
                gridType: gridType,
				type : 'find',
				applyDevice:applyDevice
			}, query || {}), $options = $('#catalog_id option', '.js-dialog'),$catalogId = $('.catalog-content li.current', '.js-dialog').data('val'), catalogIds = '', pnum = 1;
			/*if($catalogId.val() === '二级类目' || !$catalogId.val()) {
				data['catalogId'] = $('#first_catalog_id', '.js-dialog').val();
			} else {
				data['catalogId'] = $catalogId.val();
			}*/
            var $keyword = $('#templateKeyWords', '.js-dialog');
            if ($catalogId && isCate===true){
                data['catalogId']  = $catalogId;
                $keyword.val('');
            } else {
                $('.js-dialog').find('.catalog-content li').removeClass('current');
                
                if($keyword.val()) {
                    data['keyword'] = $keyword.val();
                }
            }
            
			if(data.currentPageSize) {
				pnum = data.currentPageSize;
			}

			$.ajax({
				url : url,
				type : "POST",
				data : data,
				success : function(text) {
					var json = $.parseJSON(text), html = '';
					//console.log(json);
					$.use('web-sweet', function() {
						html = '<ul class="fd-clr">';
						html += '<li class="list"><dl class="cell-product-2nd"><dt class="vertical-img">';
						html += '<div><a class="box-img" href="javascript:void(0);">';
						html += '<img class="img" src="http://img.china.alibaba.com/cms/upload/2013/760/695/1596067_133354742.png" draggable="false"></a></div>';
						html += '</dt><dd class="title">自定义模版</dd></dl></li>';
						
                        var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
						template += '<li class="list" data-eleminfo="<%=$data[i].templateId %>"><dl class="cell-product-2nd"><dt>';
						template += '<div class="vertical-img" >';
						template += ' <a class="box-img"  href="javascript:void(0);"><img class="img" src="<%= $data[i].thumbnail%>" draggable="false"  /></a>';
						template += '</div>';
						template += '</dt><dd class="title"><a target="_blank" href="' + D.domain + '/page/box/view.html?id=<%=$data[i].templateId%>&type=template" title="<%=$data[i].templateName%>"><%=$data[i].templateName%></a></dd>';
						template += '<dd class="extinfo-bar"><div class="tag"><span class="label" title="<%=$data[i].tag%>">标签：<%=$data[i].tag%></span></div><div class="tag"><span class="label">创建时间：<%=$data[i].gmtModified%></span></div></dd>';
						template += '</dl></li>';
						template += '<% } %>';
						var dataList = json['data']['dataList'];

						if(dataList) {
							html += FE.util.sweet(template).applyData(dataList);

						}
                        html += '</ul>';
						var paginator = json['data']['paginator'];
						if(paginator) {
							var pageHtml = '<div style="padding-top:5px;"><ul style="width:500px;margin:4px auto;" class="paging-t fd-clr">';
							pageHtml += '<li class="pagination">';
							if(paginator.page === 1) {
								pageHtml += '<span class="prev-disabled">上一页</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.previousPage + '" class="prev js-page">上一页</a>';
							}
							//<!-- 当前状态 -->

							if(paginator.slider) {
								for(var i = 0; i < paginator.slider.length; i++) {
									var slider = paginator.slider[i];
									if(slider === paginator.page) {
										pageHtml += '<span class="current">' + slider + '</span>';
									} else {
										pageHtml += '<a class="js-page" data-page="' + slider + '" href="javascript:void(0);">' + slider + '</a>';
									}
								}
								if(paginator.slider.length >= 7) {
									pageHtml += '<span class="omit">...</span>';
								}
							}
							if(paginator.page === paginator.pages) {
								pageHtml += '<span class="next-disabled">下一页</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.nextPage + '" class="next js-page">下一页</a>';
							}
							pageHtml += ' </li>';
							pageHtml += '<li>共<em>' + paginator.pages + '</em>页 到<input class="pnum" maxlength="4" autocomplete="off" value="' + pnum + '" type="text">页</li>';
							pageHtml += '<li><button type="button" class="btn-basic btn-gray js-page">跳转</button></li>';
							pageHtml += '</ul></div>';
							if(paginator.pages > 1) {
								html += pageHtml;
							}
						}
						callBack && typeof callBack === 'function' ? callBack.apply(that, [html]) : '';
					});

				}
			});
		}
	};

	var readyFun = [
	function() {
		//初始化是否运营场景 构建D.YunYing对象
		D.YunYing = {
			//请不要删除，重要
			isYunYing : true
		};
		$.extend(D.YunYing, yunYing);
	},
	/**
	 * 邦定分析处理是否视觉发生变化
	 */
	function() {
		//常量定义
		D.YunYing.CONSTANTS = {
			////分析处理是否视觉发生变化自定义事件常量
			DEF_VISUAL_CHANGE_EVENT : 'yunying.visual_change_event'
		};
		//$(D.YunYing).bind(D.YunYing.CONSTANTS.DEF_VISUAL_CHANGE_EVENT, function(event) {
			/***/
			//var args = Array.prototype.slice.call(arguments, 1), data = {
			//	'pageId' : args[0]
			//};
			//if(!args[0]) {
			//	return;
			//}
			//$.ajax({
				//url : D.domain + '/page/box/visualChange.html',
				//data : data,
				//type : 'POST',
				//success : function(text) {
					//var json = $.parseJSON(text);
					////if(json.data&&json.data=='true');
					//$('#dcms_box_grid_submit').attr('data-visual', true);
			//	}
			//});
		//});
	},
    /*add by hongss for 隐藏/显示操作项*/
    function(){
        var boxLevelEl = $('#box_choose_level'),
            switchEl = $('.switch', boxLevelEl),
            degMoreEl = $('.design-more');
        switchEl.bind('click', function(e){
            var el = $(this);
            el.toggleClass('hide');
            showDegMore(el, degMoreEl);
        });
        $('#box_choose_level').delegate('li', 'click', function(){
            var li = $(this);
            if (li.hasClass('design')){
                showDegMore(switchEl, degMoreEl);
            } else {
                degMoreEl.hide(200);
            }
        });

        function showDegMore(el, degMoreEl){
            if (el.hasClass('hide')){
                degMoreEl.hide(200);
            } else {
                degMoreEl.show(200);
            }
        }
    }/*,
    //双击实现布局选择
    function(){
        $('.js-dialog').delegate('.js-layout-elem .dcms-box-layoutcontent', 'dblclick', function(){
            $(this).closest('.js-dialog').find('.btn-submit').trigger('click');
        });
    }*/];

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});

})(dcms, FE.dcms);
