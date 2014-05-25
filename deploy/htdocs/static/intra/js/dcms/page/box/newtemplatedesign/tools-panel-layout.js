/**
 * 新建或编辑布局 左侧相关功能
 * @author springyu
 */
;(function($, D) {

	/**
	 * 新建模版 左侧布局库列表
	 */
	D.toolsPanelLayoutList = {
		url : "/page/box/queryTemplateByAjax.html?_input_charset=UTF8",
		init : function(p) {
			var that = this, object = {
				template_type : 'page_layout',
				page : 1
			};
			if(!( typeof p === 'object')) {
				object.page = p;
			} else {
				object = null;
				object = p;
			}

			that._query(object);
		},
		_query : function(p) {
			var urlStr = D.domain + this.url, that = this, $content = $('div.edit-content'), $templateType = $('#template_type'), $paginationNav = $('div.page-pagination-nav');
			;
			$.ajax({
				url : urlStr,
				type : "get",
				data : p,
				success : function(text) {
					var json = $.parseJSON(text);
					var html = ' <% for ( var i = 0; i < $data.length; i++ ) { %>   <div class="layout-content" data-val="<%= $data[i].templateId%>">';
					html += '<dl class="detail">';
					html += '<dd>';
					html += '  <div class="vertical-img">';
					html += '   <a href="javascript:void(0);" class="box-img"> <img draggable="false"  class="" src="<%= $data[i].thumbnail%>"/> </a>';
					html += ' </div>';
					html += ' </dd>';
					html += ' <dt>';
					html += '    <div class="template-name">';
					html += '       <span><%= $data[i].templateName%></span>';
					html += '   </div>';
					html += '  </dt>';
					// html += ' <dd>';
					// html += '  <div class="operation">';
					// html += '     <a href="javascript:void(0);" class="btn-basic">预览</a>&nbsp;<a class="btn-basic" href="javascript:void(0);">引用</a>';
					//html += ' </div>';
					//html += ' </dd>';
					html += ' </dl>';
					html += '</div> <% } %>';
					// console.log(json);
					var data = json && json.data && json.data.dataList;
					if(data) {
						$content.empty();
						$content.append('<div class="find-bar"><div class="find-row"><label  id="layout_catalog">类目：</label><div class="catalog-content"><select id="first_catalog_id" name="firstCatalogId"></select><select id="catalog_id"  name="catalogId"></select><span class="dcms-validator-tip"></span></div></div><div class="find-row"><input type="text" id="moduleKeyWords" value=""><a href="#" class="search" id="searchModule">搜索</a></div></div>');
						$.use('web-sweet', function() {
							var temp = FE.util.sweet(html).applyData(data);
							$content.append(temp);
						});

					} else {
						$content.empty();
						$content.append('<div class="find-bar"><div class="find-row"><label  id="layout_catalog">类目：</label><div class="catalog-content"><select id="first_catalog_id" name="firstCatalogId"></select><select id="catalog_id"  name="catalogId"></select><span class="dcms-validator-tip"></span></div></div><div class="find-row"><input type="text" id="moduleKeyWords" value=""><a href="#" class="search" id="searchModule">搜索</a></div></div>');

					}
					if(p.catalogId) {
						$("#layout_catalog").data('value', p.catalogId);
					}
					var pageHtml = '', paginator = json.data && json.data.paginator;
					if(paginator) {
						//分页控件
						pageHtml = '<ul class="paging-t fd-clr"> ';
						pageHtml += '<li class="pagination">';
						pageHtml += '<!-- “上一页”不可点的样式为加class“prev-disabled” -->';
						if(paginator.page === 1) {
							pageHtml += ' <a href="javascript:void(0);" class="prev-disabled">上一页</a>';
						} else {
							pageHtml += ' <a href="javascript:void(0);" data-val="' + paginator.previousPage + '" class="prev">上一页</a>';
						}
						//pageHtml += ' <span class="current">' + paginator.page + '</span>';
						pageHtml += ' <!-- “下一页”不可点的样式为加class“next-disabled” -->';
						if(paginator.page === paginator.lastPage) {
							pageHtml += ' <a href="javascript:void(0);" class="next-disabled">下一页</a>';
						} else {
							pageHtml += ' <a href="javascript:void(0);" data-val="' + paginator.nextPage + '" class="next">下一页</a>';
						}
						pageHtml += ' </li>';
						pageHtml += '<li>共<em>' + paginator.page + '/' + paginator.pages + '</em>页 </li>';
						// pageHtml += '<li><button type="button" class="btn-basic btn-gray">确定</button></li> 到<input class="pnum" maxlength="4" autocomplete="off" type="text">页';
						pageHtml += '</ul>';
						$paginationNav.empty();
						$paginationNav.append(pageHtml);
					}
					that._bind(p);

				},
				error : function() {
					console.log("连接超时请重试！");
				}
			});
		},
		_bind : function(p) {
			var that = this;
			$('a.prev,a.next').bind('click', function(event) {
				event.preventDefault();
				var $self = $(this), val = $self.data('val');
				p.page = parseInt(val);
				that.init(p);
			});
			$('div.box-layout-list').delegate('.layout-content', 'click', function(event) {
				var $self = $(this), obj = $.unparam(location.href, '&');

				var fromTemplate = $self.data('val'), templateId = obj.templateId || $('#templateId').val(), draftId = obj.draftId || $('#draftId').val(), templateType = obj.template_type || $('#template_type').val();
				var params = '';
				if(templateId) {
					params += '&templateId=' + templateId;
				}
				if(draftId) {
					params += '&draftId=' + draftId;
				}
				if(templateType) {
					params += '&templateType=' + templateType;
				}
				// console.log(params);
				location.href = D.domain + '/page/box/import_template.html?newTemplateDesign=new&fromTemplate=' + fromTemplate + params;
			});
			$('#searchModule').bind('click', function(event) {
				event.preventDefault();
				var catalogId = $('#catalog_id').val(), keyword = $('#moduleKeyWords').val();
				that.init({
					template_type : 'page_layout',
					page : 1,
					catalogId : catalogId,
					keyword : keyword
				});
			});
			//加载类目树
			var cascadeModule = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
				params : {
					type : 'playout',
					catalogId : '0'
				},
				container : 'layout_catalog',
				htmlCode : ''
			});
			cascadeModule.init();

		}
	};
	//新建布局 左侧面板初始化
	D.toolsPanelLayout = function() {
		var layoutContainer = $('.edit-layout'), url = "/page/box/queryLayoutAjax.html",
		//
		doc = $($('#dcms_box_main')[0].contentWindow.document);
		if(layoutContainer.length > 0) {
			D.getLayoutShowData(url, "layoutH990", layoutContainer);

			// add by hongss on 2012.07.30 for 多个栅格系统供选择
			$('#layout-type').change(function() {
				var layoutType = $(this).val();
				D.getLayoutShowData(url, layoutType, layoutContainer);

				var grids = D.getGridsContent(layoutType),  content = $('#content', doc), link = $('#crazy-box-fdev', doc);
				content.removeClass('w968').removeClass('screen').removeClass('dcms-crazy-box-q952').removeClass('dcms-crazy-box-q990').removeClass('dcms-crazy-box-h990');
				content.addClass(grids['className']).addClass(grids['class']);
				link.attr('href', grids['link']);
				if(layoutType==='layoutQ990'){
					content.find('.grid-24').removeClass('grid-24').addClass('grid-25');
				} else {
					content.find('.grid-25').removeClass('grid-25').addClass('grid-24');
				}
			});
		}
		// add by hongss on 2012.09.06 for add fixed layout
		var fixedContainer = $('.edit-float-layout .content');
		if(fixedContainer.length > 0) {
			D.getLayoutShowData(url, "layoutFixed", fixedContainer);
		}
		var microContainer = $('.edit-micro-layout .micro');
		if(microContainer.length > 0) {
			$('.micro-layout', microContainer).data(D.DropInPage.CONSTANTS.ELEMENT_DATA_HTML_CODE, D.ToolsPanel.MICRO_LAYOUT_HTML);
		}
		/**
		 * 增加通栏导航
		 */
		var $doc = $('#box_doc', doc),
		//
		bannerHtml = '<div id="crazy-box-banner" class="crazy-box-banner" style="margin-bottom:0;">';
		bannerHtml += '   <div class="crazy-box-grid" data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;row&quot;,&quot;number&quot;:&quot;n&quot;}}}">';
		bannerHtml += '<div class="crazy-box-row cell-row-0" data-boxoptions="{&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;}}}">';
		bannerHtml += '  <div class="crazy-box-box box-100" data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;module&quot;,&quot;number&quot;:&quot;1&quot;}}}">';
		bannerHtml += ' <div class="crazy-box-module cell-module-0" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;背景设置&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;height&quot;,&quot;name&quot;:&quot;高度&quot;,&quot;type&quot;:&quot;input&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;内边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;外边距&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;边框&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;}}}">';
		bannerHtml += '   <div class="crazy-box-content" data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;}}}"></div>';
		bannerHtml += '  </div></div></div></div></div>';
		$doc = !$doc.length?$('.cell-page-grids-main', doc):$doc;
		$('#nav-banner').change(function(event) {
			var banner = $('#crazy-box-banner', doc);
			if($(this).attr('checked') === 'checked') {
				if(banner.length > 0) {
					banner.remove();
				}
				$doc.prepend(bannerHtml);
				D.DropInPage.addEnableClass(doc);
			} else {
				banner.remove();
			}
		});
		$('#nav_footer').bind('click', function(event) {
			var banner = $('#crazy_box_footer', doc);
			if($(this).attr('checked') === 'checked') {
				if(banner.length > 0) {
					banner.remove();
				}
				var $banner = $(bannerHtml);
				$banner.removeAttr('id');
				$banner.attr('id','crazy_box_footer');
				$doc.append($banner);
				D.DropInPage.addEnableClass(doc);
			} else {
				banner.remove();
			}
		});
		D.bottomAttr.resizeWindow();
	};

	/**
	 * @author roobin.lij
	 * @userfor 渲染页面设计右侧layout数据
	 * @date 2012-01-07
	 */
	D.getLayoutShowData = function(url, type, content, callback) {
		var urlStr = D.domain + url;
		$.ajax({
			url : urlStr,
			dataType : "jsonp",
			data : {
				type : type
			},
			success : function(o) {
				$.use('web-sweet,util-json', function() {
					var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
					template += '<div class="dcms-box-layoutcontent" data-eleminfo="<%=$data[i].eleminfo%>">';
					template += ' <img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false">';
					template += ' <br><span><%= $data[i].name%></span>';
					template += '  </div>';
					template += '  <% } %>';
					var data = o['dataList'];
					var html = FE.util.sweet(template).applyData(data);
					content.empty();
					content.html(html);
				});
			},
			error : function() {
				content.html("连接超时请重试！");
			}
		});
	};

})(dcms, FE.dcms);
