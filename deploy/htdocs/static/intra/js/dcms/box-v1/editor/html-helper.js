/**
 * html帮助类
 * @author springyu
 */
;(function($, D, editor) {
	var HtmlHelper = D.Class();

	HtmlHelper.extend({
		/**
		 * @methed insertGridHighLight 获取标识区域高亮上栅格代码
		 * @param target jQuery对象，目标元素
		 */
		insertGridHighLight : function(target) {
			var gridStr = '<ul id="crazy-box-operate-layout">';
			gridStr += '<li class="layout-moveup">上移</li>';
			gridStr += '<li class="layout-movedown">下移</li>';
			gridStr += '<li class="layout-copy">复制</li>';
			gridStr += '<li class="layout-choose">选中</li>';
			gridStr += '<li class="layout-delect last">删除</li>';
			gridStr += '</ul>';
			target.iframeBody.append(gridStr);
		},
		/**
		 * 插入选中cell高亮时用的元素
		 * @param {Object} target 插入对象
		 */
		insertCellHighLight : function(target) {
			var cellHightlight = '<div id="crazy-box-cell-highlight" draggable="true" data-mode="move" class="crazy-box-cell-target-current">';
			cellHightlight += '<ul class="clist-btns">';
			cellHightlight += '<li class=""><a class="edit-cell">进入编辑</a></li>';
			// cellHightlight += '<li><a class="' + D.DropInPage.defConfig.newCopyButton + '">复制</a></li>';
			cellHightlight += '<li><a class="' + D.DropInPage.defConfig.delButton + '">删除</a></li>';
			// cellHightlight += '<li class=""><a class="edit-finish">完成编辑</a></li>';
			//cellHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// cellHightlight += '<li><a class="edit-cell-bin">控件属性</a></li>';
			// cellHightlight += '<li><a class="move-cell-bin up">向上</a></li>';
			// cellHightlight += '<li><a class="move-cell-bin down">向下</a></li>';
			cellHightlight += '</u></div>';
			target.cellHighLightEl = $(cellHightlight);
			target.fixCellHighLightEl = $('<div id="crazy-box-cell-highlight-fix" draggable="true" data-mode="move" class="crazy-box-cell-target-current-fix"></div>');
			target.iframeBody.append(target.fixCellHighLightEl);
			target.iframeBody.append(target.cellHighLightEl);
		},
		/**
		 * 插入选中微布局高亮时用的元素
		 * @param {Object} target 插入对象
		 */
		insertMicrolayoutHighLight : function(target) {
			var microHightlight = '<div id="crazy-box-micro-highlight" draggable="true" data-mode="move" class="crazy-box-micro-target-current">';
			microHightlight += '<ul class="micro-list-btns">';
			//microHightlight += '<li ><a class="micro-edit-finish">完成编辑</a></li>';
			// microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// microHightlight += '<li class="edit-micro-row-bin">行<input type="text" id="micro_row"></li>';
			// microHightlight += '<li class="edit-micro-col-bin">列<input type="text" id="micro_col"></li>';
			// microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			//  microHightlight += '<li class="disabled"><a class="merge-right-bin">向右合并</a></li>';
			//microHightlight += '<li class="disabled"><a class="merge-down-bin">向下合并</a></li>';
			//  microHightlight += '<li class="disabled"><a class="merge-cancel-bin">取消合并</a></li>';
			//  microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// microHightlight += '<li class="border-transparent-bin"><span><input type="checkbox" id="border_transparent"></span><span>边框透明</span></li>';
			microHightlight += '</u></div>';
			target.microHighLightEl = $(microHightlight);
			target.fixMicroHighLightEl = $('<div id="crazy-box-micro-highlight-fix" draggable="true" data-mode="move" class="crazy-box-micro-target-current-fix"></div>');
			target.iframeBody.append(target.fixMicroHighLightEl);
			target.iframeBody.append(target.microHighLightEl);
		},
		/**
		 * @methed _getSingerBtnsHtml 获取标识区域高亮上按钮代码
		 * @param target jQuery对象，目标元素
		 */
		getSingerBtnsHtml : function(target, opts) {
			var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS;
			var $banner = target.closest('.crazy-box-banner'), $row = target.closest('.crazy-box-row');
			$banner = $banner && !$banner.length ? target.closest('#crazy-box-banner') : $banner;
			
			btnsHtml += '<li class="js-datasource">接入数据源</li>';
			
			if($row.siblings().length > 0) {
				btnsHtml += '<li class="js-move up">上移</li>';
				btnsHtml += '<li class="js-move down">下移</li>';
			}

			btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN + '">进入编辑</li>';
			//module内容不为空或是通栏导行内的module，则执行下面语句
			//console.log(target.children().length);
			if(!target.children().length ||$.trim(target.children().html()) !== '' || ($banner.length > 0)) {
				//如果不是'edit-module'状态（新建、修改组件），则有“复制”按钮
				if(!(opts['status'] && opts['status'] === 'edit-module')) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">复制</li>';
					//03-29 qiuxiaoquan 页面编辑 ，点击同步，组件更新内容到关联的页面
 					var eleminfo=$(target).data("eleminfo");
 					if(eleminfo && eleminfo.isSync){
 						btnsHtml += '<li class="' + D.DropInPage.defConfig.syncModuleButton + '">同步</li>';						
 					}			
				}					
				
				if(target.find('.crazy-box-microlayout').length > 0) {//如果组件中有crazy-box-microlayout，则显示表格切分
					btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN + '">表格切分</li>';
				}
				//在通栏导行内有多个module或不是通栏导行 则显示删除组件
				//if(($banner.length > 0 && $row.siblings().length > 0) || !($banner.length > 0)) {
				//	btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">删除组件</li>';
				//}

			}
			//在通栏导行内有多个module或不是通栏导行 则显示删除组件
				if(($banner.length > 0 && $row.siblings().length > 0) || !($banner.length > 0)) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">删除组件</li>';
				}

			return btnsHtml;
		}
	});
	editor.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms, FE.dcms.box.editor);
