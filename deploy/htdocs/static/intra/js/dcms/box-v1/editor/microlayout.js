/**
 * @author pingchun.yupc
 * @userfor 微布局相关操作
 * @date  2012.09.7
 */

;(function($, D, undefined) {
    var Microlayout = (function() {
        function Microlayout(target) {
        	if (!(this instanceof Microlayout)){
        		return new Microlayout(target);
        	}
            this.dropInPage = target;
            this.table = new D.Table(target.table);
            this.fixCellHighLightEl = target.fixCellHighLightEl;
            this.elements = {
                'microHightlight' : $('#crazy-box-micro-highlight', target.iframeBody),
                'microRow' : $('#micro_row', '#panel_tab'),
                'microCol' : $('#micro_col', '#panel_tab'),
                'mergeDown' : $('.merge-down-bin', '#panel_tab'),
                'mergeRight' : $('.merge-right-bin', '#panel_tab'),
                'mergeCancel' : $('.merge-cancel-bin', '#panel_tab'),
                'borderTransparent' : $('#border_transparent', '#panel_tab'),
                'tdWidth' : $('#microWidth', '#panel_tab'),
                'tableWidth' : $('#tableWidth', '#panel_tab'),
                'microFinish' : $('#micro_finish', '#panel_tab'),
                'microAddCell' : $('#micro_add_cell', '#panel_tab')
            };

        }

        /**
         * 微布局实例方法
         */
        Microlayout.fn = Microlayout.prototype = ( {
            constructor : Microlayout,
            getMicroHightlight : function() {
                return this.elements.microHightlight;
            },

            /**
             * 释放资源
             */
            unbind : function() {
                if(this.elements.microRow && this.elements.microRow.length > 0) {
                    this.elements.microRow.unbind('input');
                }
                if(this.elements.microCol && this.elements.microCol.length > 0) {
                    this.elements.microCol.unbind('input');
                }
                this.elements.mergeDown.unbind('click');
                this.elements.mergeRight.unbind('click');
                this.elements.mergeCancel.unbind('click');
                this.elements.borderTransparent.unbind('click');
                this.table.tab = null;
                this.table = null;
            },
            /**
             * 微布局菜单事件邦定
             */
            bind : function() {
                var table = this.table, self = this, handleNewRow = function(oRow) {//对新增加的行添加新式和数据
                    for(var i = 0; i < oRow.cells.length; i++) {
                        var $oCell = $(oRow.cells[i]);
                        if(!$oCell.hasClass('crazy-table-containter-td')) {
                            $oCell.addClass('crazy-table-containter-td');
                        }
                        if(!$oCell.hasClass('crazy-box-enable-cell')) {
                            $oCell.addClass('crazy-box-enable-cell');
                        }
                        if(!$oCell.attr('data-boxoptions')) {
                            $oCell.attr('data-boxoptions', '{"ability":{"container":{"enableType":"cell","number":"n"}}}');
                        }

                    }
                }, handleNewCell = function(oCell) {//对新增加的列添加新式和数据
                    if(oCell) {
                        var $oCell = $(oCell);
                        if(!$oCell.hasClass('crazy-table-containter-td')) {
                            $oCell.addClass('crazy-table-containter-td');
                        }
                        if(!$oCell.hasClass('crazy-box-enable-cell')) {
                            $oCell.addClass('crazy-box-enable-cell');
                        }
                        if(!$oCell.attr('data-boxoptions')) {
                            $oCell.attr('data-boxoptions', '{"ability":{"container":{"enableType":"cell","number":"n"}}}');
                        }

                    }
                }, matrix = function(_$input) {//获取输入的行，列数，重新生成表格
                    var _val = _$input.val();
                    if(isNaN(_val)) {
                        _$input.val(parseInt(_val));
                        alert('亲，输入非法,请重新输入！');
                        return;
                    } else {
                        var pos = table.getRowAndColNumber();
                        _val = parseInt(_val);
                        if(_val <= 0) {
                            _val = 1;
                        }

                        if(_$input.attr('id') === 'micro_row' && pos.row !== _val) {
                            table.matrix(_val, pos.col, handleNewRow);
                        }
                        if(_$input.attr('id') === 'micro_col' && pos.col !== _val) {
                            table.matrix(pos.row, _val, function(oRow) {
                            }, handleNewCell);
                        }
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                    return;
                };
                /**
                 * 设定TD宽度
                 */
                if(this.elements.tdWidth && this.elements.tdWidth.length > 0) {
                    this.elements.tdWidth.bind('input', function(event) {
                        event.preventDefault();
                        var $tdWidth = $(this), that = this, $oTd, intWidth = parseInt($tdWidth.val());
                        $oTd = self.elements.microHightlight.data('elem'),$oTable = $oTd.closest('table');
                        var pos = D.Table.pos($oTd[0]);
                        //不是第一行的列不能设置宽度
                        if(pos.row === 0 && !isNaN(intWidth)) {
                            $oTd.css('width', intWidth + 'px');
                        }
                        if ($oTable.css('table-layout')!=='fixed'){
                            $oTable.css('table-layout','fixed');
                        }
                    });
                }
                /**
                 * 行数
                 */
                if(this.elements.microRow && this.elements.microRow.length > 0) {
                    this.elements.microRow.bind('input', function(event) {
                        event.preventDefault();
                        //event.stopPropagation();
                        matrix($(this));
                        //return;
                    });
                    this.elements.microRow.bind('click', function() {
                        this.select();
                    });
                }
                /**
                 * 列数
                 */
                if(this.elements.microCol && this.elements.microCol.length > 0) {
                    this.elements.microCol.bind('input', function(event) {
                        event.preventDefault();
                        //event.stopPropagation();
                        matrix($(this));
                        //return;
                    });
                    this.elements.microCol.bind('click', function() {
                        this.select();
                    });
                }
                /**
                 * 向下合并
                 */
                self.elements.mergeDown.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), $oTd;
                    if(!_self.parent().hasClass('disabled')) {
                        $oTd = self.elements.microHightlight.data('elem');
                        table.mergeDown($oTd[0]);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                /**
                 * 向右合并
                 */
                self.elements.mergeRight.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), $oTd;

                    if(!_self.parent().hasClass('disabled')) {
                        $oTd = self.elements.microHightlight.data('elem');

                        table.mergeRight($oTd[0]);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                //取消cell合并
                self.elements.mergeCancel.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), oTd;
                    if(!_self.parent().hasClass('disabled')) {
                        oTd = self.elements.microHightlight.data('elem')[0];

                        table.cancelMerge(oTd, handleNewCell);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                //边框透明
                this.elements.borderTransparent.bind('click', function(event) {
                    event.stopPropagation();
                    var _self = $(this), that = this;
                    if(that.checked) {
                        $(table.tab).find('td').removeClass('tborder');
                    } else {
                        //$(table.tab).find('td').removeAttr('style');
                        $(table.tab).find('td').addClass('tborder');
                    }
                });
                /**
                 *编辑微布局完成
                 */
                this.elements.microFinish.bind('click', function(event) {
                    self.dropInPage.chooseLevel = 'module';
                    self.dropInPage.mircolayout = null;
                    var $module = $(self.table.tab).closest('.crazy-box-module');
                       
                     self.dropInPage.currentElem = $module;
                   
                    self.dropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM,$module);
                    self.dropInPage._finishEditArea.call(self.dropInPage,self.dropInPage.singerArea, $(this), D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '编辑');
                });

            },
            disabledAll : function() {
                var self = this;
                self.elements.mergeCancel.parent().addClass('disabled');
                self.elements.mergeRight.parent().addClass('disabled');
                self.elements.mergeDown.parent().addClass('disabled');
                D.HighLight.hideLight(self.fixCellHighLightEl, false);
            },
            /**
             * 初始化 微布局 行，列数
             */
            load : function() {
                var table, pos;
                pos = this.table.getRowAndColNumber();
                this.elements.tableWidth.val(parseInt($(this.table.tab).outerWidth(true)));
                this.elements.microRow.val(pos.row);
                this.elements.microCol.val(pos.col);
                this.bind();

            },
            /**
             * 控制 是否可以合并
             * @param {Object} oTd
             */
            showIsMerge : function(oTd) {
                var mergeDown = D.Table.isMergeDown(oTd), mergeRight = D.Table.isMergeRight(oTd), oMergeDown, oMergeRight;
                var $oTd = $(oTd);
                /**
                 * 向下
                 */
                oMergeDown = this.elements.mergeDown.parent();
                if(mergeDown) {
                    oMergeDown.removeClass('disabled');
                } else {
                    oMergeDown.addClass('disabled');
                }
                //向右
                oMergeRight = this.elements.mergeRight.parent();
                if(mergeRight) {
                    oMergeRight.removeClass('disabled');
                } else {
                    oMergeRight.addClass('disabled');
                }
                var oMergeCancel = this.elements.mergeCancel.parent(), mergeCancel = D.Table.isMerge(oTd);
                if(mergeCancel) {
                    oMergeCancel.removeClass('disabled');
                } else {
                    oMergeCancel.addClass('disabled');
                }

                if(this.elements.tdWidth && this.elements.tdWidth.length > 0) {
                    var pos = D.Table.pos(oTd), width = oTd.style.width;

                    if(pos && pos.row === 0) {

                        if( typeof width === 'string' && width.lastIndexOf('px') !== -1) {
                            width = parseInt(width);
                        } else {
                            width = '';
                        }
                        this.elements.tdWidth.val(width);
                        this.elements.tdWidth.removeAttr('disabled');
                        this.elements.tdWidth.parent().removeClass('disabled');
                    } else {
                        this.elements.tdWidth.attr('disabled', 'disabled');
                        this.elements.tdWidth.parent().addClass('disabled');
                        this.elements.tdWidth.val('');
                    }
                }

                return;
            }
        });
        return Microlayout;
    })();
    $.extend(Microlayout, {
        hideMicroHightlight : function(microHightlightEl, microHightlightElFix) {
            if(microHightlightEl) {
                D.HighLight.hideMicroLight(microHightlightEl);
            }
            if(microHightlightElFix) {
                D.HighLight.hideMicroLight(microHightlightElFix);
            }
        },
        /**
         * 添加微布局后，展示微布局属性
         * @param {Object} dropInPage
         */
        dropInDropMicro : function(dropInPage) {
            var doc = dropInPage.iframeDoc,target = $('.microlayout-demo', doc);
            if(target.length) {
                dropInPage._hideAll();
                dropInPage.currentElem= target;
                dropInPage._showSingerArea(target);
                Microlayout.showMicro(dropInPage, target);
                dropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM,dropInPage.currentElem);
                D.box.editor.Module._startEditArea.call(dropInPage,dropInPage.singerArea, $(this), D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
                
                //删除 demo 样式 此样式表示是新拖拉微布局
                target.removeClass('microlayout-demo');
            }
        },
        /**
         * 展示微布局属性
         * @param {Object} dropInPage
         * @param {Object} target
         */
        showMicro : function(dropInPage, target) {
            var boxMicrolayout = target.find('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'microlayout');
            dropInPage.chooseLevel = 'microlayout';
            $('.crazy-box-microlayout', dropInPage.iframeBody).each(function(index, obj) {
                $(obj).removeClass('current');
            });
            boxMicrolayout.addClass('current');
            dropInPage.table = boxMicrolayout[0];
            D.ToolsPanel.addHtmlMicroLayout();
            //微布局
            dropInPage.mircolayout = new Microlayout(dropInPage);

            dropInPage.mircolayout.load();

            // console.log(self.microHighLightEl);
            dropInPage._hideTransport(dropInPage.moveTransport);
            D.HighLight.showMicrolayoutLight(boxMicrolayout, dropInPage.microHighLightEl);
        }
    });
    D.box.editor.Microlayout = Microlayout;
})(dcms, FE.dcms);
