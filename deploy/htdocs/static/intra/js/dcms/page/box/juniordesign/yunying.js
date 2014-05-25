/**
 * @author springyu
 * @desc
 */

;(function($, D) {

	var yunYing = {
		//����դ���б�
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
						jsLayoutElem = $('<div class="js-layout-elem layout-elem"><div>��ѡ����</div><div class="layout-grids"></div>��ѡ������ͨ��<div class="layout-float"></div></div>');
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
							'title' : '��Ӳ���',
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
										message : '��ѡ����Ҫ��ӵ�դ��'
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
					target.html("���ӳ�ʱ�����ԣ�");
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
			 * ����ͨ������
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
						message : 'ҳ�������ж���ͨ����'
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
						message : 'ҳ�������еײ�ͨ����'
					});
					return;
				}
			}
			}
			}
			});

		},
		//��ѡ�е�դ����ӵ�ҳ����
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
									message : 'ҳ���������ϸ�����'
								});
								return;
							}
						}
						if(fixedRight.length) {
							if($layout.find('.layout-fixed-right').length) {
								D.Msg.error({
									timeout : 3000,
									message : 'ҳ���������Ҹ�����'
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
						//��¼�Ѿ������޸�
						D.BoxTools.setEdited({
							'param' : editInsertSteps,
							'callback' : null
						});
						dropInPage._hideAll();
						//D.YunYing.isVisualChange();
						evt.data.dialog.dialog('close');
					} else {
						//htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">��ȡ����ʧ�ܣ������ԣ�</span>';
						alert('���ݼ���ʧ�ܣ������ԣ�');
						return;
					}

				},
				error : function(o) {
					//������ʾ��Ϣ
					//if(self.loading) {
					//self.loading.html('���ݼ���ʧ�ܣ������ԣ�');
					//}
					alert('���ݼ���ʧ�ܣ������ԣ�');
					return;
				}
			});
		},
		//��ѯ����б�
		_queryModuleList : function(query, callBack, isCate) {
			var applyDevice='pc';
			if($("#applyDevice")[0]){
				  applyDevice=$("#applyDevice").val();
			}
			var pageId = $("#pageId").val();

			var that = this, $self = $(that),
			url = D.domain + '/page/box/queryModuleAjax.html?_input_charset=UTF8',
			// ��չ������ԣ����ǩ
			data = $.extend({
				pageSize : 8,
				libraryType : 'library',
				resourceType : "pl_module",
				type : 'find',
				applyDevice:applyDevice,
				pageId:pageId
			}, query || {}), $options = $('#catalog_id option', '.js-dialog'), $catalogId = $('.catalog-content li.current', '.js-dialog').data('val'), catalogIds = '', pnum = 1;
			
            /*if($catalogId.val() === '������Ŀ' || !$catalogId.val()) {

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
                                            <div class="tag"><span class="label" title="<%=$data[i].name%>">���ƣ�<%=$data[i].name%></span></div>\
                                            <div class="tag"><span class="label">����ʱ�䣺<%=$data[i].gmtModified%></span></div>\
                                            <div class="opt-btns"><a target="_blank" href="/page/box/view.html?id=<%=$data[i].id%>&type=public_block" class="btn-basic btn-gray">Ԥ��</a>\
                                            </div></dd>';
                        } else {
                            template += '<dd class="whole-cover">\
                                            <div class="cover-cover"></div>\
                                            <div class="tag"><span class="label" title="<%=$data[i].name%>">���ƣ�<%=$data[i].name%></span></div>\
                                            <div class="tag"><span class="label">UED��<%=$data[i].ued%></span></div>\
                                            <div class="tag"><span class="label">ǰ�ˣ�<%=$data[i].frontend%></span></div>\
                                            <div class="tag"><span class="label">����ʱ�䣺<%=$data[i].gmtModified%></span></div>\
                                            <div class="opt-btns"><a target="_blank" href="/page/box/view.html?id=<%=$data[i].id%>&type=module" class="btn-basic btn-gray">Ԥ��</a>\
                                            <% if($data[i].favorite===true){ %>\
                                            <a href="#" data-type="BM" data-custom-id="<%=$data[i].id%>" class="btn-basic btn-yellow on-made">ȡ���ղ�</a><% } else { %>\
                                            <a href="#" data-type="BM" data-custom-id="<%=$data[i].id%>" class="btn-basic btn-yellow off-made">�ղ�</a><% }%>\
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
								pageHtml += '<span class="prev-disabled">��һҳ</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.previousPage + '" class="prev js-page">��һҳ</a>';
							}
							//<!-- ��ǰ״̬ -->

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
								pageHtml += '<span class="next-disabled">��һҳ</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.nextPage + '" class="next js-page">��һҳ</a>';
							}
							pageHtml += ' </li>';
							pageHtml += '<li>��<em>' + paginator.pages + '</em>ҳ ��<input class="pnum" maxlength="4" autocomplete="off" value="' + pnum + '" type="text">ҳ</li>';
							pageHtml += '<li><button type="button" class="btn-basic btn-gray js-page">��ת</button></li>';
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
						 *����Դ��Ƥ�� ����Դ��ͬ �������ֲ��䣬��ͬ���滻
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

						//��¼�Ѿ������޸�
						D.BoxTools.setEdited({
							'param' : editInsertSteps,
							'callback' : null
						});
						dropInPage._hideAll();
						D.YunYing.isVisualChange();
						$(document).trigger('refreshContent',[targetParent]);
						evt.data.dialog.dialog('close');
					} else {
						//htmlCode = '<span data-eleminfo="' + JSON.stringify(elemInfo) + '">��ȡ����ʧ�ܣ������ԣ�</span>';
						alert('���ݼ���ʧ�ܣ������ԣ�');
						return;
					}

				},
				error : function(o) {
					//������ʾ��Ϣ
					//if(self.loading) {
					//self.loading.html('���ݼ���ʧ�ܣ������ԣ�');
					//}
					alert('���ݼ���ʧ�ܣ������ԣ�');
					return;
				}
			});

		},
		//��ѯ�������¼���
		_queryModules : function(that, elemInfo, source) {  //, catalogfn
			var $Dialog = $('.js-dialog'), appendHtml = function(html) {
				var $list = $('.module-list', $Dialog);
				$list.empty();
				$list.append(html);

			};

			$Dialog.undelegate('a.js-search-module', 'click');
			$Dialog.undelegate('.js-page', 'click');
			$('.module-list').undelegate('.list', 'click');
			//ҳ���¼��������������ҳ��
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
				//������Ŀ
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
				//���ط����������
				$('.find-bar',$Dialog).hide();
			}else{
				$('select',$Dialog).empty();
				$('select',$Dialog).hide();
				$('.find-bar',$Dialog).show();
			}

			//ִ�в�ѯ
			that._queryModuleList.apply(that, [{
				width : elemInfo.width,
				source : source,
				currentPageSize : 1
			}, appendHtml]);

		},
		//չʾ��Ӫ��ѯ����б�
		showModuleList : function(elemInfo, target, dropInPage, method) {
            var that = this, $self = $(that),
            /**
			 * ��Ŀ����
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
					parentPlaceHolder : '��ѡ����Ŀ'
				});
				cascadeModule.init();
			},*/ $Dialog = $('.js-dialog'), title = '������',
			//
			html = '<div class="module-content"><div class="find-bar fd-clr"><div class="find-row con-category"></div><div class="find-row"><input type="text" placeHolder="������ؼ��ֲ�ѯ" id="moduleKeyWords" value=""><a href="#" class="js-search-module search-btn btn-basic btn-gray">����</a></div></div>';
			$Dialog.addClass('ext-width');
			$('footer', $Dialog).show();
			$('.btn-submit', $Dialog).show();
			$('section', $Dialog).empty();
            if(method == 'replace') {
				title = "�������";
			} else if (method === 'add'){
                title = "������";
            } else if (method === 'add-r'){
                title = "������";
                method = 'replace';
            }
            
            var tabTriHtml = '';
			if(dropInPage&&dropInPage.config&&!dropInPage.config.status){
				tabTriHtml='<div class="tab-trigger"><a href="#" class="js-module-source current" data-source="module">' + title + '</a><a href="#" data-source="public_block" class="js-module-source">��������</a><a href="#" data-source="fav-module" class="js-module-source">�ҵ��ղ�</a></div>';
			} else {
                tabTriHtml='<div class="tab-trigger"><a href="#" class="js-module-source current" data-source="module">' + title + '</a><a href="#" data-source="fav-module" class="js-module-source">�ҵ��ղ�</a></div>';
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
							message : '��ѡ����Ҫ��ӵ������'
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
		 * �������������Ƿ��Ӿ������仯
		 */
		isVisualChange : function() {
			//var obj = $.unparam(location.href, '&'), pageId = obj.pageId || obj.page_id || $('pageId').val();
			//
			//draftId = obj.draftId || obj.draft_id || $('draftId').val();
			//$(D.YunYing).trigger(D.YunYing.CONSTANTS.DEF_VISUAL_CHANGE_EVENT, [pageId]);
		},
		_requestTemplateElemHTML : function(elemInfo, target, dropInPage, evt, callback) {
			//����ҳ���ģ�壬ˢ�±༭��Ϊ��ģ��
			var templateid = elemInfo;
			if(callback) {
				callback(templateid);
			}
			evt.data.dialog.dialog('close');
		},
		//չʾ��Ӫ��ѯģ���б�
		showTemplateList : function(elemInfo, target, dropInPage, callback) {
			var that = this, $self = $(that),
			/**
			 * ��Ŀ����
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
					parentPlaceHolder : 'һ����Ŀ'
				});
				cascadeTemplate.init();
			}, */
            $Dialog = $('.js-dialog'), title = 'ѡ��ģ��', 
            appendHtml = function(html) {
				var $list = $('.template-list', $Dialog);
				$list.empty();
				$list.append(html);
			},
			//
			html = '<div class="find-bar fd-clr"><div class="find-row con-category"></div><div class="find-row"><input type="text" placeHolder="������ؼ��ֲ�ѯ" id="templateKeyWords" name="keyword" value=""><a href="#" class="js-search search-btn btn-basic btn-gray" id="searchTemplate">����</a></div></div>';
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
							message : '��ѡ����Ҫ��ģ�壡'
						});
						return;
					}
				},
				'close' : function(evt) {
					$('.js-dialog').removeClass('ext-width');
				}
			});
			//��ɾ���¼�
			$('.js-dialog').undelegate('a.js-search', 'click');
			$('.js-dialog').undelegate('.js-page', 'click');
			$('.template-list').undelegate('.list', 'click');

			//ҳ���¼���ѡ��ģ�壬��ҳ��
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
            //������Ŀ
			//_catalogInit();
            this._allCategory(url, param, cateCon);
			//ִ�в�ѯ
			that._queryTemplateList.apply(that, [{
				width : elemInfo.width,
				currentPageSize : 1
			}, appendHtml]);
		},
        //��Ŀ add by hongss on 2013.08.06
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
                                    categoryHtmlObj[data[i].code]['dt'] = '<dt>'+data[i].name+':</dt><dd><ul><li data-val="'+data[i].code+'"><em>ȫ��</em><i class="num">('+data[i].count+')</i></li>';
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
		//��ѯģ���б�
		_queryTemplateList : function(query, callBack, isCate) {
			var that = this, $self = $(that),
            gridType = D.box.editor.getGridType(),
            applyDevice='pc';
			if($("#applyDevice")[0]){
				  applyDevice=$("#applyDevice").val();
			}
			var url = D.domain + '/page/box/queryTemplateAjax.html?_input_charset=UTF8',
			// ��չ������ԣ����ǩ
			data = $.extend({
				pageSize : 7,
				libraryType : 'library',
				resourceType : "pl_template",
				template_type : "box",
                gridType: gridType,
				type : 'find',
				applyDevice:applyDevice
			}, query || {}), $options = $('#catalog_id option', '.js-dialog'),$catalogId = $('.catalog-content li.current', '.js-dialog').data('val'), catalogIds = '', pnum = 1;
			/*if($catalogId.val() === '������Ŀ' || !$catalogId.val()) {
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
						html += '</dt><dd class="title">�Զ���ģ��</dd></dl></li>';
						
                        var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
						template += '<li class="list" data-eleminfo="<%=$data[i].templateId %>"><dl class="cell-product-2nd"><dt>';
						template += '<div class="vertical-img" >';
						template += ' <a class="box-img"  href="javascript:void(0);"><img class="img" src="<%= $data[i].thumbnail%>" draggable="false"  /></a>';
						template += '</div>';
						template += '</dt><dd class="title"><a target="_blank" href="' + D.domain + '/page/box/view.html?id=<%=$data[i].templateId%>&type=template" title="<%=$data[i].templateName%>"><%=$data[i].templateName%></a></dd>';
						template += '<dd class="extinfo-bar"><div class="tag"><span class="label" title="<%=$data[i].tag%>">��ǩ��<%=$data[i].tag%></span></div><div class="tag"><span class="label">����ʱ�䣺<%=$data[i].gmtModified%></span></div></dd>';
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
								pageHtml += '<span class="prev-disabled">��һҳ</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.previousPage + '" class="prev js-page">��һҳ</a>';
							}
							//<!-- ��ǰ״̬ -->

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
								pageHtml += '<span class="next-disabled">��һҳ</span>';
							} else {
								pageHtml += '<a href="javascript:void(0);" data-page="' + paginator.nextPage + '" class="next js-page">��һҳ</a>';
							}
							pageHtml += ' </li>';
							pageHtml += '<li>��<em>' + paginator.pages + '</em>ҳ ��<input class="pnum" maxlength="4" autocomplete="off" value="' + pnum + '" type="text">ҳ</li>';
							pageHtml += '<li><button type="button" class="btn-basic btn-gray js-page">��ת</button></li>';
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
		//��ʼ���Ƿ���Ӫ���� ����D.YunYing����
		D.YunYing = {
			//�벻Ҫɾ������Ҫ
			isYunYing : true
		};
		$.extend(D.YunYing, yunYing);
	},
	/**
	 * ����������Ƿ��Ӿ������仯
	 */
	function() {
		//��������
		D.YunYing.CONSTANTS = {
			////���������Ƿ��Ӿ������仯�Զ����¼�����
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
    /*add by hongss for ����/��ʾ������*/
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
    //˫��ʵ�ֲ���ѡ��
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
