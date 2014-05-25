/**
 * @author springyu
 * @userfor  左则面板菜单导航
 * @date  2013-1-20
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D) {
	D.box.panel.Nav = {
		/**
		 * 展示栅格信息
		 * @param {Object} opts
		 */
		showGrids : function(opts) {
			var type = opts && opts.type, from = opts && opts.from;
			D.ToolsPanel.addHtmlPage();
			D.toolsPanelLayout();
			$('#change_page_grids').parent().hide();
			if(type === 'page' && from === 'edit-page') {
				$('#change_background').parent().show();
				$('#change_template').parent().hide();
			}
			if(type === 'page' && from === 'specialTools') {
				$('#change_background').parent().show();
				$('#change_template').parent().show();
			}
			if(type === 'pl_layout') {
				$('#change_background').parent().hide();
				$('#change_template').parent().hide();
			}
			if(type === 'pl_template') {
				$('#change_background').parent().show();
				$('#change_template').parent().show();
			}
		},
		/**
		 * 展示设置背景信息
		 * @param {Object} opts
		 */
		showBackground : function(opts) {
			var editPage = opts && opts.editPage, type = opts && opts.type, from = opts && opts.from;

			D.ToolsPanel.addHtmlPageBackground();
			$('#change_background').parent().hide();
			if(type === 'page' && from === 'specialTools') {
				$('#change_page_grids').parent().show();
				$('#change_template').parent().show();
			}
			if(type === 'page' && from === 'edit-page') {
				$('#change_page_grids').parent().show();
				$('#change_template').parent().hide();
			}
			if(type === 'pl_layout') {
				$('#change_template').parent().hide();
			}
		
			if(type === 'pl_template') {
				$('#change_page_grids').parent().show();
				$('#change_template').parent().show();
			}
			editPage && D.BoxAttr.loadPageBackground(editPage.iframeDoc);
		},
		/**
		 * 展示素材库或个人库控件信息
		 * @param {Object} opts
		 */
		showCellLibrary : function(opts) {
			var target = $(this), $navCellParent = $('#nav_cell').parent(), $navCellParentSiblings = $navCellParent.siblings();
			target.parent().hide();
			$navCellParent.removeClass('current');
			$navCellParentSiblings.removeClass('current');
			$navCellParentSiblings.hide();
			$('.panel-edit-attr').hide();
			$navCellParent.addClass('current');
			$navCellParent.show();
			$('.panel-cell-content').show();
		},
		/**
		 * 展示组件属性信息
		 * @param {Object} opts
		 */
		showModuleAttr : function(opts) {

		}
	};
})(dcms, FE.dcms);
