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
			gridStr += '<li class="layout-choose">ѡ��</li>';
			gridStr += '<li class="layout-delect last">ɾ��</li>';
			gridStr += '</ul>';
			target.iframeBody.append(gridStr);
		},
		/**
		 * ����ѡ��cell����ʱ�õ�Ԫ��
		 * @param {Object} target �������
		 */
		insertCellHighLight : function(target) {
			var cellHightlight = '<div id="crazy-box-cell-highlight" draggable="true" data-mode="move" class="crazy-box-cell-target-current">';
			cellHightlight += '<ul class="clist-btns">';
			cellHightlight += '<li class=""><a class="edit-cell">����༭</a></li>';
			// cellHightlight += '<li><a class="' + D.DropInPage.defConfig.newCopyButton + '">����</a></li>';
			cellHightlight += '<li><a class="' + D.DropInPage.defConfig.delButton + '">ɾ��</a></li>';
			// cellHightlight += '<li class=""><a class="edit-finish">��ɱ༭</a></li>';
			//cellHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// cellHightlight += '<li><a class="edit-cell-bin">�ؼ�����</a></li>';
			// cellHightlight += '<li><a class="move-cell-bin up">����</a></li>';
			// cellHightlight += '<li><a class="move-cell-bin down">����</a></li>';
			cellHightlight += '</u></div>';
			target.cellHighLightEl = $(cellHightlight);
			target.fixCellHighLightEl = $('<div id="crazy-box-cell-highlight-fix" draggable="true" data-mode="move" class="crazy-box-cell-target-current-fix"></div>');
			target.iframeBody.append(target.fixCellHighLightEl);
			target.iframeBody.append(target.cellHighLightEl);
		},
		/**
		 * ����ѡ��΢���ָ���ʱ�õ�Ԫ��
		 * @param {Object} target �������
		 */
		insertMicrolayoutHighLight : function(target) {
			var microHightlight = '<div id="crazy-box-micro-highlight" draggable="true" data-mode="move" class="crazy-box-micro-target-current">';
			microHightlight += '<ul class="micro-list-btns">';
			//microHightlight += '<li ><a class="micro-edit-finish">��ɱ༭</a></li>';
			// microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// microHightlight += '<li class="edit-micro-row-bin">��<input type="text" id="micro_row"></li>';
			// microHightlight += '<li class="edit-micro-col-bin">��<input type="text" id="micro_col"></li>';
			// microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			//  microHightlight += '<li class="disabled"><a class="merge-right-bin">���Һϲ�</a></li>';
			//microHightlight += '<li class="disabled"><a class="merge-down-bin">���ºϲ�</a></li>';
			//  microHightlight += '<li class="disabled"><a class="merge-cancel-bin">ȡ���ϲ�</a></li>';
			//  microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
			// microHightlight += '<li class="border-transparent-bin"><span><input type="checkbox" id="border_transparent"></span><span>�߿�͸��</span></li>';
			microHightlight += '</u></div>';
			target.microHighLightEl = $(microHightlight);
			target.fixMicroHighLightEl = $('<div id="crazy-box-micro-highlight-fix" draggable="true" data-mode="move" class="crazy-box-micro-target-current-fix"></div>');
			target.iframeBody.append(target.fixMicroHighLightEl);
			target.iframeBody.append(target.microHighLightEl);
		},
		/**
		 * @methed _getSingerBtnsHtml ��ȡ��ʶ��������ϰ�ť����
		 * @param target jQuery����Ŀ��Ԫ��
		 */
		getSingerBtnsHtml : function(target, opts) {
			var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS;
			var $banner = target.closest('.crazy-box-banner'), $row = target.closest('.crazy-box-row');
			$banner = $banner && !$banner.length ? target.closest('#crazy-box-banner') : $banner;
			
			btnsHtml += '<li class="js-datasource">��������Դ</li>';
			
			if($row.siblings().length > 0) {
				btnsHtml += '<li class="js-move up">����</li>';
				btnsHtml += '<li class="js-move down">����</li>';
			}

			btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_CELL_BTN + '">����༭</li>';
			//module���ݲ�Ϊ�ջ���ͨ�������ڵ�module����ִ���������
			//console.log(target.children().length);
			if(!target.children().length ||$.trim(target.children().html()) !== '' || ($banner.length > 0)) {
				//�������'edit-module'״̬���½����޸�����������С����ơ���ť
				if(!(opts['status'] && opts['status'] === 'edit-module')) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">����</li>';
					//03-29 qiuxiaoquan ҳ��༭ �����ͬ��������������ݵ�������ҳ��
 					var eleminfo=$(target).data("eleminfo");
 					if(eleminfo && eleminfo.isSync){
 						btnsHtml += '<li class="' + D.DropInPage.defConfig.syncModuleButton + '">ͬ��</li>';						
 					}			
				}					
				
				if(target.find('.crazy-box-microlayout').length > 0) {//����������crazy-box-microlayout������ʾ����з�
					btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN + '">����з�</li>';
				}
				//��ͨ���������ж��module����ͨ������ ����ʾɾ�����
				//if(($banner.length > 0 && $row.siblings().length > 0) || !($banner.length > 0)) {
				//	btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">ɾ�����</li>';
				//}

			}
			//��ͨ���������ж��module����ͨ������ ����ʾɾ�����
				if(($banner.length > 0 && $row.siblings().length > 0) || !($banner.length > 0)) {
					btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">ɾ�����</li>';
				}

			return btnsHtml;
		}
	});
	editor.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms, FE.dcms.box.editor);
