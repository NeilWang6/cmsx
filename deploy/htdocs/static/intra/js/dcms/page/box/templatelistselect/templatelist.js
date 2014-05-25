/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D) {
	var form = $('#js-search-page'), url = D.domain + '/page/box/json.html';
	var readyFun = [
	/**
	 * 类目加载
	 */
	function() {
		var resourceType = $('#resource_type').val();

		if(resourceType) {
			switch(resourceType) {
				case 'pl_cell':
					resourceType = 'cell';
					break;
				case 'pl_template':
					resourceType = 'template';
					break;
				case 'pl_module':
					resourceType = 'module';
					break;
				default:
					resourceType = 'playout';
					break;
			}
			var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
				params : {
					type : resourceType,
					catalogId : '0'
				},
				id : 'catogoryId',
				name : 'catogoryId',
				parentId : 'firstSelect',
				parentName : 'topCat',
				container : 'catalog_content'
			});
			cascade.init();
		}
	},
	//add by hongss on 2012.11.23 for 高亮头部当前菜单
	function() {
		var params = $.unparam(location.search.replace('?', ''));
		if(params['template_type'] === 'page_layout') {
			$('.page-header .menu-layout').addClass('active');
		} else if(params['template_type'] === 'box') {
			$('.page-header .menu-template').addClass('active');
		}
	},
	/**
	 * 导入
	 */
	function() {
		$('.oper-bar .btn-import').click(function(e) {
			e.preventDefault();
			var _this = $(this), templateId = _this.data('template-id');
			//模板名称
			var title=_this.data('title');
			//页面id
			var pageId=$("#js-search-page #pageId").val();
			//专场id
			var topicId=$("#js-search-page #topicId").val();
			
			var body="<div class=\"text\"><span class=\"title\">"+title+"</span>将被选取为页面模板，请确认是否导入?</div>";
			
			FE.dcms.Msg.confirm({
				'title' : '提示',
				'body' : body,
				success : function(evt) {
					$.ajax({
						url : D.domain + "/page/box/import_topic_template.html",
						data : {
							"templateId" : templateId,
							"pageId" : pageId,
							"topicId" : topicId
						},
						dataType : 'jsonp',
						success : function(o) {

							var data = o, content = '';
							if(data.success == true) {
								//需要改进
								//alert("模板选取成功！");
								/**/
								var success_tip="<div class=\"middle\"><div class=\"left\"><i class=\"tui-icon-36 icon-success\"></i></div>" +
										"<div class=\"left \"><div class=\"title\">模板选取成功！</div><div>您可以在<a href=\"/page/box/easy_search_box_page.html?action=PageManager&event_submit_do_searchTopicPage=true&pageType=BOX\">页面管理</a>中查看进度</div></div></div>";
								FE.dcms.Msg.alert({
									'title' : '提示',
									'body' : success_tip
								});
								
								/*
								$.use('ui-dialog', function(){
				                    //如有多个浮出层，请另加ID或class
				                    var dialog = $('.js-template-select-tip').dialog({
				                        modal: false,
				                        fixed: true,
				                        center: true,
				                        timeout: 3000
				                    });
				                });
								*/
								
							} else {
								alert("系统错误，请联系管理员");	
							}
						},
						error : function() {
						}
					});
				}
			});

		});
	},
	function() {
		$("dl.js-template").hover(function(e) {
			var that = this, self = $(that);
			if(!self.hasClass('preview')) {
				self.addClass('preview');
			}

		}, function() {
			var self = $(this);
			self.removeClass('preview');
		});

	}];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
