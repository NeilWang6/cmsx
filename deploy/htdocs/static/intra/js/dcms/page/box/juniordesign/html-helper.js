/**
 * html������
 * @author springyu
 */
;(function($, D, editor) {
	var HtmlHelper = D.Class();

	HtmlHelper.extend({
		/**
		 * @methed insertGridHighLight ��ȡ��ʶ���������դ�����
		 * @param target jQuery����Ŀ��Ԫ��
		 */
		insertGridHighLight : function(target) {
			var gridStr = '<ul id="crazy-box-operate-layout">';
			gridStr += '<li class="layout-moveup">����</li>';
			gridStr += '<li class="layout-movedown">����</li>';
			gridStr += '<li class="layout-copy">����</li>';
			gridStr += '<li class="layout-add">���</li>';
			gridStr += '<li class="layout-delect last">ɾ��</li>';
			gridStr += '</ul>';
			target.iframeBody.append(gridStr);
		},

		/**
		 * @methed _getSingerBtnsHtml ��ȡ��ʶ��������ϰ�ť����
		 * @param target jQuery����Ŀ��Ԫ��
		 */
		getSingerBtnsHtml : function(target, opts) {
			var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS,elemInfo = target.data('eleminfo');
			var $banner = target.closest('.crazy-box-banner'), $row = target.closest('.crazy-box-row');
			$banner = $banner && !$banner.length ? target.closest('#crazy-box-banner') : $banner;
			var isPublicBlock = elemInfo&&((elemInfo.type&&elemInfo.type==='public_block')||(elemInfo.source&&elemInfo.source==='public_block'));
			if(isPublicBlock){
				var moduleId = elemInfo&&elemInfo.id,url ='/page/box/public_block_list.html?';
				url+='action=public_block_action&event_submit_do_query_public_block=true';
				btnsHtml += '<li><a class="l-desc" href="'+D.domain+url+'&ids='+moduleId+'" target="_blank">�鿴</a></li>';
				btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">ɾ��</li>';
				return btnsHtml;
			}

			if(target.data('dsmoduleparam')) {
				btnsHtml += '<li class="js-yunying-ds">����Դ</li>';
				//btnsHtml += '<li class="js-yunying-waiting" style="display:none">����</li>';
			}

			//zhuliqi
			// btnsHtml += '<li class="js-yunying-ds">����Դ</li>';
			var $cellDefine = target.find('.cell-cell-define');
			if($cellDefine && $cellDefine.length === 1) {
				btnsHtml += '<li class="js-yunying-src">Դ����</li>';
			}
			/****/
			
			if($row.siblings().length > 0) {
				btnsHtml += '<li class="js-move up">����</li>';
				btnsHtml += '<li class="js-move down">����</li>';
			}
		
			if($.trim(target.children().html()) !== '' || ($banner.length > 0)) {
				btnsHtml += '<li class="js-attr-module attr">�������</li>';
				btnsHtml += '<li class="js-module replace">�������</li>';
				if(!(opts.status&&opts.status==='edit-module')){
					btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">����</li>';
				}
				//��ͨ���������ж��module����ͨ������ ����ʾɾ�����
				//if(!($banner.length > 0)) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">ɾ��</li>';
				//}
				var $pageId = $('#pageId');
				if(elemInfo&&$pageId&&$pageId.length&&$pageId.val()){
					btnsHtml +='<li class="js-set-public-block">��Ϊ��������</li>';
				}
				
			} else {
				btnsHtml += '<li class="js-module add">������</li>';
			}

			return btnsHtml;
		}
	});
	editor.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms, FE.dcms.box.editor);
