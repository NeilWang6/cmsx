/**
 * html������
 * @author springyu
 */
;(function($, D) {
    var HtmlHelper = D.Class();

    HtmlHelper.extend({
        /**
         * ����ѡ��cell����ʱ�õ�Ԫ��
         * @param {Object} target �������
         */
        insertCellHighLight : function(target) {
            var cellHightlight = '<div id="crazy-box-cell-highlight" draggable="true" data-mode="move" class="crazy-box-cell-target-current">';
            cellHightlight += '<ul class="clist-btns">';
            cellHightlight += '<li class=""><a class="edit-finish">��ɱ༭</a></li>';
            cellHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            cellHightlight += '<li><a class="edit-cell-bin">�ؼ�����</a></li>';
            cellHightlight += '<li><a class="move-cell-bin up">����</a></li>';
            cellHightlight += '<li><a class="move-cell-bin down">����</a></li>';
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
            microHightlight += '<li ><a class="micro-edit-finish">��ɱ༭</a></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="edit-micro-row-bin">��<input type="text" id="micro_row"></li>';
            microHightlight += '<li class="edit-micro-col-bin">��<input type="text" id="micro_col"></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="disabled"><a class="merge-right-bin">���Һϲ�</a></li>';
            microHightlight += '<li class="disabled"><a class="merge-down-bin">���ºϲ�</a></li>';
            microHightlight += '<li class="disabled"><a class="merge-cancel-bin">ȡ���ϲ�</a></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="border-transparent-bin"><span><input type="checkbox" id="border_transparent"></span><span>�߿�͸��</span></li>';
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
        getSingerBtnsHtml : function(target, state, params) {
            var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS;

            if(target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'layout') || target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'grid') || target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'row')) {
                //btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">����</li>';
                btnsHtml += '<li><a class="' + D.DropInPage.defConfig.copyButton + '">����</a></li>';
                btnsHtml += '<li><a class="' + D.DropInPage.defConfig.delButton + '">ɾ��</a></li>';
                btnsHtml += '<li class="b-margin">�ױ߾�<input type="text" id="margin_bottom"></li>';
                return btnsHtml;
            }
            if(state === 'coding') {
                btnsHtml = '<li class="' + CONSTANTS.SINGER_AREA_VIEW_HTML_BTN + '">���ӻ�</li>';
            } else if(state === 'view' || target.hasClass(params.defineModule) === true) {
                btnsHtml = '<li class="' + CONSTANTS.SINGER_AREA_EDIT_HTML_BTN + '">�༭����</li>';
            } else {
                var isDsModule = target.find('.cell-dstemplate-tdp').length > 0 || target.find('.cell-topic-module').length > 0;
                //���module��content��������ʱ�����֡��༭���ݡ���ť
                if($.trim(target.children().html()) !== '' && !isDsModule) {
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_ENTER_DS_BTN + '">��������Դ</li>';
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MODULE_TAG_BTN + '">�滻ģ��</li>';
                    if(target.find('.crazy-box-cell').length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN + '">�༭����</li>';
                    }
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MODULE_BTN + '">������</li>';
                    //btnsHtml += '<li class="' + D.DropInPage.defConfig.copyButton + '">����</li>';
                    btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">����</li>';
                    btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">ɾ��</li>';

                    if(target.find('.crazy-box-microlayout').length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN + '">΢����</li>';
                    }
                    return btnsHtml;
                }
                if(target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'module')) {
                    var _dsObj = target.find('.cell-dstemplate-tdp')[0] || target.find('.cell-topic-module')[0];
                    if(_dsObj && $(_dsObj).find('.' + params.dsCodeEdit).length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN + '">�༭����</li>';
                    }
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + '">ģ��</li>';
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + '-modify" style="display:none">����</li>';
                }
            }
            return btnsHtml;
        }
    });
    D.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms);
