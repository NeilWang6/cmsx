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
			gridStr += '<li class="layout-add">添加</li>';
			gridStr += '<li class="layout-delect last">删除</li>';
			gridStr += '</ul>';
			target.iframeBody.append(gridStr);
		},

		/**
		 * @methed _getSingerBtnsHtml 获取标识区域高亮上按钮代码
		 * @param target jQuery对象，目标元素
		 */
		getSingerBtnsHtml : function(target, opts) {
			var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS,elemInfo = target.data('eleminfo');
			var $banner = target.closest('.crazy-box-banner'), $row = target.closest('.crazy-box-row');
			$banner = $banner && !$banner.length ? target.closest('#crazy-box-banner') : $banner;
			var isPublicBlock = elemInfo&&((elemInfo.type&&elemInfo.type==='public_block')||(elemInfo.source&&elemInfo.source==='public_block'));
			if(isPublicBlock){
				var moduleId = elemInfo&&elemInfo.id,url ='/page/box/public_block_list.html?';
				url+='action=public_block_action&event_submit_do_query_public_block=true';
				btnsHtml += '<li><a class="l-desc" href="'+D.domain+url+'&ids='+moduleId+'" target="_blank">查看</a></li>';
				btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">删除</li>';
				return btnsHtml;
			}

			if(target.data('dsmoduleparam')) {
				btnsHtml += '<li class="js-yunying-ds">数据源</li>';
				//btnsHtml += '<li class="js-yunying-waiting" style="display:none">排期</li>';
			}

			//zhuliqi
			// btnsHtml += '<li class="js-yunying-ds">数据源</li>';
			var $cellDefine = target.find('.cell-cell-define');
			if($cellDefine && $cellDefine.length === 1) {
				btnsHtml += '<li class="js-yunying-src">源代码</li>';
			}
			/****/
			
			if($row.siblings().length > 0) {
				btnsHtml += '<li class="js-move up">上移</li>';
				btnsHtml += '<li class="js-move down">下移</li>';
			}
		
			if($.trim(target.children().html()) !== '' || ($banner.length > 0)) {
				btnsHtml += '<li class="js-attr-module attr">组件属性</li>';
				btnsHtml += '<li class="js-module replace">更换组件</li>';
				if(!(opts.status&&opts.status==='edit-module')){
					btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">复制</li>';
				}
				//在通栏导行内有多个module或不是通栏导行 则显示删除组件
				//if(!($banner.length > 0)) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">删除</li>';
				//}
				var $pageId = $('#pageId');
				if(elemInfo&&$pageId&&$pageId.length&&$pageId.val()){
					btnsHtml +='<li class="js-set-public-block">设为公用区块</li>';
				}
				
			} else {
				btnsHtml += '<li class="js-module add">添加组件</li>';
			}

			return btnsHtml;
		}
	});
	editor.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms, FE.dcms.box.editor);
