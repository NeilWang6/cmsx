/**
 * @package FD.app.cms.search.page
 * @author: hongss
 * @Date: 2011-09-27
 */

;(function($, D) {
	var confirmEl = $('#dcms-message-confirm');
	var searchPageForm = $('#js-search-page'), pageNum = $('#js-page-num'), readyFun = [
	/**
	 *�鿴����
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
	 * ��ʼ����Ŀ����
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
	 * �л�����Nҳ
	 */
	function() {
		$('.pages').live('click', function(e) {
			e.preventDefault();
			var n = $(this).text();
			setPageNum(n);
		});
	},
	/**
	 * ��һҳ����һҳ
	 */
	function() {
		$('.dcms-page-btn').live('click', function(e) {
			e.preventDefault();
			var n = $(this).data('pagenum');
			setPageNum(n);
		});
	},
	/**
	 * �����ڼ�ҳ
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
						content = "�Ѿ���Ԥ�������·�ͬ��ָ�����ȼ����ӿɰ�Ԥ������Ԥ��";
					} else if(data.success == false) {
						content = "ϵͳ��������ϵ����Ա";
					}
					D.Message.confirm(confirmEl, {
						msg : content,
						title : '����ͬ��ģ��'
					});
				}
			}).fail(function() {
				D.Message.confirm(confirmEl, {
					msg : '��Ԥ�������·�ͬ��ָ��ʧ��',
					title : '����ͬ��ģ��'
				});
			});
		});
	},
	function() {
		//"����"��������ҳ��
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
		//"��"��������ҳ��
		$('.dcms-content .modification').click(function(e) {
			e.preventDefault();
			var _this = $(this), pageId = _this.data('page-id');
			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
				'pageId' : pageId
			}, D.EditPage.edit, 'text');
		});
	},
	function() {
		//����
		$('.dcms-content .arrange-block').click(function(e) {
			var _this = $(this), pageId = _this.data('page-id');
			pageType = _this.data('page-type');
			if(pageType == "VIFRAME" || pageType == "XML") {
				alert("��֧�ִ�����ҳ��");
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
