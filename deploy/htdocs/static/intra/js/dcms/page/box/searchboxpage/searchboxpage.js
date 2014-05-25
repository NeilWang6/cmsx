/**
 * @author springyu
 */
;
(function($, D) {
	var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [
	function() {
		$("#example").treeview();

	},
	function() {
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	},
	/**
	 * ��ʼ����Դ���ͺ�ҳ��״̬�Ĺ�ϵ
	 */
	function() {
		var pageType=$('.dcms-search-form #pageType').val();
		
		if("BOX" == pageType){
			//��ʾ
			$('.dcms-search-form .li-page-status').show();
		}else{
			$('.dcms-search-form .li-page-status').hide();
		}
		//
		$('#pageType').bind('change', function(event) {
			var value=$(this).val();
		
			if("BOX" == value){
				//��ʾ
				$('.dcms-search-form .li-page-status').show();
			}else{
				$('.dcms-search-form .li-page-status').hide();
			}
			
		});
	},
	/**
	 * ��ʼ����Ŀ����
	 * modify by hongss on 2011.12.05
	 */
	function() {
		var popTree = new D.PopTree(), categoryIdEl = $('#selCategoryId'), categoryEl = $('#selcategoryName');

		categoryEl.click(function() {
			popTree.show(categoryEl, categoryEl, categoryIdEl);
		});
	},
	function() {
		$('.dcms-box-list').delegate('.js-data', 'click', function(event) {
			//event.preventDefault();
			var $self = $(this), $oRow = $self.closest('tr'),strUrl =$oRow.find('.js-url').attr('href').replace('http://','');
			if(strUrl){
				$self.attr('href','http://ipage.1688.com/dataview/trends/trends.htm?url='+strUrl);
			} else {
				event.preventDefault();
			}
			 
		});
	

		/**
		 * ����Ϊ��ҳ�档
		 */
		$('.dcms-box-list').delegate('.js-import', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), fromPage = _this.data('page-id');
			D.EditPage.importPage(null, null, fromPage);
		});
		/**
		 * �޸�ҳ��
		 */
		$('.dcms-box-list').delegate('.js-modification', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), pageId = _this.data('page-id');
			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
				'pageId' : pageId
			}, D.EditPage.edit, 'text');
		});
		//������������JS
		D.batchCopy();
		//���ط�����¼JS
		D.historyBoxPage();
		//
		//����
		$('.dcms-box-list .arrange-block').click(function(e) {
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
