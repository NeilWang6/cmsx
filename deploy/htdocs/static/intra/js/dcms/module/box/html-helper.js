/**
 * html帮助类
 * @author springyu
 */
;(function($, D) {
    var HtmlHelper = D.Class();

    HtmlHelper.extend({
        /**
         * 插入选中cell高亮时用的元素
         * @param {Object} target 插入对象
         */
        insertCellHighLight : function(target) {
            var cellHightlight = '<div id="crazy-box-cell-highlight" draggable="true" data-mode="move" class="crazy-box-cell-target-current">';
            cellHightlight += '<ul class="clist-btns">';
            cellHightlight += '<li class=""><a class="edit-finish">完成编辑</a></li>';
            cellHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            cellHightlight += '<li><a class="edit-cell-bin">控件属性</a></li>';
            cellHightlight += '<li><a class="move-cell-bin up">向上</a></li>';
            cellHightlight += '<li><a class="move-cell-bin down">向下</a></li>';
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
            microHightlight += '<li ><a class="micro-edit-finish">完成编辑</a></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="edit-micro-row-bin">行<input type="text" id="micro_row"></li>';
            microHightlight += '<li class="edit-micro-col-bin">列<input type="text" id="micro_col"></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="disabled"><a class="merge-right-bin">向右合并</a></li>';
            microHightlight += '<li class="disabled"><a class="merge-down-bin">向下合并</a></li>';
            microHightlight += '<li class="disabled"><a class="merge-cancel-bin">取消合并</a></li>';
            microHightlight += '<li class="li-mid-line"><a class="mid-line"><s></s></a></li>';
            microHightlight += '<li class="border-transparent-bin"><span><input type="checkbox" id="border_transparent"></span><span>边框透明</span></li>';
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
        getSingerBtnsHtml : function(target, state, params) {
            var btnsHtml = '', topicModule, CONSTANTS = D.DropInPage.CONSTANTS;

            if(target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'layout') || target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'grid') || target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'row')) {
                //btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">复制</li>';
                btnsHtml += '<li><a class="' + D.DropInPage.defConfig.copyButton + '">复制</a></li>';
                btnsHtml += '<li><a class="' + D.DropInPage.defConfig.delButton + '">删除</a></li>';
                btnsHtml += '<li class="b-margin">底边距<input type="text" id="margin_bottom"></li>';
                return btnsHtml;
            }
            if(state === 'coding') {
                btnsHtml = '<li class="' + CONSTANTS.SINGER_AREA_VIEW_HTML_BTN + '">可视化</li>';
            } else if(state === 'view' || target.hasClass(params.defineModule) === true) {
                btnsHtml = '<li class="' + CONSTANTS.SINGER_AREA_EDIT_HTML_BTN + '">编辑代码</li>';
            } else {
                var isDsModule = target.find('.cell-dstemplate-tdp').length > 0 || target.find('.cell-topic-module').length > 0;
                //如果module的content中无内容时不出现“编辑内容”按钮
                if($.trim(target.children().html()) !== '' && !isDsModule) {
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_ENTER_DS_BTN + '">接入数据源</li>';
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MODULE_TAG_BTN + '">替换模版</li>';
                    if(target.find('.crazy-box-cell').length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN + '">编辑内容</li>';
                    }
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MODULE_BTN + '">组属性</li>';
                    //btnsHtml += '<li class="' + D.DropInPage.defConfig.copyButton + '">复制</li>';
                    btnsHtml += '<li class="' + D.DropInPage.defConfig.newCopyButton + '">复制</li>';
                    btnsHtml += '<li class="' + D.DropInPage.defConfig.delButton + '">删除</li>';

                    if(target.find('.crazy-box-microlayout').length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_MICRO_LAYOUT_BTN + '">微布局</li>';
                    }
                    return btnsHtml;
                }
                if(target.hasClass(CONSTANTS.ELEMENT_CLASS_PREFIX + 'module')) {
                    var _dsObj = target.find('.cell-dstemplate-tdp')[0] || target.find('.cell-topic-module')[0];
                    if(_dsObj && $(_dsObj).find('.' + params.dsCodeEdit).length > 0) {
                        btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN + '">编辑内容</li>';
                    }
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + '">模版</li>';
                    btnsHtml += '<li class="' + CONSTANTS.SINGER_AREA_EDIT_DS_MODULE_BTN + '-modify" style="display:none">数据</li>';
                }
            }
            return btnsHtml;
        }
    });
    D.HtmlHelper = HtmlHelper;
})(dcms, FE.dcms);
