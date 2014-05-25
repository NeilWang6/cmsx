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
	 * 初始化类目数据
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
		 * 修改页面
		 */
		$('.dcms-box-list').delegate('.js-modification', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), pageId = _this.data('page-id');
			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
				'pageId' : pageId
			}, D.EditPage.edit, 'text');
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
