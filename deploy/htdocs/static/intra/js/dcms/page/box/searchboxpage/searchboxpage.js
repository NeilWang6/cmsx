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
	 * 初始化资源类型和页面状态的关系
	 */
	function() {
		var pageType=$('.dcms-search-form #pageType').val();
		
		if("BOX" == pageType){
			//显示
			$('.dcms-search-form .li-page-status').show();
		}else{
			$('.dcms-search-form .li-page-status').hide();
		}
		//
		$('#pageType').bind('change', function(event) {
			var value=$(this).val();
		
			if("BOX" == value){
				//显示
				$('.dcms-search-form .li-page-status').show();
			}else{
				$('.dcms-search-form .li-page-status').hide();
			}
			
		});
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
		 * 导入为新页面。
		 */
		$('.dcms-box-list').delegate('.js-import', 'click', function(event) {
			event.preventDefault();
			var _this = $(this), fromPage = _this.data('page-id');
			D.EditPage.importPage(null, null, fromPage);
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
		//加载批量复制JS
		D.batchCopy();
		//加载发布记录JS
		D.historyBoxPage();
		//
		//排期
		$('.dcms-box-list .arrange-block').click(function(e) {
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
