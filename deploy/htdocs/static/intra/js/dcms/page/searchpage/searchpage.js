/**
 * @package FD.app.cms.search.page
 * @author: hongss
 * @Date: 2011-09-27
 */

;(function($, D) {
	var confirmEl = $('#dcms-message-confirm');
	var searchPageForm = $('#js-search-page'), pageNum = $('#js-page-num'), readyFun = [
	/**
	 *查看数据
	 */
	function() {
		$('.dcms-grid').delegate('.js-data', 'click', function(event) {
			//event.preventDefault();
			var $self = $(this), $oRow = $self.closest('tr'), strUrl = $oRow.find('.js-url').attr('href').replace('http://', '');
		 
			if(strUrl) {
				$self.attr('href', 'http://ipage.1688.com/dataview/trends/trends.htm?url=' + strUrl);
			} else {
				event.preventDefault();
			}

		});
	},
	/**
	 * 初始化类目数据
	 * modify by hongss on 2011.12.05
	 */
	function() {
		//D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
		var popTree = new D.PopTree(), categoryIdEl = $('#selCategoryId'), categoryEl = $('#selcategoryName');

		categoryEl.click(function() {
			popTree.show(categoryEl, categoryEl, categoryIdEl);
		});
	},
	/**
	 * 切换到第N页
	 */
	function() {
		$('.pages').live('click', function(e) {
			e.preventDefault();
			var n = $(this).text();
			setPageNum(n);
		});
	},
	/**
	 * 上一页、下一页
	 */
	function() {
		$('.dcms-page-btn').live('click', function(e) {
			e.preventDefault();
			var n = $(this).data('pagenum');
			setPageNum(n);
		});
	},
	/**
	 * 跳到第几页
	 */
	function() {
		$('#js-jumpto-page').click(function(e) {
			var n = $('#js-jump-page').val();
			setPageNum(n);
		});
	},
	/***/
	function() {
		$('.sync-template').live('click', function(e) {
			e.preventDefault();
			var _this = $(this);
			var param = _this.data('param');
			$.ajax({
				url : D.domain + "/page/appCommand.html?" + param,
				type : "GET"
			}).done(function(o) {
				if(!!o) {
					var data = $.parseJSON(o);
					var content = '';
					if(data.success == true) {
						content = "已经向预发布机下发同步指定，等几分钟可绑定预发布机预览";
					} else if(data.success == false) {
						content = "系统错误，请联系管理员";
					}
					D.Message.confirm(confirmEl, {
						msg : content,
						title : '立即同步模板'
					});
				}
			}).fail(function() {
				D.Message.confirm(confirmEl, {
					msg : '向预发布机下发同步指定失败',
					title : '立即同步模板'
				});
			});
		});
	},
	function() {
		//"导入"盒子类型页面
		$('.dcms-content .import').click(function(e) {
			e.preventDefault();
			var _this = $(this),
			//templateId = $('#templateId').val(),
			//pageId = $('#pageId').val(),
			fromPage = _this.data('page-id');
			console.log(fromPage);
			D.EditPage.importPage(null, null, fromPage);
		});
	},
	function() {
		//"改"盒子类型页面
		$('.dcms-content .modification').click(function(e) {
			e.preventDefault();
			var _this = $(this), pageId = _this.data('page-id');
			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
				'pageId' : pageId
			}, D.EditPage.edit, 'text');
		});
	},
	function() {
		//排期
		$('.dcms-content .arrange-block').click(function(e) {
			var _this = $(this), pageId = _this.data('page-id');
			pageType = _this.data('page-type');
			if(pageType == "VIFRAME" || pageType == "XML") {
				alert("不支持此类型页面");
				return;
			}
			document.location.href = D.domain + '/page/arrange/arrange_block.htm?action=arrange_action&event_submit_do_query_arrange_block=true&&pageEnterFlag=true&pageId=' + pageId;
		});
	}];

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

	function setPageNum(n) {
		pageNum.val(n);
		searchPageForm.submit();
	}

})(dcms, FE.dcms);
